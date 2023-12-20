<script lang="ts">
  import { audioFiles } from "../stores/audioFile";
  import Trash from "../icons/delete.svelte";
  import { deleteRecordedAudio } from "../functions/read_write_audio";
  export let selectedAudioPath: string | undefined;
  import { getContext } from "svelte";

  const { getAudio } = getContext<{
    getAudio: () => Promise<void>;
  }>("refetch");
</script>

<div class="container">
  <div class="audio-list">
    {#each $audioFiles as file}
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
