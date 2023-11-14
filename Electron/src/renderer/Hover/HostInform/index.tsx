// TODO: 废弃
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { ipcRenderer } from 'electron';
import styles from './index.less';
import { remote } from 'electron';
import { ProcessEvent, WindowType } from '@/types';
import { Permission } from '@/renderer/types/state';
import { useSelector } from '@/renderer/store';
const mainWindowId = remote.getGlobal('shareWindowId').mainWindowId;

const mockList = [
  {
    userId: 'orange',
    userName: '你好',
  },
  {
    userId: 'liu',
    userName: ' hello',
  },
];

const HostInform: React.FC = () => {
  const messageInfo = useSelector((state) => state.messageType);
  const { reqOpenMicList, reqOpenShareList } = messageInfo;
  const [isShowReqList, setIsShowReqList] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  // const [reqOpenMicList, setReqOpenMicList] = useState(mockList);
  // const [reqOpenShareList, setReqOpenShareList] = useState(mockList);

  const hideWindow = () => {
    ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.HOST_MODAL, 'close');
  };

  const handlePermitOne = (type: string, userId: string, permit: Permission) => {
    if (type === 'mic') {
      ipcRenderer.sendTo(mainWindowId, 'permitOneMic', userId, permit);
    } else {
      ipcRenderer.sendTo(mainWindowId, 'permitOneShare', userId, permit);
    }
  };
  const handlePermitAll = (permit: Permission) => {
    ipcRenderer.sendTo(mainWindowId, 'permiteAll', permit);
    hideWindow();
  };

  useEffect(() => {
    if (reqOpenMicList.length + reqOpenShareList.length > 1) {
      // 同时有人申请开麦和共享
      setShowMessage(`${reqOpenMicList.length + reqOpenShareList.length}人正在申请发言&共享权限`);
    } else if (reqOpenMicList.length === 1 && reqOpenShareList.length === 0) {
      // 有人申请开麦
      setShowMessage(`${reqOpenMicList[0].userName}正在申请发言`);
    } else if (reqOpenShareList.length === 1 && reqOpenMicList.length === 0) {
      // 有人申请共享
      setShowMessage(`${reqOpenShareList[0].userName}正在申请共享权限`);
    } else if (reqOpenMicList.length + reqOpenShareList.length === 0) {
      hideWindow();
    }
  }, [reqOpenMicList.length, reqOpenShareList.length]);

  return (
    <div className={styles.inform}>
      <div className={styles.title}>{showMessage}</div>
      {reqOpenMicList.length + reqOpenShareList.length === 1 ? (
        <>
          <div className={styles.confirm}>
            <Button
              type="primary"
              onClick={() => {
                const type = reqOpenMicList.length === 1 ? 'mic' : 'share';
                const userId =
                  reqOpenMicList.length === 1
                    ? reqOpenMicList[0].userId
                    : reqOpenShareList[0].userId;
                handlePermitOne(type, userId, Permission.HasPermission);
              }}
            >
              同意
            </Button>
          </div>
          <div className={styles.cancel}>
            <Button
              onClick={() => {
                const type = reqOpenMicList.length === 1 ? 'mic' : 'share';
                const userId =
                  reqOpenMicList.length === 1
                    ? reqOpenMicList[0].userId
                    : reqOpenShareList[0].userId;
                handlePermitOne(type, userId, Permission.NoPermission);
              }}
            >
              拒绝
            </Button>
          </div>
        </>
      ) : (
        <>
          {isShowReqList ? (
            <>
              <div className={styles.reqList}>
                {reqOpenMicList.map((item) => {
                  const { userName, userId } = item;
                  return (
                    <div key={userId} className={styles.reqListItem}>
                      <div className={styles.text}>{userName}正在申请发言</div>
                      <div
                        className={styles.btn}
                        onClick={() => {
                          handlePermitOne('mic', userId, Permission.HasPermission);
                        }}
                      >
                        同意
                      </div>
                      <div
                        className={styles.btn}
                        onClick={() => {
                          handlePermitOne('mic', userId, Permission.NoPermission);
                        }}
                      >
                        拒绝
                      </div>
                    </div>
                  );
                })}
                {reqOpenShareList.map((item) => {
                  const { userName, userId } = item;
                  return (
                    <div key={userId} className={styles.reqListItem}>
                      <div className={styles.text}>{userName}正在申请共享权限</div>
                      <div
                        className={styles.btn}
                        onClick={() => {
                          handlePermitOne('share', userId, Permission.HasPermission);
                        }}
                      >
                        同意
                      </div>
                      <div
                        className={styles.btn}
                        onClick={() => {
                          handlePermitOne('share', userId, Permission.NoPermission);
                        }}
                      >
                        拒绝
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.footerBtn}>
                <Button
                  type="primary"
                  onClick={() => {
                    handlePermitAll(Permission.HasPermission);
                  }}
                >
                  同意所有
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    handlePermitAll(Permission.NoPermission);
                  }}
                >
                  拒绝所有
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <Button
                  type="primary"
                  onClick={() => {
                    setIsShowReqList(true);
                  }}
                >
                  查看申请列表
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => {
                    handlePermitAll(Permission.NoPermission);
                  }}
                >
                  关闭
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default HostInform;
