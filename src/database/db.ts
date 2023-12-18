import Database from "tauri-plugin-sql-api";

export const db = await Database.load("sqlite:database.db");

await db.execute(
  `CREATE TABLE IF NOT EXISTS model (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    )`
);

await db.execute(
  `CREATE TABLE IF NOT EXISTS audio (
        audio_id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_id INTEGER, 
        audio_path TEXT,
        transcript TEXT
      )`
);
