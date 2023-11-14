import { useDispatch } from '@/renderer/store';
import Toast from '@src/components/Toast';
import { useMemo } from 'react';
import * as rtsApi from '@src/pages/View/apis';
import { reviewRemoteApply, setSharePermit } from '@/renderer/store/slices/meetingRoom';
import { ApplyType, Permission } from '@/renderer/types/state';
import React from 'react';
import { Button } from 'antd';

// 点击小手
const HandleApplyToast: React.FC<{
  userName: string;
  userId: string;
  isShowMic: boolean;
  setIsShowMic: React.Dispatch<React.SetStateAction<boolean>>;
  isShowShare: boolean;
  setIsShowShare: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const { userName, userId, isShowMic, setIsShowMic, isShowShare, setIsShowShare } = props;
  const dispatch = useDispatch();

  const content = useMemo(() => {
    if (isShowMic) {
      return {
        title: `${userName}正在申请发言`,
        handleComfirm: () => {
          rtsApi.operateSelfMicPermit({
            apply_user_id: userId,
            permit: Permission.HasPermission,
          });

          setIsShowMic(false);
          dispatch(
            reviewRemoteApply({
              userId,
              applying: ApplyType.Mic,
            })
          );
        },
        handleReject: () => {
          rtsApi.operateSelfMicPermit({
            apply_user_id: userId,
            permit: Permission.NoPermission,
          });

          setIsShowMic(false);
          dispatch(
            reviewRemoteApply({
              userId,
              applying: ApplyType.Mic,
            })
          );
        },
      };
    } else if (isShowShare) {
      return {
        title: `${userName}正在申请共享权限`,
        handleComfirm: () => {
          rtsApi.sharePermissionPermit({
            apply_user_id: userId,
            permit: Permission.HasPermission,
          });

          setIsShowShare(false);
          dispatch(setSharePermit({ userId, permit: Permission.HasPermission, isLocal: false }));
          dispatch(
            reviewRemoteApply({
              userId: userId,
              applying: ApplyType.Screen,
            })
          );
        },
        handleReject: () => {
          rtsApi.sharePermissionPermit({
            apply_user_id: userId,
            permit: Permission.NoPermission,
          });

          setIsShowShare(false);
          dispatch(
            reviewRemoteApply({
              userId: userId,
              applying: ApplyType.Screen,
            })
          );
        },
      };
    }
  }, [isShowMic, isShowShare]);

  return (
    <Toast isShow={isShowMic || isShowShare} message={content?.title || ''}>
      <div>
        <Button type="primary" onClick={content?.handleComfirm}>
          同意
        </Button>
      </div>
      <div>
        <Button onClick={content?.handleReject}>取消</Button>
      </div>
    </Toast>
  );
};

export default HandleApplyToast;
