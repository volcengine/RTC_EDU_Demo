import { useEffect, useState } from 'react';

import { ipcRenderer, remote } from 'electron';

const footerWindowId = remote.getGlobal('shareWindowId').footerWindowId;

/**
 *
 * @param startTime  房间开始时间
 * @param nts 服务器时间
 * @param experienceTime 房间时长 s
 * @returns
 */
export const useRoomTime = (
  startTime: number,
  nts: number = Date.now(),
  limit: number = 30 * 60
): number => {
  const endTime = startTime + limit * 1000;

  const [remainTime, setRemainTime] = useState(Math.ceil((endTime - nts) / 1000));

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (remainTime > -1) {
      ipcRenderer.sendTo(footerWindowId, 'getTime', remainTime);
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

  useEffect(() => {
    const endTime = startTime + limit * 1000;
    setRemainTime(Math.ceil((endTime - nts) / 1000));
  }, [startTime, nts]);

  return remainTime;
};
