import { Toast } from '@/components';
import RoomEnd from './RoomEnd';
import ReviewPermission from './ReviewPermission';
import HostOpenDevice from './HostOpenDevice';
import Record from './Record';
import { useSelector } from '@/store';
import { ToastType } from './types';

function ToastMessage() {
  const toast = useSelector((state) => state.ui.toast);

  // todo 授予用户mic /share 权限后，修改apply状态

  return (
    <Toast open={toast.open} title={toast.title} width={320}>
      {toast.type === ToastType.RoomEnd && <RoomEnd message={toast.other!} />}
      {toast.type === ToastType.ApplyMic && <ReviewPermission other={toast.other} type="mic" />}
      {toast.type === ToastType.ApplyShare && <ReviewPermission other={toast.other} type="share" />}
      {toast.type === ToastType.ApplyRecord && <Record type="start" other={toast.other} />}
      {toast.type === ToastType.HostOpenCamera && <HostOpenDevice type="camera" />}
      {toast.type === ToastType.HostOpenMic && <HostOpenDevice type="mic" />}
    </Toast>
  );
}

export default ToastMessage;
