import { MediaType } from '@volcengine/rtc';
import { message } from 'antd';
import { useDispatch, useSelector } from '@/store';
import { initialState, setToast } from '@/store/slices/ui';

import { RtcClient } from '@/core/rtc';
import * as rtsApi from '@/scene/Meeting/apis/rtsApi';
import { localUserChangeCamera, localUserChangeMic } from '@/store/slices/meetingRoom';
import styles from './index.module.less';
import { DeviceState } from '@/types/state';

interface IProps {
  type: 'camera' | 'mic';
}

function RoomEnd(props: IProps) {
  const { type } = props;
  const dispatch = useDispatch();
  const devicePermissions = useSelector((state) => state.device.devicePermissions);

  const handleClose = () => {
    dispatch(setToast(initialState.toast));
  };

  const handleOk = async () => {
    if (type === 'camera') {
      if (!devicePermissions.video) {
        message.error('未获得摄像头权限!');
        handleClose();
        return;
      }

      await RtcClient.startVideoCapture();
      dispatch(localUserChangeCamera(DeviceState.Open));
      await rtsApi.operateSelfCamera({
        operate: DeviceState.Open,
      });
    }

    if (type === 'mic') {
      if (!devicePermissions.audio) {
        message.error('未获得麦克风权限!');
        handleClose();
        return;
      }

      RtcClient.unmuteStream(MediaType.AUDIO);
      dispatch(localUserChangeMic(DeviceState.Open));
      await rtsApi.operateSelfMic({
        operate: DeviceState.Open,
      });
    }

    handleClose();
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.confirmBtn} onClick={handleOk}>
        同意
      </button>

      <button className={styles.canceLBtn} onClick={handleClose}>
        取消
      </button>
    </div>
  );
}

export default RoomEnd;
