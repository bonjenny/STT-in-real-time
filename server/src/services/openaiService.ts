import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key', // Prevent crash if key missing
});

export const transcribeAudio = async (filePath: string): Promise<string> => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      language: "ko", // Optimize for Korean
    });
    return transcription.text;
  } catch (error) {
    console.error("Whisper Error:", error);
    throw error;
  }
};

export const processTextToBlocks = async (text: string): Promise<any[]> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert technical writer. Convert the following spoken text into structured Markdown blocks for a meeting note.
          Return a JSON object with a key "blocks" containing an array of objects.
          Each object in "blocks" should have:
          - "content": string (markdown text)
          - "type": "text" | "code" | "header"
          - "language": string (optional, for code blocks)
          
          Focus on identifying technical terms correctly.
          Split long text into logical paragraphs.`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) return [];
    
    try {
      const parsed = JSON.parse(content);
      return parsed.blocks || [];
    } catch (e) {
      return [{ content: text, type: 'text' }];
    }
  } catch (error) {
    console.error("GPT Error:", error);
    return [{ content: text, type: 'text' }];
  }
};
