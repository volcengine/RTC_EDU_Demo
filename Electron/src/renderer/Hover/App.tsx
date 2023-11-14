import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import Footer from './Footer/index';
import ScreenList from './ScreenList';
import AttenDeeInform from './AttendeeInform';
import MemberList from './MemberList';
import { remote } from 'electron';
import { useDispatch, useSelector } from '@src/store';
import { updateAllMessageInfo, updateMessage } from '@src/store/modules/publicMessage';
import HostRecieveRecord from './HostRecordRecieve';
import HostConfirmRecord from './HostRecordConfirm';
import Setting from './Setting';
import { initAllDevices } from '@src/store/modules/devices';
import { setRecordFileList, setSympolRecorFiledList } from '@src/store/modules/recordList';
import Record from './Record';
import '../theme/dark.css';
import '../theme/light.css';
import { SceneType, setScene } from '../store/slices/scene';
import { setMeetingRoom } from '../store/slices/meetingRoom';
import { setEdusRoom } from '../store/slices/edusRoom';
import { setEdubRoom } from '../store/slices/edubRoom';
import ApplyLinkList from './ApplyLinkList';

const footerWindowId = remote.getGlobal('shareWindowId').footerWindowId;
const memberWindowId = remote.getGlobal('shareWindowId').memberWindowId;
const applyLinkWindowId = remote.getGlobal('shareWindowId').applyLinkWindowId;

const settingWindowId = remote.getGlobal('shareWindowId').settingWindowId;
const attendeeWindowId = remote.getGlobal('shareWindowId').attendeeWindowId;
const hostWindowId = remote.getGlobal('shareWindowId').hostWindowId;
const screenWindowId = remote.getGlobal('shareWindowId').screenWindowId;
const hostRecordRecieveWindowId = remote.getGlobal('shareWindowId').hostRecordRecieveWindowId;
const hostRecordComfirmwindowId = remote.getGlobal('shareWindowId').hostRecordComfirmwindowId;
const currentId = remote.getCurrentWebContents().id;

const App: React.FC = () => {
  const [screenList, setScreenList] = useState([]);
  const { scene } = useSelector((state) => state.scene);

  const dispatch = useDispatch();
  const [url, setUrl] = useState('');
  ipcRenderer.on('recordUrl', (e, url) => {
    console.log('recordUrl', url);
    setUrl(url);
  });

  useEffect(() => {
    console.log('currentWebContentsId: ', currentId);
    // 监听主渲染进程传来的数据
    // todo 数据应该和场景相关
    ipcRenderer.on('updateRoomInfo', (e, data) => {
      console.log('updateRoomInfo', data);
      if (scene === SceneType.Meeting) {
        dispatch(setMeetingRoom(data));
      }

      if (scene === SceneType.Edus) {
        dispatch(setEdusRoom(data));
      }

      if (scene === SceneType.Edub) {
        dispatch(setEdubRoom(data));
      }
    });
    ipcRenderer.on('getMessageInfo', (e, data: any) => {
      console.log('getMessageInfo: ', data);
      dispatch(updateAllMessageInfo(data));
    });
    ipcRenderer.on('getScreenList', (e, data) => {
      console.log('getScreenList', data);
      setScreenList(data);
    });
    ipcRenderer.on('getDeviceList', (e, data) => {
      console.log('getDeviceList', data);
      dispatch(initAllDevices(data));
    });

    ipcRenderer.on('setScene', (e, data) => {
      console.log('setScene', data);
      dispatch(setScene(data));
    });

    return () => {
      ipcRenderer.removeAllListeners('updateRoomInfo');
      ipcRenderer.removeAllListeners('getScreenList');
      ipcRenderer.removeAllListeners('getMessageInfo');
      ipcRenderer.removeAllListeners('getDeviceList');
      ipcRenderer.removeAllListeners('setScene');
    };
  }, [scene]);

  useEffect(() => {
    const root = document.documentElement;
    root.className = 'light';
  }, []);

  return (
    <>
      {currentId === footerWindowId && <Footer />}
      {currentId === memberWindowId && <MemberList />}
      {currentId === applyLinkWindowId && <ApplyLinkList />}

      {currentId === settingWindowId && <Setting />}
      {currentId === screenWindowId && <ScreenList screenListInfo={screenList} />}
      {currentId === attendeeWindowId && <AttenDeeInform />}
      {/* 下面这个目前嵌套在memberList中 */}
      {/* {currentId === hostWindowId && <HostInform />} */}
      {currentId === hostRecordRecieveWindowId && <HostRecieveRecord />}
      {currentId === hostRecordComfirmwindowId && <HostConfirmRecord />}

      {url && <Record url={url} />}
    </>
  );
};

export default App;
