<script lang="ts">
  import { deleteRecordedAudio, type TAudio } from "../util/audio.";
  import Trash from "../icons/delete.svelte";
  import { createEventDispatcher } from "svelte";
  import { selected_transcript } from "../stores/selected-transcript";

  export let selectedAudio: { path?: string; data?: Blob };
  export let audioFiles: TAudio[] = [];
  const dispatch = createEventDispatcher<{ select: TAudio }>();
</script>

<div class="container">
  <div class="audio-list">
    {#if audioFiles.length === 0}
      <h4>No Audio Files</h4>
    {/if}
    {#each audioFiles as file}
      <div
        class="file-item {selectedAudio?.path === file.path ? 'active' : ''}"
      >
        <div>
          <button
            type="button"
            on:click={() => {
              dispatch("select", { path: file.path });
            }}
          >
            Select
          </button>
          {file.name}
        </div>
        <button
          type="button"
          on:click={async () => {
            await deleteRecordedAudio(
              file.path,
              $selected_transcript.transcript_id
            );
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
