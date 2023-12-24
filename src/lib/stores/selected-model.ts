import { writable } from "svelte/store";
import { getTranscript ,type TTranscript} from "../util/transcript";
import type { TModel } from "../util/model";
import { selected_transcript } from "./selected-transcript";

type TModelStore = TModel & {transcript:TTranscript[]} 

export const model_store = writable<TModelStore>({id:'',name:'', transcript:[]});

model_store.subscribe(() => {
    selected_transcript.set({model_id:'', selected_audio_path:'',transcript:'',transcript_id:''})
})