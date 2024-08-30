import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Silence, UserRole } from '@/types/state';

interface User {
  user_id: string;
  is_silence?: Silence;
  isLocal?: boolean;
  user_role: UserRole;
}

/**
 * 获取房间内的非隐身用户
 * 返回新数组
 * @param users
 * @returns
 */
function getVisiableUsers(users: User[]): User[] {
  return users.filter((u) => u.is_silence !== Silence.silence);
}

/**
 * 按用户身份进行排序
 * 数组不改变
 * @param users
 * @param shareUserId
 * @returns
 */
export function sortUserByRole<T extends User>(users: T[], shareUserId?: string): T[] {
  return [...users].sort((a, b) => {
    if (a.isLocal) {
      return -1;
    }

    if (b.isLocal) {
      return 1;
    }

    if (a.user_id === shareUserId) {
      return -1;
    }
    if (b.user_id === shareUserId) {
      return 1;
    }

    if (a.user_role === UserRole.Host) {
      return -1;
    }

    if (b.user_role === UserRole.Host) {
      return 1;
    }
    return 1;
  });
}

/**
 * 返回新数组,不改变原数组
 * @param users
 * @param current
 * @param pageSize
 * @returns
 */
const getPageNumUsers = (users: User[], current: number, pageSize: number): User[] => {
  const startIndex = current * pageSize;

  const endIndex = startIndex + pageSize;

  let pageUsers = [...users].splice(startIndex, endIndex);

  // 当前用户数不够一页

  if (pageUsers.length < pageSize) {
    pageUsers = [...users].splice(-pageSize);
  }
  // 需要从最后一页往前取pageSize

  return pageUsers;
};

/**
 * 返回新数组,不改变原数组
 * @param users
 * @param current
 * @param pageSize
 * @returns
 */
const getPageRenderUsers = (params: {
  users: User[];
  curPage: number;
  pageSize: number;
}): User[] => {
  const { curPage, pageSize, users } = params;

  const pageUsers = getPageNumUsers(users, curPage, pageSize);
  return pageUsers;
};

const isLocal = (user: User) => Boolean(user.isLocal);
const isShareUser = (user: User, shareUserId?: string) => user.user_id === shareUserId;
// 用于筛选 newList
const isHostUser = (user: User) => user.user_role === UserRole.Host;
// 用于筛选 oldList, 因为 host user 可能发生更换
const becomesHostUser = (user: User, hostUserId?: string) => user.user_id === hostUserId;

/**
 * 如果有用户进入或者离开，保持原有的相对排序，新用户在最后面
 * @param oldList
 * @param newList
 * @returns
 */
const getReleativeSortedList = (oldList: User[], newList: User[], shareUserId?: string): User[] => {
  const localUser = newList.find(isLocal);
  const shareUser = newList.find((user) => isShareUser(user, shareUserId));
  const hostUser = newList.find(isHostUser);
  const hostUserId = hostUser?.user_id;

  const oldIdList = oldList
    .filter((user) => {
      return (
        Boolean(user) && !isLocal(user) && !isShareUser(user, shareUserId) && !becomesHostUser(user, hostUserId)
      );
    })
    .map((item) => item.user_id);
  const newIdList = newList
    .filter((user) => {
      return (
        Boolean(user) && !isLocal(user) && !isShareUser(user, shareUserId) && !isHostUser(user)
      );
    })
    .map((item) => item.user_id);

  const keepSortedList = Array.from(new Set([...oldIdList, ...newIdList]));

  const normalUsers = keepSortedList.reduce((pre, cur) => {
    const finded = newList.find((item) => item.user_id === cur);

    if (finded) {
      pre.push(finded);
    }

    return pre;
  }, [] as User[]);

  const isIsUser = (item: undefined | User): item is User => Boolean(item);

  const specialUser = [localUser, shareUser, hostUser].filter(isIsUser).map((u) => u.user_id);

  const specialUserIds = Array.from(new Set([...specialUser]));

  const renderedSpecialUsers = specialUserIds.reduce((res, userId) => {
    if (localUser?.user_id === userId) {
      res.push(localUser);
      return res;
    }
    if (shareUser?.user_id === userId) {
      res.push(shareUser);
      return res;
    }
    if (hostUser?.user_id === userId) {
      res.push(hostUser);
      return res;
    }
    return res;
  }, [] as User[]);

  normalUsers.unshift(...renderedSpecialUsers);

  return normalUsers;
};

