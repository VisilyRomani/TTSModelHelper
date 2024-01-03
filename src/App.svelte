<script lang="ts">
  import ModelSelector from "./lib/ModelSelector.svelte";
  import SpeechCapture from "./lib/SpeechCapture.svelte";
  import { model_store } from "./lib/stores/selected-model";
</script>

<main class="container">
  {#if $model_store?.id}
    <button
      type="button"
      id="back"
      on:click={() => model_store.set({ id: "", name: "", transcript: [] })}
    >
      Back
    </button>
  {/if}
  <h1>Models</h1>
  {#if $model_store?.id}
    <SpeechCapture />
  {:else}
    <ModelSelector />
  {/if}
</main>

<style>
  #back {
    position: absolute;
    left: 5px;
    top: 5px;
  }

  .container {
    display: flex;
    flex-direction: column;
    text-align: center;
    overflow: hidden;
    height: 100%;
  }
</style>
