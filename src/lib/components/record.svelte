<script lang="ts">
  import { onMount } from "svelte";
  import WaveSurfer from "wavesurfer.js";
  import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
  import Pause from "../icons/pause.svelte";
  import RecordActive from "../icons/record_active.svelte";
  import RecordInactive from "../icons/record_inactive.svelte";
  import Play from "../icons/play.svelte";
  import { type TTranscript } from "../../database/db_functions";
  import { writeAudioFile } from "../file/read_write_audio";

  export let selectedTranscript: TTranscript;
  let isRecording = false;
  let wavesurfer: WaveSurfer;
  let record: RecordPlugin;

  onMount(() => {
    createWaveSurfer();
  });

  const createWaveSurfer = () => {
    // setup wavesurfer
    if (wavesurfer) {
      wavesurfer.destroy();
    }

    wavesurfer = WaveSurfer.create({
      sampleRate: 22050,

      container: "#mic",
      waveColor: "#a6edff",
      progressColor: "#498e9e",
    });

    record = wavesurfer.registerPlugin(
      RecordPlugin.create({
        mimeType: "audio/webm;codecs=PCM",
        audioBitsPerSecond: 163840,
        scrollingWaveform: true,
        renderRecordedAudio: false,
      })
    );

    record.on("record-end", async (blob) => {
      console.log(blob);
      if (selectedTranscript.model_id) {
        writeAudioFile(
          blob,
          selectedTranscript.transcript_id,
          selectedTranscript.model_id
        );
      }
      wavesurfer.destroy();
      wavesurfer = WaveSurfer.create({
        sampleRate: 22050,
        container: "#mic",
        waveColor: "#a6edff",
        progressColor: "#498e9e",
        url: URL.createObjectURL(blob),
      });
      return;
    });
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
      createWaveSurfer();
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

<div class="audio">
  {#if selectedTranscript}
    <h2>
      {selectedTranscript.transcript}
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
</div>

<style>
  #mic {
    background-color: #0f0f0f69;
  }
  .audio {
    display: flex;
    flex-direction: column;
  }
</style>
