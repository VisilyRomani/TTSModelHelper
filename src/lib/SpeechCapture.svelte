<script lang="ts">
  import { onMount } from "svelte";
  import { audio, type TAudio } from "../database/db_functions";
  import { model_store } from "./stores/model";
  let audioData: TAudio[] = [];

  let selectedAudio: TAudio;

  onMount(async () => {
    if ($model_store) {
      audioData = await audio.getAudio($model_store);
    }
    console.log(await checkMic());
  });

  const checkMic = () => {
    if (window.navigator.mediaDevices) {
      return window.navigator.mediaDevices.getUserMedia({ audio: true });
    }
  };

  const handleTextFile = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const transcript = String(evt.target?.result)
          ?.replace(/\r?\n|\r/g, "")
          .replace(/['"]+/g, "")
          .split(",")
          .map((s) => s.trim())
          .filter((s) => !!s);
        if ($model_store) {
          await audio.importAudio(transcript, $model_store);
          audioData = await audio.getAudio($model_store);
        }
      };
      if (e.target.files?.length) {
        reader.readAsText(e.target.files[0]);
      }
    }
  };
</script>

<div class="window-container">
  <div class="transcript">
    <label class="input-file">
      Import Transcript
      <input type="file" accept=".csv, .txt" on:change={handleTextFile} />
    </label>
    <div class="audio-continer">
      {#each audioData as line}
        <button type="button" on:click={() => (selectedAudio = line)}
          >{line.transcript}</button
        >
      {/each}
    </div>
  </div>
  <div class="audio">
    {#if selectedAudio?.audio_id}
      <h2>{selectedAudio.transcript}</h2>
    {/if}
  </div>
</div>

<style>
  .transcript {
    padding: 1em;
    display: flex;
    gap: 1em;
    flex-flow: column;
    overflow: auto;
  }
  .window-container {
    display: grid;
    grid-template-columns: 300px 1fr;
    overflow: auto;
  }

  .audio-continer {
    gap: 0.5em;
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: 0.5em;
  }
  .audio {
    padding: 1em;
  }

  .input-file {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    color: #ffffff;
    background-color: #0f0f0f98;
  }

  input[type="file"] {
    display: none;
  }

  .input-file {
    cursor: pointer;
  }

  .input-file:hover {
    border-color: #396cd8;
  }
  .input-file:active {
    border-color: #396cd8;
    background-color: #0f0f0f69;
  }
</style>
