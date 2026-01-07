import React, { useEffect, useState } from 'react';
import { Block } from '../../types';
import { updateBlock } from '../../services/api';
import { MarkdownBlock } from './MarkdownBlock';
import { useSocket } from '../../hooks/useSocket';

interface BlockEditorProps {
  noteId: string;
  initialBlocks: Block[];
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ noteId, initialBlocks }) => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const { subscribeToUpdates } = useSocket(noteId);

  useEffect(() => {
    setBlocks(initialBlocks);
  }, [initialBlocks]);

  useEffect(() => {
    subscribeToUpdates((action, data) => {
      console.log('Socket update:', action, data);
      
      if (action === 'create_batch') {
        const newBlocks = data as Block[];
        setBlocks(prev => {
          // Check for duplicates just in case
          const existingIds = new Set(prev.map(b => b._id));
          const uniqueNew = newBlocks.filter(b => !existingIds.has(b._id));
          return [...prev, ...uniqueNew].sort((a, b) => a.order - b.order);
        });
      } else if (action === 'update') {
        const updatedBlock = data as Block;
        setBlocks(prev => prev.map(b => b._id === updatedBlock._id ? updatedBlock : b));
      }
    });
  }, [subscribeToUpdates]);

  const handleBlockUpdate = async (id: string, content: string) => {
    // Optimistic update
    setBlocks(prev => prev.map(b => b._id === id ? { ...b, content } : b));
    
    try {
      await updateBlock(id, { content });
    } catch (error) {
      console.error('Failed to update block', error);
      // Revert or show error
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 pb-32">
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            Start recording to generate notes...
          </div>
        ) : (
          blocks.map(block => (
            <MarkdownBlock 
              key={block._id} 
              block={block} 
              onUpdate={handleBlockUpdate} 
            />
          ))
        )}
      </div>
    </div>
  );
};
