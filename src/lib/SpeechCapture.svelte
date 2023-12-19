<script lang="ts">
  import { onMount } from "svelte";
  import { transcript, type TTranscript } from "../database/db_functions";
  import Transcript from "./components/transcript.svelte";
  import { model_store } from "./stores/model";
  import Record from "./components/record.svelte";
  import { getRecordedAudio } from "./file/read_write_audio";
  import SelectAudio from "./components/selectaudio.svelte";
  let selectedTranscript: TTranscript;
  let transcriptList: TTranscript[] = [];
  let audioFiles: { name?: string; path: string }[] = [];
  onMount(async () => {
    // gets all transcript data
    if ($model_store) {
      transcriptList = await transcript.getTranscript($model_store);
    }
  });

  const getAudio = async () => {
    audioFiles = await getRecordedAudio(
      $model_store,
      selectedTranscript?.transcript_id
    );
  };

  $: selectedTranscript && getAudio();
</script>

<div class="window-container">
  <Transcript {transcriptList} bind:selectedTranscript />
  <div>
    {#if selectedTranscript}
      <Record bind:selectedTranscript />
      <SelectAudio bind:audioFiles />
    {/if}
  </div>
</div>

<style>
  .window-container {
    display: grid;
    grid-template-columns: minmax(400px, 20%) 1fr;
    overflow: auto;
  }
</style>
