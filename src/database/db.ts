import Database from "tauri-plugin-sql-api";
export const db = await Database.load("sqlite:database.db");

// Initial Database creation

await db.execute(
  `CREATE TABLE IF NOT EXISTS model (
        id TEXT PRIMARY KEY,
        name TEXT
    )`
);

await db.execute(
  `CREATE TABLE IF NOT EXISTS transcript (
        transcript_id TEXT PRIMARY KEY,
        model_id TEXT NOT NULL, 
        selected_audio_path TEXT,
        transcript TEXT NOT NULL
      )`
);
