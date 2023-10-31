import { Silence } from '@/types/state';

interface SortedUser {
  user_id?: string;
  is_silence?: Silence;
  isLocal?: boolean;
}

/**
 * 获取房间内的非隐身用户
 * @param users
 * @returns
 */
function getVisiableUsers<U extends SortedUser>(users: U[]): U[] {
  const search = new URLSearchParams(window.location.href);
  const visibility = search.get('visibility');

  return users.filter(
    (u) => u.is_silence !== Silence.silence || (visibility === 'false' && !u.isLocal)
  );
}

/**
 * 去除房间内隐身用户
 * 按 【我】【共享人】【老师】 进行排序
 * @param users
 * @param hostUserId
 * @param shareUserId
 * @returns
 */
export function sortUserByRole<U extends SortedUser>(
  users: U[],
  hostUserId?: string,
  shareUserId?: string
): U[] {
  return getVisiableUsers(users).sort((a, b) => {
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

    if (a.user_id === hostUserId) {
      return -1;
    }

    if (b.user_id === hostUserId) {
      return 1;
    }
    return 1;
  });
}

/**
 * 如果有用户进入或者离开，保持原有的相对排序，新用户在最后面
 * @param oldList
 * @param newList
 * @returns
 */
function getReleativeSortedList<U extends SortedUser>(oldList: U[], newList: U[]): U[] {
  const oldIdList = oldList.filter(Boolean).map((item) => item.user_id);
  const newIdList = newList.filter(Boolean).map((item) => item.user_id);

  const keepSortedList = Array.from(new Set([...oldIdList, ...newIdList]));

  return keepSortedList.reduce((pre, cur) => {
    const finded = newList.find((item) => item.user_id === cur);

    if (finded) {
      pre.push(finded);
    }

    return pre;
  }, [] as U[]);
}

/**
 * 不考虚用户讲话的情况下，获取某页面的用户
 */
function getCurPageUsers<U extends SortedUser>(
  sortedUsers: U[],
  current: number,
  pageSize: number
) {
  sortedUsers = [...sortedUsers];
  const startIndex = (current - 1) * pageSize;

  const endIndex = current * pageSize;

  // 当前用户数不够一页
  if (sortedUsers.length < pageSize) {
    return sortedUsers;
  }
  // 需要从最后一页往前取pageSize
  if (sortedUsers.length < endIndex - 1) {
    return sortedUsers.splice(-pageSize);
  }

  return sortedUsers.splice(startIndex, pageSize);
}

/**

 * 
 * @param users 
 * @param activeSpeaker 
 * @param pageSize 
 * @param current 从1开始
 */
export function getRenderUsers<U extends SortedUser>(
  oldSortedUsers: U[],
  noSortedUsers: U[],
  activeSpeakers: string[],
  current: number,
  pageSize: number
): {
  newSortedUsers: U[];
  curPageUsers: U[];
} {
  // 先获取是第几页
  // 判断是否交换
  // 前一页往后移，显示在第一个位置，不交换
  // 后一页往前移，交换
  // AS取activeSpeakers的最后一个，如果在当前页，不交换
  // 返回当前渲染页内容，和排序后的内容

  const sortedUsers = getReleativeSortedList(oldSortedUsers, noSortedUsers);

  const as = activeSpeakers.at(-1);

  const curPageUsers = getCurPageUsers(sortedUsers, current, pageSize);

  // 没有活跃用户，直接返回当前页
  if (!as) {
    return {
      newSortedUsers: sortedUsers,
      curPageUsers,
    };
  }

  // 当前页包含活跃用户，直接返回
  if (curPageUsers.find((u) => u.user_id === as)) {
    return {
      newSortedUsers: sortedUsers,
      curPageUsers,
    };
  }

  const activeIndex = sortedUsers.findIndex((u) => u.user_id === as);
  const activeUser = sortedUsers[activeIndex];

  // 活跃用户不在当前页
  // 1. 如果当前是第一页
  // 需要替换第一页的最不活跃的某个用户

  if (current === 1) {
    //  curPageUsers 即第一页用户。找到第一页最不活跃的用户，

    // 按活跃度从小到大排序
    const newSortByActive = [...curPageUsers].sort((a, b) => {
      const aIndex = a.user_id ? activeSpeakers.indexOf(a.user_id) : -1;
      const bIndex = b.user_id ? activeSpeakers.indexOf(b.user_id) : -1;
      // a > b ,则a的活跃度比b的活跃度高，a排在后面
      return aIndex - bIndex;
    });

    // 全局排序中，按活跃度交换用户
    const inactiveUser = newSortByActive[0];
    const inactiveIndex = sortedUsers.findIndex((u) => u.user_id === inactiveUser.user_id);

    sortedUsers[inactiveIndex] = activeUser;
    sortedUsers[activeIndex] = inactiveUser;

    // 当前页显示的活跃用户
    const curInactiveIndex = curPageUsers.findIndex((u) => u.user_id === inactiveUser.user_id);
    curPageUsers[curInactiveIndex] = activeUser;

    return {
      newSortedUsers: sortedUsers,
      curPageUsers,
    };
  }

  // 2. 如果当前是在第二页+ ，第一个位置始终是活跃用户的位置
  // 只是显示，没有替换

  const newCurPageUsers = [activeUser, ...curPageUsers].splice(0, pageSize);

  return {
    newSortedUsers: sortedUsers,
    curPageUsers: newCurPageUsers,
  };
}
