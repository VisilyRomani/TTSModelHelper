<script lang="ts">
  export let audioFiles: { name?: string; path: string }[] = [];
</script>

<div class="audio-list">
  {#each audioFiles as file}
    <button type="button">
      {file.name}
    </button>
  {/each}
</div>

<style>
  .audio-list {
    /* background-color: #0f0f0f98; */
    border-radius: 0.5em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin: 1em;
    padding: 1em;
  }
</style>