const swapUser = (users: User[], curIndex: number, tarIndex: number): void => {
  const temp = users[curIndex];
  users[curIndex] = users[tarIndex];
  users[tarIndex] = temp;
};

const findLongestInactiveUserIndex = (users: User[], shareUserId?: string): number => {
  return users.findIndex((user) => {
    if (user.isLocal) {
      return false;
    }

    if (user.user_id === shareUserId) {
      return false;
    }

    if (user.user_role === UserRole.Host) {
      return false;
    }

    return true;
  });
};

/**
 * 返回新数组
 * @param props
 * @returns
 */
const getAllVisiableUsers = (props: {
  localUser: User;
  remoteUsers: User[];
  visibility: string | null;
}): User[] => {
  const { localUser, remoteUsers, visibility } = props;

  let visibleUsers: User[];

  if (visibility === 'false') {
    visibleUsers = getVisiableUsers(remoteUsers);
  } else {
    visibleUsers = getVisiableUsers([localUser, ...remoteUsers]);
  }

  return visibleUsers;
};

const useSortUser = (props: {
  localUser: User;
  remoteUsers: User[];
  curPage: number;
  pageSize: number;
  activeSpeakers: string[];
  shareUserId?: string;
}) => {
  const { localUser, remoteUsers, curPage, pageSize, activeSpeakers, shareUserId } = props;
  const [searchParams] = useSearchParams();

  const visibility = searchParams.get('visibility');

  const visibleUsers = getAllVisiableUsers({
    localUser,
    remoteUsers,
    visibility,
  });

  // 按 我 共享用户 主持人 进房顺序进行排序
  const oldSortedUsers = useRef<User[]>(sortUserByRole(visibleUsers, shareUserId));

  // 保存当前页上的用户
  const oldPageUsers = useRef<User[]>(
    getPageRenderUsers({
      users: oldSortedUsers.current,
      curPage,
      pageSize,
    })
  );

  const [renderUsers, setRenderUsers] = useState<User[]>(oldPageUsers.current);

  const calcRenders = (params: {
    newPageUsers: User[];
    newSortedUsers: User[];
    activeSpeakerId: string | undefined;
  }) => {
    const { newPageUsers, activeSpeakerId, newSortedUsers } = params;

    // 如果存在活跃用户
    if (activeSpeakerId) {
      const activeSpeakerInPage = newPageUsers.findIndex(
        (user) => user.user_id === activeSpeakerId
      );

      // 如果当前页是第一页
      if (curPage === 0) {
        if (activeSpeakerInPage > -1) {
          // 如果活跃用户在当前页
          setRenderUsers(newPageUsers);
          oldSortedUsers.current = newSortedUsers;
          oldPageUsers.current = newPageUsers;
        } else {
          // 如果活跃用户不在第一页，需要替换到第一页来
          const activeIndex = newSortedUsers.findIndex((user) => user.user_id === activeSpeakerId);
          if (activeIndex === -1) {
            // 活跃用户退房了，此时也会触发更新，
            setRenderUsers(newPageUsers);
            oldPageUsers.current = newPageUsers;
            oldSortedUsers.current = newSortedUsers;
            return;
          }

          const longestInActiveUserIndex = findLongestInactiveUserIndex(
            newSortedUsers,
            shareUserId
          );

          if (longestInActiveUserIndex === -1) {
            // 房间里的用户是 我 / 共享/ 用户 /主持人时，不能替换
            setRenderUsers(newPageUsers);
            oldPageUsers.current = newPageUsers;
            oldSortedUsers.current = newSortedUsers;
            return;
          }

          swapUser(newSortedUsers, activeIndex, longestInActiveUserIndex);
          oldSortedUsers.current = newSortedUsers;

          // 重新计算当前页的用户

          const newRenderUsers = getPageRenderUsers({
            users: newSortedUsers,
            curPage,
            pageSize,
          });
          oldPageUsers.current = newRenderUsers;
          setRenderUsers(newRenderUsers);
        }
      } else if (activeSpeakerInPage > -1) {
        // 如果活跃用户在当前页

        if (
          newPageUsers.every(
            (user) =>
              oldPageUsers.current.findIndex((oldUser) => oldUser.user_id === user.user_id) > -1
          )
        ) {
          // 如果本次页面上每个用户都出现在了上一次计算中，则不需要更新
          setRenderUsers(newPageUsers);
          oldSortedUsers.current = newSortedUsers;
          oldPageUsers.current = newPageUsers;
        } else {
          // 活跃用户出现在第一个位置

          swapUser(newPageUsers, 0, activeSpeakerInPage);

          oldSortedUsers.current = newSortedUsers;
          oldPageUsers.current = newPageUsers;
          setRenderUsers(newPageUsers);
        }
      } else {
        // 需要出现在第一个位置

        const activeSpeaker = newSortedUsers.find((user) => user.user_id === activeSpeakerId);
        if (!activeSpeaker) {
          // 某些情况可能没找到activeSpeaker，保持现状
          setRenderUsers(newPageUsers);
          oldPageUsers.current = newPageUsers;
          oldSortedUsers.current = newSortedUsers;
        } else {
          newPageUsers[0] = activeSpeaker;
          oldPageUsers.current = newPageUsers;
          oldSortedUsers.current = newSortedUsers;
          setRenderUsers(newPageUsers);
        }
      }
    } else {
      // 不存在活跃用户，正常更新页面渲染
      setRenderUsers(newPageUsers);
      oldSortedUsers.current = newSortedUsers;
    }
  };

  // 当用户进退房, 活跃用户改变，翻页，切换共享用户时，需要重新计算当前页用户
  useEffect(() => {
    const newVisibleUsers = getAllVisiableUsers({
      localUser,
      remoteUsers,
      visibility,
    });

    const newSortedUsers = getReleativeSortedList(
      oldSortedUsers.current,
      sortUserByRole(newVisibleUsers, shareUserId),
      shareUserId
    );

    let newPageUsers = oldPageUsers.current;

    if (
      remoteUsers.length <= pageSize ||
      remoteUsers.length + 1 === oldSortedUsers.current.length
    ) {
      // 如果只是进退房，只有房间内用户不足1页的情况才重新计算当前页用户
      newPageUsers = getPageRenderUsers({
        users: newSortedUsers,
        curPage,
        pageSize,
      });
    }

    const activeSpeakerId = activeSpeakers[activeSpeakers.length - 1];

    calcRenders({
      newPageUsers,
      newSortedUsers,
      activeSpeakerId,
    });
  }, [remoteUsers, localUser, activeSpeakers, shareUserId, curPage]);

  /**
   * 主动更新页面用户，出现在翻页时
   */
  const updatePageUser = () => {
    const newVisibleUsers = getAllVisiableUsers({
      localUser,
      remoteUsers,
      visibility,
    });

    const newSortedUsers = getReleativeSortedList(
      oldSortedUsers.current,
      sortUserByRole(newVisibleUsers, shareUserId),
      shareUserId
    );

    const newPageUsers = getPageRenderUsers({
      users: newSortedUsers,
      curPage,
      pageSize,
    });

    const activeSpeakerId = activeSpeakers[activeSpeakers.length - 1];
    calcRenders({
      newPageUsers,
      newSortedUsers,
      activeSpeakerId,
    });
  };

  return {
    curPageUsers: renderUsers,
    // 如果翻页已经到头了，可能需要更新当前页的用户
    // 比如 原来有12个用户，翻到第2页，此时第13个用户进房，再次点击翻页，13号用户会出现
    updatePageUser,
  };
};

export default useSortUser;

