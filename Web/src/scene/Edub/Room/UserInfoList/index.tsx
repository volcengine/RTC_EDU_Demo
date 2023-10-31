import { useSearchParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Icon } from '@/components';
import { useDispatch, useSelector } from '@/store';
import styles from './index.module.less';
import CloseIcon from '@/assets/images/Close.svg';
import { setUserListDrawOpen } from '@/store/slices/ui';
import { appendRemoteUsers, EdubRoomState, IEdubUser } from '@/store/slices/edubRoom';
import UserItemInfo, { UserItemInfoProps } from '../../components/UserItemInfo';
import { sortUserByRole } from '@/utils/useSortUser';
import * as rtsApi from '@/scene/Edub/apis/rtsApi';
import { isRtsError } from '@/utils/rtsUtils';

export interface UserListProps {
  room: EdubRoomState;
}

function UserList(props: UserListProps) {
  const { room } = props;
  const ui = useSelector((state) => state.ui);
  const usersRef = useRef<HTMLDivElement | null>(null);
  const curUserPage = useRef<number>(3);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleCloseUserListDraw = () => {
    dispatch(setUserListDrawOpen(false));
  };

  const users = sortUserByRole(
    [room.localUser as IEdubUser, ...room.remoteUsers],
    room.share_user_id
  );

  const handleScroll = async () => {
    // 超过60人，开启加载
    if (users.length < 60) {
      return;
    }
    if (loading) {
      return;
    }
    if (usersRef.current) {
      // 内容实际高度
      const scrollHeight = usersRef.current.scrollHeight;
      // 滚动条滚动距离
      const scrollTop = usersRef.current.scrollTop;
      // 窗口可视范围高度
      const clientHeight = usersRef.current.clientHeight;
      if (clientHeight + scrollTop >= scrollHeight) {
        setLoading(true);
        const res = await rtsApi.edubGetUserList({
          index: curUserPage.current,
          size: 20,
        });
        if (!isRtsError(res)) {
          const { user_list } = res;
          dispatch(appendRemoteUsers(user_list));
          curUserPage.current += 1;
        }
        setLoading(false);
      }
    }
  };

  return (
    <div
      className={styles.userListWrapper}
      style={{
        display: ui.userListDrawOpen ? 'block' : 'none',
      }}
    >
      <div className={styles.userListTile}>
        <span>
          成员(
          {(room.remoteUsers?.length || 0) + (searchParams?.get('visibility') === 'false' ? 0 : 1)})
        </span>

        <span onClick={handleCloseUserListDraw}>
          <Icon src={CloseIcon} className={styles.iconClose} />
        </span>
      </div>
      <div className={styles.userListContent} onScroll={handleScroll} ref={usersRef}>
        {users?.map((user) => {
          return (
            <UserItemInfo user={user} key={user.user_id} room={room as UserItemInfoProps['room']} />
          );
        })}

        {loading && <div className={styles.loadMore}>加载中...</div>}
      </div>
    </div>
  );
}

export default UserList;
