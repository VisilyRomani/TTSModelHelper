<script lang="ts">
  import { getContext, onMount } from "svelte";
  import WaveSurfer from "wavesurfer.js";
  import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
  import Pause from "../icons/pause.svelte";
  import RecordActive from "../icons/record_active.svelte";
  import RecordInactive from "../icons/record_inactive.svelte";
  import Play from "../icons/play.svelte";
  import { selected_transcript } from "../stores/selected-transcript";
  import { writeAudioFile } from "../util/audio.";
  import { transcode } from "../ffmpeg/ffmpeg";

  export let audio: Blob | undefined;
  let isRecording = false;
  let wavesurfer: WaveSurfer;
  let record: RecordPlugin;

  let testAudio: Blob;
  $: testAudio;
  $: console.log($selected_transcript);

  onMount(() => {
    createWaveSurfer(undefined);
  });

  // const { getAudio } = getContext<{
  //   getAudio: () => Promise<void>;
  // }>("refetch");

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
        // mimeType: "audio/webm;codecs=PCM",
        // audioBitsPerSecond: 163840,
        scrollingWaveform: true,
        renderRecordedAudio: false,
      })
    );

    record.on("record-end", async (blob) => {
      if ($selected_transcript.model_id) {
        // await writeAudioFile(
        //   blob,
        //   $selected_transcript.transcript_id,
        //   $selected_transcript.model_id
        // );
        console.log("blob", blob);
        const wav = await transcode(blob);
        console.log("wav", wav);
        testAudio = wav;
      }
      if (wavesurfer) {
        wavesurfer.destroy();
      }
      // wavesurfer = WaveSurfer.create({
      //   sampleRate: 22050,
      //   container: "#mic",
      //   waveColor: "#a6edff",
      //   progressColor: "#498e9e",
      //   url: URL.createObjectURL(blob),
      // });
    });
  };

  $: if (window.document && audio) {
    createWaveSurfer(audio);
  }

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
{#if testAudio}
  <audio controls src={URL.createObjectURL(testAudio)}></audio>
{:else}
  nothing
{/if}

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
