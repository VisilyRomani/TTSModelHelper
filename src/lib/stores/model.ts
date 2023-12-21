import { writable } from "svelte/store";
import { transcript } from "../functions/db_functions";

export type model = {
  model_id: number;
  transcript: {
    transcript_id: number;
    transcript: string;
    selected_audio: string | null;
  }[];
};

export const model_store = writable<model>();

model_store.subscribe(async (ctx) => {
  // from db get transcript from value.modelid
  ctx.model_id;

  ctx.transcript = await transcript.getTranscript(ctx.model_id);
});
