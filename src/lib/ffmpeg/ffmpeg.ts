import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

export let ffmpeg: FFmpeg | null;

// Inital load for ffmpeg.wasm
const load = async () => {
  if (!ffmpeg) {
    console.log("loading ffmpeg");
    ffmpeg = new FFmpeg();
    let baseURL = "https://unpkg.com/@ffmpeg/core@0.12.5/dist/esm";
    const loaded = await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  }
};

// converts blob audio from recoring into Signed 16 Bit PCM audio file at 22050 sample rate
export const transcode = async (audioFile: Blob): Promise<Blob> => {
  if (ffmpeg) {
    ffmpeg.on("progress", (e) => {
      console.log(e.progress);
    });
    await ffmpeg.writeFile("raw-audio", await fetchFile(audioFile));
    await ffmpeg.exec([
      "-i",
      "raw-audio",
      "-vn",
      "-c:a",
      "pcm_s16le",
      "-ar",
      "22050",
      "output.wav",
    ]);
    const output = (await ffmpeg.readFile("output.wav")) as Uint8Array;
    return new Blob([output.buffer], { type: "audio/wav; codecs=MS_PCM" });
  } else {
    await load();
    return await transcode(audioFile);
  }
};
