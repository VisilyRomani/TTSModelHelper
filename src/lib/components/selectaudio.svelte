<script lang="ts">
  import Trash from "../icons/delete.svelte";
  export let selectedAudioPath: string | undefined;
  import { deleteRecordedAudio, getAllRecordedAudio } from "../util/audio.";
  import { selected_transcript } from "../stores/selected-transcript";

  let audioFiles: { name?: string; path: string }[] = [];

  const getAudio = async () => {
    audioFiles = await getAllRecordedAudio(
      $selected_transcript.model_id,
      $selected_transcript?.transcript_id
    );
  };
  $selected_transcript && getAudio()
</script>

<div class="container">
  <div class="audio-list">
    {#if audioFiles.length === 0}
      <h4>No Audio Files</h4>
    {/if}
    {#each audioFiles as file}
      <div class="file-item {selectedAudioPath === file.path ? 'active' : ''}">
        <div>
          <button
            type="button"
            on:click={() => (selectedAudioPath = file.path)}
          >
            Select
          </button>
          {file.name}
        </div>
        <button
          type="button"
          on:click={async () => {
            await deleteRecordedAudio(file.path);
            await getAudio();
          }}
        >
          <Trash fill="white" /></button
        >
      </div>
    {/each}
  </div>
</div>

<style>
  .active {
    background-color: #b0b0b098;
  }
  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0.5em;
    width: 100%;
    padding: 0.5em;
  }

  .audio-list {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin: 1em;
    padding: 1em;
  }
  .container {
    /* height:; */
    overflow: auto;
  }
</style>
