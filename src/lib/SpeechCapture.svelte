<script lang="ts">
  import { onMount, setContext } from "svelte";
  import Transcript from "./components/transcript.svelte";
  import { model_store } from "./stores/selected-model";
  import Record from "./components/record.svelte";
  import SelectAudio from "./components/selectaudio.svelte";
  import { selected_transcript } from "./stores/selected-transcript";
  import { getRecordedAudio } from "./util/audio.";
  let selectedAudioPath = $selected_transcript?.selected_audio_path || undefined
  let audio: Blob | undefined;

  const audioAsync = async () => {
    audio = await getRecordedAudio(selectedAudioPath);
  };

  $: selectedAudioPath && audioAsync();
</script>

<div class="window-container">
  <Transcript />
  <div class="cont">
    {#if $selected_transcript.transcript_id}
      <Record bind:audio />
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
