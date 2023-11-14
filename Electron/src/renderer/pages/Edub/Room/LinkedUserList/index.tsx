import { Player } from '@src/pages/Edub/components';
import { IEdubUser } from '@src/store/slices/edubRoom';
import { UserRole } from '@src/types/state';
import React from 'react';
import styles from './index.module.less';

export interface LinkedUserListProps {
  room: {
    localUser?: IEdubUser;
    teacher?: IEdubUser;
    linkmic_user_list?: IEdubUser[];
    host_user_id?: string;
  };
}

function LinkedUserList(props: LinkedUserListProps) {
  const { room } = props;

  const localUser = room.localUser;

  const localIsHost = localUser?.user_role === UserRole.Host;
  return (
    <div
      className={styles.linkedUserWrapper}
      style={{
        minWidth: localIsHost ? 177 : 332,
        maxWidth: localIsHost ? 177 : 332,
      }}
    >
      <Player
        user={localIsHost ? localUser : room.teacher!}
        localUser={localUser}
        height={localIsHost ? 100 : 188}
      />

      {room.linkmic_user_list?.map((user) => {
        return (
          <Player
            user={user}
            localUser={localUser}
            key={user.user_id}
            height={localIsHost ? 100 : 188}
          />
        );
      })}
    </div>
  );
}

export default LinkedUserList;
