import { db } from "./db";

export type TModel = { id: number; name: string }[];

export type TAudio = {
  audio_id: number;
  model_id: number;
  audio: Blob;
  transcript: string;
  audio_name: string;
};

import { model_store } from "../lib/stores/model";

export const model = {
  createModel: async (input: string) => {
    if (input) {
      return await db.execute(
        `
        INSERT INTO model (name)
        VALUES (?)`,
        [input]
      );
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

export const audio = {
  getAllAudio: async () => {
    return await db.select<TAudio[]>(`SELECT * FROM audio`);
  },
  getAudio: async (model_id: number) => {
    return await db.select<TAudio[]>(
      `SELECT * FROM audio WHERE model_id = $1`,
      [model_id]
    );
  },
  importAudio: async (transcript: string[], model_id: number) => {
    const audioPromise = transcript.map(async (s) => {
      return await db.execute(
        `INSERT INTO audio (model_id, transcript)
        VALUES(?,?)`,
        [model_id, s]
      );
    });
    return await Promise.all(audioPromise);
  },
};
