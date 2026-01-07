import React, { useState, useEffect, useRef } from 'react';
import { Block } from '../../types';
import { Lock, Edit3 } from 'lucide-react';

interface MarkdownBlockProps {
  block: Block;
  onUpdate: (id: string, content: string) => void;
}

export const MarkdownBlock: React.FC<MarkdownBlockProps> = ({ block, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(block.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Update local content if block changes externally (and not currently editing)
    if (!isEditing) {
      setLocalContent(block.content);
    }
  }, [block.content, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localContent !== block.content) {
      onUpdate(block._id, localContent);
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    autoResize();
  }, [localContent, isEditing]);

  if (block.isLocked) {
    return (
      <div className="p-4 my-2 bg-gray-50 border border-gray-200 rounded-lg relative opacity-70 cursor-not-allowed">
        <Lock size={16} className="absolute top-2 right-2 text-gray-400" />
        <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
           {/* Simple markdown rendering simulation */}
           {block.type === 'header' ? <h2 className="text-xl font-bold">{block.content}</h2> : block.content}
        </div>
        <div className="text-xs text-gray-400 mt-2">AI Generating...</div>
      </div>
    );
  }

  return (
    <div 
      className={`p-2 my-2 rounded-lg transition-colors group ${
        isEditing ? 'bg-white ring-2 ring-blue-100' : 'hover:bg-gray-50'
      }`}
      onClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent outline-none resize-none font-mono text-sm"
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <div className="relative">
          <div className="prose max-w-none whitespace-pre-wrap">
             {block.type === 'header' ? <h2 className="text-xl font-bold">{block.content}</h2> : block.content}
          </div>
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit3 size={14} className="text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
};
