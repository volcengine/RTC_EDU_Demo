/// <reference types="node" />
import { RenderType } from "../types";
interface YUVFrame {
    format: {
        width: number;
        height: number;
        rotation: number;
        chromaWidth: number;
        chromaHeight: number;
        cropLeft: number;
        cropTop: number;
        cropWidth: number;
        cropHeight: number;
        displayWidth: number;
        displayHeight: number;
    };
    y: {
        bytes: Buffer;
        stride: number;
    };
    u: {
        bytes: Buffer;
        stride: number;
    };
    v: {
        bytes: Buffer;
        stride: number;
    };
}
export declare class YUVRender {
    context_: any;
    parent: HTMLDivElement;
    container: HTMLDivElement;
    canvas: HTMLCanvasElement;
    renderMode: number;
    yuvCanvas: any;
    destroied: boolean;
    mirror_: boolean;
    renderTypeElem: HTMLLabelElement | undefined;
    static renderType: RenderType;
    static buildYUVFrame(data: any): YUVFrame;
    /**
      * Static function to check if WebGL will be available with appropriate features.
      * @returns {boolean} - true if available
      */
    static checkWebGL(): boolean;
    static setRenderType(type: RenderType): void;
    constructor(element: HTMLDivElement, renderMode: number | undefined, mirror: boolean, context?: any);
    destroy(): void;
    setMirrorType(mirror: boolean): void;
    clearFrame(): void;
    renderFrame(frame: YUVFrame): void;
    adjustRender(frame: YUVFrame): void;
}
export {};
