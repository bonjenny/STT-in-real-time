export interface Block {
  _id: string;
  noteId: string;
  content: string;
  type: 'text' | 'code' | 'header';
  order: number;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteWithBlocks {
  note: Note;
  blocks: Block[];
}
