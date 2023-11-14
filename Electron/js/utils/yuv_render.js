"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2022 Beijing Volcano Engine Technology Ltd.
 * SPDX-License-Identifier: MIT
 */
const YUVCanvas = require("yuv-canvas");
const types_1 = require("../types");
class YUVRender {
    constructor(element, renderMode = types_1.RenderMode.FIT, mirror, context) {
        this.destroied = false;
        // [parentDiv [containerDiv [canvas ]]];
        this.parent = element;
        this.renderMode = renderMode;
        this.container = document.createElement("div");
        this.mirror_ = mirror;
        this.context_ = context || {};
        // this.container.style.border = '1px solid red'; // for debug
        Object.assign(this.container.style, {
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
        });
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("style", "overflow: hidden");
        this.parent.appendChild(this.container);
        this.container.appendChild(this.canvas);
        // Show Render Type
        if (('isRenderTypeHint' in window) && (window.isRenderTypeHint)) {
            this.renderTypeElem = document.createElement('label');
            Object.assign(this.renderTypeElem.style, {
                position: "absolute",
                top: "2px",
                left: "2px",
                fontSize: "16px",
                color: "red",
                zIndex: "2",
            });
            this.parent.style.position = 'relative';
            this.parent.style.zIndex = '1';
            this.parent.appendChild(this.renderTypeElem);
        }
        // If rendering with webgl fails, automatically switch to software rendering
        this.canvas.addEventListener('webglcontextlost', () => {
            console.warn('webglcontextlost, try to use software renderer.');
            if (this.canvas && this.renderTypeElem) {
                this.renderTypeElem.innerHTML = 'software';
            }
            if (this.canvas) {
                this.canvas.removeEventListener('webglcontextlost', () => { }, false);
                this.container.removeChild(this.canvas);
                this.canvas = document.createElement("canvas");
                this.canvas.setAttribute("style", "overflow: hidden");
                this.container.appendChild(this.canvas);
                this.yuvCanvas = YUVCanvas.attach(this.canvas, { 'webGL': false });
            }
        }, false);
        let isWebGL = (YUVRender.renderType == types_1.RenderType.kRenderTypeWebGL) ? YUVRender.checkWebGL() : false;
        console.log('useRenderType:', isWebGL ? 'webgl' : 'software');
        if (this.renderTypeElem) {
            this.renderTypeElem.innerHTML = isWebGL ? 'webgl' : 'software';
        }
        // by my test results, it will cose averate 12ms to render a YUV frame if webGL is off
        // and it will cost about 3ms whe webGL is on
        this.yuvCanvas = YUVCanvas.attach(this.canvas, { 'webGL': isWebGL });
    }
    // see https://github.com/brion/yuv-buffer
    static buildYUVFrame(data) {
        const { width, height, plane_y, plane_u, plane_v, plane_size_y, plane_size_u, plane_size_v, rotation, } = data;
        let frame = {
            format: {
                width: width,
                height: height,
                chromaWidth: width / 2,
                chromaHeight: height / 2,
                cropLeft: 0,
                cropTop: 0,
                cropWidth: width,
                cropHeight: height,
                displayWidth: width,
                displayHeight: height,
                rotation: rotation,
            },
            y: { bytes: plane_y, stride: plane_size_y },
            u: { bytes: plane_u, stride: plane_size_u },
            v: { bytes: plane_v, stride: plane_size_v },
        };
        return frame;
    }
    /**
      * Static function to check if WebGL will be available with appropriate features.
      * @returns {boolean} - true if available
      */
    static checkWebGL() {
        var _a;
        let canvas = document.createElement('canvas');
        let gl;
        canvas.width = 1;
        canvas.height = 1;
        try {
            let options = {
                // Don't trigger discrete GPU in multi-GPU systems
                preferLowPowerToHighPerformance: true,
                powerPreference: 'low-power',
                // Don't try to use software GL rendering!
                failIfMajorPerformanceCaveat: true,
                // In case we need to capture the resulting output.
                preserveDrawingBuffer: true
            };
            gl = (canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options));
        }
        catch (e) {
            return false;
        }
        if (gl) {
            let register = gl.TEXTURE0;
            let width = 4;
            let height = 4;
            let texture = gl.createTexture();
            let data = new Uint8Array(width * height);
            let texWidth = width;
            let format = gl.ALPHA;
            let filter = gl.LINEAR;
            gl.activeTexture(register);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
            gl.texImage2D(gl.TEXTURE_2D, 0, // mip level
            format, // internal format
            texWidth, height, 0, // border
            format, // format
            gl.UNSIGNED_BYTE, //type
            data // data!
            );
            var err = gl.getError();
            if (err) {
                // Doesn't support alpha textures?
                return false;
            }
            else {
                // Actively release the temporary gl context
                (_a = gl.getExtension('WEBGL_lose_context')) === null || _a === void 0 ? void 0 : _a.loseContext();
                return true;
            }
        }
        else {
            return false;
        }
    }
    ;
    static setRenderType(type) {
        console.log('setRenderType:', type);
        YUVRender.renderType = type;
    }
    destroy() {
        if (!this.destroied) {
            this.yuvCanvas.clear();
            this.canvas.remove();
            this.container.remove();
            this.yuvCanvas = null;
            this.destroied = true;
            if (this.renderTypeElem) {
                this.renderTypeElem.remove();
            }
        }
    }
    setMirrorType(mirror) {
        this.mirror_ = mirror;
    }
    clearFrame() {
        if (this.yuvCanvas) {
            this.yuvCanvas.clear();
        }
        else {
            console.warn("call renderFrame, but yuvCanvas is null");
        }
    }
    renderFrame(frame) {
        if (this.yuvCanvas) {
            this.adjustRender(frame);
            if (this.context_.flagNotRenderFrame) {
            }
            else {
                this.yuvCanvas.drawFrame(frame);
            }
        }
        else {
            console.warn("call renderFrame, but yuvCanvas is null");
        }
    }
    adjustRender(frame) {
        let containerRatio = this.container.clientWidth / this.container.clientHeight;
        let targetWidth;
        let targetHeight;
        if (frame.format.rotation === 90 || frame.format.rotation === 270) {
            targetWidth = frame.format.height;
            targetHeight = frame.format.width;
        }
        else {
            targetWidth = frame.format.width;
            targetHeight = frame.format.height;
        }
        let frameRatio = targetWidth / targetHeight;
        switch (this.renderMode) {
            case types_1.RenderMode.HIDDEN:
                {
                    if (containerRatio >= frameRatio) {
                        this.canvas.style.zoom = String(this.container.clientWidth / targetWidth);
                    }
                    else {
                        this.canvas.style.zoom = String(this.container.clientHeight / targetHeight);
                    }
                    let transform = "rotateZ(" + frame.format.rotation.toString() + "deg)";
                    if (this.mirror_) {
                        transform += " rotateY(180deg)";
                    }
                    this.canvas.style.transform = transform;
                }
                break;
            case types_1.RenderMode.FIT:
                {
                    if (containerRatio >= frameRatio) {
                        this.canvas.style.zoom = String(this.container.clientHeight / targetHeight);
                    }
                    else {
                        this.canvas.style.zoom = String(this.container.clientWidth / targetWidth);
                    }
                    let transform = "rotateZ(" + frame.format.rotation.toString() + "deg)";
                    if (this.mirror_) {
                        transform += " rotateY(180deg)";
                    }
                    this.canvas.style.transform = transform;
                }
                break;
            default:
                {
                    console.warn(`adjustRender with an unexpected mode: ${this.renderMode}`);
                }
                break;
        }
    }
}
exports.YUVRender = YUVRender;
YUVRender.renderType = types_1.RenderType.kRenderTypeWebGL;
//# sourceMappingURL=yuv_render.js.map