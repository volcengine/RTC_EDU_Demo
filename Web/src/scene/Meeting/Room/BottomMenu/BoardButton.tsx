import { useMemo, useState } from 'react';
import { message as Message, Popover } from 'antd';
import classNames from 'classnames';
import { useSelector } from '@/store';
import BoardIcon from '@/assets/images/Board.svg';
import { isRtsError } from '@/utils/rtsUtils';

import styles from './index.module.less';
import * as rtsApi from '@/scene/Meeting/apis/rtsApi';
import { MenuIconButton, PopoverContent } from '@/components';
import { Permission, ShareStatus, ShareType, UserRole } from '@/types/state';
import { BoardClient } from '@/core/board';
import { RtcClient } from '@/core/rtc';

export default function () {
  const [popOpen, setPopOpen] = useState(false);

  const room = useSelector((state) => state.meetingRoom);
  const isHost = room.localUser.user_role === UserRole.Host;

  const hasSharePermission =
    isHost || room.localUser?.share_permission === Permission.HasPermission;

  const isSharing = useMemo(() => {
    return room.share_type === ShareType.Board && room.share_status === ShareStatus.Sharing;
  }, [room]);

  const isLocalSharing = useMemo(() => {
    return (
      room?.share_user_id &&
      room.share_type === ShareType.Board &&
      room?.share_user_id === room?.localUser?.user_id
    );
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
      // 主持人抢共享权限
      if (isHost && !isLocalSharing) {
        await handleStartShareBoard();
        return;
      }
      BoardClient.leaveRoom();
      rtsApi.finishShare();
    } else {
      handleStartShareBoard();
    }
  };

  const text = useMemo(() => {
    if (isSharing && hasSharePermission) {
      return '结束白板共享';
    }

    return '共享白板';
  }, [isSharing]);

  return (
    <div className={styles.menuButton}>
      {hasSharePermission ? (
        <MenuIconButton
          // iconClassName={styles.normalIcon}
          iconClassName={classNames({
            [styles.sharingIcon]: !isSharing && hasSharePermission,
            [styles.stopIcon]: isSharing,
          })}
          onClick={handleClick}
          text={text}
          icon={BoardIcon}
        />
      ) : (
        <Popover
          trigger="click"
          //   overlayClassName={styles.micPopover}
          open={popOpen}
          placement="top"
          content={
            <PopoverContent
              okText="申请权限"
              onOk={handleApplyShare}
              onCancel={() => {
                setPopOpen(false);
              }}
              titleText="暂无共享权限，请向主持人申请"
            />
          }
        >
          <MenuIconButton
            // iconClassName={styles.normalIcon}
            iconClassName={isSharing ? styles.sharingIcon : styles.normalIcon}
            onClick={handleClick}
            text={text}
            icon={BoardIcon}
          />
        </Popover>
      )}
    </div>
  );
}
