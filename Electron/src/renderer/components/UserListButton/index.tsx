import { useDispatch, useSelector } from '@src/store';

import User from '@assets/images/UserList.svg';
// import UserOpen from '@/assets/images/UserOpen.svg';

import { MenuIconButton } from '@src/components';
import styles from './index.module.less';
import { setUserListDrawOpen } from '@src/store/slices/ui';
import React from 'react';

interface IList {
  room: {
    remoteUsers?: any[];
  };
}

export default function (props: IList) {
  const { room } = props;

  const dispatch = useDispatch();

  const ui = useSelector((state) => state.ui);

  const handleClick = () => {
    dispatch(setUserListDrawOpen(!ui.userListDrawOpen));
  };

  return (
    <div className={styles.menuButton}>
      <MenuIconButton
        iconClassName={styles.normalIcon}
        onClick={handleClick}
        text="成员"
        icon={User}
      />

      <div className={styles.userCount}>{(room.remoteUsers?.length || 0) + 1}</div>
    </div>
  );
}
