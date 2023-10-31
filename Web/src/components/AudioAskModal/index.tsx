import { Modal } from 'antd';
import { InfoCircleTwoTone } from '@ant-design/icons';
import { useCallback, useState } from 'react';
import styles from './index.module.less';
import { useSelector, useDispatch } from '@/store';
import { SiteVisitStatus, setSiteVisitStatus } from '@/store/slices/symbols';

function AudioAskModal() {

    const dispatch = useDispatch();
    const siteVisitStatus = useSelector((state) => state.symbols.siteVisitStatus);
    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(!siteVisitStatus);

    const onModalOk = useCallback(() => {
        document.body.querySelectorAll("audio")?.forEach((audio) => audio?.play());
        dispatch(setSiteVisitStatus(SiteVisitStatus.initial));
        setIsModalOpen(false);
    }, [])

    const onModalCancel = useCallback(() => {
        dispatch(setSiteVisitStatus(SiteVisitStatus.initial));
        setIsModalOpen(false);
    }, [])

    return (
        <Modal
            title={null}
            open={isModalOpen}
            onOk={onModalOk}
            onCancel={onModalCancel}
            okText="开启音频"
            cancelText="取消"
        >
            <div className={styles.modalContent}>
                <InfoCircleTwoTone className={styles.icon}/>
                由于浏览器的设置，会议已被自动静音，请手动开启音频
            </div>
        </Modal>
    );
}

export default AudioAskModal;
