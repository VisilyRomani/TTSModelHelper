<script lang="ts">
  import { onMount } from "svelte";
  import { model, type TModel } from "../database/db_functions";
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
</script>

<div>
  <input bind:value={input} />
  <button type="button" on:click={modelCreator}>Create</button>
</div>

{#each data as model}
  <div>
    {model.name}
  </div>
{/each}
