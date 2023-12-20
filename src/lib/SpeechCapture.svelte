<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { transcript, type TTranscript } from "./functions/db_functions";
  import Transcript from "./components/transcript.svelte";
  import { model_store } from "./stores/model";
  import Record from "./components/record.svelte";
  import {
    getAllRecordedAudio,
    getRecordedAudio,
  } from "./functions/read_write_audio";
  import SelectAudio from "./components/selectaudio.svelte";
  import { audioFiles } from "./stores/audioFile";
  let selectedTranscript: TTranscript;
  let selectedAudioPath: string | undefined;
  let transcriptList: TTranscript[] = [];
  let audio: Blob | undefined;

  onMount(async () => {
    if ($model_store) {
      transcriptList = await transcript.getTranscript($model_store);
    }
  });

  const audioAsync = async () => {
    audio = await getRecordedAudio(selectedAudioPath);
  };

  const getAudio = async () => {
    audioFiles.set(
      await getAllRecordedAudio($model_store, selectedTranscript?.transcript_id)
    );
    audio = undefined;
    selectedAudioPath = undefined;
  };

  setContext("refetch", { getAudio });

  $: selectedAudioPath && audioAsync();
  $: selectedTranscript && getAudio();
</script>

<div class="window-container">
  <Transcript {transcriptList} bind:selectedTranscript />
  <div class="cont">
    {#if selectedTranscript}
      <Record bind:selectedTranscript bind:audio />
      <SelectAudio bind:selectedAudioPath />
    {/if}
  </div>
</div>

<style>
  .window-container {
    display: grid;
    grid-template-columns: minmax(400px, 20%) 1fr;
    overflow: auto;
  }
  .cont {
    padding: 1em;
    display: flex;
    gap: 1em;
    flex-flow: column;
    overflow: auto;
  }
</style>
