<script lang="ts">
  import WaveSurfer from "wavesurfer.js";
  import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
  import Pause from "../icons/pause.svelte";
  import RecordActive from "../icons/record_active.svelte";
  import RecordInactive from "../icons/record_inactive.svelte";
  import Play from "../icons/play.svelte";
  import { selected_transcript } from "../stores/selected-transcript";
  import { writeAudioFile } from "../util/audio.";
  import { transcode } from "../ffmpeg/ffmpeg";
  import { createEventDispatcher } from "svelte";

  export let selectedAudio: { path?: string; data?: Blob };
  let isRecording = false;
  let wavesurfer: WaveSurfer;
  let record: RecordPlugin;

  const dispatch = createEventDispatcher();

  const createWaveSurfer = async (audio: Blob | undefined) => {
    if (wavesurfer) {
      wavesurfer.destroy();
    }

    wavesurfer = WaveSurfer.create({
      sampleRate: 22050,
      container: "#mic",
      waveColor: "#a6edff",
      progressColor: "#498e9e",
      url: audio ? URL.createObjectURL(audio) : undefined,
    });

    record = wavesurfer.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: false,
      })
    );

    record.on("record-end", async (blob) => {
      if ($selected_transcript.model_id) {
        await writeAudioFile(
          blob,
          $selected_transcript.transcript_id,
          $selected_transcript.model_id
        );
        const wav = await transcode(blob);
        if (wavesurfer) {
          wavesurfer.destroy();
        }
        dispatch("refetch");
        wavesurfer = WaveSurfer.create({
          sampleRate: 22050,
          container: "#mic",
          waveColor: "#a6edff",
          progressColor: "#498e9e",
          url: URL.createObjectURL(blob),
        });
      }
    });
  };

  $: window.document, selectedAudio && createWaveSurfer(selectedAudio.data);

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
      createWaveSurfer(undefined);
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
  {#if $selected_transcript}
    <h2>
      {$selected_transcript.transcript}
    </h2>
  {/if}
  <div id="mic" />
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
    border-radius: 4px;
    margin: 1rem;
    height: 128px;
  }
  .audio {
    display: flex;
    flex-direction: column;
  }
</style>
