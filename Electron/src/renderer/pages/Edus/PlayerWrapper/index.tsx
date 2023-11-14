import React from 'react';
import PlayerLayout from './PlayerLayout';
import { useSelector } from '@src/store';
import ShareLayout from '@components/ShareLayout/index';
import { ShareStatus } from '@/renderer/types/state';

const PlayerWrapper: React.FC<{}> = () => {
  const room = useSelector((state) => state.edusRoom);
  return (
    <>
      {room.share_status === ShareStatus.Sharing ? <ShareLayout room={room} /> : <PlayerLayout />}
    </>
  );
};

export default PlayerWrapper;
