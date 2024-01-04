<script lang="ts">
  import { model_store } from "../stores/selected-model";
  import { getTranscript, importTranscript } from "../util/transcript";
  import { selected_transcript } from "../stores/selected-transcript";
  import { message } from "@tauri-apps/api/dialog";

  const handleJsonInput = async (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      if (e.target.files?.length) {
        try {
          const transcriptList: { text: string }[] = JSON.parse(
            await e.target.files[0].text()
          );
          if (
            Array.isArray(transcriptList) &&
            transcriptList.every(
              (item) =>
                typeof item === "object" &&
                item.hasOwnProperty("text") &&
                typeof item.text === "string"
            )
          ) {
            if ($model_store) {
              await importTranscript(
                transcriptList.map((t) => t.text),
                $model_store.id
              );
              const transcript = await getTranscript($model_store.id);
              model_store.set({ ...$model_store, transcript: transcript });
            }
          } else {
            throw Error("Invalid JSON input");
          }
        } catch (e) {
          console.log(e);
          if (e instanceof Error) {
            message("Error: " + e.message, { title: "Error", type: "error" });
          }
        }
      }
    }
  };
  $: transcript = $model_store.transcript;
</script>

<div class="transcript">
  <label class="input-file">
    Import Transcript
    <input type="file" accept="application/json" on:change={handleJsonInput} />
  </label>
  <div class="transcript-continer">
    {#each transcript as line, idx (idx)}
      <button
        type="button"
        on:click={async () => {
          selected_transcript.set(line);
        }}
        class={$selected_transcript?.transcript_id === line?.transcript_id
          ? "selected"
          : line?.selected_audio_path
            ? "completed"
            : ""}
      >
        {idx}. {line.transcript}</button
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
  .completed {
    background-color: rgb(104, 147, 104);
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
    background-color: #8789da98;
  }
  button {
    text-align: left;
  }
</style>
