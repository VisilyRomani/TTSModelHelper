import { BaseDirectory, createDir } from "@tauri-apps/api/fs";
import { db } from "../../database/db";
import uniqid from 'uniqid'

export interface TModel {
  id: string;
  name: string;
}

export const createModel = async (name: string) => {
  if (name) {
    const model_id = uniqid()
    try {
      const model = await db.execute(
        `INSERT INTO model (id, name)
          VALUES (?,?)`,
        [model_id ,name]
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

export const clearModels = async () => {
  return await db.execute(`
DELETE from model WHERE id != 99
`);
};
