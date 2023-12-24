<script lang="ts">
  import { onMount } from "svelte";
  import { model_store } from "./stores/selected-model";
  import { getTranscript } from "./util/transcript";
  import { clearModels, createModel, getModels, type TModel } from "./util/model";
  let input = "";
  let data: TModel[] = [];

  onMount(async () => {
    data = await getModels();
  });

  const modelCreator = async () => {
    await createModel(input);
    data = await getModels();
    input = "";
  };

  const deleteModels = async () => {
    await clearModels();
    data = await getModels();
    console.log(data)
    
  };

  const assignModel = async (model:TModel) => {
    const transcripts = await getTranscript(model.id)
    model_store.set({...model, transcript:transcripts});
  };
</script>

<div>
  <input bind:value={input} />
  <button type="button" on:click={modelCreator}>Create</button>
  <button type="button" on:click={deleteModels}>Delete All Models</button>
</div>
<div class="model-container">
  {#each data as model}
    <button
      class="model-selector"
      type="button"
      on:click={() => assignModel(model)}
    >
      {model.name}
    </button>
  {/each}
</div>

<style>
  .model-container {
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 0.5em;
  }

  .model-selector {
    padding: 0.5em;
  }
</style>
