import { useEffect, useState } from 'react';

const getTimeFromSecond = (sec: number): string => {
  if (sec < 0) {
    return '00:00';
  }
  let minutes: number | string = Math.floor(sec / 60);
  let seconds: number | string = sec % 60;
  minutes = minutes > 9 ? `${minutes}` : `0${minutes}`;
  seconds = seconds > 9 ? `${seconds}` : `0${seconds}`;

  return `${minutes}:${seconds}`;
};

/**
 *
 * @param startTime  房间开始时间,精确到毫秒
 * @param nts 服务器时间,精确到毫秒
 * @param limit 房间存在时间，秒
 * @returns
 */
const useRoomTime = (startTime: number, nts: number = Date.now(), limit = 30 * 60): string => {
  const endTime = startTime + limit * 1000;

  const [remainTime, setRemainTime] = useState(Math.ceil((endTime - nts) / 1000));

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (remainTime > -1) {
      timer = setInterval(() => {
        setRemainTime((v) => v - 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [remainTime]);

  return getTimeFromSecond(remainTime);
};

export default useRoomTime;
