import TOS from '@volcengine/tos-sdk';
import { tosConfig } from '@/config';

interface IUploadFile {
  key: string;
  file: File;
  onProgress?: (uploadPercent: number) => void;
}

async function uploadFile(params: IUploadFile) {
  console.log('upload');
  const format = params.file.name.split('.').pop();

  if (
    params.file.size > 100 * 1000 * 1000 &&
    ['jpg', 'jpeg', 'png', 'bmp'].includes(format || '')
  ) {
    throw new Error('图片大小不可超过100MB');
  }
  if (params.file.size > 200 * 1000 * 1000) {
    throw new Error('文件大小不可超过200MB');
  }

  const client = new TOS({
    accessKeyId: tosConfig.accessKeyId,
    accessKeySecret: tosConfig.accessKeySecret,
    region: tosConfig.region,
    endpoint: tosConfig.endpoint,
    bucket: tosConfig.bucket,
    requestTimeout: 30000,
  });

  try {
    await client.uploadFile({
      key: params.key,
      file: params.file,
      partSize: 5 * 1024 * 1024,
      progress: (percent) => {
        params.onProgress && params.onProgress(percent * 100);
      },
    });

    const url = client.getPreSignedUrl({ key: params.key, expires: 7 * 24 * 3600 });
    return url;
  } catch (error) {
    console.error('tos err', error);
  }
}

export function validateUrl(url: string) {
  return new RegExp(
    '^((?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?)?$',
    'i'
  ).test(url);
}

export default uploadFile;
