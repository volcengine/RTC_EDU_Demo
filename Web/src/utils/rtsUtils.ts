import { RtcClient } from '@/core/rtc';
import { ErrCodeMap, SendServerMessageErr, SendServerMessageRes, RtsError } from '@/types/rtsTypes';

export function isRtsError(res: any): res is RtsError {
  return res?.type === SendServerMessageErr;
}

export async function sendServerMessage<T = any>(
  event: string,
  formatRes: (res: SendServerMessageRes<T>) => T | SendServerMessageRes<T>,
  data?: Record<string, any>
): Promise<any | RtsError> {
  try {
    const res = await RtcClient.sendServerMessage<T>(event, data ? JSON.stringify(data) : '{}');
    if (res.code !== 200) {
      console.error(`${event} err`, res.code, ErrCodeMap[res.code as keyof typeof ErrCodeMap]);
    }
    return formatRes(res);
  } catch (err) {
    console.error(`sendServerMessage ${event} err`, err);
    return {
      type: SendServerMessageErr,
      message: `sendServerMessage ${event} err`,
    };
  }
}

export const getResponse = <T>(res: SendServerMessageRes<T>) => res.response;
export const getRes = <T>(res: T) => res;

export const getNull = () => null;
