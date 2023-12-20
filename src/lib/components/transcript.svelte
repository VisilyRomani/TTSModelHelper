<script lang="ts">
  import { transcript, type TTranscript } from "../functions/db_functions";
  import { model_store } from "../stores/model";

  export let selectedTranscript: TTranscript | null;
  export let transcriptList: TTranscript[] = [];

  const handleTextFile = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const trans = String(evt.target?.result)
          ?.replace(/\r?\n|\r/g, "")
          .replace(/['"]+/g, "")
          .split(",")
          .map((s) => s.trim())
          .filter((s) => !!s);
        if ($model_store) {
          await transcript.importTranscript(trans, $model_store);
          transcriptList = await transcript.getTranscript($model_store);
        }
      };
      if (e.target.files?.length) {
        reader.readAsText(e.target.files[0]);
      }
    }
  };
</script>

<div class="transcript">
  <label class="input-file">
    Import Transcript
    <input type="file" accept=" .txt" on:change={handleTextFile} />
  </label>
  <div class="transcript-continer">
    {#each transcriptList as line}
      <button
        type="button"
        on:click={async () => {
          if ($model_store) {
            transcriptList = await transcript.getTranscript($model_store);
          }
          selectedTranscript = line;
        }}
        class={selectedTranscript?.transcript_id === line?.transcript_id
          ? "selected"
          : ""}>{line.transcript}</button
      >
    {/each}
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
  .transcript-continer {
    gap: 0.5em;
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: 0.5em;
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
  .selected {
    background-color: #b0b0b098;
  }
</style>
