/* eslint-disable prettier/prettier */
import { useRef } from 'react';
import { BoardClient } from '@/core/board';
import { useSelector, useDispatch } from '@/store';
import { IPreviewBoard, setPreviewBoardList } from "@/store/slices/board";

const useUpdatePreviewBoard = (): [
    IPreviewBoard[],
    () => Promise<IPreviewBoard[]>
] => {
    const dispatch = useDispatch();
    const previewBoard = useSelector((state) => state.board.previewBoardList);
    const updateTime = useRef<number>(Date.now());
    console.warn = (text) => text;

    const updatedPreviewBoard = (): Promise<IPreviewBoard[]>  => {
        return new Promise((resolve, _rej) => {
          const boardInfo = BoardClient.currentWhiteboard;
            if (boardInfo) {
                const curUpdateTime = Date.now();
                updateTime.current = curUpdateTime;
                Promise.all(
                    boardInfo.getAllPageInfo().map(async ({ pageId }, pageIndex) => {
                        /** 此处应每次都重新生成，避免在 pdf/ppt 等资源上绘制时无法缩略图显示 */
                        const url = await boardInfo.exportSnapshot({ pageIndex });
                        return { url, pageId, pageIndex };
                    })
                ).then((res) => {
                    if (curUpdateTime >= updateTime.current) {
                        dispatch(setPreviewBoardList(res));
                        resolve(res);
                    }
                }).catch(reason => console.error(reason));
            } else {
                dispatch(setPreviewBoardList([]));
                resolve([]);
            }
        })
    }

    return [
        previewBoard,
        updatedPreviewBoard,
    ]
};

export default useUpdatePreviewBoard;
