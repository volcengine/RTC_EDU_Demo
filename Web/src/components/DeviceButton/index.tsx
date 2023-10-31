import { useEffect, useMemo, useRef, useState } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import { useDispatch, useSelector } from '@/store';
import { DeviceState } from '@/types/state';
import ArrowIcon from '@/assets/images/Arrow.svg';
import { setCamera, setMicrophone } from '@/store/slices/devices';
import { iconUtils } from '@/utils';
import { RtcClient } from '@/core/rtc';
import { Icon, MenuIconButton } from '@/components';

import { DeviceType, getDeviceStatus } from './utils';
import styles from './index.module.less';

interface DeviceButtonProps {
  deviceType: DeviceType;
  text?: string;
  onDeivce: (deviceType: DeviceType) => void;
  localUser: {
    camera: DeviceState;
    mic: DeviceState;
  };
}

export default function (props: DeviceButtonProps) {
  const { deviceType, text, onDeivce, localUser } = props;

  const devices = useSelector((state) => state.device);

  const dispatch = useDispatch();

  const [showOptions, setShowOptions] = useState(false);

  const btnRef = useRef<HTMLDivElement>(null);

  const hasDevicePermission =
    deviceType === DeviceType.Camera
      ? devices.devicePermissions.video
      : devices.devicePermissions.audio;

  const deviceList = useMemo(() => {
    return deviceType === 'microphone' ? devices.microphoneList : devices.cameraList;
  }, [devices, deviceType]);

  const handleDeviceChange = (e: RadioChangeEvent) => {
    RtcClient.switchDevice(deviceType, e.target.value);

    if (deviceType === 'microphone') {
      dispatch(setMicrophone(e.target.value));
    } else {
      dispatch(setCamera(e.target.value));
    }

    setShowOptions(false);
  };

  const handleSetDevices = () => {
    setShowOptions(!showOptions);
  };

  const handleClick = () => {
    onDeivce(deviceType);
  };

  useEffect(() => {
    const hidePop = (e: Event) => {
      if (!btnRef.current?.contains(e.target as unknown as HTMLElement)) {
        setShowOptions(false);
      }
    };

    window.addEventListener('click', hidePop);
    return () => {
      window.removeEventListener('click', hidePop);
    };
  }, [btnRef]);

  return (
    <div className={styles.menuButton} ref={btnRef}>
      <MenuIconButton
        onClick={handleClick}
        iconClassName={
          getDeviceStatus(deviceType, localUser!) === DeviceState.Open && hasDevicePermission
            ? styles.permitIcon
            : styles.noPermitIcon
        }
        text={text}
        icon={iconUtils.getIcon(
          deviceType,
          getDeviceStatus(deviceType, localUser) === DeviceState.Open && hasDevicePermission
            ? 'On'
            : 'Off'
        )}
      />
      <div
        className={`${styles.ArrowIcon} ${showOptions ? styles.ArrowIconRotate : ''}`}
        onClick={handleSetDevices}
      >
        <Icon src={ArrowIcon} />
      </div>

      <div
        className={styles.devicesList}
        onMouseLeave={() => {
          setShowOptions(false);
        }}
        style={{
          display: showOptions ? 'block' : 'none',
        }}
      >
        <div className={styles.mediaDevicesContent}>
          <Radio.Group
            onChange={handleDeviceChange}
            value={
              deviceType === 'microphone' ? devices.selectedMicrophone : devices.selectedCamera
            }
          >
            {deviceList?.map((device) => (
              <Radio value={device.deviceId} key={device.deviceId}>
                {device.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}
