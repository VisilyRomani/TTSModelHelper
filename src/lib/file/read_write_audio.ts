import {
  writeBinaryFile,
  BaseDirectory,
  readBinaryFile,
} from "@tauri-apps/api/fs";

export const writeAudioFile = async (
  audio: Blob,
  file_name: string,
  model_name: string
) => {
  try {
    await writeBinaryFile(
      {
        contents: new Uint8Array(await audio.arrayBuffer()),
        path: `model\\${model_name}\\${file_name}.wav`,
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
