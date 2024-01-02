import { BaseDirectory, createDir, exists, writeBinaryFile, readDir, readBinaryFile, removeFile } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import uniqid from 'uniqid';

export const writeAudioFile = async (
    audio: Blob,
    transcript_id: string,
    model_id: string
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
          path: `model\\${model_id}\\${transcript_id}\\${audioId}.wav`,
        },
        { dir: BaseDirectory.AppData }
      );
      return `model\\${model_id}\\${transcript_id}\\${audioId}.wav`;
    } catch (e) {
      console.log(e);
    }
  };


  export const getAllRecordedAudio = async (
    model: string | undefined,
    transcript_id: string | undefined
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
    return directories;
  };

  // currently when save it is in 8bit might need to change to 16 bit
// const signed16BitArray = unsigned8BitArray.map(x => (x + 128) & 0xFF - 128);

export const getRecordedAudio = async (
    path: string | undefined
  ): Promise<Blob | undefined> => {
    try {
      if (!path) {
        return undefined;
      }
      const binaryAudio = await readBinaryFile(path);
  
      return new Blob([binaryAudio.buffer], { type: "audio/webm;codecs=PCM" });
    } catch (e) {
      console.log(e);
    }
    return undefined;
  };
  
  export const deleteRecordedAudio = async (path: string) => {
    try {
      await removeFile(path);
    } catch (e) {
      console.error(e);
    }
  };
  