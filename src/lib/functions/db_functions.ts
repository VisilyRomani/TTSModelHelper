import { BaseDirectory, createDir } from "@tauri-apps/api/fs";
import { db } from "../../database/db";

export type TModel = { id: number; name: string }[];

export type TTranscript = {
  transcript_id: number;
  model_id: number;
  audio_path: string | null;
  transcript: string;
};

export const model = {
  createModel: async (input: string) => {
    if (input) {
      try {
        const model = await db.execute(
          `INSERT INTO model (name)
          VALUES (?)`,
          [input]
        );
        await createDir(`model\\${model.lastInsertId}`, {
          dir: BaseDirectory.AppData,
          recursive: true,
        });
      } catch (e) {
        console.log(e);
      }
    }
    return [];
  },
  getModels: async () => {
    return await db.select<{ id: number; name: string }[]>(
      "SELECT * FROM model"
    );
  },
  clearModels: async () => {
    return await db.execute(`
    DELETE from model WHERE id != 99
    `);
  },
};

export const transcript = {
  getAllTranscript: async () => {
    return await db.select<TTranscript[]>(`SELECT * FROM audio`);
  },
  getTranscript: async (model_id: number) => {
    return await db.select<TTranscript[]>(
      `SELECT * FROM transcript WHERE model_id = $1`,
      [model_id]
    );
  },
  importTranscript: async (transcript: string[], model_id: number) => {
    const audioPromise = transcript.map(async (s) => {
      return await db.execute(
        `INSERT INTO transcript (model_id, transcript)
        VALUES(?,?)`,
        [model_id, s]
      );
    });
    return await Promise.all(audioPromise);
  },
  // updateTranscript: async (
  //   audio_path: string,
  //   audio_id: number,
  //   model_id: number
  // ) => {
  //   return await db.execute(
  //     `UPDATE Transcript SET audio=$1 WHERE audio_id=$2 and model_id=$3`,
  //     [audio_path, audio_id, model_id]
  //   );
  // },
};
