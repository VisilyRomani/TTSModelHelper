<script lang="ts">
  import { onMount } from "svelte";
  import { assignModel } from "./stores/selected-model";
  import { save } from "@tauri-apps/api/dialog";
  import {
    clearModels,
    createModel,
    getExportAudioFiles,
    getModels,
    type TModel,
  } from "./util/model";
  import JSZip from "jszip";
  import { writeBinaryFile, writeFile } from "@tauri-apps/api/fs";
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
  };

  const exportHandler = async (model: TModel) => {
    const exportFiles = await getExportAudioFiles(model);

    const savePath = await save({
      title: "Export Audio",
      filters: [{ name: "zip", extensions: ["zip"] }],
    });
    const zip = new JSZip();

    const audio = zip.folder("wav");
    try {
      exportFiles.forEach(async (element) => {
        if (element.data) {
          audio?.file(`${element.transcript_id}.wav`, element.data, {
            binary: true,
          });
        }
      });

      const data = await zip?.generateAsync({ type: "blob" });

      if (data) {
        writeBinaryFile(
          `${savePath}.zip`,
          (await data.arrayBuffer()) as Uint8Array
        );
      } else {
        alert("Failed to export");
      }
    } catch (e) {
      console.error(e);
    }
  };
</script>

<div>
  <input bind:value={input} />
  <button type="button" on:click={modelCreator}>Create</button>
  <!-- <button type="button" on:click={deleteModels}>Delete All Models</button> -->
</div>
<div class="model-container">
  {#each data as model}
    <div class="model">
      <h3>
        {model.name}
      </h3>
      <div>
        <button on:click={() => exportHandler(model)} type="button">
          Export
        </button>
        <button
          class="model-selector"
          type="button"
          on:click={() => assignModel(model)}
        >
          >
        </button>
      </div>
    </div>
  {/each}
</div>

<style>
  .model {
    background-color: rgb(74, 69, 69);
    display: flex;
    gap: 1em;
    justify-content: space-between;
    border-radius: 1em;
    align-items: center;
    padding: 0.5em;
  }
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
