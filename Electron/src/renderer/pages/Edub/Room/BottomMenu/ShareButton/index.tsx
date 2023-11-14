import { Radio, RadioChangeEvent } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from '@src/store';
import ShareIcon from '@assets/images/ScreenShareGreen.svg';
import BoardIcon from '@assets/images/WhiteBoardShareGreen.svg';
import ArrowIcon from '@assets/images/Arrow.svg';

import { Icon, MenuIconButton, ScreenListModal } from '@src/components';
import * as rtsApi from '@src/pages/Edub/apis/rtsApi';

import { RtcClient } from '@src/core/rtc';
import styles from './index.module.less';
import { ShareConfig, ShareType } from '@src/types/state';
import { ScreenCaptureSourceInfo } from '@volcengine/vertc-electron-sdk/js/types';
import React from 'react';
import { ScreenListInfo } from '@/renderer/components/ScreenListModal';
import { getScreenConfig } from '@/renderer/core/utils';
import { setShareScreenConfig } from '@/renderer/store/slices/ui';
import { isVeRtcApplication } from '@/renderer/utils/screenShare';

const filterConfigs = [] as number[];

interface ShareButtonProps {
  filterScreenIds: number[];
  screenListInfo: ScreenListInfo[];
  setFilterScreenIds: React.Dispatch<React.SetStateAction<number[]>>;
  setScreenList: React.Dispatch<React.SetStateAction<ScreenCaptureSourceInfo[]>>;
}

export default function (props: ShareButtonProps) {
  const { filterScreenIds, screenListInfo, setFilterScreenIds, setScreenList } = props;
  const room = useSelector((state) => state.edubRoom);
  const [isShowScreenList, setIsShowScreenList] = useState(false);

  const [showOptions, setShowOptions] = useState(false);
  const dispatch = useDispatch();

  const shareScreenConfig = useSelector((state) => state.ui.screenEncodeConfig);

  const shareType = room.share_type;

  const btnRef = useRef<HTMLDivElement>(null);

  const handleShareScreenConfigChange = (e: RadioChangeEvent) => {
    const newConfig = e.target.value;

    const encodeConfig = getScreenConfig(newConfig);

    dispatch(setShareScreenConfig(newConfig));

    RtcClient.engine?.setScreenVideoEncoderConfig(encodeConfig);
    setShowOptions(false);
  };

  const resetMainWindowSize = (size: {
    screenX: number;
    screenY: number;
    width: number;
    height: number;
  }) => {
    return {
      ...size,
      fixedW: 332,
      fixedH: size.height,
    };
  };

  // 大班课模式，只有老师有权限操作
  // 大班课模式，只能在白板和屏幕之间切换
  const handleClick = async () => {
    const screenList = RtcClient.engine?.getScreenCaptureSourceList();
    console.log('screenList: ', screenList);
    const tempList = screenList?.filter((item) => {
      if (isVeRtcApplication(item)) {
        if (!filterConfigs.some((windowId) => item.source_id === windowId)) {
          filterConfigs.push(item.source_id);
        }
      }
      return !isVeRtcApplication(item);
    });
    setFilterScreenIds(filterConfigs);
    setScreenList(tempList || []);
    setIsShowScreenList(true);
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
        iconClassName={styles.sharingIcon}
        onClick={handleClick}
        text="屏幕共享"
        icon={shareType === ShareType.Screen ? ShareIcon : BoardIcon}
      />
      <div
        className={`${styles.ArrowIcon} ${showOptions ? styles.ArrowIconRotate : ''}`}
        onClick={() => {
          setShowOptions(!showOptions);
        }}
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
          <Radio.Group onChange={handleShareScreenConfigChange} value={shareScreenConfig}>
            <Radio value={ShareConfig.Text}>清晰度优先</Radio>
            <Radio value={ShareConfig.Motion}>流畅度优先</Radio>
            {/* <Radio value={ShareConfig.Detail}>
                  智能模式
                  <span className={styles.shareDesc}>根据共享内容自动切换清晰或流畅模式</span>
                </Radio> */}
          </Radio.Group>
        </div>
      </div>

      <ScreenListModal
        startShare={() => {
          rtsApi.edubStartShare({
            share_type: ShareType.Screen,
          });
        }}
        isShowScreenList={isShowScreenList}
        filterScreenIds={filterScreenIds}
        screenListInfo={screenListInfo}
        setIsShowScreenList={setIsShowScreenList}
        calcSize={resetMainWindowSize}
      ></ScreenListModal>
    </div>
  );
}

// screenListInfo, setScreenList, filterScreenIds, setFilterScreenIds
