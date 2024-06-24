import { useMemo, useState } from 'react';
import classNames from 'classnames';
import { message as Message, Popover } from 'antd';
import { useSelector } from '@/store';
import BoardIcon from '@/assets/images/Board.svg';
import { isRtsError } from '@/utils/rtsUtils';

import styles from './index.module.less';
import * as rtsApi from '@/scene/Edus/apis/rtsApi';
import { MenuIconButton, PopoverContent } from '@/components';
import { Permission, ShareStatus, ShareType, UserRole } from '@/types/state';
import { BoardClient } from '@/core/board';
import { RtcClient } from '@/core/rtc';

export default function () {
  const [popOpen, setPopOpen] = useState(false);
  const room = useSelector((state) => state.edusRoom);
  const isHost = room.localUser.user_role === UserRole.Host;

  const hasSharePermission = useMemo(() => {
    return isHost || room.localUser?.share_permission === Permission.HasPermission;
  }, [room, isHost]);

  const isSharing = useMemo(() => {
    return room.share_type === ShareType.Board && room.share_status === ShareStatus.Sharing;
  }, [room]);

  const handleStartShareBoard = async () => {
    const res = await rtsApi.startShare({
      share_type: ShareType.Board,
    });

    RtcClient.stopScreenCapture();
    if (!isRtsError(res)) {
      console.log('共享白板成功');
    } else {
      Message.error('共享白板失败');
    }
  };

  const handleApplyShare = () => {
    rtsApi.sharePermissionApply();
    setPopOpen(false);
  };

  const handleClick = async () => {
    console.log('共享白板');

    if (!hasSharePermission) {
      setPopOpen(true);
      return;
    }

    if (isSharing) {
      await BoardClient.leaveRoom();
      await rtsApi.finishShare();
    } else {
      await handleStartShareBoard();
    }
  };

  const text = useMemo(() => {
    if (isSharing && hasSharePermission) {
      return '结束白板共享';
    }
    if (!hasSharePermission) {
      return '申请白板共享';
    }

    return '白板共享';
  }, [isSharing, hasSharePermission]);

  return (
    <div className={styles.menuButton}>
      {hasSharePermission ? (
        <MenuIconButton
          iconClassName={classNames({
            [styles.normalIcon]: !isSharing,
            [styles.stopIcon]: isSharing,
          })}
          onClick={handleClick}
          text={text}
          icon={BoardIcon}
        />
      ) : (
        <Popover
          trigger="click"
          open={popOpen}
          placement="top"
          content={
            <PopoverContent
              okText="申请权限"
              onOk={handleApplyShare}
              onCancel={() => {
                setPopOpen(false);
              }}
              titleText="暂无共享权限，请向老师申请"
            />
          }
        >
          <MenuIconButton
            iconClassName={classNames({
              [styles.normalIcon]: hasSharePermission,
              [styles.noPermIcon]: !hasSharePermission,
            })}
            onClick={handleClick}
            text={text}
            icon={BoardIcon}
          />
        </Popover>
      )}
    </div>
  );
}
