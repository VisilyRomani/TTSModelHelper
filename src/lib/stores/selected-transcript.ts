import { writable } from "svelte/store";
import type { TTranscript } from "../util/transcript";

export const selected_transcript = writable<TTranscript>({
  model_id: "",
  selected_audio_path: "",
  transcript: "",
  transcript_id: "",
});
