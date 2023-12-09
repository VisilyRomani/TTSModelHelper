import { db } from "./db";
export type TModel = { id: number; name: string }[];

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
};
