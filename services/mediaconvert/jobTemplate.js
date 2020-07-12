export const getJobTemplate = (input, output) => {
  return {
    Queue: "arn:aws:mediaconvert:us-west-2:527728718473:queues/Default",
    UserMetadata: {
      job: "id",
      videoid: "123",
    },
    Role: "arn:aws:iam::527728718473:role/media_convert_default_role",
    Settings: {
      TimecodeConfig: {
        Source: "ZEROBASED",
      },
      OutputGroups: [
        {
          CustomName: "dash-output",
          Name: "DASH ISO",
          Outputs: [
            {
              ContainerSettings: {
                Container: "MPD",
              },
              VideoDescription: {
                ScalingBehavior: "DEFAULT",
                TimecodeInsertion: "DISABLED",
                AntiAlias: "ENABLED",
                Sharpness: 50,
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    InterlaceMode: "PROGRESSIVE",
                    NumberReferenceFrames: 3,
                    Syntax: "DEFAULT",
                    Softness: 0,
                    GopClosedCadence: 1,
                    GopSize: 90,
                    Slices: 1,
                    GopBReference: "DISABLED",
                    MaxBitrate: 6000000,
                    SlowPal: "DISABLED",
                    SpatialAdaptiveQuantization: "ENABLED",
                    TemporalAdaptiveQuantization: "ENABLED",
                    FlickerAdaptiveQuantization: "DISABLED",
                    EntropyEncoding: "CABAC",
                    FramerateControl: "INITIALIZE_FROM_SOURCE",
                    RateControlMode: "QVBR",
                    QvbrSettings: {
                      QvbrQualityLevel: 9,
                      QvbrQualityLevelFineTune: 0,
                    },
                    CodecProfile: "MAIN",
                    Telecine: "NONE",
                    MinIInterval: 0,
                    AdaptiveQuantization: "HIGH",
                    CodecLevel: "AUTO",
                    FieldEncoding: "PAFF",
                    SceneChangeDetect: "ENABLED",
                    QualityTuningLevel: "SINGLE_PASS_HQ",
                    FramerateConversionAlgorithm: "DUPLICATE_DROP",
                    UnregisteredSeiTimecode: "DISABLED",
                    GopSizeUnits: "FRAMES",
                    ParControl: "INITIALIZE_FROM_SOURCE",
                    NumberBFramesBetweenReferenceFrames: 2,
                    RepeatPps: "DISABLED",
                    DynamicSubGop: "STATIC",
                  },
                },
                AfdSignaling: "NONE",
                DropFrameTimecode: "ENABLED",
                RespondToAfd: "NONE",
                ColorMetadata: "INSERT",
              },
              NameModifier: "video-fileid",
            },
            {
              ContainerSettings: {
                Container: "MPD",
              },
              AudioDescriptions: [
                {
                  AudioTypeControl: "FOLLOW_INPUT",
                  AudioSourceName: "Audio Selector 1",
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      AudioDescriptionBroadcasterMix: "NORMAL",
                      Bitrate: 96000,
                      RateControlMode: "CBR",
                      CodecProfile: "LC",
                      CodingMode: "CODING_MODE_2_0",
                      RawFormat: "NONE",
                      SampleRate: 48000,
                      Specification: "MPEG4",
                    },
                  },
                  LanguageCodeControl: "FOLLOW_INPUT",
                },
              ],
              NameModifier: "audio-fileid",
            },
            {
              ContainerSettings: {
                Container: "MPD",
              },
              VideoDescription: {
                Width: 1280,
                ScalingBehavior: "DEFAULT",
                Height: 720,
                TimecodeInsertion: "DISABLED",
                AntiAlias: "ENABLED",
                Sharpness: 50,
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    InterlaceMode: "PROGRESSIVE",
                    ParNumerator: 1,
                    NumberReferenceFrames: 3,
                    Syntax: "DEFAULT",
                    FramerateDenominator: 1001,
                    GopClosedCadence: 1,
                    HrdBufferInitialFillPercentage: 90,
                    GopSize: 90,
                    Slices: 1,
                    GopBReference: "ENABLED",
                    HrdBufferSize: 10000000,
                    MaxBitrate: 5000000,
                    SlowPal: "DISABLED",
                    ParDenominator: 1,
                    SpatialAdaptiveQuantization: "ENABLED",
                    TemporalAdaptiveQuantization: "ENABLED",
                    FlickerAdaptiveQuantization: "ENABLED",
                    EntropyEncoding: "CABAC",
                    FramerateControl: "SPECIFIED",
                    RateControlMode: "QVBR",
                    QvbrSettings: {
                      QvbrQualityLevel: 7,
                      QvbrQualityLevelFineTune: 0,
                    },
                    CodecProfile: "HIGH",
                    Telecine: "NONE",
                    FramerateNumerator: 30000,
                    MinIInterval: 0,
                    AdaptiveQuantization: "HIGH",
                    CodecLevel: "LEVEL_4",
                    FieldEncoding: "PAFF",
                    SceneChangeDetect: "ENABLED",
                    QualityTuningLevel: "SINGLE_PASS",
                    FramerateConversionAlgorithm: "DUPLICATE_DROP",
                    UnregisteredSeiTimecode: "DISABLED",
                    GopSizeUnits: "FRAMES",
                    ParControl: "SPECIFIED",
                    NumberBFramesBetweenReferenceFrames: 3,
                    RepeatPps: "DISABLED",
                  },
                },
                AfdSignaling: "NONE",
                DropFrameTimecode: "ENABLED",
                RespondToAfd: "NONE",
                ColorMetadata: "INSERT",
              },
              NameModifier: "video-720p",
            },
            {
              ContainerSettings: {
                Container: "MPD",
              },
              VideoDescription: {
                Width: 854,
                ScalingBehavior: "DEFAULT",
                Height: 480,
                TimecodeInsertion: "DISABLED",
                AntiAlias: "ENABLED",
                Sharpness: 50,
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    InterlaceMode: "PROGRESSIVE",
                    NumberReferenceFrames: 3,
                    Syntax: "DEFAULT",
                    Softness: 0,
                    GopClosedCadence: 1,
                    GopSize: 90,
                    Slices: 1,
                    GopBReference: "DISABLED",
                    SlowPal: "DISABLED",
                    SpatialAdaptiveQuantization: "ENABLED",
                    TemporalAdaptiveQuantization: "ENABLED",
                    FlickerAdaptiveQuantization: "DISABLED",
                    EntropyEncoding: "CABAC",
                    Bitrate: 5000000,
                    FramerateControl: "INITIALIZE_FROM_SOURCE",
                    RateControlMode: "CBR",
                    CodecProfile: "MAIN",
                    Telecine: "NONE",
                    MinIInterval: 0,
                    AdaptiveQuantization: "HIGH",
                    CodecLevel: "AUTO",
                    FieldEncoding: "PAFF",
                    SceneChangeDetect: "ENABLED",
                    QualityTuningLevel: "SINGLE_PASS",
                    FramerateConversionAlgorithm: "DUPLICATE_DROP",
                    UnregisteredSeiTimecode: "DISABLED",
                    GopSizeUnits: "FRAMES",
                    ParControl: "INITIALIZE_FROM_SOURCE",
                    NumberBFramesBetweenReferenceFrames: 2,
                    RepeatPps: "DISABLED",
                    DynamicSubGop: "STATIC",
                  },
                },
                AfdSignaling: "NONE",
                DropFrameTimecode: "ENABLED",
                RespondToAfd: "NONE",
                ColorMetadata: "INSERT",
              },
              NameModifier: "video-480p",
            },
          ],
          OutputGroupSettings: {
            Type: "DASH_ISO_GROUP_SETTINGS",
            DashIsoGroupSettings: {
              SegmentLength: 30,
              Destination: output,
              DestinationSettings: {
                S3Settings: {
                  Encryption: {
                    EncryptionType: "SERVER_SIDE_ENCRYPTION_S3",
                  },
                },
              },
              FragmentLength: 2,
              SegmentControl: "SEGMENTED_FILES",
              MpdProfile: "MAIN_PROFILE",
              HbbtvCompliance: "NONE",
              WriteSegmentTimelineInRepresentation: "ENABLED",
            },
          },
        },
        {
          Name: "File Group",
          Outputs: [
            {
              ContainerSettings: {
                Container: "RAW",
              },
              VideoDescription: {
                ScalingBehavior: "DEFAULT",
                TimecodeInsertion: "DISABLED",
                AntiAlias: "ENABLED",
                Sharpness: 50,
                CodecSettings: {
                  Codec: "FRAME_CAPTURE",
                  FrameCaptureSettings: {
                    FramerateNumerator: 33,
                    FramerateDenominator: 80,
                    MaxCaptures: 4,
                    Quality: 80,
                  },
                },
                DropFrameTimecode: "ENABLED",
                ColorMetadata: "INSERT",
              },
              Extension: "jpg",
              NameModifier: "thumbnail",
            },
          ],
          OutputGroupSettings: {
            Type: "FILE_GROUP_SETTINGS",
            FileGroupSettings: {
              Destination: `${output}thumbnails/`,
            },
          },
        },
      ],
      AdAvailOffset: 0,
      Inputs: [
        {
          AudioSelectors: {
            "Audio Selector 1": {
              Offset: 0,
              DefaultSelection: "DEFAULT",
              ProgramSelection: 1,
            },
          },
          VideoSelector: {
            ColorSpace: "FOLLOW",
            Rotate: "DEGREE_0",
            AlphaBehavior: "DISCARD",
          },
          FilterEnable: "AUTO",
          PsiControl: "USE_PSI",
          FilterStrength: 0,
          DeblockFilter: "DISABLED",
          DenoiseFilter: "DISABLED",
          TimecodeSource: "ZEROBASED",
          FileInput: input,
        },
      ],
    },
    BillingTagsSource: "JOB",
    AccelerationSettings: {
      Mode: "DISABLED",
    },
    StatusUpdateInterval: "SECONDS_60",
    Priority: 0,
    Tags: {
      Product: "hackweek21.01",
      Creator: "atlasplus-team",
    },
  }
}
