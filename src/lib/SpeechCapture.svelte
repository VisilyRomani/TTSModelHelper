<script lang="ts">
  import Transcript from "./components/transcript.svelte";
  import Record from "./components/record.svelte";
  import SelectAudio from "./components/selectaudio.svelte";
  import { selected_transcript } from "./stores/selected-transcript";
  import {
    getAllRecordedAudio,
    getRecordedAudio,
    type TAudio,
  } from "./util/audio.";
  import { updateAudioPath } from "./util/transcript";
  import { model_store } from "./stores/selected-model";
  let selectedAudio: { path?: string; data?: Blob };
  let audioFiles: TAudio[] = [];

  const getAudio = async () => {
    audioFiles = await getAllRecordedAudio(
      $selected_transcript.model_id,
      $selected_transcript?.transcript_id
    );
    selectedAudio = {
      path: $selected_transcript.selected_audio_path,
      data: await getRecordedAudio($selected_transcript.selected_audio_path),
    };
  };

  const refetchHandler = () => {
    getAudio();
  };

  const selectHandler = async (e: CustomEvent<TAudio>) => {
    await updateAudioPath(e.detail.path, $selected_transcript.transcript_id);
    selectedAudio = {
      path: e.detail.path,
      data: await getRecordedAudio(e.detail.path),
    };
    selected_transcript.update((data) => {
      data.selected_audio_path = e.detail.path;
      return data;
    });
    model_store.update((store) => {
      store.transcript = $model_store.transcript.map((data) => {
        if (data.transcript_id === $selected_transcript.transcript_id) {
          return { ...data, selected_audio_path: e.detail.path };
        } else {
          return data;
        }
      });
      return store;
    });
  };

  $: $selected_transcript, getAudio();
</script>

<div class="window-container">
  <Transcript />
  <div class="cont">
    {#if $selected_transcript.transcript_id}
      <Record bind:selectedAudio on:refetch={refetchHandler} />
      <SelectAudio
        bind:audioFiles
        bind:selectedAudio
        on:select={selectHandler}
      />
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
