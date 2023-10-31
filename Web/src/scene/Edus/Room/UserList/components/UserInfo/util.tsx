import { BaseUser, ShareStatus } from '@/types/state';

export const getMaxWidth = (
  user: Partial<BaseUser> & {
    applying?: any[];
    isLocal?: boolean;
  },
  room: {
    host_user_id?: string;
  }
): number => {
  const isHost = user?.user_id && user?.user_id === room.host_user_id;

  const isApplying = !!user?.applying?.length;

  const isSharing = user?.share_status === ShareStatus.Sharing;

  const isMe = !!user?.isLocal;

  let maxWidth = 63;
  if (!isHost) {
    maxWidth += 31;
  }

  if (!isMe) {
    maxWidth += 38;
  }

  if (!isSharing) {
    maxWidth += 19;
  }

  if (!isApplying) {
    maxWidth += 15;
  }

  return maxWidth;
};
