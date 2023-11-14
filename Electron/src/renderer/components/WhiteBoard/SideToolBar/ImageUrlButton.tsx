import { useState } from 'react';
import { message, Modal, Button, Input } from 'antd';
import { BkFillType, IWhiteBoard } from '@volcengine/white-board-manage';
import React from 'react';

function validateUrl(url: string) {
  // eslint-disable-next-line prefer-regex-literals
  return new RegExp(
    '^((?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?)?$',
    'i'
  ).test(url);
}
function ImgUrlButton({ whiteBoard, fillType }: { whiteBoard: IWhiteBoard; fillType: BkFillType }) {
  const [visible, setVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

  return (
    <>
      <Button onClick={() => setVisible(true)}>添加URL图片背景</Button>
      <Modal
        title="Img Url"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          if (validateUrl(imgUrl)) {
            whiteBoard.changePageBackground({
              pageId: whiteBoard.getCurrentPageId(),
              img: imgUrl,
              fillType,
            });
            setVisible(false);
          } else {
            message.error('URL格式错误');
          }
        }}
      >
        <Input value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
      </Modal>
    </>
  );
}

export default ImgUrlButton;
