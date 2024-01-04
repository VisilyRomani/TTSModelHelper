import { BaseDirectory, createDir } from "@tauri-apps/api/fs";
import { db } from "../../database/db";
import uniqid from "uniqid";
import { getRecordedAudio } from "./audio.";
import { fs } from "@tauri-apps/api";

export interface TModel {
  id: string;
  name: string;
}

export const createModel = async (name: string) => {
  if (name) {
    const model_id = uniqid();
    try {
      const model = await db.execute(
        `INSERT INTO model (id, name)
          VALUES (?,?)`,
        [model_id, name]
      );
      await createDir(`model\\${model_id}`, {
        dir: BaseDirectory.AppData,
        recursive: true,
      });
    } catch (e) {
      console.log(e);
    }
  }
  return [];
};

export const getModels = async () => {
  return await db.select<TModel[]>("SELECT * FROM model");
};

export const deleteModel = async (model: TModel) => {
  try {
    await db.execute(`DELETE from model WHERE id = $1`, [model.id]);
    await db.execute(`DELETE from transcript WHERE model_id = $1`, [model.id]);
    await fs.removeDir(`model\\${model.id}`, {
      dir: BaseDirectory.AppData,
      recursive: true,
    });
  } catch (e) {
    console.error(e);
  }
};

export const getExportAudioFiles = async (model: TModel) => {
  const filePath = await db.select<
    {
      id: string;
      selected_audio_path: string;
      transcript: string;
      transcript_id: string;
    }[]
  >(
    `
  SELECT * FROM model 
    LEFT JOIN transcript on model.id = transcript.model_id
    WHERE model_id = $1 & transcript.selected_audio_path IS NOT null
  `,
    [model.id]
  );
  return Promise.all(
    filePath.map(async (file) => {
      return {
        ...file,
        data: await getRecordedAudio(file.selected_audio_path),
      };
    })
  );
};
