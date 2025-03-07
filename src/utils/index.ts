import * as protobuf from 'protobufjs';
// import danmu from '@/assets/dm.proto
// import dm from '@/proto/proto.js'

export function processPic(pic: string | URL) {
  if (!pic) return '';
  const newUrl = new URL(pic);
  newUrl.protocol = 'http';
  newUrl.host = 'localhost:8080';
  return newUrl.href;
}

export function timestampToDate(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  const ampm = date.getHours() < 12 ? 'AM' : 'PM';

  return `${year}-${month}-${day} ${ampm} ${hour}:${minute}:${second}`;
}

export function timestampToDate2(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  // const second = date.getSeconds().toString().padStart(2, '0');
  // const ampm = date.getHours() < 12 ? 'AM' : 'PM';

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

const protoJSON = {
  options: {
    syntax: 'proto3',
  },
  nested: {
    dm: {
      nested: {
        DmColorfulType: {
          values: {
            NoneType: 0,
            VipGradualColor: 60001,
          },
        },
        DmFromType: {
          values: {
            DmFromUnknown: 0,
            DmFromNormal: 1,
            DmFromCmd: 2,
            DmFromLive: 3,
          },
        },
        DmColorful: {
          fields: {
            type: {
              type: 'DmColorfulType',
              id: 1,
            },
            src: {
              type: 'string',
              id: 2,
            },
          },
        },
        DanmakuElem: {
          fields: {
            stime: {
              type: 'int32',
              id: 2,
            },
            mode: {
              type: 'int32',
              id: 3,
            },
            size: {
              type: 'int32',
              id: 4,
            },
            color: {
              type: 'uint32',
              id: 5,
            },
            uhash: {
              type: 'string',
              id: 6,
            },
            text: {
              type: 'string',
              id: 7,
            },
            date: {
              type: 'int64',
              id: 8,
            },
            weight: {
              type: 'int32',
              id: 9,
            },
            action: {
              type: 'string',
              id: 10,
            },
            pool: {
              type: 'int32',
              id: 11,
            },
            dmid: {
              type: 'string',
              id: 12,
            },
            attr: {
              type: 'int32',
              id: 13,
            },
            animation: {
              type: 'string',
              id: 22,
            },
            colorful: {
              type: 'DmColorfulType',
              id: 24,
            },
            oid: {
              type: 'int64',
              id: 26,
            },
            dmFrom: {
              type: 'DmFromType',
              id: 27,
            },
          },
        },
        DmSegMobileReply: {
          fields: {
            elems: {
              rule: 'repeated',
              type: 'DanmakuElem',
              id: 1,
            },
            colorfulSrc: {
              rule: 'repeated',
              type: 'DmColorful',
              id: 5,
            },
          },
        },
      },
    },
  },
};

export function handleProtoBuf(encryptedData: any) {
  // console.log(encryptedData)
  // 转成uint8Array类型，否则无法解析
  const uint8Array = new Uint8Array(encryptedData);
  // console.log(uint8Array)
  const root = protobuf.Root.fromJSON(protoJSON);
  const MyMessage = root.lookupType('DmSegMobileReply');
  // console.log(MyMessage)

  // 解析消息对象
  const message2 = MyMessage.decode(uint8Array);

  // 获取object化的消息对象
  const data = MyMessage.toObject(message2, {
    enums: String,
    longs: String,
    bytes: String,
    defaults: true,
    arrays: true,
    objects: true,
    oneofs: true,
  });

  // 解密数据
  function decrypt(buffer: any) {
    return buffer;
  }

  // console.log(decrypt(data))
  return decrypt(data);
}

export function parseUrlParams(url: string) {
  const params: any = {};
  const urlParts = url.split('?');
  if (urlParts.length > 1) {
    const query = urlParts[1];
    const pairs = query.split('&');
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value);
    });
  }
  return params;
}

export function rgb888ToRgb(rgb888: number) {
  const r = (rgb888 >> 16) & 0xff;
  const g = (rgb888 >> 8) & 0xff;
  const b = rgb888 & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
}

export function processAvatarLink(avatar: string | URL) {
  if (!avatar) return '';
  const newUrl = new URL(avatar);
  newUrl.protocol = 'http';
  newUrl.host = 'localhost:8080';
  return newUrl.href;
}

export function debounce(
  fn: { apply: (arg0: any, arg1: any[]) => void },
  delay: number | undefined,
) {
  let timer: any = null;
  return function (...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      // @ts-ignore
      fn.apply(this, args);
    }, delay);
  };
}

export function throttle(
  func: { apply: (arg0: any, arg1: IArguments) => void },
  wait: number | undefined,
) {
  let timer: any = null;
  return function () {
    if (timer) return;
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, arguments);
      timer = null;
    }, wait);
  };
}

export function formatTime(seconds: number) {
  if (seconds < 0) return '00:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsRemaining = seconds % 60;
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
  }
}

export function changeUrlSearchParam(params: { key: any; value: any }[]) {
  // 获取当前 URL 的参数
  const searchParams = new URLSearchParams(window.location.search);
  // 修改参数值
  params.forEach(({ key, value }) => searchParams.set(key, value));
  // 创建一个新的 URL，替换当前的 URL 但不刷新页面
  window.history.replaceState(
    {},
    '',
    `${window.location.href.split('?')[0]}?${searchParams.toString()}`,
  );
}
