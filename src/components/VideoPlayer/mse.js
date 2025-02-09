// import { ControlBar } from './ControlBar.js';

const createParsedMpd = ({
  baseUri,
  video,
  audio,
  duration,
  minBufferTime,
}) => {
  return {
    Period_asArray: [
      {
        AdaptationSet_asArray: [
          {
            AudioChannelConfiguration_asArray: [
              {
                __children: [],
                schemeIdUri:
                  'urn:mpeg:dash:23003:3:audio_channel_configuration:2011',
                value: '2',
              },
            ],
            Role_asArray: [
              {
                __children: [],
                schemeIdUri: 'urn:mpeg:dash:role:2011',
                value: 'main',
              },
            ],
            Representation_asArray: audio.map(item => ({
              BaseURL: item.baseUrl,
              BaseURL_asArray: [item.baseUrl],
              bandwidth: item.bandwidth,
              id: '2_1',
              // "audioSamplingRate": 48000,
              mimeType: 'audio/mp4',
              codecs: item.codecs,
              AudioChannelConfiguration: {
                __children: [],
                schemeIdUri:
                  'urn:mpeg:dash:23003:3:audio_channel_configuration:2011',
                value: '2',
              },
            })),
            // "audioSamplingRate": 48000,
            codecs: audio.codecs,
            contentType: 'audio',
            group: 2,
            id: 2,
            lang: 'en',
            mimeType: 'audio/mp4',
            subsegmentAlignment: 'true',
            subsegmentStartsWithSAP: 1,
          },
          {
            Role: {
              __children: [],
              schemeIdUri: 'urn:mpeg:dash:role:2011',
              value: 'main',
            },
            Role_asArray: [
              {
                __children: [],
                schemeIdUri: 'urn:mpeg:dash:role:2011',
                value: 'main',
              },
            ],
            // "Representation": [
            //   {
            //         "BaseURL": video.baseUrl,
            //         "BaseURL_asArray": [
            //             video.baseUrl
            //         ],
            //         "__children": [
            //             {
            //                 "BaseURL": video.baseUrl
            //             }
            //         ],
            //         "bandwidth": video.bandwidth,
            //         "height": video.height,
            //         "id": "1_4",
            //         "mediaStreamStructureId": "1",
            //         "width": video.width,
            //         "sar": "1:1",
            //         "frameRate": video.frameRate,
            //         "mimeType": "video/mp4",
            //         "codecs": video.codecs,
            //         "maximumSAPPeriod": 5
            //     }
            // ],
            Representation_asArray: video.map((item, index) => ({
              BaseURL: item.baseUrl,
              BaseURL_asArray: [item.baseUrl],
              __children: [
                {
                  BaseURL: item.baseUrl,
                },
              ],
              bandwidth: item.bandwidth,
              height: item.height,
              id: '1_'.concat(index + 1),
              mediaStreamStructureId: '1'.concat(index + 1),
              width: item.width,
              sar: '1:1',
              frameRate: item.frameRate,
              mimeType: 'video/mp4',
              codecs: item.codecs,
              maximumSAPPeriod: 5,
            })),
            contentType: 'video',
            // codecs: video.codecs,
            // frameRate: video.frameRate,
            // group: 1,
            // id: 1,
            // mimeType: 'video/mp4',
            par: '16:9',
            // sar: '1:1',
            subsegmentAlignment: 'true',
            subsegmentStartsWithSAP: 1,
          },
        ],
        duration: duration,
        id: 'P1',
      },
    ],
    maxSubsegmentDuration: 5,
    mediaPresentationDuration: duration,
    minBufferTime: minBufferTime,
    autoSwitchBitrate: false,
    baseUri: baseUri, // 可选参数, 前面有的话就不用了
    loadedTime: new Date(),
  };
};

function initialize(videoEl, mpdInfo) {
  const parsedManifest = createParsedMpd(mpdInfo);
  const player = window.dashjs.MediaPlayer().create();
  player.updateSettings({
    streaming: {
      abr: {
        // initialBitrate: { audio: -1, video: 800 },
        autoSwitchBitrate: { audio: true, video: false },
      },
    },
  });
  player.initialize(videoEl, null, false);
  player.attachSource(parsedManifest);
  // player.setQualityFor('video', 0)
  // const controlbar = new ControlBar(player);
  // controlbar.initialize();
  // player.play();
  return player;
}

export default initialize;
