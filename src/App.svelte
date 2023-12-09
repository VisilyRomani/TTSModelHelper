<script lang="ts">
  import ModelSelector from "./lib/ModelSelector.svelte";
  import { db } from "./database/db";

  const a = async () => {
    const dat =  await db.select("SELECT * FROM model");
    console.log(dat)
    return dat
  }
  a()
  
</script>

<main class="container">
  <h1>Models</h1>
  <ModelSelector/>
</main>

<style>
  .logo.vite:hover {
    filter: drop-shadow(0 0 2em #747bff);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00);
  }
</style>