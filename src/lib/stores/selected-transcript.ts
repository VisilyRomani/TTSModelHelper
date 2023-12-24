import { writable } from "svelte/store";
import type { TTranscript } from "../util/transcript";

export const selected_transcript = writable<TTranscript>()

