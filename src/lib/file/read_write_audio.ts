import {
  writeBinaryFile,
  BaseDirectory,
  readBinaryFile,
} from "@tauri-apps/api/fs";

export const writeAudioFile = async (
  audio: Blob,
  file_name: number,
  model_name: number
) => {
  try {
    await writeBinaryFile(
      {
        contents: new Uint8Array(await audio.arrayBuffer()),
        path: `model\\${model_name}\\${file_name}.webm`,
      },
      { dir: BaseDirectory.AppData }
    );
    return `${model_name}\\${file_name}.wav`;
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
