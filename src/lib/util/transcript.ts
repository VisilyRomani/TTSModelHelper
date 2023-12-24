import { db } from "../../database/db";
import uniqid from 'uniqid';

export interface TTranscript {
  transcript_id: string;
  model_id: string;
  selected_audio_path: string;
  transcript: string;
}

export const getTranscript = async (model_id: string) => {
  return await db.select<TTranscript[]>(
    `SELECT * FROM transcript WHERE model_id = $1`,
    [model_id]
  );
};
export const importTranscript = async (
  transcript: string[],
  model_id: string
) => {
  const audioPromise = transcript.map(async (value) => {
    const transcript_id = uniqid()
    return await db.execute(
      `INSERT INTO transcript (transcript_id ,model_id, transcript)
        VALUES(?,?,?)`,
      [transcript_id, model_id, value]
    );
  });
  return await Promise.all(audioPromise);
};
