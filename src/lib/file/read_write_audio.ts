import {
  writeBinaryFile,
  BaseDirectory,
  readBinaryFile,
  exists,
  createDir,
  readDir,
} from "@tauri-apps/api/fs";
import uniqid from "uniqid";
import { appDataDir } from "@tauri-apps/api/path";

export const writeAudioFile = async (
  audio: Blob,
  transcript_id: number,
  model_id: number
) => {
  try {
    if (
      !(await exists(
        `${await appDataDir()}\\model\\${model_id}\\${transcript_id}`
      ))
    ) {
      createDir(`model\\${model_id}\\${transcript_id}`, {
        dir: BaseDirectory.AppData,
      });
    }
    const audioId = uniqid();
    await writeBinaryFile(
      {
        contents: new Uint8Array(await audio.arrayBuffer()),
        path: `model\\${model_id}\\${transcript_id}\\${audioId}.webm`,
      },
      { dir: BaseDirectory.AppData }
    );
    return `model\\${model_id}\\${transcript_id}\\${audioId}.webm`;
  } catch (e) {
    console.log(e);
  }
};

const readAudioFile = async (file_name: string) => {
  try {
    const binaryAudio = await readBinaryFile(file_name, {
      dir: BaseDirectory.Resource,
    });

    return new Blob([binaryAudio], { type: "audio/webm;codecs=opus" });
  } catch (e) {
    console.log(e);
  }
};

export const getRecordedAudio = async (
  model: number | undefined,
  transcript_id: number | undefined
) => {
  if (!model || !transcript_id) {
    console.log("missing");
    return [];
  }
  const path = `model\\${model}\\${transcript_id}`;

  let directories: { name?: string; path: string }[] = [];
  try {
    directories = await readDir(path, {
      dir: BaseDirectory.AppData,
    });
  } catch (e) {
    // If no file found error is thrown
    // happens when no recordings
    console.error(e);
  }
  console.log(directories);
  return directories;
};
