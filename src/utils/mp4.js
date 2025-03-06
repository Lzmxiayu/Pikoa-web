// 使用 Webcodecs API 进行解码

const mp4box = MP4Box.createFile();

export async function MP4Clip(videoFile) {
  return new Promise((resolve, reject) => {
    if (!videoFile) {
      console.error('No file selected.');
      return;
    }
    // 获取视频的arraybuffer数据
    const reader = new FileReader();
    reader.onload = async e => {
      const buffer = e.target.result;
      const covers = await getVideoFrames(buffer);
      const set = new Set();
      const urls = covers.map(item => getDataURL(item));
      for (const url of urls) {
        set.add(url);
      }
      resolve([...set]);
    };
    reader.readAsArrayBuffer(videoFile);
  });
}

function getVideoFrames(buffer) {
  return new Promise((resolve, reject) => {
    // 视频轨道，解码用
    let videoTrack = null;
    let videoDecoder = null;
    // 这个就是最终解码出来的视频画面序列文件
    const videoFrames = [];

    let nbSampleTotal = 0;
    let countSample = 0;

    mp4box.onReady = function (info) {
      // 记住视频轨道信息，onSamples匹配的时候需要
      videoTrack = info.videoTracks[0];

      if (videoTrack != null) {
        mp4box.setExtractionOptions(videoTrack.id, 'video', {
          nbSamples: 100,
        });
      }

      // 视频的宽度和高度
      const videoW = videoTrack.track_width;
      const videoH = videoTrack.track_height;
      console.log(videoTrack);
      // 设置视频解码器
      videoDecoder = new VideoDecoder({
        output: videoFrame => {
          createImageBitmap(videoFrame).then(img => {
            videoFrames.push({
              img,
              duration: videoFrame.duration,
              timestamp: videoFrame.timestamp,
            });
            videoFrame.close();
          });
        },
        error: err => {
          console.error('videoDecoder错误：', err);
        },
      });

      nbSampleTotal = videoTrack.nb_samples;

      videoDecoder.configure({
        codec: videoTrack.codec,
        codedWidth: videoW,
        codedHeight: videoH,
        description: getExtradata(),
      });

      mp4box.start();
    };

    mp4box.onSamples = function (trackId, ref, samples) {
      // samples其实就是采用数据了
      if (videoTrack.id === trackId) {
        mp4box.stop();

        countSample += samples.length;
        console.log(samples);
        for (const sample of samples) {
          const type = sample.is_sync ? 'key' : 'delta';

          const chunk = new EncodedVideoChunk({
            type,
            timestamp: sample.cts,
            duration: sample.duration,
            data: sample.data,
          });

          videoDecoder.decode(chunk);
        }
        console.log(countSample, nbSampleTotal);
        // if (countSample === nbSampleTotal) {
        //   videoDecoder.flush();
        // }
      }
    };
    mp4box.onError = function () {
      resolve([]);
    };
    let timer = setInterval(() => {
      if (videoFrames.length >= 90) {
        clearInterval(timer);
        let randNum = 0;
        const indexs = new Array(10)
          .fill(0)
          .map((_, idx) => {
            randNum = Math.floor(Math.random(10) * 10) + idx * 10;
            console.log('randNum', randNum);
            return videoFrames[randNum];
          })
          .filter(item => item?.img instanceof ImageBitmap);
        console.log(indexs);
        resolve([
          indexs[0],
          indexs[Math.floor((indexs.length * 1) / 4)],
          indexs[Math.floor((indexs.length * 3) / 4)],
          indexs[indexs.length - 1],
        ]);
      }
    }, 500);

    buffer.fileStart = 0;
    mp4box.appendBuffer(buffer);
    mp4box.flush();
  });
}

function getDataURL(imgBitmap) {
  const imageBitmap = imgBitmap.img;

  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const ctx = canvas.getContext('2d');

  ctx.drawImage(imageBitmap, 0, 0);

  return canvas.toDataURL('image/png');
}

const getExtradata = () => {
  // 生成VideoDecoder.configure需要的description信息
  const entry = mp4box.moov.traks[0].mdia.minf.stbl.stsd.entries[0];

  const box = entry.avcC ?? entry.hvcC ?? entry.vpcC;
  if (box != null) {
    const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
    box.write(stream);
    // slice()方法的作用是移除moov box的header信息
    return new Uint8Array(stream.buffer.slice(8));
  }
};
