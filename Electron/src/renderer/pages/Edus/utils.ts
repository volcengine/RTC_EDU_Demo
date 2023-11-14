import { useDispatch, useSelector } from '@src/store';

import { ipcRenderer, remote } from 'electron';

import { RTSEventName } from '@utils/types/index';
import { v4 as uuidv4 } from 'uuid';
import { StreamIndex } from '@volcengine/vertc-electron-sdk/js/types';

import { useEffect, useState } from 'react';
import { RecordFile } from '@src/store/modules/recordList';
import { UserRole } from '@/renderer/types/state';
const footerWindowId = remote.getGlobal('shareWindowId').footerWindowId;

export const useBasicParams = () => {
  const roomInfo = useSelector((state) => state.roomInfo);
  const userLoginInfo = useSelector((state) => state.user);
  const { me, room } = roomInfo;
  const { room_id, app_id } = room;
  const { user_id } = me;
  const { login_token, device_id } = userLoginInfo;
  const message = {
    app_id,
    room_id,
    user_id,
    login_token,
    request_id: device_id,
    device_id,
  };
  return message;
};

// 获取rts请求基础参数
export const getBasicParams = (event_name: RTSEventName, basicParam: any, content: Object) => {
  const message = {
    ...basicParam,
    event_name,
    request_id: uuidv4(),
    content: JSON.stringify(content),
  };
  return JSON.stringify(message);
};

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

export default useRoomTime;

// 处理本地音频信息回调
export const handleLocalVolume = (info: any) => {
  const { audio_properties_info } = info[0];
  const { linearVolume, nonlinearVolume } = audio_properties_info;
  const linear = (linearVolume / 255) * 100;
  const nonlinear = ((nonlinearVolume + 127) / 127) * 100;
  return {
    linearVolume: linear,
    nonlinearVolume: nonlinear,
  };
};
// 处理远端音频信息
export const handleRemoteVolume = (info: any) => {
  const tempInfo = (info as any[]).filter((item: any) => {
    const { stream_key } = item;
    const { stream_index } = stream_key;
    return stream_index !== StreamIndex.kStreamIndexScreen;
  });
  return tempInfo.map((item: any) => {
    const { audio_properties_info, stream_key } = item;
    const { linearVolume, nonlinearVolume } = audio_properties_info;
    const linear = (linearVolume / 255) * 100;
    const nonlinear = ((nonlinearVolume + 127) / 127) * 100;
    const { user_id } = stream_key;
    return {
      linearVolume: linear,
      nonlinearVolume: nonlinear,
      userId: user_id,
    };
  });
};

// 处理录制文件
export const formateRecordMap = (recordFileMap: Record<string, RecordFile[]>) => {
  console.log('formateRecordMap: ', recordFileMap);
  if (Object.keys(recordFileMap)?.length > 0) {
    const recordList = Object.keys(recordFileMap)
      .map((item) => recordFileMap[item])
      .flat()
      .map((item) => {
        const { url, start_time, duration } = item;
        const startDate = new Date(start_time);
        const endDate = new Date(start_time + duration);
        const timeHeader =
          startDate.getFullYear() +
          '/' +
          (startDate.getMonth() + 1 < 10
            ? '0' + (startDate.getMonth() + 1)
            : startDate.getMonth() + 1) +
          '/' +
          startDate.getDate();
        const timeFooter =
          startDate.getHours() +
          ':' +
          startDate.getMinutes() +
          ':' +
          startDate.getSeconds() +
          '—' +
          endDate.getHours() +
          ':' +
          endDate.getMinutes() +
          ':' +
          endDate.getSeconds();
        return {
          url,
          filename: timeHeader + ' ' + timeFooter,
        };
      });
    return recordList;
  } else {
    return [];
  }
};
// 对userList排序
export const sortUserList = <
  T extends {
    user_id?: string;
    user_role?: UserRole;
  } = any
>(props: {
  userList: T[];
  me: T;
  shareUserId?: string;
  isMemberList?: boolean;
}) => {
  const { userList, me, shareUserId, isMemberList } = props;
  //   const tempList = userList.filter((item) => {
  //     return item.user_id !== me.user_id;
  //   });
  const users = [...userList].sort((i1, i2) => {
    if (i1.user_id === shareUserId) {
      return -1;
    }
    if (i2.user_id === shareUserId) {
      return 1;
    }
    if (i1.user_role === UserRole.Host) {
      return -1;
    }
    if (i2.user_role === UserRole.Host) {
      return 1;
    }
    if (isMemberList) {
      return 0;
    }
    return 0;
  });
  users.unshift(me);
  return users;
};
// 获取当前需要渲染的人
export const getRenderUserList = <T = any>(props: {
  sortedUserList: T[];
  pageIdx: number;
  length: number;
}) => {
  const { sortedUserList, pageIdx, length } = props;
  if (sortedUserList.length < length) {
    return [...sortedUserList];
  }
  let newUsers: T[] = sortedUserList.slice(length * pageIdx, length * (pageIdx + 1));
  if (newUsers.length < length) {
    newUsers = sortedUserList.slice(-length);
  }
  return newUsers;
};
