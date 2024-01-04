## Introduction

TTSModelHelper is used to record audio training data for rhasspy [Piper](https://github.com/rhasspy/piper) text to speach. Users can import a transcript for a model they create. Preview and listen to past audio they recorded and export all of the files into a compliant zip folder containing all of their training data 

## Getting Started
If you are interested in making changes fork and clone the repository.
Make sure you have the [prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) software to create a tauri application. Follow the quickstart guide from at Tauri website 

Install the node requrements:
```sh
pnpm i
```
To launch the delopment enviroment with pnpm:
```sh
pnpm tauri dev
```

## Exeptions
Currently this application does not support multiple speakers

## Format
Metadata is structured with an id and transcript seperated by `|` 

```id|transcript```

Exported files are in a zip format that follows the following structure
```
file.zip
│   metadata.csv    
│
└───wav
    │   audiofile.wav
    │   audiofile2.wav
```

