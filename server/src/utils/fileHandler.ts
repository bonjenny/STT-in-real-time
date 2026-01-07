import fs from 'fs';
import path from 'path';

export const getUploadPath = (filename: string): string => {
  return path.join(__dirname, '../../uploads', filename);
};

export const deleteFile = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const ensureUploadsDir = (): void => {
  const uploadDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};
