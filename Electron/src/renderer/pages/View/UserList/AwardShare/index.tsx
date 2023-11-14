import { useDispatch } from '@/renderer/store';
import { Permission } from '@/renderer/types/state';
import React, { useMemo } from 'react';
import Toast from '@src/components/Toast';
import { Button } from 'antd';
import * as rtsApi from '@src/pages/View/apis';
import { setSharePermit } from '@/renderer/store/slices/meetingRoom';

// 授予参会人权限
const AwardShare: React.FC<{
  userId: string;
  isShowAwardShare: boolean;
  setIsShowAwardShare: React.Dispatch<React.SetStateAction<boolean>>;
  shareOperate: Permission;
}> = (props) => {
  const { userId, isShowAwardShare, shareOperate, setIsShowAwardShare } = props;
  const dispatch = useDispatch();
  const title = useMemo(() => {
    if (shareOperate === Permission.HasPermission) {
      return '是否授予共享权限';
    } else if (shareOperate === Permission.NoPermission) {
      return '是否取消共享权限';
    }
  }, [shareOperate]);

  const handleComfirm = () => {
    rtsApi.operateOtherSharePermission({
      operate_user_id: userId,
      operate: shareOperate,
    });

    dispatch(
      setSharePermit({
        userId: userId,
        permit: shareOperate,
        isLocal: false,
      })
    );
    setIsShowAwardShare(false);
  };

  const handleReject = () => {
    setIsShowAwardShare(false);
  };

  return (
    <Toast isShow={isShowAwardShare} message={title || ''}>
      <div>
        <Button type="primary" onClick={handleComfirm}>
          确认
        </Button>
      </div>
      <div>
        <Button onClick={handleReject}>取消</Button>
      </div>
    </Toast>
  );
};

export default AwardShare;
