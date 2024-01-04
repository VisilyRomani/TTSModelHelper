<script lang="ts">
  import { onMount } from "svelte";
  import { assignModel } from "./stores/selected-model";
  import { save, ask } from "@tauri-apps/api/dialog";
  import {
    deleteModel,
    createModel,
    getExportAudioFiles,
    getModels,
    type TModel,
  } from "./util/model";
  import JSZip from "jszip";
  import { writeBinaryFile } from "@tauri-apps/api/fs";
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

  /**
   * Folder structure for export
   * - metadata.csv
   * - wav
   *    - audio files
   */
  const exportHandler = async (model: TModel) => {
    const exportFiles = await getExportAudioFiles(model);

    const savePath = await save({
      title: "Export Audio",
      defaultPath: model.name.replaceAll(" ", "_"),
      filters: [{ name: "zip", extensions: ["zip"] }],
    });

    const zip = new JSZip();
    const audio = zip.folder("wav");

    if (!audio) {
      alert("failed to create wav folder");
      return;
    }

    // creates metadata.csv & zips wav audio files
    let metadata = "";
    exportFiles.forEach((element) => {
      // only create csv with available audio blob data
      if (element.data) {
        metadata =
          metadata + element.transcript_id + "|" + element.transcript + "\n";
        audio.file(`${element.transcript_id}.wav`, element.data, {
          binary: true,
        });
      }
    });

    zip.file("metadata.csv", new Blob([metadata], { type: "text/csv" }));

    const data = await zip.generateAsync({ type: "blob" });

    writeBinaryFile(
      `${savePath}.zip`,
      (await data.arrayBuffer()) as Uint8Array
    );
  };

  const deleteHandler = async (model: TModel) => {
    const result = await ask(
      `Are you sure you want to delete model: ${model.name}`,
      {
        title: "Delete",
        type: "warning",
      }
    );
    if (!result) {
      return;
    }

    await deleteModel(model);
    data = await getModels();
  };
</script>

<div>
  <input bind:value={input} />
  <button type="button" on:click={modelCreator}>Create</button>
</div>
<div class="model-container">
  {#each data as listModel}
    <div class="model">
      <h3>
        {listModel.name}
      </h3>
      <div class="btn-container">
        <div class="btn-sub">
          <button type="button" on:click={() => exportHandler(listModel)}>
            Export
          </button>
          <button type="button" on:click={() => deleteHandler(listModel)}>
            Delete
          </button>
        </div>
        <button
          class="model-selector"
          type="button"
          on:click={() => assignModel(listModel)}
        >
          Open
        </button>
      </div>
    </div>
  {/each}
</div>

<style>
  .btn-sub {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
  .btn-container {
    display: flex;
    gap: 1em;
  }
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
