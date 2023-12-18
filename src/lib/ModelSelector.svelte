<script lang="ts">
  import { onMount } from "svelte";
  import { model, type TModel } from "../database/db_functions";
  import { model_store } from "./stores/model";
  let input = "";
  let data: TModel = [];
  onMount(async () => {
    data = await model.getModels();
  });

  const modelCreator = async () => {
    await model.createModel(input);
    data = await model.getModels();
    input = "";
  };

  const deleteModels = async () => {
    await model.clearModels();
    data = await model.getModels();
  };

  const assignModel = (model_id: number) => {
    model_store.set(model_id);
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
      on:click={() => assignModel(model.id)}
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
