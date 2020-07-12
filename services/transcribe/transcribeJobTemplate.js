export const getTranscribeJob = (input, output, videoId) => {
  return {
    TranscriptionJobName: videoId,
    LanguageCode: "en-US",
    MediaSampleRateHertz: 48000,
    MediaFormat: "mp4",
    Media: {
      MediaFileUri: input,
    },
    OutputBucketName: output,
  }
}
