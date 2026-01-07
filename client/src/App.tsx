import React, { useEffect, useState } from 'react';
import { MainLayout } from './layout/MainLayout';
import { BlockEditor } from './components/editor/BlockEditor';
import { AudioRecorder } from './components/recorder/AudioRecorder';
import { useAudioStream } from './hooks/useAudioStream';
import { createNote, getNote } from './services/api';
import { Note, Block } from './types';
import { Loader2 } from 'lucide-react';

function App() {
	const [currentNote, setCurrentNote] = useState<Note | null>(null);
	const [blocks, setBlocks] = useState<Block[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Initialize: Create or fetch a default note for demo purposes
	useEffect(() => {
		const init = async () => {
			try {
				// ideally list notes and select one, but for demo we create/fetch one
				// For simplicity, let's just create a new one every reload or use a fixed ID?
				// Let's create one.
				const note = await createNote(`Meeting - ${new Date().toLocaleString()}`);
				setCurrentNote(note);
				setBlocks([]);
			} catch (e) {
				console.error('Failed to init', e);
			} finally {
				setIsLoading(false);
			}
		};
		init();
	}, []);

	const { isRecording, startRecording, stopRecording } = useAudioStream(currentNote?._id || null);

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="animate-spin text-blue-600" size={48} />
			</div>
		);
	}

	return (
		<MainLayout>
			{currentNote && (
				<>
					<div className="max-w-3xl mx-auto pt-8 px-8">
						<h1 className="text-3xl font-bold text-gray-800 mb-2">{currentNote.title}</h1>
						<div className="text-sm text-gray-500 mb-8">{new Date(currentNote.createdAt).toLocaleDateString()}</div>
					</div>

					<BlockEditor noteId={currentNote._id} initialBlocks={blocks} />

					<AudioRecorder isRecording={isRecording} onStart={startRecording} onStop={stopRecording} />
				</>
			)}
		</MainLayout>
	);
}

export default App;
