import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from '@/store';

import User from '@/assets/images/UserList.svg';
// import UserOpen from '@/assets/images/UserOpen.svg';

import { MenuIconButton } from '@/components';
import styles from './index.module.less';
import { setUserListDrawOpen } from '@/store/slices/ui';

interface IList {
  room: {
    remoteUsers?: any[];
  };
}

export default function (props: IList) {
  const { room } = props;

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

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
        // todo 打开弹窗时的样式
        icon={User}
      />

      <div className={styles.userCount}>
        {(room.remoteUsers?.length || 0) + (searchParams?.get('visibility') === 'false' ? 0 : 1)}
      </div>
    </div>
  );
}
