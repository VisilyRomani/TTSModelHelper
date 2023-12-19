<script lang="ts">
  import { onMount } from "svelte";
  import { audio, type TAudio } from "../database/db_functions";
  import { model_store } from "./stores/model";
  import WaveSurfer from "wavesurfer.js";
  import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
  import Play from "./icons/play.svelte";
  import Pause from "./icons/pause.svelte";
  import RecordActive from "./icons/record_active.svelte";
  import RecordInactive from "./icons/record_inactive.svelte";
  import { writeAudioFile } from "./file/read_write_audio";

  let selectedAudio: TAudio;
  let audioData: TAudio[] = [];
  let wavesurfer: WaveSurfer;
  let record: RecordPlugin;

  $: isRecording = false;
  onMount(async () => {
    // gets all transcript data
    if ($model_store) {
      audioData = await audio.getAudio($model_store);
      console.log(audioData);
    }
    createWaveSurfer(null);
  });

  $: selectedAudio && createWaveSurfer(selectedAudio);

  const createWaveSurfer = (savedAudio: TAudio | null) => {
    // setup wavesurfer
    if (wavesurfer) {
      wavesurfer.destroy();
    }

    wavesurfer = WaveSurfer.create({
      sampleRate:22050,

      container: "#mic",
      waveColor: "#a6edff",
      progressColor: "#498e9e",
    });

    record = wavesurfer.registerPlugin(
      RecordPlugin.create({
        mimeType:'audio/webm;codecs=PCM',
        audioBitsPerSecond:163840,
        scrollingWaveform: true,
        renderRecordedAudio: false,
      })
    );

    record.on("record-end", async (blob) => {
      console.log(blob)
      if (selectedAudio?.model_id) {
        writeAudioFile(blob, selectedAudio.audio_id, selectedAudio.model_id);
      }
      wavesurfer.destroy();
      wavesurfer = WaveSurfer.create({
        sampleRate:22050,
        container: "#mic",
        waveColor: "#a6edff",
        progressColor: "#498e9e",
        url: URL.createObjectURL(blob),
      });
      return;
    });
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

  const handleRecordPause = () => {
    if (record.isPaused()) {
      record.resumeRecording();
    } else {
      record.pauseRecording();
    }
  };

  const handleRecordStart = () => {
    if (record.isRecording() || record.isPaused()) {
      isRecording = false;
      record.stopRecording();
    } else {
      isRecording = true;
      createWaveSurfer(null);
      record.startRecording();
    }
  };

  const recordPlayback = () => {
    if (wavesurfer.isPlaying()) {
      wavesurfer.pause();
    } else {
      wavesurfer.play();
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
        <button
          type="button"
          on:click={async () => {
            if ($model_store) {
              audioData = await audio.getAudio($model_store);
            }
            selectedAudio = line;
          }}
          class={selectedAudio?.audio_id === line?.audio_id ? "selected" : ""}
          >{line.transcript}</button
        >
      {/each}
    </div>
  </div>

  <div class="audio {selectedAudio ?? 'hidden'}" >
    {#if selectedAudio}
      <h2>
        {selectedAudio?.transcript}
      </h2>
    {/if}
    <div
      id="mic"
      style="border: 1px solid #ddd; border-radius: 4px; margin: 1rem"
    />
    <div class="controls">
      <button type="button" on:click={recordPlayback}>
        <Play />
      </button>

      <button type="button" on:click={handleRecordStart}>
        {#if isRecording}
          <RecordInactive />
        {:else}
          <RecordActive fill="red" />
        {/if}
      </button>

      <button type="button" on:click={handleRecordPause}>
        <Pause />
      </button>
    </div>
    <!-- <button type="button" on:click={handleRecord}>start</button> -->
  </div>
</div>

<style>
  
  .hidden{
    visibility: hidden;
  }
  #mic{
    background-color: #0f0f0f69;
  }
  .selected {
    background-color: #b0b0b098;
  }
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
    display: flex;
    flex-direction: column;
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
