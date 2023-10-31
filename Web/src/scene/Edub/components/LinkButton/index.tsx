import { useEffect, useRef, useState } from 'react';
import { message, Popover } from 'antd';
import { Icon, PopoverContent } from '@/components';
import { useDispatch, useSelector } from '@/store';
import LinkIcon from '@/assets/images/Link.svg';

import * as rtsApi from '@/scene/Edub/apis/rtsApi';
import { LinkStatus, setLinkStatus } from '@/store/slices/edubRoom';

import styles from './index.module.less';

export default function () {
  const linkStatus = useSelector((state) => state.edubRoom.linkStatus);

  const applyUserCount = useSelector((state) => state.edubRoom.apply_user_count);

  const [popOpen, setPopOpen] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const handleLink = async (link: boolean) => {
    if (link) {
      /** Apply for mic link */
      dispatch(setLinkStatus(LinkStatus.Applying));
      await rtsApi.edubLinkmicApply();

    } else {
      /** Cancel mic link */
      dispatch(setLinkStatus(LinkStatus.NotLink));
      await rtsApi.edubLinkmicApplyCancel();
    }
  };

  useEffect(() => {
    const hidePop = (e: Event) => {
      if (!btnRef.current?.contains(e.target as unknown as HTMLElement)) {
        setPopOpen(false);
      }
    };

    window.addEventListener('click', hidePop);
    return () => {
      window.removeEventListener('click', hidePop);
    };
  }, [btnRef]);

  return (
    <div className={styles.linkButton} ref={btnRef}>
      {linkStatus === LinkStatus.NotLink && (
        <div
          className={styles.notlink}
          onClick={() => {
            if (applyUserCount >= 20) {
              message.warning('连麦申请人数超过20人，暂不允许连麦');
              return;
            }

            handleLink(true);
          }}
        >
          <Icon src={LinkIcon} />
          <span>我要连麦</span>
        </div>
      )}
      {linkStatus === LinkStatus.Applying && (
        <Popover
          open={popOpen}
          content={
            <PopoverContent
              onOk={() => {
                setPopOpen(false);
                handleLink(false);
              }}
              onCancel={() => {
                setPopOpen(false);
              }}
              titleText="是否取消连麦申请"
            />
          }
        >
          <div
            className={styles.applying}
            onClick={() => {
              setPopOpen(true);
            }}
          >
            <Icon src={LinkIcon} />
            <span>申请中</span>
          </div>
        </Popover>
      )}

      {linkStatus === LinkStatus.Linking && (
        <div className={styles.linking}>
          <Icon src={LinkIcon} />
          <span>连麦中</span>
        </div>
      )}
    </div>
  );
}
