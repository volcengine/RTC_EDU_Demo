"use strict";
/*
 * Copyright (c) 2022 Beijing Volcano Engine Technology Ltd.
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
//////////////////////////////////////////////////////////////////////////
// VRTCEngine here
/** {en}
 * @brief Video rendering scale mode
 */
/** {zh}
 * @brief 渲染时，视频内容缩放模式
 */
var RenderMode;
(function (RenderMode) {
    /** {en}
     * @brief Fit.
     *        The video frame is scaled with fixed aspect ratio, until it fits just within the canvas. Other part of the canvas is filled with the background color.
     */
    /** {zh}
     * @brief 视频帧内容全部显示优先。
     * 视频帧等比缩放，直至视频帧能够在视窗上全部显示。如果视频帧长宽比例与视窗不同，视窗上未被视频帧填满区域将被涂黑。
     * 缩放完成后，视频帧的一边长和视窗的对应边长一致，另一边长小于等于视窗对应边长。
     */
    RenderMode[RenderMode["FIT"] = 1] = "FIT";
    /** {en}
     * @brief Fill and Crop.
     *        The video frame is scaled with fixed aspect ratio, until it completely fills the canvas. The region of the video exceeding the canvas will be cropped.
     */
    /** {zh}
     * @brief 视窗填满优先。
     * 视频帧等比缩放，直至视窗被视频填满。如果视频帧长宽比例与视窗不同，视频帧的多出部分将无法显示。
     * 缩放完成后，视频帧的一边长和视窗的对应边长一致，另一边长大于等于视窗对应边长。
     */
    RenderMode[RenderMode["HIDDEN"] = 2] = "HIDDEN";
})(RenderMode = exports.RenderMode || (exports.RenderMode = {}));
/** {en}
 * @brief rendering type
 */
/** {zh}
 * @brief 渲染类型
 */
var RenderType;
(function (RenderType) {
    /** {en}
     * @brief WebGL render.
     */
    /** {zh}
     * @brief WebGL渲染。
     */
    RenderType[RenderType["kRenderTypeWebGL"] = 1] = "kRenderTypeWebGL";
    /** {en}
     * @brief Software render.
     */
    /** {zh}
     * @brief Software渲染。
     */
    RenderType[RenderType["kRenderTypeSoftware"] = 2] = "kRenderTypeSoftware";
})(RenderType = exports.RenderType || (exports.RenderType = {}));
;
/** {en}
 * @brief Subscription status of media streams
 */
/** {zh}
 * @brief 订阅媒体流状态
 */
var SubscribeState;
(function (SubscribeState) {
    /** {en}
     * @brief Successfully changed the subscription status
     */
    /** {zh}
     * @brief 订阅/取消订阅流成功
     */
    SubscribeState[SubscribeState["kSubscribeStateSuccess"] = 0] = "kSubscribeStateSuccess";
    /** {en}
     * @brief Failed to change the subscription status, because you were not in the room.
     */
    /** {zh}
     * @brief 订阅/取消订阅流失败，本地用户未在房间中
     */
    SubscribeState[SubscribeState["kSubscribeStateFailedNotInRoom"] = 1] = "kSubscribeStateFailedNotInRoom";
    /** {en}
     * @brief Failed to change the subscription status, because the target audio/video stream was not found.
     */
    /** {zh}
     * @brief 订阅/取消订阅流失败，房间内未找到指定的音视频流
     */
    SubscribeState[SubscribeState["kSubscribeStateFailedStreamNotFound"] = 2] = "kSubscribeStateFailedStreamNotFound";
    /** {en}
     * @brief Failed to change the subscription status, because the number of streams you have subscribed to has exceeded the limit.
     */
    /** {zh}
     * @brief 超过订阅流数上限
     */
    SubscribeState[SubscribeState["kSubscribeStateFailedOverLimit"] = 3] = "kSubscribeStateFailedOverLimit";
})(SubscribeState = exports.SubscribeState || (exports.SubscribeState = {}));
/** {en}
 * @brief  Video frame scale mode
 */
/** {zh}
 * @brief 视频帧缩放模式，默认使用FitWithCropping模式
 */
var ScaleMode;
(function (ScaleMode) {
    /** {en}
     * @brief Auto mode, default to FitWithCropping.
     */
    /** {zh}
     * @brief 自动模式
     */
    ScaleMode[ScaleMode["Auto"] = 0] = "Auto";
    /** {en}
     * @brief Stretch the video frame until the video frame and the window have the same resolution. The video frame's aspect ratio can be changed as it is automatically stretched to fill the window, but the whole image is visible.
     */
    /** {zh}
     * @brief 视频尺寸进行缩放和拉伸以充满显示视窗
     */
    ScaleMode[ScaleMode["Stretch"] = 1] = "Stretch";
    /** {en}
     * @brief  Fit the window with cropping
     *         Scale the video frame uniformly until the window is filled. If the video frame's aspect ratio is different from that of the window, the extra part of the video frame will be cropped.
     *         After the scaling process is completed, the width or height of the video frame will be consistent with that of the window, and the other dimension will be greater than or equal to that of the window.
     */
    /** {zh}
     * @brief
     * 优先保证视窗被填满。视频尺寸等比缩放，直至整个视窗被视频填满。如果视频长宽与显示窗口不同，多出的视频将被截掉
     */
    ScaleMode[ScaleMode["FitWithCropping"] = 2] = "FitWithCropping";
    /** {en}
     * @brief  Fit the window with filling
     *         Scale the video frame uniformly until its width or height reaches the boundary of the window. If the video frame's aspect ratio is different from that of the window, the area that is not filled will be black.
     *         After the scaling process is completed, the width or height of the video frame will be consistent with that of the window, and the other dimension will be less than or equal to that of the window.
     */
    /** {zh}
     * @brief
     * 优先保证视频内容全部显示。视频尺寸等比缩放，直至视频窗口的一边与视窗边框对齐。如果视频长宽与显示窗口不同，视窗上未被填满的区域将被涂黑
     */
    ScaleMode[ScaleMode["FitWithFilling"] = 3] = "FitWithFilling";
})(ScaleMode = exports.ScaleMode || (exports.ScaleMode = {}));
/** {en}
 * @brief Video encoder type
 */
/** {zh}
 * @brief 视频的编码类型
 */
var VideoCodecType;
(function (VideoCodecType) {
    /** {en}
     * @brief Unknown
     */
    /** {zh}
     * @brief 未知类型
     */
    VideoCodecType[VideoCodecType["kVideoCodecUnknown"] = 0] = "kVideoCodecUnknown";
    /** {en}
     * @brief H264
     */
    /** {zh}
     * @brief 标准H264
     */
    VideoCodecType[VideoCodecType["kVideoCodecH264"] = 1] = "kVideoCodecH264";
    /** {en}
     * @hidden
     * @brief
     */
    /** {zh}
     * @hidden
     * @brief 标准ByteVC1
     */
    VideoCodecType[VideoCodecType["kVideoCodecByteVC1"] = 2] = "kVideoCodecByteVC1";
})(VideoCodecType = exports.VideoCodecType || (exports.VideoCodecType = {}));
/** {en}
 * @brief  Video encoding mode
 */
/** {zh}
 * @brief 视频编码模式
 */
var CodecMode;
(function (CodecMode) {
    /** {en}
     * @brief Automatic
     */
    /** {zh}
     * @brief 自动选择
     */
    CodecMode[CodecMode["AutoMode"] = 0] = "AutoMode";
    /** {en}
     * @brief Hardware encoding
     */
    /** {zh}
     * @brief 硬编码
     */
    CodecMode[CodecMode["HardwareMode"] = 1] = "HardwareMode";
    /** {en}
     * @brief Software encoding
     */
    /** {zh}
     * @brief 软编码
     */
    CodecMode[CodecMode["SoftwareMode"] = 2] = "SoftwareMode";
})(CodecMode = exports.CodecMode || (exports.CodecMode = {}));
/** {en}
 * @brief Auto
 */
/** {zh}
 * @brief 自动最高编码码率
 */
exports.SEND_KBPS_AUTO_CALCULATE = -1;
/** {en}
 * @brief Disable
 */
/** {zh}
 * @brief 不设置最高编码码率
 */
exports.SEND_KBPS_DISABLE_VIDEO_SEND = 0;
/** {en}
 * @brief  Data frame type
 */
/** {zh}
 * @brief 数据帧类型
 */
var DataFrameType;
(function (DataFrameType) {
    /** {en}
     * @brief SEI  video frame
     */
    /** {zh}
     * @brief SEI 视频帧
     */
    DataFrameType[DataFrameType["kDataFrameTypeSei"] = 0] = "kDataFrameTypeSei";
})(DataFrameType = exports.DataFrameType || (exports.DataFrameType = {}));
/** {en}
 * @brief Audio frame type
 */
/** {zh}
 * @brief 音频帧类型
 */
var AudioFrameType;
(function (AudioFrameType) {
    /** {en}
     * @brief PCM 16bit
     */
    /** {zh}
     * @brief PCM 16bit
     */
    AudioFrameType[AudioFrameType["kFrameTypePCM16"] = 0] = "kFrameTypePCM16";
})(AudioFrameType = exports.AudioFrameType || (exports.AudioFrameType = {}));
/** {zh}
 * @brief 音频声道。
 */
var AudioChannel;
(function (AudioChannel) {
    /** {zh}
     * @brief 自动声道，适用于从 SDK 获取音频数据，使用 SDK 内部处理的声道，不经过 resample。
     *        当你需要从 SDK 获取音频数据时，若对声道没有强依赖，建议设置成该值，可以通过避免 resample 带来一些性能优化。
     */
    AudioChannel[AudioChannel["kAudioChannelAuto"] = -1] = "kAudioChannelAuto";
    /** {zh}
     * @brief 单声道
     */
    AudioChannel[AudioChannel["kAudioChannelMono"] = 1] = "kAudioChannelMono";
    /** {zh}
     * @brief 双声道
     */
    AudioChannel[AudioChannel["kAudioChannelStereo"] = 2] = "kAudioChannelStereo";
})(AudioChannel = exports.AudioChannel || (exports.AudioChannel = {}));
/** {zh}
 * @brief 音频采样率，单位为 HZ。
 */
var AudioSampleRate;
(function (AudioSampleRate) {
    /** {zh}
     * @brief 自动采样率，适用于从 SDK 获取音频数据，使用 SDK 内部处理的采样率，不经过 resample。
     *        当你需要从 SDK 获取音频数据时，若对采样率没有强依赖，建议设置成该值，可以通过避免 resample 带来一些性能优化。
     */
    AudioSampleRate[AudioSampleRate["kAudioSampleRateAuto"] = -1] = "kAudioSampleRateAuto";
    /** {zh}
     * @brief 8000 Hz 采样率
     */
    AudioSampleRate[AudioSampleRate["kAudioSampleRate8000"] = 8000] = "kAudioSampleRate8000";
    /** {zh}
     * @brief 16000 Hz 采样率
     */
    AudioSampleRate[AudioSampleRate["kAudioSampleRate16000"] = 16000] = "kAudioSampleRate16000";
    /** {zh}
     * @brief 32000 Hz 采样率
     */
    AudioSampleRate[AudioSampleRate["kAudioSampleRate32000"] = 32000] = "kAudioSampleRate32000";
    /** {zh}
     * @brief 44100 Hz 采样率
     */
    AudioSampleRate[AudioSampleRate["kAudioSampleRate44100"] = 44100] = "kAudioSampleRate44100";
    /** {zh}
     * @brief 48000 Hz 采样率
     */
    AudioSampleRate[AudioSampleRate["kAudioSampleRate48000"] = 48000] = "kAudioSampleRate48000";
})(AudioSampleRate = exports.AudioSampleRate || (exports.AudioSampleRate = {}));
/** {en}
 * @brief SDK  Connection status with the signaling server.
 */
/** {zh}
 * @brief SDK 与信令服务器连接状态。
 */
var ConnectionState;
(function (ConnectionState) {
    /** {en}
     * @brief Disconnected for 12s, SDK will try to reconnect automatically.
     */
    /** {zh}
     * @brief 连接断开。
     */
    ConnectionState[ConnectionState["kConnectionStateDisconnected"] = 1] = "kConnectionStateDisconnected";
    /** {en}
     * @brief The first request to connect to the server. Connecting.
     */
    /** {zh}
     * @brief 首次连接，正在连接中。
     */
    ConnectionState[ConnectionState["kConnectionStateConnecting"] = 2] = "kConnectionStateConnecting";
    /** {en}
     * @brief The first connection was successful.
     */
    /** {zh}
     * @brief 涵盖了以下情况：
     * + 首次连接时，10秒连接不成功;
     * + 连接成功后，断连 10 秒。自动重连中。
     */
    ConnectionState[ConnectionState["kConnectionStateConnected"] = 3] = "kConnectionStateConnected";
    /** {en}
     * @brief The code includes the following status:
     * + The first connection is not successful for 10s.
     * + The connection has been lost for 10s. Auto reconnecting.
     */
    /** {zh}
     * @brief 涵盖了以下情况：
     * + 首次连接时，10秒连接不成功;
     * + 连接成功后，断连 10 秒。自动重连中。
     */
    ConnectionState[ConnectionState["kConnectionStateReconnecting"] = 4] = "kConnectionStateReconnecting";
    /** {en}
     * @brief Successful reconnection after disconnection.
     */
    /** {zh}
     * @brief 连接断开后重连成功。
     */
    ConnectionState[ConnectionState["kConnectionStateReconnected"] = 5] = "kConnectionStateReconnected";
    /** {en}
     * @brief In status `kConnectionStateDisconnected` for more than 10s without a successful reconnection. SDK will still continue to try to reconnect.
     */
    /** {zh}
     * @brief 处于 `kConnectionStateDisconnected` 状态超过 10 秒，且期间重连未成功。SDK 仍将继续尝试重连。
     */
    ConnectionState[ConnectionState["kConnectionStateLost"] = 6] = "kConnectionStateLost";
})(ConnectionState = exports.ConnectionState || (exports.ConnectionState = {}));
/** {en}
 * @brief Reason to leave the room
 */
/** {zh}
 * @brief 用户离线原因。
 *        房间内的远端用户离开房间时，本端用户会收到 [`onUserLeave`](85533#onuserleave) 回调通知，此枚举类型为回调的用户离线原因。
 */
var UserOfflineReasonType;
(function (UserOfflineReasonType) {
    /** {en}
     * @brief The remote client calls [leaveRoom](85532#leaveroom) to leave the room.
     */
    /** {zh}
     * @brief 远端用户调用 [leaveRoom](85532#leaveroom) 方法退出房间。
     */
    UserOfflineReasonType[UserOfflineReasonType["kUserOfflineReasonQuit"] = 0] = "kUserOfflineReasonQuit";
    /** {en}
     * @brief The remote client is disconnected because of poor network connection or expired Token.
     */
    /** {zh}
     * @brief 远端用户因网络等原因掉线。
     */
    UserOfflineReasonType[UserOfflineReasonType["kUserOfflineReasonDropped"] = 1] = "kUserOfflineReasonDropped";
    /** {en}
     * @brief The remote client calls [setUserVisibility](#setuservisibility) to turn invisible.
     */
    /** {zh}
     * @brief 远端用户切换至隐身状态。
     */
    UserOfflineReasonType[UserOfflineReasonType["kUserOfflineReasonSwitchToInvisible"] = 2] = "kUserOfflineReasonSwitchToInvisible";
    /** {en}
     * @brief The remote user has been removed from the room by the administrator via a OpenAPI call.
     */
    /** {zh}
     * @brief 远端用户被踢出出房间。
              因调用踢出用户的 OpenAPI，远端用户被踢出房间。
     */
    UserOfflineReasonType[UserOfflineReasonType["kUserOfflineReasonKickedByAdmin"] = 3] = "kUserOfflineReasonKickedByAdmin";
})(UserOfflineReasonType = exports.UserOfflineReasonType || (exports.UserOfflineReasonType = {}));
/** {zh}
 * @brief 媒体设备类型
 */
var MediaDeviceType;
(function (MediaDeviceType) {
    /** {zh}
     * @brief 音频渲染设备
     */
    MediaDeviceType[MediaDeviceType["kMediaDeviceTypeAudioRenderDevice"] = 0] = "kMediaDeviceTypeAudioRenderDevice";
    /** {zh}
     * @brief 音频采集设备
     */
    MediaDeviceType[MediaDeviceType["kMediaDeviceTypeAudioCaptureDevice"] = 1] = "kMediaDeviceTypeAudioCaptureDevice";
    /** {zh}
     *@hidden
     * @brief 视频渲染设备类型，该类型暂无使用
     */
    MediaDeviceType[MediaDeviceType["kMediaDeviceTypeVideoRenderDevice"] = 2] = "kMediaDeviceTypeVideoRenderDevice";
    /** {zh}
     * @brief 视频采集设备
     */
    MediaDeviceType[MediaDeviceType["kMediaDeviceTypeVideoCaptureDevice"] = 3] = "kMediaDeviceTypeVideoCaptureDevice";
})(MediaDeviceType = exports.MediaDeviceType || (exports.MediaDeviceType = {}));
/** {zh}
 * @brief 媒体设备事件类型
 */
var MediaDeviceNotification;
(function (MediaDeviceNotification) {
    /** {zh}
     * @brief 设备已就绪
     */
    MediaDeviceNotification[MediaDeviceNotification["kMediaDeviceNotificationActive"] = 1] = "kMediaDeviceNotificationActive";
    /** {zh}
     * @brief 设备被禁用
     */
    MediaDeviceNotification[MediaDeviceNotification["kMediaDeviceNotificationDisabled"] = 2] = "kMediaDeviceNotificationDisabled";
    /** {zh}
     * @brief 没有此设备
     */
    MediaDeviceNotification[MediaDeviceNotification["kMediaDeviceNotificationNotPresent"] = 4] = "kMediaDeviceNotificationNotPresent";
    /** {zh}
     * @brief 设备被拔出
     */
    MediaDeviceNotification[MediaDeviceNotification["kMediaDeviceNotificationUnplugged"] = 8] = "kMediaDeviceNotificationUnplugged";
})(MediaDeviceNotification = exports.MediaDeviceNotification || (exports.MediaDeviceNotification = {}));
/** {en}
 * @brief Type of the screen capture object
 */
/** {zh}
 * @brief 屏幕采集对象的类型
 */
var ScreenCaptureSourceType;
(function (ScreenCaptureSourceType) {
    /** {en}
     * @brief Type unknown
     */
    /** {zh}
     * @brief 类型未知
     */
    ScreenCaptureSourceType[ScreenCaptureSourceType["kScreenCaptureSourceTypeUnknown"] = 0] = "kScreenCaptureSourceTypeUnknown";
    /** {en}
     * @brief Application window
     */
    /** {zh}
     * @brief 应用程序的窗口
     */
    ScreenCaptureSourceType[ScreenCaptureSourceType["kScreenCaptureSourceTypeWindow"] = 1] = "kScreenCaptureSourceTypeWindow";
    /** {en}
     * @brief Desktop
     */
    /** {zh}
     * @brief 桌面
     */
    ScreenCaptureSourceType[ScreenCaptureSourceType["kScreenCaptureSourceTypeScreen"] = 2] = "kScreenCaptureSourceTypeScreen";
})(ScreenCaptureSourceType = exports.ScreenCaptureSourceType || (exports.ScreenCaptureSourceType = {}));
/** {en}
 * @brief Priority of the publisher. When a user encounters performance insufficiency of either the network or the device, the media stream  will fall back in the ascending order of `RemoteUserPriority`.
 */
/** {zh}
 * @brief 远端用户优先级，在性能不足需要回退时，会优先回退优先级低的用户的音视频流
 */
var RemoteUserPriority;
(function (RemoteUserPriority) {
    /** {en}
     * @brief Low, the default
     */
    /** {zh}
     * @brief 用户优先级为低（默认值）
     */
    RemoteUserPriority[RemoteUserPriority["kRemoteUserPriorityLow"] = 0] = "kRemoteUserPriorityLow";
    /** {en}
     * @brief Medium
     */
    /** {zh}
     * @brief 用户优先级为正常
     */
    RemoteUserPriority[RemoteUserPriority["kRemoteUserPriorityMedium"] = 100] = "kRemoteUserPriorityMedium";
    /** {en}
     * @brief High
     */
    /** {zh}
     * @brief 用户优先级为高
     */
    RemoteUserPriority[RemoteUserPriority["kRemoteUserPriorityHigh"] = 200] = "kRemoteUserPriorityHigh";
})(RemoteUserPriority = exports.RemoteUserPriority || (exports.RemoteUserPriority = {}));
/** {en}
 * @brief Rendering mode
 */
/** {zh}
 * @brief 渲染模式
 */
var PublicStreamRenderMode;
(function (PublicStreamRenderMode) {
    /** {en}
     * @brief Fill and Crop.
     *        The video frame is scaled with fixed aspect ratio, and completely fills the canvas. The region of the video exceeding the canvas will be cropped.
     */
    /** {zh}
     * @brief 视窗填满优先。
     *        视频帧等比缩放，直至视窗被视频填满。如果视频帧长宽比例与视窗不同，视频帧的多出部分将无法显示。
     *        缩放完成后，视频帧的一边长和视窗的对应边长一致，另一边长大于等于视窗对应边长。
     */
    PublicStreamRenderMode[PublicStreamRenderMode["kRenderModeHidden"] = 1] = "kRenderModeHidden";
    /** {en}
     * @brief Fit.
     *        The video frame is scaled with fixed aspect ratio, and is shown completely in the canvas. The region of the canvas not filled with video frame, is filled with `background`.
     */
    /** {zh}
     * @brief 视频帧内容全部显示优先。
     *        视频帧等比缩放，直至视频帧能够在视窗上全部显示。如果视频帧长宽比例与视窗不同，视窗上未被视频帧填满区域将被涂黑。
     *        缩放完成后，视频帧的一边长和视窗的对应边长一致，另一边长小于等于视窗对应边长。
     */
    PublicStreamRenderMode[PublicStreamRenderMode["kRenderModeFit"] = 2] = "kRenderModeFit";
    /** {en}
     *  @brief Fill the canvas.
     *         The video frame is scaled to fill the canvas. During the process, the aspect ratio may change.
     */
    /** {zh}
     *  @brief 视频帧自适应画布
     *         视频帧非等比缩放，直至画布被填满。在此过程中，视频帧的长宽比例可能会发生变化。
     */
    PublicStreamRenderMode[PublicStreamRenderMode["kRenderModeFill"] = 3] = "kRenderModeFill";
})(PublicStreamRenderMode = exports.PublicStreamRenderMode || (exports.PublicStreamRenderMode = {}));
/** {en}
 * @hidden
 * @brief State and errors for publishing or subscribing public streams
 */
/** {zh}
 * @detail 85534
 * @brief 公共流状态码
 */
var PublicStreamErrorCode;
(function (PublicStreamErrorCode) {
    /** {en}
     * @brief Published or subscribed successfully.
     */
    /** {zh}
     * @brief 发布或订阅成功。
     */
    PublicStreamErrorCode[PublicStreamErrorCode["kPublicStreamErrorCodeOK"] = 0] = "kPublicStreamErrorCodeOK";
    /** {en}
     * @brief Invalid parameter(s). Please revise the parameter(s) and retry.
     */
    /** {zh}
     * @brief 公共流的参数异常，请修改参数后重试。
     */
    PublicStreamErrorCode[PublicStreamErrorCode["kPublicStreamErrorCodePushInvalidParam"] = 1191] = "kPublicStreamErrorCodePushInvalidParam";
    /** {en}
     * @brief Error for the task at the server side. The server will retry upon the failure.
     */
    /** {zh}
     * @brief 服务端状态异常，将自动重试。
     */
    PublicStreamErrorCode[PublicStreamErrorCode["kPublicStreamErrorCodePushInvalidStatus"] = 1192] = "kPublicStreamErrorCodePushInvalidStatus";
    /** {en}
     * @brief Unrecoverable error of publishing the public stream. Please start the task again.
     */
    /** {zh}
     * @brief 内部错误，不可恢复，请重试。
     */
    PublicStreamErrorCode[PublicStreamErrorCode["kPublicStreamErrorCodePushInternalError"] = 1193] = "kPublicStreamErrorCodePushInternalError";
    /** {en}
     * @brief Failed to publish. The SDK will retry upon the failure. We recommend to keep listening to the publishing result.
     */
    /** {zh}
     * @brief 发布失败，将自动重试，请关注重试结果。
     */
    PublicStreamErrorCode[PublicStreamErrorCode["kPublicStreamErrorCodePushFailed"] = 1195] = "kPublicStreamErrorCodePushFailed";
    /** {en}
     * @brief Failed to publish the public stream for time-out error. The SDK will retry 10 s after the timeout. The maximum number of retry attempts is 3.
     */
    /** {zh}
     * @brief 发布失败，10 s 后会重试，重试 3 次后自动停止。
     */
    PublicStreamErrorCode[PublicStreamErrorCode["kPublicStreamErrorCodePushTimeout"] = 1196] = "kPublicStreamErrorCodePushTimeout";
    /** {en}
     * @brief Failed to play a public stream because the publisher has not started publishing.
     */
    /** {zh}
     * @brief 订阅失败，发布端未开始发布流。
     */
    PublicStreamErrorCode[PublicStreamErrorCode["kPublicStreamErrorCodePullNoPushStream"] = 1300] = "kPublicStreamErrorCodePullNoPushStream";
})(PublicStreamErrorCode = exports.PublicStreamErrorCode || (exports.PublicStreamErrorCode = {}));
/** {en}
 * @hidden
 * @brief Layout mode of the public stream
 */
/** {zh}
 * @brief 公共流的布局模式
 */
var StreamLayoutMode;
(function (StreamLayoutMode) {
    /** {en}
     * @brief auto mode
     */
    /** {zh}
     * @brief 自动布局
     */
    StreamLayoutMode[StreamLayoutMode["kLayoutAutoMode"] = 0] = "kLayoutAutoMode";
    /** {en}
     * @brief Customer mode
     */
    /** {zh}
     * @brief 自定义
     */
    StreamLayoutMode[StreamLayoutMode["kLayoutCustomerMode"] = 2] = "kLayoutCustomerMode";
})(StreamLayoutMode = exports.StreamLayoutMode || (exports.StreamLayoutMode = {}));
/** {en}
 * @brief Stream mixing region type
 */
/** {zh}
 * @brief 合流布局区域类型
 */
var TranscoderLayoutRegionType;
(function (TranscoderLayoutRegionType) {
    /** {en}
     * @brief The region type is a video stream.
     */
    /** {zh}
     * @brief 合流布局区域类型为视频。
     */
    TranscoderLayoutRegionType[TranscoderLayoutRegionType["kLayoutRegionTypeVideoStream"] = 0] = "kLayoutRegionTypeVideoStream";
    /** {en}
     * @brief The region type is an image.
     */
    /** {zh}
     * @brief 合流布局区域类型为图片。
     */
    TranscoderLayoutRegionType[TranscoderLayoutRegionType["kLayoutRegionTypeImage"] = 1] = "kLayoutRegionTypeImage";
})(TranscoderLayoutRegionType = exports.TranscoderLayoutRegionType || (exports.TranscoderLayoutRegionType = {}));
/** {en}
 * @brief Types of streams to be mixed
 */
/** {zh}
 * @brief 合流输出内容类型
 */
var TranscoderContentControlType;
(function (TranscoderContentControlType) {
    /** {en}
     * @brief Audio and video
     */
    /** {zh}
     * @brief 音视频
     */
    TranscoderContentControlType[TranscoderContentControlType["kHasAudioAndVideo"] = 0] = "kHasAudioAndVideo";
    /** {en}
     * @brief Audio only
     */
    /** {zh}
     * @brief 音频
     */
    TranscoderContentControlType[TranscoderContentControlType["kHasAudioOnly"] = 1] = "kHasAudioOnly";
    /** {en}
     * @brief Video only
     */
    /** {zh}
     * @brief 视频
     */
    TranscoderContentControlType[TranscoderContentControlType["kHasVideoOnly"] = 2] = "kHasVideoOnly";
})(TranscoderContentControlType = exports.TranscoderContentControlType || (exports.TranscoderContentControlType = {}));
/** {en}
 * @brief Video encoding format
 */
/** {zh}
 * @brief 转推直播视频编码参数
 */
var TranscoderVideoCodecProfile;
(function (TranscoderVideoCodecProfile) {
    /** {en}
     * @brief H264 baseline profile
     */
    /** {zh}
     * @brief H264 格式基本规格编码
     */
    TranscoderVideoCodecProfile[TranscoderVideoCodecProfile["kByteH264ProfileBaseline"] = 0] = "kByteH264ProfileBaseline";
    /** {en}
     * @brief H264 main profile
     */
    /** {zh}
     * @brief H264 格式主流规格编码
     */
    TranscoderVideoCodecProfile[TranscoderVideoCodecProfile["kByteH264ProfileMain"] = 1] = "kByteH264ProfileMain";
    /** {en}
     * @brief H264 high profile
     */
    /** {zh}
     * @brief H264 格式高规格编码
     */
    TranscoderVideoCodecProfile[TranscoderVideoCodecProfile["kByteH264ProfileHigh"] = 2] = "kByteH264ProfileHigh";
    /** {en}
     * @brief Custom baseline profile
     */
    /** {zh}
     * @brief ByteVC1 格式基本规格编码
     */
    TranscoderVideoCodecProfile[TranscoderVideoCodecProfile["kByteVC1ProfileBaseline"] = 3] = "kByteVC1ProfileBaseline";
    /** {en}
     * @brief Custom main profile
     */
    /** {zh}
     * @brief ByteVC1 格式主流规格编码
     */
    TranscoderVideoCodecProfile[TranscoderVideoCodecProfile["kByteVC1ProfileMain"] = 4] = "kByteVC1ProfileMain";
    /** {en}
     * @brief Custom high profile
     */
    /** {zh}
     * @brief ByteVC1 格式高规格编码
     */
    TranscoderVideoCodecProfile[TranscoderVideoCodecProfile["kByteVC1ProfileHigh"] = 5] = "kByteVC1ProfileHigh";
})(TranscoderVideoCodecProfile = exports.TranscoderVideoCodecProfile || (exports.TranscoderVideoCodecProfile = {}));
/** {en}
 * @brief The video codec.
 */
/** {zh}
 * @brief 视频编码格式。
 */
var TranscoderVideoCodecType;
(function (TranscoderVideoCodecType) {
    /** {en}
     * @brief (Default) H.264 format.
     */
    /** {zh}
     * @brief H.264 格式，默认值。
     */
    TranscoderVideoCodecType[TranscoderVideoCodecType["kTranscodeVideoCodecH264"] = 0] = "kTranscodeVideoCodecH264";
    /** {en}
     * @brief ByteVC1 format.
     */
    /** {zh}
     * @brief ByteVC1 格式。
     */
    TranscoderVideoCodecType[TranscoderVideoCodecType["kTranscodeVideoCodecH265"] = 1] = "kTranscodeVideoCodecH265";
})(TranscoderVideoCodecType = exports.TranscoderVideoCodecType || (exports.TranscoderVideoCodecType = {}));
/** {en}
 * @brief AAC profile. Defaults to `0`.
 */
/** {zh}
 * @brief 转推直播音频编码 AAC 等级
 */
var TranscoderAudioCodecProfile;
(function (TranscoderAudioCodecProfile) {
    /** {en}
     * @brief Low-Complexity profile (AAC-LC)
     */
    /** {zh}
     * @brief AAC-LC
     */
    TranscoderAudioCodecProfile[TranscoderAudioCodecProfile["kByteAACProfileLC"] = 0] = "kByteAACProfileLC";
    /** {en}
     * @brief HE-AAC profile (AAC LC with SBR)
     */
    /** {zh}
     * @brief HE-AAC v1
     */
    TranscoderAudioCodecProfile[TranscoderAudioCodecProfile["kByteAACProfileHEv1"] = 1] = "kByteAACProfileHEv1";
    /** {en}
     * @brief HE-AAC v2 profile (AAC LC with SBR and Parametric Stereo)
     */
    /** {zh}
     * @brief HE-AAC v2
     */
    TranscoderAudioCodecProfile[TranscoderAudioCodecProfile["kByteAACProfileHEv2"] = 2] = "kByteAACProfileHEv2";
})(TranscoderAudioCodecProfile = exports.TranscoderAudioCodecProfile || (exports.TranscoderAudioCodecProfile = {}));
var TranscoderAudioCodecType;
(function (TranscoderAudioCodecType) {
    /**
     * @brief AAC 格式。
     */
    TranscoderAudioCodecType[TranscoderAudioCodecType["kTranscodeAudioCodecAAC"] = 0] = "kTranscodeAudioCodecAAC";
})(TranscoderAudioCodecType = exports.TranscoderAudioCodecType || (exports.TranscoderAudioCodecType = {}));
/** {en}
 * @brief Video rendering scale mode
 */
/** {zh}
 * @brief 转推直播视频渲染模式
 */
var TranscoderRenderMode;
(function (TranscoderRenderMode) {
    /**
     * @hidden
     */
    TranscoderRenderMode[TranscoderRenderMode["kRenderUnknown"] = 0] = "kRenderUnknown";
    /** {en}
     * @brief Fill and Crop.
     *        The video frame is scaled with fixed aspect ratio, until it completely fills the canvas. The region of the video exceeding the canvas will be cropped.
     */
    /** {zh}
     * @brief 视频尺寸等比缩放，优先保证窗口被填满。当视频尺寸与显示窗口尺寸不一致时，多出的视频将被截掉。
     */
    TranscoderRenderMode[TranscoderRenderMode["kRenderHidden"] = 1] = "kRenderHidden";
    /** {en}
     * @brief Fit.
     *        The video frame is scaled with fixed aspect ratio, until it fits just within the canvas. Other part of the canvas is filled with the background color.
     */
    /** {zh}
     * @brief
     * 视频尺寸等比缩放，优先保证视频内容全部显示。当视频尺寸与显示窗口尺寸不一致时，会把窗口未被填满的区域填充成黑色。
     */
    TranscoderRenderMode[TranscoderRenderMode["kRenderFit"] = 2] = "kRenderFit";
    /** {en}
     * @brief Fill the canvas.
     *        The video frame is scaled to fill the canvas. During the process, the aspect ratio may change.
     */
    /** {zh}
     * @brief 视频尺寸非等比例缩放，把窗口充满。当视频尺寸与显示窗口尺寸不一致时，视频高或宽方向会被拉伸。
     */
    TranscoderRenderMode[TranscoderRenderMode["kRenderAdaptive"] = 3] = "kRenderAdaptive";
})(TranscoderRenderMode = exports.TranscoderRenderMode || (exports.TranscoderRenderMode = {}));
/** {en}
 * @brief Media streaming network quality.
 */
/** {zh}
 * @brief 媒体流网络质量。
 */
var NetworkQuality;
(function (NetworkQuality) {
    /** {en}
     * @brief Network quality unknown.
     */
    /** {zh}
     * @brief 网络质量未知。
     */
    NetworkQuality[NetworkQuality["kNetworkQualityUnknown"] = 0] = "kNetworkQualityUnknown";
    /** {en}
     * @brief The network quality is excellent.
     */
    /** {zh}
     * @brief 网络质量极好。
     */
    NetworkQuality[NetworkQuality["kNetworkQualityExcellent"] = 1] = "kNetworkQualityExcellent";
    /** {en}
     * @brief The subjective feeling is similar to kNetworkQualityExcellent, but the bit rate may be slightly lower.
     */
    /** {zh}
     * @brief 主观感觉和 kNetworkQualityExcellent 差不多，但码率可能略低。
     */
    NetworkQuality[NetworkQuality["kNetworkQualityGood"] = 2] = "kNetworkQualityGood";
    /** {en}
     * @brief Subjective feelings are flawed but do not affect communication.
     */
    /** {zh}
     * @brief 主观感受有瑕疵但不影响沟通。
     */
    NetworkQuality[NetworkQuality["kNetworkQualityPoor"] = 3] = "kNetworkQualityPoor";
    /** {en}
     * @brief Can barely communicate but not smoothly.
     */
    /** {zh}
     * @brief 勉强能沟通但不顺畅。
     */
    NetworkQuality[NetworkQuality["kNetworkQualityBad"] = 4] = "kNetworkQualityBad";
    /** {en}
     * @brief The quality of the network is very poor and communication is basically impossible.
     */
    /** {zh}
     * @brief 网络质量非常差，基本不能沟通。
     */
    NetworkQuality[NetworkQuality["kNetworkQualityVbad"] = 5] = "kNetworkQualityVbad";
})(NetworkQuality = exports.NetworkQuality || (exports.NetworkQuality = {}));
/** {en}
 * @detail 85534
 * @brief Result of sending messages and the reason of failure if it fails.
 */
/** {zh}
 * @detail 85534
 * @brief 发送用户消息或者房间消息的结果
 */
var MessageSendResultCode;
(function (MessageSendResultCode) {
    /** {en}
     * @brief The P2P message has been sent successfully.
     */
    /** {zh}
     * @brief 用户 P2P 消息发送成功
     */
    MessageSendResultCode[MessageSendResultCode["MESSAGE_CODE_SUCCESS"] = 0] = "MESSAGE_CODE_SUCCESS";
    /** {en}
     * @brief The room-wide broadcasting message has been sent successfully.
     */
    /** {zh}
     * @brief 房间 Broadcast 消息发送成功
     */
    MessageSendResultCode[MessageSendResultCode["MESSAGE_CODE_ROOM_SUCCESS"] = 200] = "MESSAGE_CODE_ROOM_SUCCESS";
    /** {en}
     * @brief Failure. Sending timeout.
     */
    /** {zh}
     * @brief 发送超时，没有发送
     */
    MessageSendResultCode[MessageSendResultCode["MESSAGE_CODE_ERROR_TIMEOUT"] = 1] = "MESSAGE_CODE_ERROR_TIMEOUT";
    /** {en}
     * @brief Failure. Channel disconnected.
     */
    /** {zh}
     * @brief 通道断开，没有发送
     */
    MessageSendResultCode[MessageSendResultCode["MESSAGE_CODE_ERROR_BROKEN"] = 2] = "MESSAGE_CODE_ERROR_BROKEN";
    /** {en}
     * @brief Failure. Recipient not found.
     */
    /** {zh}
     * @brief 找不到接收方
     */
    MessageSendResultCode[MessageSendResultCode["MESSAGE_CODE_ERROR_NOT_RECEIVER"] = 3] = "MESSAGE_CODE_ERROR_NOT_RECEIVER";
    /** {en}
     * @brief Failure. The sender of the message did not join the room
     */
    /** {zh}
     * @brief 消息发送方没有加入房间
     */
    MessageSendResultCode[MessageSendResultCode["MESSAGE_CODE_ERROR_NOT_JOIN"] = 100] = "MESSAGE_CODE_ERROR_NOT_JOIN";
    /** {en}
     * @brief Failure. No data transmission channel connection available
     */
    /** {zh}
     * @brief 没有可用的数据传输通道连接
     */
    MessageSendResultCode[MessageSendResultCode["MESSAGE_CODE_ERROR_NO_CONNECTION"] = 102] = "MESSAGE_CODE_ERROR_NO_CONNECTION";
    /** {en}
     * @brief Failure. Message exceeds the range of the permitted size, 64 KB.
     */
    /** {zh}
     * @brief 消息超过最大长度，当前为64KB
     */
    MessageSendResultCode[MessageSendResultCode["MESSAGE_CODE_ERROR_EXCEED_MAX_LENGTH"] = 103] = "MESSAGE_CODE_ERROR_EXCEED_MAX_LENGTH";
    /** {en}
     * @brief Failure. The id of the recipient is empty
     */
    /** {zh}
     * @brief 接收消息的单个用户 id 为空
     */
    MessageSendResultCode[MessageSendResultCode["MESSAGE_CODE_ERROR_EMPTY_USER"] = 104] = "MESSAGE_CODE_ERROR_EMPTY_USER";
    /** {en}
     * @brief Failure. Unknown error
     */
    /** {zh}
     * @brief 未知错误
     */
    MessageSendResultCode[MessageSendResultCode["MESSAGE_CODE_ERROR_UNKNOWN"] = 1000] = "MESSAGE_CODE_ERROR_UNKNOWN";
})(MessageSendResultCode = exports.MessageSendResultCode || (exports.MessageSendResultCode = {}));
/** {en}
 * @brief Audio mix file playback status.
 */
/** {zh}
 * @brief 音频混音文件播放状态。
 */
var AudioMixingState;
(function (AudioMixingState) {
    /** {en}
     * @brief Mix loaded
     */
    /** {zh}
     * @brief 混音已加载
     */
    AudioMixingState[AudioMixingState["kAudioMixingStatePreloaded"] = 0] = "kAudioMixingStatePreloaded";
    /** {en}
     * @brief Mix is playing
     */
    /** {zh}
     * @brief 混音正在播放
     */
    AudioMixingState[AudioMixingState["kAudioMixingStatePlaying"] = 1] = "kAudioMixingStatePlaying";
    /** {en}
     * @brief Mix Pause
     */
    /** {zh}
     * @brief 混音暂停
     */
    AudioMixingState[AudioMixingState["kAudioMixingStatePaused"] = 2] = "kAudioMixingStatePaused";
    /** {en}
     * @brief Mixing stopped
     */
    /** {zh}
     * @brief 混音停止
     */
    AudioMixingState[AudioMixingState["kAudioMixingStateStopped"] = 3] = "kAudioMixingStateStopped";
    /** {en}
     * @brief Mix playback failed
     */
    /** {zh}
     * @brief 混音播放失败
     */
    AudioMixingState[AudioMixingState["kAudioMixingStateFailed"] = 4] = "kAudioMixingStateFailed";
    /** {en}
     * @brief End of mixing
     */
    /** {zh}
     * @brief 混音播放结束
     */
    AudioMixingState[AudioMixingState["kAudioMixingStateFinished"] = 5] = "kAudioMixingStateFinished";
})(AudioMixingState = exports.AudioMixingState || (exports.AudioMixingState = {}));
/** {en}
 * @detail 85534
 * @brief Error code for audio mixing
 */
/** {zh}
 * @detail 85534
 * @brief 音频混音文件播放错误码。
 */
var AudioMixingError;
(function (AudioMixingError) {
    /** {en}
     * @brief OK
     */
    /** {zh}
     * @brief 正常
     */
    AudioMixingError[AudioMixingError["kAudioMixingErrorOk"] = 0] = "kAudioMixingErrorOk";
    /** {en}
     * @brief Preload failed. Invalid path or the length exceeds 20s.
     */
    /** {zh}
     * @brief 预加载失败，找不到混音文件或者文件长度超出 20s
     */
    AudioMixingError[AudioMixingError["kAudioMixingErrorPreloadFailed"] = 1] = "kAudioMixingErrorPreloadFailed";
    /** {en}
     * @brief Mixing failed. Invalid path or fail to open the file.
     */
    /** {zh}
     * @brief 混音开启失败，找不到混音文件或者混音文件打开失败
     */
    AudioMixingError[AudioMixingError["kAudioMixingErrorStartFailed"] = 2] = "kAudioMixingErrorStartFailed";
    /** {en}
     * @brief Invalid mixID
     */
    /** {zh}
     * @brief 混音 ID 异常
     */
    AudioMixingError[AudioMixingError["kAudioMixingErrorIdNotFound"] = 3] = "kAudioMixingErrorIdNotFound";
    /** {en}
     * @brief Invalid position
     */
    /** {zh}
     * @brief 设置混音文件的播放位置出错
     */
    AudioMixingError[AudioMixingError["kAudioMixingErrorSetPositionFailed"] = 4] = "kAudioMixingErrorSetPositionFailed";
    /** {en}
     * @brief Invalid volume. The range is [0, 400].
     */
    /** {zh}
     * @brief 音量参数不合法，仅支持设置的音量值为[0, 400]
     */
    AudioMixingError[AudioMixingError["kAudioMixingErrorInValidVolume"] = 5] = "kAudioMixingErrorInValidVolume";
    /** {en}
     * @brief Another file was preloaded for mixing. Call [unloadAudioMixing](#unloadaudiomixing) first.
     */
    /** {zh}
     * @brief 播放的文件与预加载的文件不一致，请先使用 [unloadAudioMixing](85532#unloadaudiomixing) 卸载文件
     */
    AudioMixingError[AudioMixingError["kAudioMixingErrorLoadConflict"] = 6] = "kAudioMixingErrorLoadConflict";
    /** {en}
     * @brief Do not support the mix type.
     */
    /** {zh}
     * @brief 不支持此混音类型。
     */
    AudioMixingError[AudioMixingError["kAudioMixingErrorIdTypeNotMatch"] = 7] = "kAudioMixingErrorIdTypeNotMatch";
    /** {en}
     * @brief Invalid pitch value.
     */
    /** {zh}
     * @brief 设置混音文件的音调不合法
     */
    AudioMixingError[AudioMixingError["kAudioMixingErrorInValidPitch"] = 8] = "kAudioMixingErrorInValidPitch";
    /** {en}
     * @brief Invalid audio track.
     */
    /** {zh}
     * @brief 设置混音文件的音轨不合法
     */
    AudioMixingError[AudioMixingError["kAudioMixingErrorInValidAudioTrack"] = 9] = "kAudioMixingErrorInValidAudioTrack";
    /** {en}
     * @brief Mixing starting
     */
    /** {zh}
     * @brief 混音文件正在启动中
     */
    AudioMixingError[AudioMixingError["kAudioMixingErrorIsStarting"] = 10] = "kAudioMixingErrorIsStarting";
    /** {en}
     * @brief Invalid playback speed
     */
    /** {zh}
     * @brief 设置混音文件的播放速度不合法
     */
    AudioMixingError[AudioMixingError["kAudioMixingErrorInValidPlaybackSpeed"] = 11] = "kAudioMixingErrorInValidPlaybackSpeed";
})(AudioMixingError = exports.AudioMixingError || (exports.AudioMixingError = {}));
/** {en}
 * @detail 85534
 * @brief Callback warning code. The warning code indicates that there is a problem within the SDK and is trying to recover. Warning codes only serve as notifications.
 */
/** {zh}
 * @detail 85534
 * @brief 回调警告码。警告码说明 SDK 内部遇到问题正在尝试恢复。警告码仅起通知作用。
 */
var WarningCode;
(function (WarningCode) {
    /** {en}
     * @brief Failed to enter the room.
     *        When you call the first time to join the room or disconnect and reconnect due to poor network conditions, the room entry fails due to a server error. The SDK automatically retries the room.
     */
    /** {zh}
     * @brief 进房失败。
     *        当你调用初次加入房间或者由于网络状况不佳断网重连时，由于服务器错误导致进房失败。SDK 会自动重试进房。
     */
    WarningCode[WarningCode["kWarningCodeJoinRoomFailed"] = -2001] = "kWarningCodeJoinRoomFailed";
    /** {en}
     * @brief Release audio & video stream failed.
     *        When you publish audio & video streams in your room, the publication fails due to a server error. The SDK automatically retries the release.
     */
    /** {zh}
     * @brief 发布音视频流失败。
     *        当你在所在房间中发布音视频流时，由于服务器错误导致发布失败。SDK 会自动重试发布。
     */
    WarningCode[WarningCode["kWarningCodePublishStreamFailed"] = -2002] = "kWarningCodePublishStreamFailed";
    /** {en}
     * @brief Subscription to audio & video stream failed.
     *         The subscription failed because the audio & video stream for the subscription could not be found in the current room. The SDK will automatically retry the subscription. If the subscription fails, it is recommended that you exit the retry.
     */
    /** {zh}
     * @brief 订阅音视频流失败。
     *        当前房间中找不到订阅的音视频流导致订阅失败。SDK 会自动重试订阅，若仍订阅失败则建议你退出重试。
     */
    WarningCode[WarningCode["kWarningCodeSubscribeStreamFailed404"] = -2003] = "kWarningCodeSubscribeStreamFailed404";
    /** {en}
     * @brief Subscription to audio & video stream failed.
     *        When you subscribe to audio & video streams in your room, the subscription fails due to a server error. The SDK automatically retries the subscription.
     */
    /** {zh}
     * @brief 订阅音视频流失败。
     *        当你订阅所在房间中的音视频流时，由于服务器错误导致订阅失败。SDK 会自动重试订阅。
     */
    WarningCode[WarningCode["kWarningCodeSubscribeStreamFailed5xx"] = -2004] = "kWarningCodeSubscribeStreamFailed5xx";
    /** {en}
     * @brief This warning is triggered when you call `setUserVisibility` to set yourself unvisible to others and then try to publish the flow.
     */
    /** {zh}
     * @brief 当调用 [setUserVisibility](85532#setuservisibility) 将自身可见性设置为 false 后，再尝试发布流会触发此警告。
     */
    WarningCode[WarningCode["kWarningCodePublishStreamForbiden"] = -2009] = "kWarningCodePublishStreamForbiden";
    /** {en}
     * @brief Sending a custom broadcast message failed, you are not currently in the room.
     */
    /** {zh}
     * @brief 发送自定义广播消息失败，当前你未在房间中。
     */
    WarningCode[WarningCode["kWarningCodeSendCustomMessage"] = -2011] = "kWarningCodeSendCustomMessage";
    /** {en}
     * @brief When the number of people in the room exceeds 500, stop sending `onUserJoined` and `onUserLeave` callbacks to existing users in the room, and prompt all users in the room via broadcast.
     */
    /** {zh}
     * @brief 当房间内人数超过 500 人时，停止向房间内已有用户发送 [onUserJoined](85533#onuserjoined) 和 [onUserLeave](85533#onuserleave) 回调，并通过广播提示房间内所有用户。
     */
    WarningCode[WarningCode["kWarningCodeUserNotifyStop"] = -2013] = "kWarningCodeUserNotifyStop";
    /** {en}
     * @brief user had published in other room or had published public stream.
     */
    /** {zh}
     * @brief 用户已经在其他房间发布过流，或者用户正在发布公共流。
     */
    WarningCode[WarningCode["kWarningCodeUserInPublish"] = -2014] = "kWarningCodeUserInPublish";
    /** {en}
     * @brief user had published in other room or had published public stream.
     */
    /** {zh}
     * @brief 新生成的房间已经替换了同样roomId的旧房间
     */
    WarningCode[WarningCode["kWarningCodeOldRoomBeenReplaced"] = -2016] = "kWarningCodeOldRoomBeenReplaced";
    /** {en}
     * @brief The old room has been replaced by new room with the same roomId
     */
    /** {zh}
     * @brief 当前正在进行回路测试，该接口调用无效
     */
    WarningCode[WarningCode["kWarningCodeInEchoTestMode"] = -2017] = "kWarningCodeInEchoTestMode";
    /** {en}
     * @brief The camera permission is abnormal, and the current application does not obtain the camera permission.
     */
    /** {zh}
     * @brief 摄像头权限异常，当前应用没有获取摄像头权限。
     */
    WarningCode[WarningCode["kWarningCodeNoCameraPermission"] = -5001] = "kWarningCodeNoCameraPermission";
    /** {en}
     * @hidden
     * @brief Setting the screen audio capture type with `setScreenAudioSourceType` after calling `publishScreen` is not supported, please set before `publishScreen`.
     */
    /** {zh}
     * @hidden
     * @brief 不支持在 [publishScreen](85532#publishscreen) 之后设置屏幕音频采集类型
     *        setScreenAudioSourceType，请在 [publishScreen](85532#publishscreen)  之前设置
     */
    WarningCode[WarningCode["kWarningCodeSetScreenAudioSourceTypeFailed"] = -5009] = "kWarningCodeSetScreenAudioSourceTypeFailed";
    /** {en}
     * @brief Setting the audio capture method for screen sharing via `setScreenAudioStreamIndex` after calling `publishScreen` is not supported.
     */
    /** {zh}
     * @brief 不支持在 [publishScreen](85532#publishscreen) 之后，
     *        通过 [setScreenAudioStreamIndex](85532#setscreenaudiostreamindex) 设置屏幕共享时的音频采集方式。
     */
    WarningCode[WarningCode["kWarningCodeSetScreenAudioStreamIndexFailed"] = -5010] = "kWarningCodeSetScreenAudioStreamIndexFailed";
    /** {en}
     * @brief Invalid pitch value setting
     */
    /** {zh}
     * @brief 设置语音音高不合法
     */
    WarningCode[WarningCode["kWarningCodeInvalidVoicePitch"] = -5011] = "kWarningCodeInvalidVoicePitch";
    /** {en}
     * @brief Invalid audio format setting
     */
    /** {zh}
     * @brief 设置音频格式不合法
     */
    WarningCode[WarningCode["kWarningCodeInvalidAudioFormat"] = -5012] = "kWarningCodeInvalidAudioFormat";
    /** {en}
     * @brief Mixed use of old and new interfaces for external audio sources
     */
    /** {zh}
     * @brief 外部音频源新旧接口混用
     */
    WarningCode[WarningCode["kWarningCodeInvalidCallForExtAudio"] = -5013] = "kWarningCodeInvalidCallForExtAudio";
    /** {en}
     * @brief The specified internal rendering canvas handle is invalid.
     *        This callback is triggered when you specify an invalid canvas handle when you call [setupLocalVideo(85532#setuplocalvideo) or [setupRemoteVideo](85532#setupremotevideo).
     */
    /** {zh}
     * @brief 指定的内部渲染画布句柄无效。   当你调用 [setupLocalVideo(85532#setuplocalvideo) 或 [setupRemoteVideo](85532#setupremotevideo) 时指定了无效的画布句柄，触发此回调。
     */
    WarningCode[WarningCode["kWarningCodeInvalidCanvasHandle"] = -6001] = "kWarningCodeInvalidCanvasHandle";
    /** {en}
     * @brief The authentication file is invalid. When checking the status of the authentication file, if the local file is inconsistent with the remote file, a
     *        second warning will be triggered.
     */
    /** {zh}
     * @brief 鉴权文件失效，当检查鉴权文件状态时，本地文件与远端文件不一致会触发次警告。
     */
    WarningCode[WarningCode["kWarningLicenseFileExpired"] = -7001] = "kWarningLicenseFileExpired";
    /**
     * @brief [音频技术](https://www.volcengine.com/docs/6489/71986) SDK 鉴权失效。联系技术支持人员。
     */
    WarningCode[WarningCode["kWarningInvaildSamiAppkeyORToken"] = -7002] = "kWarningInvaildSamiAppkeyORToken";
    /**
     * @brief [音频技术](https://www.volcengine.com/docs/6489/71986) 资源加载失败。传入正确的 DAT 路径，或联系技术支持人员。
     */
    WarningCode[WarningCode["kWarningInvaildSamiResourcePath"] = -7003] = "kWarningInvaildSamiResourcePath";
    /**
     * @brief [音频技术](https://www.volcengine.com/docs/6489/71986) 库加载失败。使用正确的库，或联系技术支持人员。
     */
    WarningCode[WarningCode["kWarningLoadSamiLibraryFailed"] = -7004] = "kWarningLoadSamiLibraryFailed";
    /**
     * @brief [音频技术](https://www.volcengine.com/docs/6489/71986) 不支持此音效。联系技术支持人员。
     */
    WarningCode[WarningCode["kWarningInvaildSamiEffectType"] = -7005] = "kWarningInvaildSamiEffectType";
})(WarningCode = exports.WarningCode || (exports.WarningCode = {}));
/** {en}
 * @detail 85534
 * @brief Callback error code.
 *        When an unrecoverable error is encountered inside the SDK, the user is notified via the `onError` callback.
 */
/** {zh}
 * @detail 85534
 * @brief 回调错误码。  SDK 内部遇到不可恢复的错误时，会通过 [onError](85533#onerror) 回调通知用户。
 */
var ErrorCode;
(function (ErrorCode) {
    /** {en}
     * @brief Token  is invalid.
     *        The Token used when joining the room is invalid or expired. The user is required to retrieve the token and call the `updateToken` to update the token.
     */
    /** {zh}
     * @brief Token 无效。调用 [joinRoom](85532#joinroom) 方法时使用的 Token 无效或过期失效。需要用户重新获取 Token，并调用 [updateToken](85532#updatetoken) 方法更新 Token。
     */
    ErrorCode[ErrorCode["kErrorCodeInvalidToken"] = -1000] = "kErrorCodeInvalidToken";
    /** {en}
     * @brief Join room error.
     *        An unknown error occurred while joining the room, which caused the joining room to fail. Users are required to rejoin the room.
     */
    /** {zh}
     * @brief 加入房间错误。调用 [joinRoom](85532#joinroom) 方法时发生未知错误导致加入房间失败。需要用户重新加入房间。
     */
    ErrorCode[ErrorCode["kErrorCodeJoinRoom"] = -1001] = "kErrorCodeJoinRoom";
    /** {en}
     * @brief No permission to publish audio & video streams.
     *        The user failed to publish the audio & video stream in the room. The reason for the failure is that the user does not have permission to publish the stream.
     */
    /** {zh}
     * @brief 没有发布音视频流权限。用户在所在房间中发布音视频流失败，失败原因为用户没有发布流的权限。
     */
    ErrorCode[ErrorCode["kErrorCodeNoPublishPermission"] = -1002] = "kErrorCodeNoPublishPermission";
    /** {en}
     * @brief No subscription permissions for audio & video streams.
     *        The user failed to subscribe to the audio & video stream in the room where the user is located. The reason for the failure is that the user does not have permission to subscribe to the stream.
     */
    /** {zh}
     * @brief 没有订阅音视频流权限。用户订阅所在房间中的音视频流失败，失败原因为用户没有订阅流的权限。
     */
    ErrorCode[ErrorCode["kErrorCodeNoSubscribePermission"] = -1003] = "kErrorCodeNoSubscribePermission";
    /** {en}
     * @brief The user has been removed from the room because the same user joined the room on the other client.
     */
    /** {zh}
     * @brief 用户重复登录。本地用户所在房间中有相同用户 ID 的用户加入房间，导致本地用户被踢出房间。
     */
    ErrorCode[ErrorCode["kErrorCodeDuplicateLogin"] = -1004] = "kErrorCodeDuplicateLogin";
    /** {en}
     * @brief The user has been removed from the room by the administrator via a OpenAPI call.
     */
    /** {zh}
     * @brief 服务端调用 OpenAPI 将当前用户踢出房间
     */
    ErrorCode[ErrorCode["kErrorCodeKickedOut"] = -1006] = "kErrorCodeKickedOut";
    /** {en}
     * @brief When calling `createRTCRoom`, if the roomid is illegal, it will return null and throw the error
     */
    /** {zh}
     * @brief 当调用 createRTCRoom ，如果roomid 非法，会返回null，并抛出该error
     */
    ErrorCode[ErrorCode["kRoomErrorCodeRoomIdIllegal"] = -1007] = "kRoomErrorCodeRoomIdIllegal";
    /** {en}
     * @brief Token expired. Call `joinRoom` to rejoin with a valid Token.
     */
    /** {zh}
     * @brief Token 过期。调用 joinRoom 使用新的 Token 重新加入房间。
     */
    ErrorCode[ErrorCode["kRoomErrorTokenExpired"] = -1009] = "kRoomErrorTokenExpired";
    /** {en}
     * @brief The Token you provided when calling `updateToken` is invalid.
     */
    /** {zh}
     * @brief 调用 updateToken 传入的 Token 无效
     */
    ErrorCode[ErrorCode["kRoomErrorUpdateTokenWithInvalidToken"] = -1010] = "kRoomErrorUpdateTokenWithInvalidToken";
    /** {en}
     * @brief Users have been removed from the room because the administrator dismissed the room by calling OpenAPI.
     */
    /** {zh}
     * @brief 服务端调用 OpenAPI 解散房间，所有用户被移出房间。
     */
    ErrorCode[ErrorCode["kErrorCodeRoomDismiss"] = -1011] = "kErrorCodeRoomDismiss";
    /** {en}
     * @brief Join room error.
     *        The LICENSE billing account does not use the LICENSE_AUTHENTICATE SDK while entering the room, which caused the joining room to fail.
     */
    /** {zh}
     * @brief 加入房间错误。进房时, LICENSE 计费账号未使用 LICENSE_AUTHENTICATE SDK，加入房间错误。
     */
    ErrorCode[ErrorCode["kErrorCodeJoinRoomWithoutLicenseAuthenticateSDK"] = -1012] = "kErrorCodeJoinRoomWithoutLicenseAuthenticateSDK";
    /** {en}
     * @brief there is a room with the same roomId，whose room id is the same with echo test
     */
    /** {zh}
     * @brief 通话回路检测已经存在同样 roomId 的房间了
     */
    ErrorCode[ErrorCode["kErrorCodeRoomAlreadyExist"] = -1013] = "kErrorCodeRoomAlreadyExist";
    /** {en}
     * @brief Subscription to audio & video stream failed, the total number of subscribed audio & video streams exceeded the upper limit.
     *        In the game scenario, in order to ensure the performance and quality of audio & video calls, the server will limit the total number of audio & video streams subscribed by the user. When the total number of audio & video streams subscribed by the user has reached the maximum, continuing to subscribe to more streams will fail, and the user will receive this error notification.
     */
    /** {zh}
     * @brief 订阅音视频流失败，订阅音视频流总数超过上限。游戏场景下，为了保证音视频通话的性能和质量，服务器会限制用户订阅的音视频流总数。当用户订阅的音视频流总数已达上限时，继续订阅更多流时会失败，同时用户会收到此错误通知。
     */
    ErrorCode[ErrorCode["kErrorCodeOverStreamSubscribeLimit"] = -1070] = "kErrorCodeOverStreamSubscribeLimit";
    /** {en}
     * @brief Publishing flow failed, the total number of publishing flows exceeds the upper limit. The
     *        RTC system limits the total number of streams published in a single room, including video streams, audio streams, and screen streams. Local users will fail to publish streams to the room when the maximum number of published streams in the room has been reached, and will receive this error notification.
     */
    /** {zh}
     * @brief 发布流失败，发布流总数超过上限。 RTC 系统会限制单个房间内发布的总流数，总流数包括视频流、音频流和屏幕流。如果房间内发布流数已达上限时，本地用户再向房间中发布流时会失败，同时会收到此错误通知。
     */
    ErrorCode[ErrorCode["kErrorCodeOverStreamPublishLimit"] = -1080] = "kErrorCodeOverStreamPublishLimit";
    /** {en}
     * @hidden
     * @deprecated since 3.52, use kErrorCodeOverStreamPublishLimit instead.
     * @brief Publishing the screen stream failed, and the total number of publishing streams exceeded the upper limit. The
     *        RTC system limits the total number of streams published in a single room, including video streams, audio streams, and screen streams. Local users will fail to publish streams to the room when the maximum number of published streams in the room has been reached, and will receive this error notification.
     */
    /** {zh}
     * @hidden
     * @deprecated since 3.52, use kErrorCodeOverStreamPublishLimit instead.
     * @brief 发布屏幕流失败，发布流总数超过上限。RTC 系统会限制单个房间内发布的总流数，总流数包括视频流、音频流和屏幕流。如果房间内发布流数已达上限时，本地用户再向房间中发布流时会失败，同时会收到此错误通知。
     */
    ErrorCode[ErrorCode["kErrorCodeOverScreenPublishLimit"] = -1081] = "kErrorCodeOverScreenPublishLimit";
    /** {en}
     * @hidden
     * @deprecated since 3.52, use kErrorCodeOverStreamPublishLimit instead.
     * @brief The total number of published video streams exceeds the upper limit.
     *        The RTC system limits the number of video streams posted in a single room. If the maximum number of video streams posted in the room has been reached, local users will fail to post video streams to the room again and will receive this error notification.
     */
    /** {zh}
     * @hidden
     * @deprecated since 3.52, use kErrorCodeOverStreamPublishLimit instead.
     * @brief 发布视频流总数超过上限。RTC 系统会限制单个房间内发布的视频流数。如果房间内发布视频流数已达上限时，本地用户再向房间中发布视频流时会失败，同时会收到此错误通知。
     */
    ErrorCode[ErrorCode["kErrorCodeOverVideoPublishLimit"] = -1082] = "kErrorCodeOverVideoPublishLimit";
    /** {en}
     * @brief A/V synchronization failed.
     *        Current source audio ID has been set by other video publishers in the same room.
     *        One single audio source cannot be synchronized with multiple video sources at the same time.
     */
    /** {zh}
     * @brief 音视频同步失败。当前音频源已与其他视频源关联同步关系。单个音频源不支持与多个视频源同时同步。
     */
    ErrorCode[ErrorCode["kErrorCodeInvalidAudioSyncUidRepeated"] = -1083] = "kErrorCodeInvalidAudioSyncUidRepeated";
    /** {en}
     * @brief The user has been removed from the room due to the abnormal status of server.
     *        SDK  is disconnected with the signaling server. It will not reconnect automatically. Please contact technical support.
     */
    /** {zh}
     * @brief 服务端异常状态导致退出房间。SDK与信令服务器断开，并不再自动重连，可联系技术支持。
     */
    ErrorCode[ErrorCode["kErrorCodeAbnormalServerStatus"] = -1084] = "kErrorCodeAbnormalServerStatus";
    /** {en}
     * @brief The room has banned before the user calls `joinRoom`.
     */
    /** {zh}
     * @brief 房间被封禁。
     */
    ErrorCode[ErrorCode["kErrorCodeJoinRoomRoomForbidden"] = -1025] = "kErrorCodeJoinRoomRoomForbidden";
    /** {en}
     * @brief The user has banned before calling `joinRoom`.
     */
    /** {zh}
     * @brief 用户被封禁。
     */
    ErrorCode[ErrorCode["kErrorCodeJoinRoomUserForbidden"] = -1026] = "kErrorCodeJoinRoomUserForbidden";
    /** {en}
     * @brief The license method did not load successfully. Check the corresponding extension.
     */
    /** {zh}
     * @brief license 计费方法没有加载成功。可能是因为 license 相关插件未正确集成。
     */
    ErrorCode[ErrorCode["kErrorCodeJoinRoomLicenseFunctionNotFound"] = -1027] = "kErrorCodeJoinRoomLicenseFunctionNotFound";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
/** {en}
 * @brief SDK  Network connection type.
 */
/** {zh}
 * @brief SDK 网络连接类型。
 */
var NetworkType;
(function (NetworkType) {
    /** {en}
     * @brief Network connection type unknown.
     */
    /** {zh}
     * @brief 网络连接类型未知。
     */
    NetworkType[NetworkType["kNetworkTypeUnknown"] = -1] = "kNetworkTypeUnknown";
    /** {en}
     * @brief The network connection has been disconnected.
     */
    /** {zh}
     * @brief 网络连接已断开。
     */
    NetworkType[NetworkType["kNetworkTypeDisconnected"] = 0] = "kNetworkTypeDisconnected";
    /** {en}
     * @brief The network connection type is LAN.
     */
    /** {zh}
     * @brief 网络连接类型为 LAN 。
     */
    NetworkType[NetworkType["kNetworkTypeLAN"] = 1] = "kNetworkTypeLAN";
    /** {en}
     * @brief The network connection type is Wi-Fi (including hotspots).
     */
    /** {zh}
     * @brief 网络连接类型为 Wi-Fi（包含热点）。
     */
    NetworkType[NetworkType["kNetworkTypeWIFI"] = 2] = "kNetworkTypeWIFI";
    /** {en}
     * @brief The network connection type is 2G mobile network.
     */
    /** {zh}
     * @brief 网络连接类型为 2G 移动网络。
     */
    NetworkType[NetworkType["kNetworkTypeMobile2G"] = 3] = "kNetworkTypeMobile2G";
    /** {en}
     * @brief The network connection type is 3G mobile network.
     */
    /** {zh}
     * @brief 网络连接类型为 3G 移动网络。
     */
    NetworkType[NetworkType["kNetworkTypeMobile3G"] = 4] = "kNetworkTypeMobile3G";
    /** {en}
     * @brief The network connection type is 4G mobile network.
     */
    /** {zh}
     * @brief 网络连接类型为 4G 移动网络。
     */
    NetworkType[NetworkType["kNetworkTypeMobile4G"] = 5] = "kNetworkTypeMobile4G";
    /** {en}
     * @brief The network connection type is 5G mobile network.
     */
    /** {zh}
     * @brief 网络连接类型为 5G 移动网络。
     */
    NetworkType[NetworkType["kNetworkTypeMobile5G"] = 6] = "kNetworkTypeMobile5G";
})(NetworkType = exports.NetworkType || (exports.NetworkType = {}));
/** {en}
 * @brief Audio & video quality feedback problem
 */
/** {zh}
 * @brief 反馈信息类型
 */
var ProblemFeedbackOption;
(function (ProblemFeedbackOption) {
    /** {en}
     * @brief No problem
     */
    /** {zh}
     * @brief 没有问题
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionNone"] = 0] = "kProblemFeedbackOptionNone";
    /** {en}
     * @brief Other issues
     */
    /** {zh}
     * @brief 其他问题
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionOtherMessage"] = 1] = "kProblemFeedbackOptionOtherMessage";
    /** {en}
     * @brief Connection failed
     */
    /** {zh}
     * @brief 连接失败
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionDisconnected"] = 2] = "kProblemFeedbackOptionDisconnected";
    /** {en}
     * @brief High latency for the ear monitor
     */
    /** {zh}
     * @brief 耳返延迟大
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionEarBackDelay"] = 3] = "kProblemFeedbackOptionEarBackDelay";
    /** {en}
     * @brief Noise on the local end
     */
    /** {zh}
     * @brief 本端有杂音
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionLocalNoise"] = 11] = "kProblemFeedbackOptionLocalNoise";
    /** {en}
     * @brief Audio stall on the local end
     */
    /** {zh}
     * @brief 本端声音卡顿
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionLocalAudioLagging"] = 12] = "kProblemFeedbackOptionLocalAudioLagging";
    /** {en}
     * @brief No sound on the local end
     */
    /** {zh}
     * @brief 本端无声音
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionLocalNoAudio"] = 13] = "kProblemFeedbackOptionLocalNoAudio";
    /** {en}
     * @brief Too little/loud sound on the local end
     */
    /** {zh}
     * @brief 本端声音大/小
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionLocalAudioStrength"] = 14] = "kProblemFeedbackOptionLocalAudioStrength";
    /** {en}
     * @brief Echo noise on the local end
     */
    /** {zh}
     * @brief 本端有回声
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionLocalEcho"] = 15] = "kProblemFeedbackOptionLocalEcho";
    /** {en}
     * @brief Unclear video on the local end
     */
    /** {zh}
     * @brief 本端视频模糊
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionLocalVideoFuzzy"] = 25] = "kProblemFeedbackOptionLocalVideoFuzzy";
    /** {en}
     * @brief Unclear video on the local end
     */
    /** {zh}
     * @brief 本端音视频不同步
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionLocalNotSync"] = 26] = "kProblemFeedbackOptionLocalNotSync";
    /** {en}
     * @brief Video stall on the local end
     */
    /** {zh}
     * @brief 本端视频卡顿
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionLocalVideoLagging"] = 27] = "kProblemFeedbackOptionLocalVideoLagging";
    /** {en}
     * @brief No picture on the local end
     */
    /** {zh}
     * @brief 本端无画面
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionLocalNoVideo"] = 28] = "kProblemFeedbackOptionLocalNoVideo";
    /** {en}
     * @brief Noise on the remote end
     */
    /** {zh}
     * @brief 远端有杂音
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionRemoteNoise"] = 38] = "kProblemFeedbackOptionRemoteNoise";
    /** {zh}
     * @brief 远端声音卡顿
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionRemoteAudioLagging"] = 39] = "kProblemFeedbackOptionRemoteAudioLagging";
    /** {en}
     * @brief No sound on the remote end
     */
    /** {zh}
     * @brief 远端无声音
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionRemoteNoAudio"] = 40] = "kProblemFeedbackOptionRemoteNoAudio";
    /** {en}
     * @brief Too little/loud sound on the remote end
     */
    /** {zh}
     * @brief 远端声音大/小
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionRemoteAudioStrength"] = 41] = "kProblemFeedbackOptionRemoteAudioStrength";
    /** {en}
     * @brief Echo noise on the remote end
     */
    /** {zh}
     * @brief 远端有回声
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionRemoteEcho"] = 42] = "kProblemFeedbackOptionRemoteEcho";
    /** {en}
     * @brief Unclear video on the remote end
     */
    /** {zh}
     * @brief 远端视频模糊
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionRemoteVideoFuzzy"] = 52] = "kProblemFeedbackOptionRemoteVideoFuzzy";
    /** {en}
     * @brief Audio & video out of sync on the remote end
     */
    /** {zh}
     * @brief 远端音视频不同步
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionRemoteNotSync"] = 53] = "kProblemFeedbackOptionRemoteNotSync";
    /** {en}
     * @brief Video stall on the remote end
     */
    /** {zh}
     * @brief 远端视频卡顿
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionRemoteVideoLagging"] = 54] = "kProblemFeedbackOptionRemoteVideoLagging";
    /** {en}
     * @brief No picture on the remote end
     */
    /** {zh}
     * @brief 远端无画面
     */
    ProblemFeedbackOption[ProblemFeedbackOption["kProblemFeedbackOptionRemoteNoVideo"] = 55] = "kProblemFeedbackOptionRemoteNoVideo";
})(ProblemFeedbackOption = exports.ProblemFeedbackOption || (exports.ProblemFeedbackOption = {}));
/** {en}
 * @brief Whether to turn on release performance fallback
 */
/** {zh}
 * @brief 是否开启发布性能回退
 */
var PerformanceAlarmMode;
(function (PerformanceAlarmMode) {
    /** {en}
     * @brief Not enabled Release performance fallback
     */
    /** {zh}
     * @brief 未开启发布性能回退
     */
    PerformanceAlarmMode[PerformanceAlarmMode["kPerformanceAlarmModeNormal"] = 0] = "kPerformanceAlarmModeNormal";
    /** {en}
     * @brief Open Release Performance Rollback
     */
    /** {zh}
     * @brief 已开启发布性能回退
     */
    PerformanceAlarmMode[PerformanceAlarmMode["kPerformanceAlarmModeSimulcast"] = 1] = "kPerformanceAlarmModeSimulcast";
})(PerformanceAlarmMode = exports.PerformanceAlarmMode || (exports.PerformanceAlarmMode = {}));
/** {en}
 * @brief Reasons of performance-related alarms
 */
/** {zh}
 * @brief [onPerformanceAlarms](85533#onperformancealarms) 告警的原因
 */
var PerformanceAlarmReason;
(function (PerformanceAlarmReason) {
    /** {en}
     * @brief The poor network causes the transmission performance to fall back. This reason is only received when sending performance fallback is turned on.
     */
    /** {zh}
     * @brief 网络原因差，造成了发送性能回退。仅在开启发送性能回退时，会收到此原因。
     */
    PerformanceAlarmReason[PerformanceAlarmReason["kPerformanceAlarmReasonBandwidthFallbacked"] = 0] = "kPerformanceAlarmReasonBandwidthFallbacked";
    /** {en}
     * @brief Network performance recovery, transmission performance rollback recovery. This reason is only received when sending performance fallback is turned on.
     */
    /** {zh}
     * @brief 网络性能恢复，发送性能回退恢复。仅在开启发送性能回退时，会收到此原因。
     */
    PerformanceAlarmReason[PerformanceAlarmReason["kPerformanceAlarmReasonBandwidthResumed"] = 1] = "kPerformanceAlarmReasonBandwidthResumed";
    /** {en}
     * @brief If the send performance fallback is not turned on, when receiving this alarm, it means that the performance is insufficient;
     *        If the send performance fallback is turned on, when receiving this alarm, it means that the performance is insufficient and the send performance fallback has occurred.
     */
    /** {zh}
     * @brief 如果未开启发送性能回退，收到此告警时，意味着性能不足；如果开启了发送性能回退，收到此告警时，意味着性能不足，且已发生发送性能回退。
     */
    PerformanceAlarmReason[PerformanceAlarmReason["kPerformanceAlarmReasonPerformanceFallbacked"] = 2] = "kPerformanceAlarmReasonPerformanceFallbacked";
    /** {en}
     * @brief If the send performance fallback is not turned on, when receiving this alarm, it means that the performance shortage has been restored;
     *         If the send performance fallback is turned on, when receiving this alarm, it means that the performance shortage has been restored and the send performance fallback has occurred. Recovery.
     */
    /** {zh}
     * @brief 如果未开启发送性能回退，收到此告警时，意味着性能不足已恢复； 如果开启了发送性能回退，收到此告警时，意味着性能不足已恢复，且已发生发送性能回退恢复。
     */
    PerformanceAlarmReason[PerformanceAlarmReason["kPerformanceAlarmReasonPerformanceResumed"] = 3] = "kPerformanceAlarmReasonPerformanceResumed";
})(PerformanceAlarmReason = exports.PerformanceAlarmReason || (exports.PerformanceAlarmReason = {}));
/** {zh}
 * @brief 媒体设备错误类型
 */
var MediaDeviceError;
(function (MediaDeviceError) {
    /**
     * @brief 媒体设备正常
     */
    MediaDeviceError[MediaDeviceError["kMediaDeviceErrorOK"] = 0] = "kMediaDeviceErrorOK";
    /**
     * @brief 没有权限启动媒体设备
     */
    MediaDeviceError[MediaDeviceError["kMediaDeviceErrorDeviceNoPermission"] = 1] = "kMediaDeviceErrorDeviceNoPermission";
    /**
     * @brief 媒体设备已经在使用中
     */
    MediaDeviceError[MediaDeviceError["kMediaDeviceErrorDeviceBusy"] = 2] = "kMediaDeviceErrorDeviceBusy";
    /**
     * @brief 媒体设备错误
     */
    MediaDeviceError[MediaDeviceError["kMediaDeviceErrorDeviceFailure"] = 3] = "kMediaDeviceErrorDeviceFailure";
    /**
     * @brief 未找到指定的媒体设备
     */
    MediaDeviceError[MediaDeviceError["kMediaDeviceErrorDeviceNotFound"] = 4] = "kMediaDeviceErrorDeviceNotFound";
    /**
     * @brief 媒体设备被移除。
     *        对象为采集屏幕流时，表明窗体被关闭或显示器被移除。
     */
    MediaDeviceError[MediaDeviceError["kMediaDeviceErrorDeviceDisconnected"] = 5] = "kMediaDeviceErrorDeviceDisconnected";
    /**
     * @brief 设备没有数据回调
     */
    MediaDeviceError[MediaDeviceError["kMediaDeviceErrorDeviceNoCallback"] = 6] = "kMediaDeviceErrorDeviceNoCallback";
    /**
     * @brief 设备采样率不支持
     */
    MediaDeviceError[MediaDeviceError["kMediaDeviceErrorDeviceUNSupportFormat"] = 7] = "kMediaDeviceErrorDeviceUNSupportFormat";
    /**
     * @hidden
     * @brief ios 屏幕采集没有 group id 参数
     */
    MediaDeviceError[MediaDeviceError["kMediaDeviceErrorDeviceNotFindGroupId"] = 8] = "kMediaDeviceErrorDeviceNotFindGroupId";
    /**
     * @hidden
     * @brief 打断类型：使用camera过程中被送到后台
     */
    MediaDeviceError[MediaDeviceError["kMediaDeviceErrorDeviceNotAvailableInBackground"] = 9] = "kMediaDeviceErrorDeviceNotAvailableInBackground";
    /**
     * @hidden
     * @brief 打断类型：被其他客户端打断，比如一个正在使用capture session的app
     */
    MediaDeviceError[MediaDeviceError["kMediaDeviceErrorDeviceVideoInUseByAnotherClient"] = 10] = "kMediaDeviceErrorDeviceVideoInUseByAnotherClient";
    /**
     * @hidden
     * @brief 打断类型：使用Slide Over,、Split View 或者 PIP时被中断，比如台前调度，画中画
     */
    MediaDeviceError[MediaDeviceError["kMediaDeviceErrorDeviceNotAvailableWithMultipleForegroundApps"] = 11] = "kMediaDeviceErrorDeviceNotAvailableWithMultipleForegroundApps";
    /**
     * @hidden
     * @brief 打断类型：系统压力，比如过热
     */
    MediaDeviceError[MediaDeviceError["kMediaDeviceErrorDeviceNotAvailableDueToSystemPressure"] = 12] = "kMediaDeviceErrorDeviceNotAvailableDueToSystemPressure";
})(MediaDeviceError = exports.MediaDeviceError || (exports.MediaDeviceError = {}));
/** {zh}
 * @brief 用户加入房间的类型。
 */
var JoinRoomType;
(function (JoinRoomType) {
    /** {zh}
     * @brief 首次加入房间。用户手动调用 [joinRoom](85532#joinroom)，收到加入成功。
     */
    JoinRoomType[JoinRoomType["kJoinRoomTypeFirst"] = 0] = "kJoinRoomTypeFirst";
    /** {zh}
     * @brief 重新加入房间。用户网络较差，失去与服务器的连接，进行重连时收到加入成功。
     */
    JoinRoomType[JoinRoomType["kJoinRoomTypeReconnected"] = 1] = "kJoinRoomTypeReconnected";
})(JoinRoomType = exports.JoinRoomType || (exports.JoinRoomType = {}));
/** {zh}
 * @brief 停止/启动发送音/视频流的状态
 */
var MuteState;
(function (MuteState) {
    /** {zh}
     * @brief 启动发送音/视频流的状态
     */
    MuteState[MuteState["kMuteStateOff"] = 0] = "kMuteStateOff";
    /** {zh}
     * @brief 停止发送音/视频流的状态
     */
    MuteState[MuteState["kMuteStateOn"] = 1] = "kMuteStateOn";
})(MuteState = exports.MuteState || (exports.MuteState = {}));
/** {en}
 * @brief Stream type.
 */
/** {zh}
 * @brief 流属性
 */
var StreamIndex;
(function (StreamIndex) {
    /** {en}
     * @brief Main stream which includes video captured by cameras or audio captured by microphone
     */
    /** {zh}
     * @brief 主流。包括：通过默认摄像头/麦克风采集到的视频/音频;
     */
    StreamIndex[StreamIndex["kStreamIndexMain"] = 0] = "kStreamIndexMain";
    /** {en}
     * @brief Screen stream to be shared
     * Screen recording stream or sounds coming from the sound card
     */
    /** {zh}
     * @brief 屏幕流。
     *        屏幕共享时共享的视频流，或来自声卡的本地播放音频流。
     */
    StreamIndex[StreamIndex["kStreamIndexScreen"] = 1] = "kStreamIndexScreen";
})(StreamIndex = exports.StreamIndex || (exports.StreamIndex = {}));
/**
 * @type keytype
 * @brief 视频帧颜色编码格式
 */
var VideoPixelFormat;
(function (VideoPixelFormat) {
    /**
     * @brief 未知的颜色编码格式
     */
    VideoPixelFormat[VideoPixelFormat["kVideoPixelFormatUnknown"] = 0] = "kVideoPixelFormatUnknown";
    /**
     * @brief YUV I420 格式
     */
    VideoPixelFormat[VideoPixelFormat["kVideoPixelFormatI420"] = 1] = "kVideoPixelFormatI420";
    /**
     * @brief YUV NV12 格式
     */
    VideoPixelFormat[VideoPixelFormat["kVideoPixelFormatNV12"] = 2] = "kVideoPixelFormatNV12";
    /**
     * @brief YUV NV21 格式
     */
    VideoPixelFormat[VideoPixelFormat["kVideoPixelFormatNV21"] = 3] = "kVideoPixelFormatNV21";
    /**
     * @brief RGB 24bit格式，
     */
    VideoPixelFormat[VideoPixelFormat["kVideoPixelFormatRGB24"] = 4] = "kVideoPixelFormatRGB24";
    /**
     * @brief RGBA 编码格式
     */
    VideoPixelFormat[VideoPixelFormat["kVideoPixelFormatRGBA"] = 5] = "kVideoPixelFormatRGBA";
    /**
     * @brief ARGB 编码格式
     */
    VideoPixelFormat[VideoPixelFormat["kVideoPixelFormatARGB"] = 6] = "kVideoPixelFormatARGB";
    /**
     * @brief BGRA 编码格式
     */
    VideoPixelFormat[VideoPixelFormat["kVideoPixelFormatBGRA"] = 7] = "kVideoPixelFormatBGRA";
})(VideoPixelFormat = exports.VideoPixelFormat || (exports.VideoPixelFormat = {}));
;
/** {zh}
 * @type keytype
 * @brief 视频帧编码格式
 */
/** {en}
 * @type keytype
 * @brief Video frame encoding format
 */
var PixelFormat;
(function (PixelFormat) {
    /** {zh}
     * @brief YUV I420 格式
     */
    /** {en}
     * @brief YUV I420 format
     */
    PixelFormat[PixelFormat["kI420"] = 1] = "kI420";
    /** {zh}
     * @brief RGBA 格式, 字节序为 R8 G8 B8 A8
     */
    /** {en}
     * @brief RGBA format
     */
    PixelFormat[PixelFormat["kRGBA"] = 5] = "kRGBA";
})(PixelFormat = exports.PixelFormat || (exports.PixelFormat = {}));
/** {en}
 * @brief Events during pushing streams to CDN
 */
/** {zh}
 * @brief 转推直播事件
 */
var StreamMixingEvent;
(function (StreamMixingEvent) {
    /** {en}
     * @brief Request to start pushing streams to CDN
     */
    /** {zh}
     * @brief 请求发起转推直播任务
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingStart"] = 1] = "kStreamMixingStart";
    /** {en}
     * @brief ask to push streams to CDN started
     */
    /** {zh}
     * @brief 发起转推直播任务成功
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingStartSuccess"] = 2] = "kStreamMixingStartSuccess";
    /** {en}
     * @brief Failed to start the task to push streams to CDN
     */
    /** {zh}
     * @brief 发起转推直播任务失败
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingStartFailed"] = 3] = "kStreamMixingStartFailed";
    /** {en}
     * @brief Request to update the configuration for the task to push streams to CDN
     */
    /** {zh}
     * @brief 请求更新转推直播任务配置
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingUpdate"] = 4] = "kStreamMixingUpdate";
    /** {en}
     * @brief Successfully update the configuration for the task to push streams to CDN
     */
    /** {zh}
     * @brief 成功更新转推直播任务配置
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingUpdateSuccess"] = 5] = "kStreamMixingUpdateSuccess";
    /** {en}
     * @brief Failed to update the configuration for the task to push streams to CDN
     */
    /** {zh}
     * @brief 更新转推直播任务配置失败
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingUpdateFailed"] = 6] = "kStreamMixingUpdateFailed";
    /** {en}
     * @brief Request to stop the task to push streams to CDN
     */
    /** {zh}
     * @brief 请求结束转推直播任务
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingStop"] = 7] = "kStreamMixingStop";
    /** {en}
     * @brief The task to push streams to CDN stopped
     */
    /** {zh}
     * @brief 结束转推直播任务成功
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingStopSuccess"] = 8] = "kStreamMixingStopSuccess";
    /** {en}
     * @brief Failed to stop the task to push streams to CDN
     */
    /** {zh}
     * @brief 结束转推直播任务失败
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingStopFailed"] = 9] = "kStreamMixingStopFailed";
    /** {en}
     * @brief Timeout for the request to update the configuration for the task to push streams to CDN.
     */
    /** {zh}
     * @brief 更新转推直播任务配置的请求超时
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingChangeMixType"] = 10] = "kStreamMixingChangeMixType";
    /** {en}
     * @brief Got the first frame of the mixed audio stream by client.
     */
    /** {zh}
     * @brief 得到客户端合流音频首帧
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingFirstAudioFrameByClientMix"] = 11] = "kStreamMixingFirstAudioFrameByClientMix";
    /** {en}
     * @brief Got the first frame of the mixed video stream by client.
     */
    /** {zh}
     * @brief 收到客户端合流视频首帧
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingFirstVideoFrameByClientMix"] = 12] = "kStreamMixingFirstVideoFrameByClientMix";
    /** {en}
     * @brief Timeout for the request to update the configuration for the task to push streams to CDN
     */
    /** {zh}
     * @brief 更新转推直播任务配置超时
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingUpdateTimeout"] = 13] = "kStreamMixingUpdateTimeout";
    /** {en}
     * @brief Timeout for the request to start the task to push streams to CDN
     */
    /** {zh}
     * @brief 发起转推直播任务配置超时
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingStartTimeout"] = 14] = "kStreamMixingStartTimeout";
    /** {en}
     * @brief Error in the parameters of the request for the task to push streams to CDN
     */
    /** {zh}
     * @brief 合流布局参数错误
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingRequestParamError"] = 15] = "kStreamMixingRequestParamError";
    /** {en}
     * @brief Mixing image.
     */
    /** {zh}
     * @brief 合流加图片
     */
    StreamMixingEvent[StreamMixingEvent["kStreamMixingMixImageEvent"] = 16] = "kStreamMixingMixImageEvent";
})(StreamMixingEvent = exports.StreamMixingEvent || (exports.StreamMixingEvent = {}));
/** {en}
 * @brief Events during pushing streams to CDN
 */
/** {zh}
 * @brief 转推直播事件
 */
var SingleStreamPushEvent;
(function (SingleStreamPushEvent) {
    /** {en}
     * @brief Starting pushing a single stream to CDN.
     */
    /** {zh}
     * @brief 开始推流。
     */
    SingleStreamPushEvent[SingleStreamPushEvent["kSingleStreamPushStart"] = 1] = "kSingleStreamPushStart";
    /** {en}
     * @brief Successfully pushed a single stream to CDN.
     */
    /** {zh}
     * @brief 推流成功。
     */
    SingleStreamPushEvent[SingleStreamPushEvent["kSingleStreamPushSuccess"] = 2] = "kSingleStreamPushSuccess";
    /** {en}
     * @brief Failed to push a single stream to CDN.
     */
    /** {zh}
     * @brief 推流失败。
     */
    SingleStreamPushEvent[SingleStreamPushEvent["kSingleStreamPushFailed"] = 3] = "kSingleStreamPushFailed";
    /** {en}
     * @brief Stop pushing a single stream to CDN.
     */
    /** {zh}
     * @brief 停止推流。
     */
    SingleStreamPushEvent[SingleStreamPushEvent["kSingleStreamPushStop"] = 4] = "kSingleStreamPushStop";
    /** {en}
     * @brief Request timed out. Please check network status and retry.
     */
    /** {zh}
     * @brief 单流转推直播任务处理超时，请检查网络状态并重试。
     */
    SingleStreamPushEvent[SingleStreamPushEvent["kSingleStreamPushTimeout"] = 5] = "kSingleStreamPushTimeout";
    /** {en}
     * @brief Request failed due to invalid parameter.
     */
    /** {zh}
     * @brief 参数错误。
     */
    SingleStreamPushEvent[SingleStreamPushEvent["kSingleStreamPushParamError"] = 6] = "kSingleStreamPushParamError";
})(SingleStreamPushEvent = exports.SingleStreamPushEvent || (exports.SingleStreamPushEvent = {}));
/** {en}
 * @brief Stream mixing type
 */
/** {zh}
 * @brief 合流类型
 */
var StreamMixingType;
(function (StreamMixingType) {
    /** {en}
     * @brief Server-side stream mixing
     */
    /** {zh}
     * @brief 服务端合流
     */
    StreamMixingType[StreamMixingType["kStreamMixingTypeByServer"] = 0] = "kStreamMixingTypeByServer";
    /** {en}
     * @brief Intelligent stream mixing. The SDK will intelligently decide that a stream mixing task would be done on the client or the server.
     */
    /** {zh}
     * @brief 端云一体合流
     */
    StreamMixingType[StreamMixingType["kStreamMixingTypeByClient"] = 1] = "kStreamMixingTypeByClient";
})(StreamMixingType = exports.StreamMixingType || (exports.StreamMixingType = {}));
var RecordingType;
(function (RecordingType) {
    /**
     * @brief 只录制音频
     */
    RecordingType[RecordingType["kRecordAudioOnly"] = 0] = "kRecordAudioOnly";
    /**
     * @brief 只录制视频
     */
    RecordingType[RecordingType["kRecordVideoOnly"] = 1] = "kRecordVideoOnly";
    /**
     * @brief 同时录制音频和视频
     */
    RecordingType[RecordingType["kRecordVideoAndAudio"] = 2] = "kRecordVideoAndAudio";
})(RecordingType = exports.RecordingType || (exports.RecordingType = {}));
/** {en}
 * @brief Verification information required to use automatic speech recognition services
 */
/** {zh}
 * @brief 使用自动语音识别服务所需校验信息
 */
var ASRAuthorizationType;
(function (ASRAuthorizationType) {
    /** {en}
     * @brief Token  authentication
     */
    /** {zh}
     * @brief Token 鉴权
     */
    ASRAuthorizationType[ASRAuthorizationType["kASRAuthorizationTypeToken"] = 0] = "kASRAuthorizationTypeToken";
    /** {en}
     * @brief Signature  Authentication
     */
    /** {zh}
     * @brief Signature 鉴权
     */
    /** {en}
     * @brief Signature  Authentication
     */
    ASRAuthorizationType[ASRAuthorizationType["kASRAuthorizationTypeSignature"] = 1] = "kASRAuthorizationTypeSignature";
})(ASRAuthorizationType = exports.ASRAuthorizationType || (exports.ASRAuthorizationType = {}));
/** {zh}
 * @brief 房间内远端流被移除的原因。
 */
var StreamRemoveReason;
(function (StreamRemoveReason) {
    /** {zh}
     * @brief 远端用户停止发布流。
     */
    StreamRemoveReason[StreamRemoveReason["kStreamRemoveReasonUnpublish"] = 0] = "kStreamRemoveReasonUnpublish";
    /** {zh}
     * @brief 远端用户发布流失败。
     */
    StreamRemoveReason[StreamRemoveReason["kStreamRemoveReasonPublishFailed"] = 1] = "kStreamRemoveReasonPublishFailed";
    /** {zh}
     * @brief 保活失败。
     */
    StreamRemoveReason[StreamRemoveReason["kStreamRemoveReasonKeepLiveFailed"] = 2] = "kStreamRemoveReasonKeepLiveFailed";
    /** {zh}
     * @brief 远端用户断网。
     */
    StreamRemoveReason[StreamRemoveReason["kStreamRemoveReasonClientDisconnected"] = 3] = "kStreamRemoveReasonClientDisconnected";
    /** {zh}
     * @brief 远端用户重新发布流。
     */
    StreamRemoveReason[StreamRemoveReason["kStreamRemoveReasonRepublish"] = 4] = "kStreamRemoveReasonRepublish";
    /** {zh}
     * @brief 其他原因。
     */
    StreamRemoveReason[StreamRemoveReason["kStreamRemoveReasonOther"] = 5] = "kStreamRemoveReasonOther";
})(StreamRemoveReason = exports.StreamRemoveReason || (exports.StreamRemoveReason = {}));
/** {en}
 * @brief Reason of the Fallback or reverting from a Fallback of the subscribed stream or the publishing stream
 */
/** {zh}
 * @brief 远端订阅流发生回退或恢复的原因
 */
var FallbackOrRecoverReason;
(function (FallbackOrRecoverReason) {
    /** {en}
     * @brief The default: Fallback due to an unknown reason that is neither infufficienclt bandwidth of the network nor poor-performance of the device
     */
    /** {zh}
     * @brief 其他原因，非带宽和性能原因引起的回退或恢复。默认值
     */
    FallbackOrRecoverReason[FallbackOrRecoverReason["kFallbackOrRecoverReasonUnknown"] = -1] = "kFallbackOrRecoverReasonUnknown";
    /** {en}
     * @brief Fallback of the subscribed stream due to insufficient bandwidth of the network
     */
    /** {zh}
     * @brief 由带宽不足导致的订阅端音视频流回退。
     */
    FallbackOrRecoverReason[FallbackOrRecoverReason["kFallbackOrRecoverReasonSubscribeFallbackByBandwidth"] = 0] = "kFallbackOrRecoverReasonSubscribeFallbackByBandwidth";
    /** {en}
     * @brief Fallback of the subscribed stream for poor-performance of the device
     */
    /** {zh}
     * @brief 由性能不足导致的订阅端音视频流回退。
     */
    FallbackOrRecoverReason[FallbackOrRecoverReason["kFallbackOrRecoverReasonSubscribeFallbackByPerformance"] = 1] = "kFallbackOrRecoverReasonSubscribeFallbackByPerformance";
    /** {en}
     * @brief Reverting from a Fallback of the subscribed stream due to the recovery of the network bandwidth
     */
    /** {zh}
     * @brief 由带宽恢复导致的订阅端音视频流恢复。
     */
    FallbackOrRecoverReason[FallbackOrRecoverReason["kFallbackOrRecoverReasonSubscribeRecoverByBandwidth"] = 2] = "kFallbackOrRecoverReasonSubscribeRecoverByBandwidth";
    /** {en}
     * @brief Reverting from a Fallback of the subscribed stream due to the amelioration of the device performance
     */
    /** {zh}
     * @brief 由性能恢复导致的订阅端音视频流恢复。
     */
    FallbackOrRecoverReason[FallbackOrRecoverReason["kFallbackOrRecoverReasonSubscribeRecoverByPerformance"] = 3] = "kFallbackOrRecoverReasonSubscribeRecoverByPerformance";
    /** {en}
     * @brief Fallback of the publishing stream due to Insufficient bandwidth of the network
     */
    /** {zh}
     * @brief 由带宽不足导致的发布端音视频流回退。
     */
    FallbackOrRecoverReason[FallbackOrRecoverReason["kFallbackOrRecoverReasonPublishFallbackByBandwidth"] = 4] = "kFallbackOrRecoverReasonPublishFallbackByBandwidth";
    /** {en}
     * @brief Fallback of the publishing stream due to poor-performance of the device
     */
    /** {zh}
     * @brief 由性能不足导致的发布端音视频流回退。
     */
    FallbackOrRecoverReason[FallbackOrRecoverReason["kFallbackOrRecoverReasonPublishFallbackByPerformance"] = 5] = "kFallbackOrRecoverReasonPublishFallbackByPerformance";
    /** {en}
     * @brief Reverting from a Fallback of the publishing stream due to the recovery of the network bandwidth
     */
    /** {zh}
     * @brief 由带宽恢复导致的发布端音视频流恢复。
     */
    FallbackOrRecoverReason[FallbackOrRecoverReason["kFallbackOrRecoverReasonPublishRecoverByBandwidth"] = 6] = "kFallbackOrRecoverReasonPublishRecoverByBandwidth";
    /** {en}
     * @brief Reverting from a Fallback of the publishing stream due to the amelioration of the device performance
     */
    /** {zh}
     * @brief 由性能恢复导致的发布端音视频流恢复。
     */
    FallbackOrRecoverReason[FallbackOrRecoverReason["kFallbackOrRecoverReasonPublishRecoverByPerformance"] = 7] = "kFallbackOrRecoverReasonPublishRecoverByPerformance";
})(FallbackOrRecoverReason = exports.FallbackOrRecoverReason || (exports.FallbackOrRecoverReason = {}));
/** {en}
 * @brief Information on video frame rotation angle
 */
/** {zh}
 * @brief 视频旋转信息，枚举类型，定义了以 90 度为间隔的四种旋转模式。
 */
var VideoRotation;
(function (VideoRotation) {
    /** {en}
     * @brief Video does not rotate
     */
    /** {zh}
     * @brief 顺时针旋转 0 度
     */
    VideoRotation[VideoRotation["kVideoRotation0"] = 0] = "kVideoRotation0";
    /** {en}
     * @brief Video rotates 90 degrees clockwise
     */
    /** {zh}
     * @brief 顺时针旋转 90 度
     */
    VideoRotation[VideoRotation["kVideoRotation90"] = 90] = "kVideoRotation90";
    /** {en}
     * @brief Video rotates 180 degrees clockwise
     */
    /** {zh}
     * @brief 顺时针旋转 180 度
     */
    VideoRotation[VideoRotation["kVideoRotation180"] = 180] = "kVideoRotation180";
    /** {en}
     * @brief Video rotates 270 degrees clockwise
     */
    /** {zh}
     * @brief 顺时针旋转 270 度
     */
    VideoRotation[VideoRotation["kVideoRotation270"] = 270] = "kVideoRotation270";
})(VideoRotation = exports.VideoRotation || (exports.VideoRotation = {}));
/** {zh}
 * @brief 虚拟背景类型。
 */
var VirtualBackgroundSourceType;
(function (VirtualBackgroundSourceType) {
    /** {zh}
     * @brief 使用纯色背景替换视频原有背景。
     */
    VirtualBackgroundSourceType[VirtualBackgroundSourceType["kVirtualBackgroundSourceColor"] = 0] = "kVirtualBackgroundSourceColor";
    /** {zh}
     * @brief 使用自定义图片替换视频原有背景。
     */
    VirtualBackgroundSourceType[VirtualBackgroundSourceType["kVirtualBackgroundSourceImage"] = 1] = "kVirtualBackgroundSourceImage";
})(VirtualBackgroundSourceType = exports.VirtualBackgroundSourceType || (exports.VirtualBackgroundSourceType = {}));
/** {en}
 * @brief Local audio stream status.
 */
/** {zh}
 * @brief 本地音频流状态。
 */
var LocalAudioStreamState;
(function (LocalAudioStreamState) {
    /** {en}
     * @brief The default initial state of the local audio.
     *         Callback to this state when the microphone stops working, corresponding to the error code kLocalAudioStreamErrorOk
     */
    /** {zh}
     * @brief 本地音频默认初始状态。
     *        麦克风停止工作时回调该状态，对应错误码 kLocalAudioStreamErrorOk
     */
    LocalAudioStreamState[LocalAudioStreamState["kLocalAudioStreamStateStopped"] = 0] = "kLocalAudioStreamStateStopped";
    /** {en}
     * @brief The local audio recording device started successfully.
     *         Callback to the state when the first frame of audio is collected, corresponding to the error code kLocalAudioStreamErrorOk
     */
    /** {zh}
     * @brief 本地音频录制设备启动成功。
     *        采集到音频首帧时回调该状态，对应错误码 kLocalAudioStreamErrorOk
     */
    LocalAudioStreamState[LocalAudioStreamState["kLocalAudioStreamStateRecording"] = 1] = "kLocalAudioStreamStateRecording";
    /** {en}
     * @brief The first frame of the local audio was successfully encoded.
     *         Callback to the state when the audio first frame encoding is successful, corresponding to the error code kLocalAudioStreamErrorOk
     */
    /** {zh}
     * @brief 本地音频首帧编码成功。
     *        音频首帧编码成功时回调该状态，对应错误码 kLocalAudioStreamErrorOk
     */
    LocalAudioStreamState[LocalAudioStreamState["kLocalAudioStreamStateEncoding"] = 2] = "kLocalAudioStreamStateEncoding";
    /** {en}
     * @brief The local audio startup failed, and the status is called back at the following times:
     * + The local recording device failed to start, corresponding to the error code kLocalAudioStreamErrorRecordFailure
     * + No recording device permission was detected, corresponding to the error code kLocalAudioStreamErrorDeviceNoPermission
     * + The audio encoding failed, corresponding to the error code kLocalAudioStreamErrorEncodeFailure
     */
    /** {zh}
     * @brief 本地音频启动失败，在以下时机回调该状态：
     * +本地录音设备启动失败，对应错误码 kLocalAudioStreamErrorRecordFailure
     * +检测到没有录音设备权限，对应错误码 kLocalAudioStreamErrorDeviceNoPermission
     * +音频编码失败，对应错误码 kLocalAudioStreamErrorEncodeFailure
     */
    LocalAudioStreamState[LocalAudioStreamState["kLocalAudioStreamStateFailed"] = 3] = "kLocalAudioStreamStateFailed";
})(LocalAudioStreamState = exports.LocalAudioStreamState || (exports.LocalAudioStreamState = {}));
/** {en}
 * @detail 85534
 * @brief Error code when the local audio state changes
 */
/** {zh}
 * @detail 85534
 * @brief 本地音频流状态改变时的错误码。
 */
var LocalAudioStreamError;
(function (LocalAudioStreamError) {
    /** {en}
     * @brief Local audio status is normal.
     */
    /** {zh}
     * @brief 本地音频状态正常
     */
    LocalAudioStreamError[LocalAudioStreamError["kLocalAudioStreamErrorOk"] = 0] = "kLocalAudioStreamErrorOk";
    /** {en}
     * @brief Local audio error cause unknown
     */
    /** {zh}
     * @brief 本地音频出错原因未知
     */
    LocalAudioStreamError[LocalAudioStreamError["kLocalAudioStreamErrorFailure"] = 1] = "kLocalAudioStreamErrorFailure";
    /** {en}
     * @brief No permission to start local audio recording device
     */
    /** {zh}
     * @brief 没有权限启动本地音频录制设备
     */
    LocalAudioStreamError[LocalAudioStreamError["kLocalAudioStreamErrorDeviceNoPermission"] = 2] = "kLocalAudioStreamErrorDeviceNoPermission";
    /** {en}
     * @hidden
     * @brief The local audio recording device is already in use.
     * The error code is not yet in use
     */
    /** {zh}
     * @hidden
     * @brief 本地音频录制设备已经在使用中
     * @notes 该错误码暂未使用
     */
    LocalAudioStreamError[LocalAudioStreamError["kLocalAudioStreamErrorDeviceBusy"] = 3] = "kLocalAudioStreamErrorDeviceBusy";
    /** {en}
     * @brief Local audio recording failed, it is recommended that you check whether the recording device is working properly
     */
    /** {zh}
     * @brief 本地音频录制失败，建议你检查录制设备是否正常工作
     */
    LocalAudioStreamError[LocalAudioStreamError["kLocalAudioStreamErrorRecordFailure"] = 4] = "kLocalAudioStreamErrorRecordFailure";
    /** {en}
     * @brief Local audio encoding failed
     */
    /** {zh}
     * @brief 本地音频编码失败
     */
    LocalAudioStreamError[LocalAudioStreamError["kLocalAudioStreamErrorEncodeFailure"] = 5] = "kLocalAudioStreamErrorEncodeFailure";
    /** {en}
     * @brief No audio recording equipment available
     */
    /** {zh}
     * @brief 没有可用的音频录制设备
     */
    LocalAudioStreamError[LocalAudioStreamError["kLocalAudioStreamErrorNoRecordingDevice"] = 6] = "kLocalAudioStreamErrorNoRecordingDevice";
})(LocalAudioStreamError = exports.LocalAudioStreamError || (exports.LocalAudioStreamError = {}));
/** {en}
 * @brief Remote audio stream state.
 */
/** {zh}
 * @brief 远端音频流状态。
 */
var RemoteAudioState;
(function (RemoteAudioState) {
    /** {en}
     * @brief The remote audio stream is not received.
     */
    /** {zh}
     * @brief 不接收远端音频流。
     */
    RemoteAudioState[RemoteAudioState["kRemoteAudioStateStopped"] = 0] = "kRemoteAudioStateStopped";
    /** {en}
     * @brief Start receiving the remote audio stream header.
    /** {zh}
     * @brief 开始接收远端音频流首包。
     */
    RemoteAudioState[RemoteAudioState["kRemoteAudioStateStarting"] = 1] = "kRemoteAudioStateStarting";
    /** {en}
     * @brief The remote audio stream is decoding and playing normally.
    /** {zh}
     * @brief 远端音频流正在解码，正常播放。
     */
    RemoteAudioState[RemoteAudioState["kRemoteAudioStateDecoding"] = 2] = "kRemoteAudioStateDecoding";
    /** {en}
     * @brief Remote audio streaming card.
     */
    /** {zh}
     * @brief 远端音频流卡顿。
     */
    RemoteAudioState[RemoteAudioState["kRemoteAudioStateFrozen"] = 3] = "kRemoteAudioStateFrozen";
    /** {en}
     * @hidden
     * @brief The remote audio stream failed to play
     * @notes  The error code is not yet used
     */
    /** {zh}
     * @hidden
     * @brief 远端音频流播放失败
     * @notes 该错误码暂未使用
     */
    RemoteAudioState[RemoteAudioState["kRemoteAudioStateFailed"] = 4] = "kRemoteAudioStateFailed";
})(RemoteAudioState = exports.RemoteAudioState || (exports.RemoteAudioState = {}));
/** {en}
 * @brief Receives the cause of the remote audio stream state change.
 */
/** {zh}
 * @brief 接收远端音频流状态改变的原因。
 */
var RemoteAudioStateChangeReason;
(function (RemoteAudioStateChangeReason) {
    /** {en}
     * @brief Internal reasons
     */
    /** {zh}
     * @brief 内部原因
     */
    RemoteAudioStateChangeReason[RemoteAudioStateChangeReason["kRemoteAudioStateChangeReasonInternal"] = 0] = "kRemoteAudioStateChangeReasonInternal";
    /** {en}
     * @brief Network blocking
     */
    /** {zh}
     * @brief 网络阻塞
     */
    RemoteAudioStateChangeReason[RemoteAudioStateChangeReason["kRemoteAudioStateChangeReasonNetworkCongestion"] = 1] = "kRemoteAudioStateChangeReasonNetworkCongestion";
    /** {en}
     * @brief Network back to normal
     */
    /** {zh}
     * @brief 网络恢复正常
     */
    RemoteAudioStateChangeReason[RemoteAudioStateChangeReason["kRemoteAudioStateChangeReasonNetworkRecovery"] = 2] = "kRemoteAudioStateChangeReasonNetworkRecovery";
    /** {en}
     * @brief Local user stops receiving remote audio stream
     */
    /** {zh}
     * @brief 本地用户停止接收远端音频流
     */
    RemoteAudioStateChangeReason[RemoteAudioStateChangeReason["kRemoteAudioStateChangeReasonLocalMuted"] = 3] = "kRemoteAudioStateChangeReasonLocalMuted";
    /** {en}
     * @brief Local users resume receiving remote audio streams
     */
    /** {zh}
     * @brief 本地用户恢复接收远端音频流
     */
    RemoteAudioStateChangeReason[RemoteAudioStateChangeReason["kRemoteAudioStateChangeReasonLocalUnmuted"] = 4] = "kRemoteAudioStateChangeReasonLocalUnmuted";
    /** {en}
     * @brief Remote user stops sending audio stream
     */
    /** {zh}
     * @brief 远端用户停止发送音频流
     */
    RemoteAudioStateChangeReason[RemoteAudioStateChangeReason["kRemoteAudioStateChangeReasonRemoteMuted"] = 5] = "kRemoteAudioStateChangeReasonRemoteMuted";
    /** {en}
     * @brief Remote user resumes sending audio stream
     */
    /** {zh}
     * @brief 远端用户恢复发送音频流
     */
    RemoteAudioStateChangeReason[RemoteAudioStateChangeReason["kRemoteAudioStateChangeReasonRemoteUnmuted"] = 6] = "kRemoteAudioStateChangeReasonRemoteUnmuted";
    /** {en}
     * @brief Remote user leaves room
     */
    /** {zh}
     * @brief 远端用户离开房间
     */
    RemoteAudioStateChangeReason[RemoteAudioStateChangeReason["kRemoteAudioStateChangeReasonRemoteOffline"] = 7] = "kRemoteAudioStateChangeReasonRemoteOffline";
})(RemoteAudioStateChangeReason = exports.RemoteAudioStateChangeReason || (exports.RemoteAudioStateChangeReason = {}));
/** {en}
 * @brief Local video stream status
 */
/** {zh}
 * @brief 本地视频流状态
 */
var LocalVideoStreamState;
(function (LocalVideoStreamState) {
    /** {en}
     * @brief Local video capture stop state
     */
    /** {zh}
     * @brief 本地视频采集停止状态
     */
    LocalVideoStreamState[LocalVideoStreamState["kLocalVideoStreamStateStopped"] = 0] = "kLocalVideoStreamStateStopped";
    /** {en}
     * @brief Local video capture device activated
     */
    /** {zh}
     * @brief 本地视频采集设备启动成功
     */
    LocalVideoStreamState[LocalVideoStreamState["kLocalVideoStreamStateRecording"] = 1] = "kLocalVideoStreamStateRecording";
    /** {en}
     * @brief After local video capture, the first frame is encoded successfully
     */
    /** {zh}
     * @brief 本地视频采集后，首帧编码成功
     */
    LocalVideoStreamState[LocalVideoStreamState["kLocalVideoStreamStateEncoding"] = 2] = "kLocalVideoStreamStateEncoding";
    /** {en}
     * @brief Local video capture device failed to start
     */
    /** {zh}
     * @brief 本地视频采集设备启动失败
     */
    LocalVideoStreamState[LocalVideoStreamState["kLocalVideoStreamStateFailed"] = 3] = "kLocalVideoStreamStateFailed";
})(LocalVideoStreamState = exports.LocalVideoStreamState || (exports.LocalVideoStreamState = {}));
/** {en}
 * @detail 85534
 * @brief Error Codes for the local video state changed
 */
/** {zh}
 * @detail 85534
 * @brief 本地视频状态改变时的错误码
 */
var LocalVideoStreamError;
(function (LocalVideoStreamError) {
    /** {en}
     * @brief Normal
     */
    /** {zh}
     * @brief 状态正常
     */
    LocalVideoStreamError[LocalVideoStreamError["kLocalVideoStreamErrorOk"] = 0] = "kLocalVideoStreamErrorOk";
    /** {en}
     * @brief Local video stream publishing failed
     */
    /** {zh}
     * @brief 本地视频流发布失败
     */
    LocalVideoStreamError[LocalVideoStreamError["kLocalVideoStreamErrorFailure"] = 1] = "kLocalVideoStreamErrorFailure";
    /** {en}
     * @brief No access to the local video capture device
     */
    /** {zh}
     * @brief 没有权限启动本地视频采集设备
     */
    LocalVideoStreamError[LocalVideoStreamError["kLocalVideoStreamErrorDeviceNoPermission"] = 2] = "kLocalVideoStreamErrorDeviceNoPermission";
    /** {en}
     * @brief Local video capture equipment is occupied
     */
    /** {zh}
     * @brief 本地视频采集设备被占用
     */
    LocalVideoStreamError[LocalVideoStreamError["kLocalVideoStreamErrorDeviceBusy"] = 3] = "kLocalVideoStreamErrorDeviceBusy";
    /** {en}
     * @brief Local video capture device does not exist
     */
    /** {zh}
     * @brief 本地视频采集设备不存在
     */
    LocalVideoStreamError[LocalVideoStreamError["kLocalVideoStreamErrorDeviceNotFound"] = 4] = "kLocalVideoStreamErrorDeviceNotFound";
    /** {en}
     * @brief Local video capture failed, it is recommended to check whether the acquisition device is working properly
     */
    /** {zh}
     * @brief 本地视频采集失败，建议检查采集设备是否正常工作
     */
    LocalVideoStreamError[LocalVideoStreamError["kLocalVideoStreamErrorCaptureFailure"] = 5] = "kLocalVideoStreamErrorCaptureFailure";
    /** {en}
     * @brief Local video encoding failed
     */
    /** {zh}
     * @brief 本地视频编码失败
     */
    LocalVideoStreamError[LocalVideoStreamError["kLocalVideoStreamErrorEncodeFailure"] = 6] = "kLocalVideoStreamErrorEncodeFailure";
    /** {en}
     * @brief The local video capture device is disconnected. It is occupied by other programs during the call.
     */
    /** {zh}
     * @brief 通话过程中本地视频采集设备被其他程序抢占，导致设备连接中断
     */
    LocalVideoStreamError[LocalVideoStreamError["kLocalVideoStreamErrorDeviceDisconnected"] = 7] = "kLocalVideoStreamErrorDeviceDisconnected";
})(LocalVideoStreamError = exports.LocalVideoStreamError || (exports.LocalVideoStreamError = {}));
/** {en}
 * @brief Remote video stream status.
 */
/** {zh}
 * @brief 远端视频流状态。
 */
var RemoteVideoState;
(function (RemoteVideoState) {
    /** {en}
     * @brief The remote video stream defaults to the initial state, and the video has not yet started playing.
     */
    /** {zh}
     * @brief 远端视频流默认初始状态，视频尚未开始播放。
     */
    RemoteVideoState[RemoteVideoState["kRemoteVideoStateStopped"] = 0] = "kRemoteVideoStateStopped";
    /** {en}
     * @brief Local user has received remote video stream header packet.
     */
    /** {zh}
     * @brief 本地用户已接收远端视频流首包。
     */
    RemoteVideoState[RemoteVideoState["kRemoteVideoStateStarting"] = 1] = "kRemoteVideoStateStarting";
    /** {en}
     * @brief The remote video stream is decoding and playing normally.
     */
    /** {zh}
     * @brief 远端视频流正在解码，正常播放。
     */
    RemoteVideoState[RemoteVideoState["kRemoteVideoStateDecoding"] = 2] = "kRemoteVideoStateDecoding";
    /** {en}
     * @brief Remote video streaming card, there may be network and other reasons.
     */
    /** {zh}
     * @brief 远端视频流卡顿，可能有网络等原因。
     */
    RemoteVideoState[RemoteVideoState["kRemoteVideoStateFrozen"] = 3] = "kRemoteVideoStateFrozen";
    /** {en}
     * @brief The remote video stream failed to play.
     */
    /** {zh}
     * @brief 远端视频流播放失败。
     */
    RemoteVideoState[RemoteVideoState["kRemoteVideoStateFailed"] = 4] = "kRemoteVideoStateFailed";
})(RemoteVideoState = exports.RemoteVideoState || (exports.RemoteVideoState = {}));
/** {en}
 * @brief Cause of remote video stream state change
 */
/** {zh}
 * @brief 远端视频流状态改变的原因
 */
var RemoteVideoStateChangeReason;
(function (RemoteVideoStateChangeReason) {
    /** {en}
     * @brief Internal reasons
     */
    /** {zh}
     * @brief 内部原因
     */
    RemoteVideoStateChangeReason[RemoteVideoStateChangeReason["kRemoteVideoStateChangeReasonInternal"] = 0] = "kRemoteVideoStateChangeReasonInternal";
    /** {en}
     * @brief Network blocking
     */
    /** {zh}
     * @brief 网络阻塞
     */
    RemoteVideoStateChangeReason[RemoteVideoStateChangeReason["kRemoteVideoStateChangeReasonNetworkCongestion"] = 1] = "kRemoteVideoStateChangeReasonNetworkCongestion";
    /** {en}
     * @brief Network back to normal
     */
    /** {zh}
     * @brief 网络恢复正常
     */
    RemoteVideoStateChangeReason[RemoteVideoStateChangeReason["kRemoteVideoStateChangeReasonNetworkRecovery"] = 2] = "kRemoteVideoStateChangeReasonNetworkRecovery";
    /** {en}
     * @brief Local user stops receiving remote video stream or local user disables video module
     */
    /** {zh}
     * @brief 本地用户停止接收远端视频流或本地用户禁用视频模块
     */
    RemoteVideoStateChangeReason[RemoteVideoStateChangeReason["kRemoteVideoStateChangeReasonLocalMuted"] = 3] = "kRemoteVideoStateChangeReasonLocalMuted";
    /** {en}
     * @brief Local user resumes receiving remote video streams or local user enables video modules
     */
    /** {zh}
     * @brief 本地用户恢复接收远端视频流或本地用户启用视频模块
     */
    RemoteVideoStateChangeReason[RemoteVideoStateChangeReason["kRemoteVideoStateChangeReasonLocalUnmuted"] = 4] = "kRemoteVideoStateChangeReasonLocalUnmuted";
    /** {en}
     * @brief The remote user stops sending the video stream or the remote user disables the video module
     */
    /** {zh}
     * @brief 远端用户停止发送视频流或远端用户禁用视频模块
     */
    RemoteVideoStateChangeReason[RemoteVideoStateChangeReason["kRemoteVideoStateChangeReasonRemoteMuted"] = 5] = "kRemoteVideoStateChangeReasonRemoteMuted";
    /** {en}
     * @brief Remote user resumes sending video stream or remote user enables video module
     */
    /** {zh}
     * @brief 远端用户恢复发送视频流或远端用户启用视频模块
     */
    RemoteVideoStateChangeReason[RemoteVideoStateChangeReason["kRemoteVideoStateChangeReasonRemoteUnmuted"] = 6] = "kRemoteVideoStateChangeReasonRemoteUnmuted";
    /** {en}
     * @brief The remote user leaves the channel. State transition see `onUserUnPublishStream`.
     */
    /** {zh}
     * @brief 远端用户离开频道。
     *        状态转换参考 onStreamRemove(85533#onstreamremove)
     */
    RemoteVideoStateChangeReason[RemoteVideoStateChangeReason["kRemoteVideoStateChangeReasonRemoteOffline"] = 7] = "kRemoteVideoStateChangeReasonRemoteOffline";
})(RemoteVideoStateChangeReason = exports.RemoteVideoStateChangeReason || (exports.RemoteVideoStateChangeReason = {}));
/** {en}
 * @brief First frame sending state
 */
/** {zh}
 * @brief 首帧发送状态
 */
var FirstFrameSendState;
(function (FirstFrameSendState) {
    /** {en}
     * @brief Sending.
     */
    /** {zh}
     * @brief 发送中
     */
    FirstFrameSendState[FirstFrameSendState["kFirstFrameSendStateSending"] = 0] = "kFirstFrameSendStateSending";
    /** {en}
     * @brief Sent.
     */
    /** {zh}
     * @brief 发送成功
     */
    FirstFrameSendState[FirstFrameSendState["kFirstFrameSendStateSent"] = 1] = "kFirstFrameSendStateSent";
    /** {en}
     * @brief Failed.
     */
    /** {zh}
     * @brief 发送失败
     */
    FirstFrameSendState[FirstFrameSendState["kFirstFrameSendStateEnd"] = 2] = "kFirstFrameSendStateEnd";
})(FirstFrameSendState = exports.FirstFrameSendState || (exports.FirstFrameSendState = {}));
/** {en}
 * @brief First frame playback state
 */
/** {zh}
 * @brief 首帧播放状态
 */
var FirstFramePlayState;
(function (FirstFramePlayState) {
    /** {en}
     * @brief Playing
     */
    /** {zh}
     * @brief 播放中
     */
    FirstFramePlayState[FirstFramePlayState["kFirstFramePlayStatePlaying"] = 0] = "kFirstFramePlayStatePlaying";
    /** {en}
     * @brief Play started.
     */
    /** {zh}
     * @brief 播放成功
     */
    FirstFramePlayState[FirstFramePlayState["kFirstFramePlayStatePlayed"] = 1] = "kFirstFramePlayStatePlayed";
    /** {en}
     * @brief Failed.
     */
    /** {zh}
     * @brief 播放失败
     */
    FirstFramePlayState[FirstFramePlayState["kFirstFramePlayStateEnd"] = 2] = "kFirstFramePlayStateEnd";
})(FirstFramePlayState = exports.FirstFramePlayState || (exports.FirstFramePlayState = {}));
/** {en}
 * @brief Mixing type
 */
/** {zh}
 * @brief 混音播放类型
 */
var AudioMixingType;
(function (AudioMixingType) {
    /** {en}
     * @brief Play at the local device only
     */
    /** {zh}
     * @brief 仅本地播放
     */
    AudioMixingType[AudioMixingType["kAudioMixingTypePlayout"] = 0] = "kAudioMixingTypePlayout";
    /** {en}
     * @brief Send to the remote devices only
     */
    /** {zh}
     * @brief 仅远端播放
     */
    AudioMixingType[AudioMixingType["kAudioMixingTypePublish"] = 1] = "kAudioMixingTypePublish";
    /** {en}
     * @brief Play and send to remote
     */
    /** {zh}
     * @brief 本地和远端同时播放
     */
    AudioMixingType[AudioMixingType["kAudioMixingTypePlayoutAndPublish"] = 2] = "kAudioMixingTypePlayoutAndPublish";
})(AudioMixingType = exports.AudioMixingType || (exports.AudioMixingType = {}));
/** {en}
 * @brief Stream fallback options of publisher
 */
/** {zh}
 * @brief 发布端音视频流回退选项
 */
var PublishFallbackOption;
(function (PublishFallbackOption) {
    /** {en}
     * @brief Default setting. No fallback is allowed under limited network conditions.
     */
    /** {zh}
     * @brief 上行网络不佳或设备性能不足时，不对音视频流作回退处理。默认设置。
     */
    PublishFallbackOption[PublishFallbackOption["kPublishFallbackOptionDisabled"] = 0] = "kPublishFallbackOptionDisabled";
    /** {en}
     * @brief Under limited network conditions, the video streams that you published will degrade sequentially from the highest-quality stream to the lowest-quality stream until it can match current network conditions. See [Stream Fallback](https://docs.byteplus.com/byteplus-rtc/docs/70137) for details.
     */
    /** {zh}
     * @brief 上行网络不佳或设备性能不足时，发布的视频流会从大流到小流依次降级，直到与当前网络性能匹配从大流开始做降级处理，具体降级规则参看[性能回退](https://www.volcengine.com/docs/6348/70137)文档。
     */
    PublishFallbackOption[PublishFallbackOption["kPublishFallbackOptionSimulcast"] = 1] = "kPublishFallbackOptionSimulcast";
})(PublishFallbackOption = exports.PublishFallbackOption || (exports.PublishFallbackOption = {}));
/** {en}
 * @brief  Room profile
 *        Choose an appropriate room-profile option to meet the requirement of the scenario for media encoding algorithm, video profiles, and network configurations.
 *        Call `setAudioProfile` to apply another audio quality option.
 */
/** {zh}
 * @brief 房间模式
 *        根据所需场景，选择合适的房间模式，应用不同的音视频算法、视频参数和网络配置
 *        调用 `setAudioProfile` 改变音频参数配置
 */
var RoomProfileType;
(function (RoomProfileType) {
    /** {en}
     * @brief General mode by default
     */
    /** {zh}
     * @brief 普通音视频通话模式。
     *        你应在 1V1 音视频通话时，使用此设置。
     *        此设置下，弱网抗性较好。
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeCommunication"] = 0] = "kRoomProfileTypeCommunication";
    /** {zh}
     * @deprecated since 342.1, use kRoomProfileTypeInteractivePodcast instead
     * @hidden
     * @brief 直播模式。
     *        当你对音视频通话的音质和画质要求较高时，应使用此设置。
     *        此设置下，当用户使用蓝牙耳机收听时，蓝牙耳机使用媒体模式。
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeLiveBroadcasting"] = 1] = "kRoomProfileTypeLiveBroadcasting";
    /** {en}
     * @brief Game voice mode. Low consumption of computing resources and network data
     *        Additional performance optimizations have been made for low-end devices:
     *             + Encodes frame length 40/60 for some low-end models.
     *             + Disables software 3A audio processing for some low-end models.
     *        Enhance iOS Compatibility with other screen recordings to avoid audio recordings being interrupted by RTC.
     */
    /** {zh}
     * @brief 游戏语音模式，低功耗、低流量消耗。
     *        低端机在此模式下运行时，进行了额外的性能优化：
     *            + 部分低端机型配置编码帧长 40/60
     *            + 部分低端机型关闭软件 3A 音频处理
     *        增强对 iOS 其他屏幕录制进行的兼容性，避免音频录制被 RTC 打断。
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeGame"] = 2] = "kRoomProfileTypeGame";
    /** {en}
     * @brief Cloud game mode.
     *        Use this mode for game App requiring low latency.
     *        During poor network connection, communication experiences get worse with this mode.
     */
    /** {zh}
     * @brief 云游戏模式。
     *        如果你的游戏场景需要低延迟的配置，使用此设置。
     *        此设置下，弱网抗性较差。
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeCloudGame"] = 3] = "kRoomProfileTypeCloudGame";
    /** {en}
     * @brief Cloud render mode featuring extra-low latency.
     *        Choose this mode if it is not a game App yet requires low latency.
     *        In this mode, latency will significantly decrease at the cost of lower audio quality as well as the bad performance with weak network signal.
     */
    /** {zh}
     * @brief 低时延模式。SDK 会使用低延时设置。
     *        当你的场景非游戏或云游戏场景，又需要极低延时的体验时，可以使用该模式。
     *        该模式下，音视频通话延时会明显降低，但同时弱网抗性、通话音质等均会受到一定影响。
     *        在使用此模式前，强烈建议咨询技术支持同学。
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeLowLatency"] = 4] = "kRoomProfileTypeLowLatency";
    /** {en}
     * @brief For 1 vs 1 video and audio calls
     */
    /** {zh}
     * @brief 适用于 1 vs 1 音视频通话
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeChat"] = 5] = "kRoomProfileTypeChat";
    /** {en}
     * @brief For video and audio chat rooms of 3 or more people
     */
    /** {zh}
     * @brief 适用于 3 人及以上纯语音通话
     *        音视频通话为媒体模式，上麦时切换为通话模式
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeChatRoom"] = 6] = "kRoomProfileTypeChatRoom";
    /** {en}
     * @brief For scenarios such as "Watch together." and "Listen together." Multiple clients are capable of playing the same videos and audios synchronically.
     *        In these scenarios, RTC does not involve the transportation of the sharing media but only synchronizes video/music playback across multiple clients via signaling.
     */
    /** {zh}
     * @brief 实现多端同步播放音视频，适用于 “一起看” 或 “一起听” 场景。
     *        该场景中，使用 RTC 信令同步播放进度，共享的音频内容不通过 RTC 进行传输。
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeLwTogether"] = 7] = "kRoomProfileTypeLwTogether";
    /** {en}
     * @brief For the game apps demanding high-resolution audio. In this mode, RTC plays audio using the media mode only.
     */
    /** {zh}
     * @brief 适用于对音质要求较高的游戏场景，优化音频 3A 策略，只通过媒体模式播放音频
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeGameHD"] = 8] = "kRoomProfileTypeGameHD";
    /** {en}
     * @brief For the events of co-hosting in the live-streaming
     *        During a livestreaming using a CDN network, the host can invite another host to join the co-hosting event using RTC.
     */
    /** {zh}
     * @brief 适用于直播中主播之间连麦的业务场景。
     *        直播时通过 CDN，发起连麦 PK 时使用 RTC。
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeCoHost"] = 9] = "kRoomProfileTypeCoHost";
    /** {en}
     * @brief For interactive podcasts that the host can have video and audio interactions with the audience. The voice mode is set to communication mode to avoid volume spiking and dipping acutely.
     */
    /** {zh}
     * @brief 适用于单主播和观众进行音视频互动的直播。通话模式，上下麦不会有模式切换，避免音量突变现象
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeInteractivePodcast"] = 10] = "kRoomProfileTypeInteractivePodcast";
    /** {en}
     * @brief For the online karaoke with high-quality audio and low latency
     *        In these scenarios, RTC transports the accompaniment and mixed audio, such as solo and non-realtime chorus.
     */
    /** {zh}
     * @brief 线上 KTV 场景，音乐音质，低延迟
     *        使用 RTC 传输伴奏音乐，混音后的歌声，适合独唱或单通合唱
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeKTV"] = 11] = "kRoomProfileTypeKTV";
    /** {en}
     * @brief For the online-chorusing scenarios requiring high-quality audio and low latency. Contact our technical specialists before you apply it to your App.
     */
    /** {zh}
     * @brief 适合在线实时合唱场景，高音质，超低延迟。使用本配置前请联系技术支持进行协助完成其他配置。
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeChorus"] = 12] = "kRoomProfileTypeChorus";
    /** {en}
     * @hidden
     * @brief For VR chat with support for 192 KHz audio sample rate and feature of 360 Reality AudioAudio
     */
    /** {zh}
     * @hidden
     * @brief 适用于 VR 场景。支持最高 192 KHz 音频采样率，可开启球形立体声。345之后支持
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeVRChat"] = 13] = "kRoomProfileTypeVRChat";
    /** {en}
     * @brief For scenarios of streaming live videos to only one client on the LAN. It can be applied to devices on the Internet or LAN.
     */
    /** {zh}
     * @brief 适用于 1 vs 1 游戏串流，支持公网或局域网。
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeGameStreaming"] = 14] = "kRoomProfileTypeGameStreaming";
    /** {en}
     * @brief For scenarios of streaming live videos to multiple clients within the LAN with the support of 60fps @8K video stream with the bitrate of 100 Mbps
     * A private media server is expected to be ready on the LAN.
     */
    /** {zh}
     * @brief 适用于局域网的 1 对多视频直播，最高支持 8K， 60 帧/秒， 100 Mbps 码率
     *        需要在局域网配置私有化部署媒体服务器。
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeLanLiveStreaming"] = 15] = "kRoomProfileTypeLanLiveStreaming";
    /** {en}
     * @brief For meeting Apps installed on personal devices
     */
    /** {zh}
     * @brief 适用于云端会议中的个人设备
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeMeeting"] = 16] = "kRoomProfileTypeMeeting";
    /** {en}
     * @brief For meeting Apps installed on terminals of meeting rooms, such as Rooms.
     */
    /** {zh}
     * @brief 适用于云端会议中的会议室终端设备，例如 Rooms，投屏盒子等。
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeMeetingRoom"] = 17] = "kRoomProfileTypeMeetingRoom";
    /** {en}
     * @brief For the online classrooms and lectures that over 10 participants in the room are allowed to join the video chat.
     */
    /** {zh}
     * @brief 适用于课堂互动，房间内所有成员都可以进行音视频互动
     *        当你的场景中需要同时互动的成员超过 10 人时使用此模式
     */
    RoomProfileType[RoomProfileType["kRoomProfileTypeClassroom"] = 18] = "kRoomProfileTypeClassroom";
})(RoomProfileType = exports.RoomProfileType || (exports.RoomProfileType = {}));
/** {zh}
 * @brief 订阅回退选项
 */
var SubscribeFallbackOption;
(function (SubscribeFallbackOption) {
    /** {zh}
     * @brief 下行网络较弱时，关闭订阅音视频流时的性能回退功能，默认值
     */
    SubscribeFallbackOption[SubscribeFallbackOption["kSubscribeFallbackOptionDisable"] = 0] = "kSubscribeFallbackOptionDisable";
    /** {zh}
     * @brief 下行网络较弱时，只接收视频小流
     */
    SubscribeFallbackOption[SubscribeFallbackOption["kSubscribeFallbackOptionVideoStreamLow"] = 1] = "kSubscribeFallbackOptionVideoStreamLow";
    /** {zh}
     * @brief 下行网络较弱时，先尝试只接收视频小流；如果网络环境无法显示视频，则再回退到只接收远端订阅的音频流
     */
    SubscribeFallbackOption[SubscribeFallbackOption["kSubscribeFallbackOptionAudioOnly"] = 2] = "kSubscribeFallbackOptionAudioOnly";
})(SubscribeFallbackOption = exports.SubscribeFallbackOption || (exports.SubscribeFallbackOption = {}));
/** {zh}
 * @brief 是否开启镜像模式
 */
var MirrorMode;
(function (MirrorMode) {
    /** {zh}
     * @brief 不开启
     */
    MirrorMode[MirrorMode["kMirrorModeOff"] = 0] = "kMirrorModeOff";
    /** {zh}
     * @brief 开启
     */
    MirrorMode[MirrorMode["kMirrorModeOn"] = 1] = "kMirrorModeOn";
})(MirrorMode = exports.MirrorMode || (exports.MirrorMode = {}));
/** {en}
 * @brief Mirror type
 */
/** {zh}
 * @brief 镜像类型
 */
var MirrorType;
(function (MirrorType) {
    /** {en}
     * @brief The preview and the published video stream are not mirrored.
     */
    /** {zh}
     * @brief 本地预览和编码传输时均无镜像效果
     */
    MirrorType[MirrorType["kMirrorTypeNone"] = 0] = "kMirrorTypeNone";
    /** {en}
     * @brief The preview is mirrored. The published video stream is not mirrored.
     */
    /** {zh}
     * @brief 本地预览时有镜像效果，编码传输时无镜像效果
     */
    MirrorType[MirrorType["kMirrorTypeRender"] = 1] = "kMirrorTypeRender";
    /** {en}
     * @brief The preview and the published video stream are mirrored.
     */
    /** {zh}
     * @brief 本地预览和编码传输时均有镜像效果
     */
    MirrorType[MirrorType["kMirrorTypeRenderAndEncoder"] = 3] = "kMirrorTypeRenderAndEncoder";
})(MirrorType = exports.MirrorType || (exports.MirrorType = {}));
/** {en}
 * @brief Pause/resume receiving the remote media stream type.
 */
/** {zh}
 * @brief 暂停/恢复接收远端的媒体流类型。
 */
var PauseResumeControlMediaType;
(function (PauseResumeControlMediaType) {
    /** {en}
     * @brief Audio only
     */
    /** {zh}
     * @brief 只控制音频，不影响视频
     */
    PauseResumeControlMediaType[PauseResumeControlMediaType["kRTCPauseResumeControlMediaTypeAudio"] = 0] = "kRTCPauseResumeControlMediaTypeAudio";
    /** {en}
     * @brief Video only
     */
    /** {zh}
     * @brief 只控制视频，不影响音频
     */
    PauseResumeControlMediaType[PauseResumeControlMediaType["kRTCPauseResumeControlMediaTypeVideo"] = 1] = "kRTCPauseResumeControlMediaTypeVideo";
    /** {en}
     * @brief Both video and audio
     */
    /** {zh}
     * @brief 同时控制音频和视频
     */
    PauseResumeControlMediaType[PauseResumeControlMediaType["kRTCPauseResumeControlMediaTypeVideoAndAudio"] = 2] = "kRTCPauseResumeControlMediaTypeVideoAndAudio";
})(PauseResumeControlMediaType = exports.PauseResumeControlMediaType || (exports.PauseResumeControlMediaType = {}));
/** {en}
 * @brief Whether to collect mouse information when collecting screen video stream internally
 */
/** {zh}
 * @brief 内部采集屏幕视频流时，是否采集鼠标信息
 */
var MouseCursorCaptureState;
(function (MouseCursorCaptureState) {
    /** {en}
     * @brief Collect mouse information
     */
    /** {zh}
     * @brief 采集鼠标信息
     */
    MouseCursorCaptureState[MouseCursorCaptureState["kMouseCursorCaptureStateOn"] = 0] = "kMouseCursorCaptureStateOn";
    /** {en}
     * @brief Do not collect mouse information
     */
    /** {zh}
     * @brief 不采集鼠标信息
     */
    MouseCursorCaptureState[MouseCursorCaptureState["kMouseCursorCaptureStateOff"] = 1] = "kMouseCursorCaptureStateOff";
})(MouseCursorCaptureState = exports.MouseCursorCaptureState || (exports.MouseCursorCaptureState = {}));
/** {en}
 * @brief Media stream type
 */
/** {zh}
 * @brief 媒体流类型
 */
var MediaStreamType;
(function (MediaStreamType) {
    /** {en}
     * @brief Audio only
     */
    /** {zh}
     * @brief 只控制音频
     */
    MediaStreamType[MediaStreamType["kMediaStreamTypeAudio"] = 1] = "kMediaStreamTypeAudio";
    /** {en}
     * @brief Video only
     */
    /** {zh}
     * @brief 只控制视频
     */
    MediaStreamType[MediaStreamType["kMediaStreamTypeVideo"] = 2] = "kMediaStreamTypeVideo";
    /** {en}
     * @brief Both audio and video
     */
    /** {zh}
     * @brief 同时控制音频和视频
     */
    MediaStreamType[MediaStreamType["kMediaStreamTypeBoth"] = 3] = "kMediaStreamTypeBoth";
})(MediaStreamType = exports.MediaStreamType || (exports.MediaStreamType = {}));
/** {en}
 * @brief Basic beauty effect.
 */
/** {zh}
 * @brief 基础美颜模式
 */
var EffectBeautyMode;
(function (EffectBeautyMode) {
    /** {en}
     * @brief Brightness.
     */
    /** {zh}
     * @brief 美白
     */
    EffectBeautyMode[EffectBeautyMode["kEffectBeautyWhite"] = 0] = "kEffectBeautyWhite";
    /** {en}
     * @brief Smoothness.
     */
    /** {zh}
     * @brief 磨皮
     */
    EffectBeautyMode[EffectBeautyMode["kEffectBeautySmooth"] = 1] = "kEffectBeautySmooth";
    /** {en}
     * @brief Sharpness.
     */
    /** {zh}
     * @brief 锐化
     */
    EffectBeautyMode[EffectBeautyMode["kEffectBeautySharpen"] = 2] = "kEffectBeautySharpen";
})(EffectBeautyMode = exports.EffectBeautyMode || (exports.EffectBeautyMode = {}));
/** {en}
 * @brief Mix playback channel type
 */
/** {zh}
 * @brief 混音播放声道类型
 */
var AudioMixingDualMonoMode;
(function (AudioMixingDualMonoMode) {
    /** {en}
     * @brief Consistent with audio files
     */
    /** {zh}
     * @brief 和音频文件一致
     */
    AudioMixingDualMonoMode[AudioMixingDualMonoMode["kAudioMixingDualMonoModeAuto"] = 0] = "kAudioMixingDualMonoModeAuto";
    /** {en}
     * @brief Only the left channel audio in the audio file can be heard
     */
    /** {zh}
     * @brief 只能听到音频文件中左声道的音频
     */
    AudioMixingDualMonoMode[AudioMixingDualMonoMode["kAudioMixingDualMonoModeL"] = 1] = "kAudioMixingDualMonoModeL";
    /** {en}
     * @brief Only the right channel audio in the audio file can be heard
     */
    /** {zh}
     * @brief 只能听到音频文件中右声道的音频
     */
    AudioMixingDualMonoMode[AudioMixingDualMonoMode["kAudioMixingDualMonoModeR"] = 2] = "kAudioMixingDualMonoModeR";
    /** {en}
     * @brief Can hear the left and right audio channels in the audio file at the same time
     */
    /** {zh}
     * @brief 能同时听到音频文件中左右声道的音频
     */
    AudioMixingDualMonoMode[AudioMixingDualMonoMode["kAudioMixingDualMonoModeMix"] = 3] = "kAudioMixingDualMonoModeMix";
})(AudioMixingDualMonoMode = exports.AudioMixingDualMonoMode || (exports.AudioMixingDualMonoMode = {}));
/** {en}
 * @brief RTM message
 */
/** {zh}
 * @brief 发送消息的可靠有序性
 */
var MessageConfig;
(function (MessageConfig) {
    /** {en}
     * @brief Low latency reliable and orderly message
     */
    /** {zh}
     * @brief 低延时可靠有序消息
     */
    MessageConfig[MessageConfig["kMessageConfigReliableOrdered"] = 0] = "kMessageConfigReliableOrdered";
    /** {en}
     * @brief Ultra-low latency ordered message
     */
    /** {zh}
     * @brief 超低延时有序消息
     */
    MessageConfig[MessageConfig["kMessageConfigUnreliableOrdered"] = 1] = "kMessageConfigUnreliableOrdered";
    /** {en}
     * @brief Ultra-low latency unordered message
     */
    /** {zh}
     * @brief 超低延时无序消息
     */
    MessageConfig[MessageConfig["kMessageConfigUnreliableUnordered"] = 2] = "kMessageConfigUnreliableUnordered";
})(MessageConfig = exports.MessageConfig || (exports.MessageConfig = {}));
/** {en}
 * @brief A/V synchronization states
 */
/** {zh}
 * @brief 音视频同步状态
 */
var AVSyncState;
(function (AVSyncState) {
    /** {en}
     * @brief A/V synchronization begins.
     */
    /** {zh}
     * @brief 音视频开始同步
     */
    AVSyncState[AVSyncState["kAVSyncStateAVStreamSyncBegin"] = 0] = "kAVSyncStateAVStreamSyncBegin";
    /** {en}
     * @brief The publisher stops publishing audio stream during the synchronization, which does not affect the sync relationship.
     */
    /** {zh}
     * @brief 音视频同步过程中音频移除，但不影响当前的同步关系
     */
    AVSyncState[AVSyncState["kAVSyncStateAudioStreamRemove"] = 1] = "kAVSyncStateAudioStreamRemove";
    /** {en}
     * @brief The publisher stops publishing audio stream during the synchronization, which does not affect the sync relationship.
     */
    /** {zh}
     * @brief 音视频同步过程中视频移除，但不影响当前的同步关系
     */
    AVSyncState[AVSyncState["kAVSyncStateVdieoStreamRemove"] = 2] = "kAVSyncStateVdieoStreamRemove";
    /** {en}
     * @hidden
     * @brief Subscriber settings synchronization
     */
    /** {zh}
     * @hidden
     * @brief 订阅端设置同步
     */
    AVSyncState[AVSyncState["kAVSyncStateSetAVSyncStreamId"] = 3] = "kAVSyncStateSetAVSyncStreamId";
})(AVSyncState = exports.AVSyncState || (exports.AVSyncState = {}));
/** {en}
 * @brief The state of the relaying for each room
 */
/** {zh}
 * @brief 跨房间转发媒体流过程中的不同目标房间的状态和错误信息
 */
var ForwardStreamState;
(function (ForwardStreamState) {
    /** {en}
     * @brief Idle
     * + States of all the rooms turns to idle after you call `stopForwardStreamToRooms`.
     * + States of the rooms turns to idle that you call `updateForwardStreamToRooms` to remove.
     */
    /** {zh}
     * @brief 空闲状态
     * + 成功调用 `stopForwardStreamToRooms` 后，所有目标房间为空闲状态。
     * + 成功调用 `updateForwardStreamToRooms` 减少目标房间后，本次减少的目标房间为空闲状态。
     */
    ForwardStreamState[ForwardStreamState["kForwardStreamStateIdle"] = 0] = "kForwardStreamStateIdle";
    /** {en}
     * @brief Start relaying.
     * + State of the rooms turn to this state after the relaying starts successfully by calling `startForwardStreamToRooms`.
     * + State of the rooms added by calling `updateForwardStreamToRooms` turn to this state after the relaying start successfully.
     */
    /** {zh}
     * @brief 开始转发
     * + 调用 `startForwardStreamToRooms` 成功向所有房间开始转发媒体流后，返回此状态。
     * + 调用 `updateForwardStreamToRooms` 后，成功向新增目标房间开始转发媒体流后，返回此状态。
     */
    ForwardStreamState[ForwardStreamState["kForwardStreamStateSuccess"] = 1] = "kForwardStreamStateSuccess";
    /** {en}
     * @brief Relay fails. Refer to [ForwardStreamError](85534#forwardstreamerror) for more information for more information.
     *        Once the relaying fails, state of the room turns to this state after calling `startForwardStreamToRooms` or `updateForwardStreamToRooms`.
     */
    /** {zh}
     * @brief 转发失败，失败详情参考 [ForwardStreamError](85534#forwardstreamerror)
     *        调用 `startForwardStreamToRooms` 或 `updateForwardStreamToRooms` 后，如遇转发失败，返回此状态。
     */
    ForwardStreamState[ForwardStreamState["kForwardStreamStateFailure"] = 2] = "kForwardStreamStateFailure";
})(ForwardStreamState = exports.ForwardStreamState || (exports.ForwardStreamState = {}));
/** {en}
 * @detail 85534
 * @brief Error codes during the relaying
 */
/** {zh}
 * @detail 85534
 * @brief 媒体流跨房间转发过程中抛出的错误码
 */
var ForwardStreamError;
(function (ForwardStreamError) {
    /** {en}
     * @brief Normal
     */
    /** {zh}
     * @brief 正常
     */
    ForwardStreamError[ForwardStreamError["kForwardStreamErrorOK"] = 0] = "kForwardStreamErrorOK";
    /** {en}
     * @brief Invalid argument
     */
    /** {zh}
     * @brief 参数异常
     */
    ForwardStreamError[ForwardStreamError["kForwardStreamErrorInvalidArgument"] = 1201] = "kForwardStreamErrorInvalidArgument";
    /** {en}
     * @brief Invalid token
     */
    /** {zh}
     * @brief token 错误
     */
    ForwardStreamError[ForwardStreamError["kForwardStreamErrorInvalidToken"] = 1202] = "kForwardStreamErrorInvalidToken";
    /** {en}
     * @brief Error returning from server
     */
    /** {zh}
     * @brief 服务端异常
     */
    ForwardStreamError[ForwardStreamError["kForwardStreamErrorResponse"] = 1203] = "kForwardStreamErrorResponse";
    /** {en}
     * @brief Relaying aborts for the reason of that a User with the same user ID as that of the publisher joins.
     */
    /** {zh}
     * @brief 目标房间有相同 user id 的用户加入，转发中断
     */
    ForwardStreamError[ForwardStreamError["kForwardStreamErrorRemoteKicked"] = 1204] = "kForwardStreamErrorRemoteKicked";
    /** {en}
     * @brief Server denies.
     */
    /** {zh}
     * @brief 服务端不支持转发功能
     */
    ForwardStreamError[ForwardStreamError["kForwardStreamErrorNotSupport"] = 1205] = "kForwardStreamErrorNotSupport";
})(ForwardStreamError = exports.ForwardStreamError || (exports.ForwardStreamError = {}));
/** {en}
 * @brief Events during the relaying
 */
/** {zh}
 * @brief 媒体流跨房间转发事件
 */
var ForwardStreamEvent;
(function (ForwardStreamEvent) {
    /** {en}
     * @brief Relaying pauses for the reason of network disconnecting.
     */
    /** {zh}
     * @brief 本端与服务器网络连接断开，暂停转发。
     */
    ForwardStreamEvent[ForwardStreamEvent["kForwardStreamEventDisconnected"] = 0] = "kForwardStreamEventDisconnected";
    /** {en}
     * @brief Relaying recovers from the disconnecting.
     */
    /** {zh}
     * @brief 本端与服务器网络连接恢复，转发服务连接成功。
     */
    ForwardStreamEvent[ForwardStreamEvent["kForwardStreamEventConnected"] = 1] = "kForwardStreamEventConnected";
    /** {en}
     * @brief Relaying aborts for the reason of that a User with the same user ID as that of the publisher joins.
     */
    /** {zh}
     * @brief 转发中断。转发过程中，如果相同 user_id 的用户进入目标房间，转发中断。
     */
    ForwardStreamEvent[ForwardStreamEvent["kForwardStreamEventInterrupt"] = 2] = "kForwardStreamEventInterrupt";
    /** {en}
     * @brief Target room list updates after you call `updateForwardStreamToRooms`.
     */
    /** {zh}
     * @brief 目标房间已更新，由 `updateForwardStreamToRooms` 触发。
     */
    ForwardStreamEvent[ForwardStreamEvent["kForwardStreamEventDstRoomUpdated"] = 3] = "kForwardStreamEventDstRoomUpdated";
    /** {en}
     * @brief Wrong API-calling order. For example, call `updateForwardStreamToRooms` before calling `startForwardStreamToRooms`.
     */
    /** {zh}
     * @brief API 调用时序错误。例如，在调用 `startForwardStreamToRooms` 之前调用 `updateForwardStreamToRooms` 。
     */
    ForwardStreamEvent[ForwardStreamEvent["kForwardStreamEventUnExpectAPICall"] = 4] = "kForwardStreamEventUnExpectAPICall";
})(ForwardStreamEvent = exports.ForwardStreamEvent || (exports.ForwardStreamEvent = {}));
/** {en}
 * @brief Volume Roll-off modes that a sound has in an audio source
 */
/** {zh}
 * @brief 空间音频音量随距离衰减模式
 */
var AttenuationType;
(function (AttenuationType) {
    /** {en}
     * @brief Disable Volume Attenuation
     */
    /** {zh}
     * @brief 不随距离衰减
     */
    AttenuationType[AttenuationType["kAttenuationTypeNone"] = 0] = "kAttenuationTypeNone";
    /** {en}
     * @brief Linear roll-off mode which lowers the volume of the sound over the distance
     */
    /** {zh}
     * @brief 线性衰减，音量随距离增大而线性减小
     */
    AttenuationType[AttenuationType["kAttenuationTypeLinear"] = 1] = "kAttenuationTypeLinear";
    /** {en}
     * @brief Exponential roll-off mode which exponentially decreases the volume of the sound with the distance raising
     */
    /** {zh}
     * @brief 指数型衰减，音量随距离增大进行指数衰减
     */
    AttenuationType[AttenuationType["kAttenuationTypeExponential"] = 2] = "kAttenuationTypeExponential";
})(AttenuationType = exports.AttenuationType || (exports.AttenuationType = {}));
/** {en}
 * @brief Encoder preference
 */
/** {zh}
 * @brief 编码策略偏好
 */
var VideoEncodePreference;
(function (VideoEncodePreference) {
    /** {en}
     * @brief No preference
     */
    /** {zh}
     * @brief 无偏好
     */
    VideoEncodePreference[VideoEncodePreference["kVideoEncodePreferenceDisabled"] = 0] = "kVideoEncodePreferenceDisabled";
    /** {en}
     * @brief Frame rate first
     */
    /** {zh}
     * @brief 帧率优先
     */
    VideoEncodePreference[VideoEncodePreference["kVideoEncodePreferenceFramerate"] = 1] = "kVideoEncodePreferenceFramerate";
    /** {en}
     * @brief Quality first
     */
    /** {zh}
     * @brief 质量优先
     */
    VideoEncodePreference[VideoEncodePreference["kVideoEncodePreferenceQuality"] = 2] = "kVideoEncodePreferenceQuality";
    /** {en}
     * @brief Balancing quality and frame rate
     */
    /** {zh}
     * @brief 平衡质量与帧率
     */
    VideoEncodePreference[VideoEncodePreference["kVideoEncodePreferenceBalance"] = 3] = "kVideoEncodePreferenceBalance";
})(VideoEncodePreference = exports.VideoEncodePreference || (exports.VideoEncodePreference = {}));
/** {en}
 * @brief Video capture preference
 */
/** {zh}
 * @brief 视频采集配置
 */
var CapturePreference;
(function (CapturePreference) {
    /** {en}
     * @brief (Default) Video capture preference: auto
     *        SDK determines the best video capture parameters referring to the camera output parameters and the encoder configuration.
     */
    /** {zh}
     * @brief （默认）自动设置采集参数。
     *        SDK在开启采集时根据服务端下发的采集配置结合编码参数设置最佳采集参数。
     */
    CapturePreference[CapturePreference["KAuto"] = 0] = "KAuto";
    /** {en}
     * @brief Video capture preference: manual
     *        Set the resolution and the frame rate manually.
     */
    /** {zh}
     * @brief 手动设置采集参数，包括采集分辨率、帧率。
     */
    CapturePreference[CapturePreference["KManual"] = 1] = "KManual";
    /** {en}
     * @brief Video capture preference: encoder configuration
     *        The capture parameters are the same with the parameters set in [setVideoEncoderConfig](85532#setvideoencoderconfig).
     */
    /** {zh}
     * @brief 采集参数与编码参数一致，即在 [setVideoEncoderConfig](85532#setvideoencoderconfig) 中设置的参数。
     */
    CapturePreference[CapturePreference["KAutoPerformance"] = 2] = "KAutoPerformance";
})(CapturePreference = exports.CapturePreference || (exports.CapturePreference = {}));
/** {en}
 * @brief Call test result
 */
/** {zh}
 * @brief 音视频回路测试结果
 */
var EchoTestResult;
(function (EchoTestResult) {
    /** {en}
     * @brief The playback of captured audio/video is received, test succeeds.
     */
    /** {zh}
     * @brief 接收到采集的音视频的回放，通话回路检测成功
     */
    EchoTestResult[EchoTestResult["kTestSuccess"] = 0] = "kTestSuccess";
    /** {en}
     * @brief Test is not completed after 60 seconds and has been stopped automatically.
     */
    /** {zh}
     * @brief 测试超过 60s 仍未完成，已自动停止
     */
    EchoTestResult[EchoTestResult["kTestTimeout"] = 1] = "kTestTimeout";
    /** {en}
     * @brief Less than 5s between the end of the last test and the start of the next test.
     */
    /** {zh}
     * @brief 上一次测试结束和下一次测试开始之间的时间间隔少于 5s
     */
    EchoTestResult[EchoTestResult["kTestIntervalShort"] = 2] = "kTestIntervalShort";
    /** {en}
     * @brief Audio capture error
     */
    /** {zh}
     * @brief 音频采集异常
     */
    EchoTestResult[EchoTestResult["kAudioDeviceError"] = 3] = "kAudioDeviceError";
    /** {en}
     * @brief Video capture error
     */
    /** {zh}
     * @brief 视频采集异常
     */
    EchoTestResult[EchoTestResult["kVideoDeviceError"] = 4] = "kVideoDeviceError";
    /** {en}
     * @brief Audio reception error
     */
    /** {zh}
     * @brief 音频接收异常
     */
    EchoTestResult[EchoTestResult["kAudioReceiveError"] = 5] = "kAudioReceiveError";
    /** {en}
     * @brief Video reception error
     */
    /** {zh}
     * @brief 视频接收异常
     */
    EchoTestResult[EchoTestResult["kVideoReceiveError"] = 6] = "kVideoReceiveError";
    /** {en}
     * @brief Unrecoverable internal error
     */
    /** {zh}
     * @brief 内部错误，不可恢复
     */
    EchoTestResult[EchoTestResult["kInternalError"] = 7] = "kInternalError";
})(EchoTestResult = exports.EchoTestResult || (exports.EchoTestResult = {}));
/** {en}
 * @brief The volume callback modes.
 */
/** {zh}
 * @brief 音量回调模式。
 */
var AudioReportMode;
(function (AudioReportMode) {
    /** {en}
     * @brief Always-on(Default).
     */
    /** {zh}
     * @brief 默认始终开启音量回调。
     */
    AudioReportMode[AudioReportMode["kAudioReportModeNormal"] = 0] = "kAudioReportModeNormal";
    /** {en}
     * @brief After visibly joining a room and unpublish your streams, disable the volume callback.
     */
    /** {zh}
     * @brief 可见用户进房并停止推流后，关闭音量回调。
     */
    AudioReportMode[AudioReportMode["kAudioReportModeDisconnect"] = 1] = "kAudioReportModeDisconnect";
    /** {en}
     * @brief After visibly joining a room and unpublish your streams, enable the volume callback. The volume is reset to 0.
     */
    /** {zh}
     * @brief 可见用户进房并停止推流后，开启音量回调，回调值重置为0。
     */
    AudioReportMode[AudioReportMode["kAudioReportModeReset"] = 2] = "kAudioReportModeReset";
})(AudioReportMode = exports.AudioReportMode || (exports.AudioReportMode = {}));
/** {en}
 * @brief Configuration of whether including locally mixed audio info in the audio properties report.
 */
/** {zh}
 * @brief 音频信息提示中是否包含本地混音音频数据。
 */
var AudioPropertiesMode;
(function (AudioPropertiesMode) {
    /** {en}
     * @brief Only locally captured microphone audio info and locally captured screen audio info are included in the audio properties report.
     */
    /** {zh}
     * @brief 音频信息提示中，仅包含本地麦克风采集的音频数据和本地屏幕音频采集数据。
     */
    AudioPropertiesMode[AudioPropertiesMode["kAudioPropertiesModeMicrophone"] = 0] = "kAudioPropertiesModeMicrophone";
    /** {en}
     * @brief Locally mixing audio info is included in the audio properties report, in addition to locally captured microphone audio info and locally captured screen audio info.
     */
    /** {zh}
     * @brief 音频信息提示中，除本地麦克风采集的音频数据和本地屏幕音频采集数据外，还包含本地混音的音频数据。
     */
    AudioPropertiesMode[AudioPropertiesMode["kAudioPropertiesModeAudioMixing"] = 1] = "kAudioPropertiesModeAudioMixing";
})(AudioPropertiesMode = exports.AudioPropertiesMode || (exports.AudioPropertiesMode = {}));
/** {en}
 * @brief Audio track type of the KTV player.
 */
/** {zh}
 * @brief 原唱伴唱类型。
 */
var AudioTrackType;
(function (AudioTrackType) {
    /** {en}
     * @brief Play the original music with vocals.
     */
    /** {zh}
     * @brief 播放原唱。
     */
    AudioTrackType[AudioTrackType["kOriginal"] = 1] = "kOriginal";
    /** {en}
     * @brief Play the instrumental music without vocals.
     */
    /** {zh}
     * @brief 播放伴唱。
     */
    AudioTrackType[AudioTrackType["kAccompy"] = 2] = "kAccompy";
})(AudioTrackType = exports.AudioTrackType || (exports.AudioTrackType = {}));
/** {en}
 * @brief Audio play type.
 */
/** {zh}
 * @brief 音乐播放类型。
 */
var AudioPlayType;
(function (AudioPlayType) {
    /** {en}
     * @brief Only play on the local side.
     */
    /** {zh}
     * @brief 仅本地播放。
     */
    AudioPlayType[AudioPlayType["kLocal"] = 0] = "kLocal";
    /** {en}
     * @brief Only play on the remote side.
     */
    /** {zh}
     * @brief 仅远端播放。
     */
    AudioPlayType[AudioPlayType["kRemote"] = 1] = "kRemote";
    /** {en}
     * @brief Play on the local and remote side.
     */
    /** {zh}
     * @brief 本地、远端同时播放。
     */
    AudioPlayType[AudioPlayType["kLocalAndRemote"] = 2] = "kLocalAndRemote";
})(AudioPlayType = exports.AudioPlayType || (exports.AudioPlayType = {}));
/** {en}
 * @brief The lyrics file's format.
 */
/** {zh}
 * @brief 歌词文件类型。
 */
var DownloadLyricType;
(function (DownloadLyricType) {
    /** {en}
     * @brief KRC lyrics file.
     */
    /** {zh}
     * @brief KRC 歌词文件。
     */
    DownloadLyricType[DownloadLyricType["kKRC"] = 0] = "kKRC";
    /** {en}
     * @brief LRC lyrics file.
     */
    /** {zh}
     * @brief LRC 歌词文件。
     */
    DownloadLyricType[DownloadLyricType["kLRC"] = 1] = "kLRC";
})(DownloadLyricType = exports.DownloadLyricType || (exports.DownloadLyricType = {}));
/** {en}
 * @hidden
 * @brief KTV error code.
 */
/** {zh}
 * @detail 85534
 * @brief KTV 错误码。
 */
var KTVErrorCode;
(function (KTVErrorCode) {
    /** {en}
     * @brief Success.
     */
    /** {zh}
     * @brief 成功。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeOK"] = 0] = "kKTVErrorCodeOK";
    /** {en}
     * @brief Invalid AppID.
     */
    /** {zh}
     * @brief AppID 异常。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeAppidInValid"] = -3000] = "kKTVErrorCodeAppidInValid";
    /** {en}
     * @brief Invalid parameter.
     */
    /** {zh}
     * @brief 非法参数，传入的参数不正确。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeParasInValid"] = -3001] = "kKTVErrorCodeParasInValid";
    /** {en}
     * @brief Failed to get music resources.
     */
    /** {zh}
     * @brief 获取歌曲资源失败。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeGetMusicFailed"] = -3002] = "kKTVErrorCodeGetMusicFailed";
    /** {en}
     * @brief Failed to get lyrics.
     */
    /** {zh}
     * @brief 获取歌词失败。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeGetLyricFailed"] = -3003] = "kKTVErrorCodeGetLyricFailed";
    /** {en}
     * @brief The music is removed.
     */
    /** {zh}
     * @brief 歌曲下架。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeMusicTakedown"] = -3004] = "kKTVErrorCodeMusicTakedown";
    /** {en}
     * @brief Failed to download the music file.
     */
    /** {zh}
     * @brief 歌曲文件下载失败。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeMusicDownload"] = -3005] = "kKTVErrorCodeMusicDownload";
    /** {en}
     * @brief Failed to download the MIDI file.
     */
    /** {zh}
     * @brief MIDI 文件下载失败。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeMidiDownloadFailed"] = -3006] = "kKTVErrorCodeMidiDownloadFailed";
    /** {en}
     * @brief The system is busy.
     */
    /** {zh}
     * @brief 系统繁忙。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeSystemBusy"] = -3007] = "kKTVErrorCodeSystemBusy";
    /** {en}
     * @brief Network anomaly.
     */
    /** {zh}
     * @brief 网络异常。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeNetwork"] = -3008] = "kKTVErrorCodeNetwork";
    /** {en}
     * @brief The KTV feature is not added to the room.
     */
    /** {zh}
     * @brief KTV 功能未加入房间。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeNotJoinRoom"] = -3009] = "kKTVErrorCodeNotJoinRoom";
    /** {en}
     * @brief Failed to parse data.
     */
    /** {zh}
     * @brief 解析数据失败。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeParseData"] = -3010] = "kKTVErrorCodeParseData";
    /** {en}
     * @brief Failed to download.
     */
    /** {zh}
     * @brief 下载失败。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeDownload"] = -3011] = "kKTVErrorCodeDownload";
    /** {en}
     * @brief Already downloading.
     */
    /** {zh}
     * @brief 已在下载中。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeDownloading"] = -3012] = "kKTVErrorCodeDownloading";
    /** {en}
     * @brief Internal error. Contact the technical support representatives for help.
     */
    /** {zh}
     * @brief 内部错误，联系技术支持人员。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeInternalDomain"] = -3013] = "kKTVErrorCodeInternalDomain";
    /**
     * @brief 下载失败，磁盘空间不足。清除缓存后重试。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeInsufficientDiskSpace"] = -3014] = "kKTVErrorCodeInsufficientDiskSpace";
    /**
     * @brief 下载失败，音乐文件解密失败，联系技术支持人员。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeMusicDecryptionFailed"] = -3015] = "kKTVErrorCodeMusicDecryptionFailed";
    /**
     * @brief 下载失败，音乐文件重命名失败，请重试。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeFileRenameFailed"] = -3016] = "kKTVErrorCodeFileRenameFailed";
    /**
     * @brief 下载失败，下载超时，请重试。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeDownloadTimeOut"] = -3017] = "kKTVErrorCodeDownloadTimeOut";
    /**
     * @brief 清除缓存失败，可能原因是文件被占用或者系统异常，请重试。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeClearCacheFailed"] = -3018] = "kKTVErrorCodeClearCacheFailed";
    /**
     * @brief 取消下载。
     */
    KTVErrorCode[KTVErrorCode["kKTVErrorCodeDownloadCanceled"] = -3019] = "kKTVErrorCodeDownloadCanceled";
})(KTVErrorCode = exports.KTVErrorCode || (exports.KTVErrorCode = {}));
/** {en}
 * @brief The lyrics type.
 */
/** {zh}
 * @brief 歌词格式类型。
 */
var LyricStatus;
(function (LyricStatus) {
    /** {en}
     * @brief No lyrics.
     */
    /** {zh}
     * @brief 无歌词。
     */
    LyricStatus[LyricStatus["kNone"] = 0] = "kNone";
    /** {en}
     * @brief KRC lyrics.
     */
    /** {zh}
     * @brief KRC 歌词。
     */
    LyricStatus[LyricStatus["kKRC"] = 1] = "kKRC";
    /** {en}
     * @brief LRC lyrics.
     */
    /** {zh}
     * @brief LRC 歌词。
     */
    LyricStatus[LyricStatus["kLRC"] = 2] = "kLRC";
    /** {en}
     * @brief KRC and LRC lyrics.
     */
    /** {zh}
     * @brief KRC 歌词和 LRC 歌词均有。
     */
    LyricStatus[LyricStatus["kKRCAndLRC"] = 3] = "kKRCAndLRC";
})(LyricStatus = exports.LyricStatus || (exports.LyricStatus = {}));
/** {en}
 * @brief Hot music type.
 */
/** {zh}
 * @brief 热榜类别。
 */
var MusicHotType;
(function (MusicHotType) {
    /** {en}
     * @brief Hot music in the content center.
     */
    /** {zh}
     * @brief 火山内容中心热歌榜。
     */
    MusicHotType[MusicHotType["kMusicHotTypeContentCenter"] = 1] = "kMusicHotTypeContentCenter";
    /** {en}
     * @brief Hot music of the project.
     */
    /** {zh}
     * @brief 项目热歌榜。
     */
    MusicHotType[MusicHotType["kMusicHotTypeProject"] = 2] = "kMusicHotTypeProject";
})(MusicHotType = exports.MusicHotType || (exports.MusicHotType = {}));
/** {en}
 * @brief Download file type.
 */
/** {zh}
 * @brief 下载文件类型。
 */
var DownloadFileType;
(function (DownloadFileType) {
    /** {en}
     * @brief Audio file.
     */
    /** {zh}
     * @brief 音频文件。
     */
    DownloadFileType[DownloadFileType["kDownloadFileTypeMusic"] = 1] = "kDownloadFileTypeMusic";
    /** {en}
     * @brief KRC lyrics file.
     */
    /** {zh}
     * @brief KRC 歌词文件。
     */
    DownloadFileType[DownloadFileType["kDownloadFileTypeKRC"] = 2] = "kDownloadFileTypeKRC";
    /** {en}
     * @brief LRC lyrics file.
     */
    /** {zh}
     * @brief LRC 歌词文件。
     */
    DownloadFileType[DownloadFileType["kDownloadFileTypeLRC"] = 3] = "kDownloadFileTypeLRC";
    /** {en}
     * @brief MIDI file.
     */
    /** {zh}
     * @brief MIDI 文件。
     */
    DownloadFileType[DownloadFileType["kDownloadFileTypeMIDI"] = 4] = "kDownloadFileTypeMIDI";
})(DownloadFileType = exports.DownloadFileType || (exports.DownloadFileType = {}));
/** {en}
 * @brief Music playing status.
 */
/** {zh}
 * @brief 音乐播放状态。
 */
var PlayState;
(function (PlayState) {
    /** {en}
     * @brief Playing.
     */
    /** {zh}
     * @brief 播放中。
     */
    PlayState[PlayState["kPlaying"] = 1] = "kPlaying";
    /** {en}
     * @brief Paused.
     */
    /** {zh}
     * @brief 暂停中。
     */
    PlayState[PlayState["kPaused"] = 2] = "kPaused";
    /** {en}
     * @brief Stopped.
     */
    /** {zh}
     * @brief 已停止。
     */
    PlayState[PlayState["kStoped"] = 3] = "kStoped";
    /** {en}
     * @brief Failed to play.
     */
    /** {zh}
     * @brief 播放失败。
     */
    PlayState[PlayState["kFailed"] = 4] = "kFailed";
    /** {en}
     * @brief Finished.
     */
    /** {zh}
     * @brief 播放结束。
     */
    PlayState[PlayState["kFinished"] = 5] = "kFinished";
})(PlayState = exports.PlayState || (exports.PlayState = {}));
/** {en}
 * @brief KTV player error code.
 */
/** {zh}
 * @brief KTV 播放器错误码。
 */
var KTVPlayerErrorCode;
(function (KTVPlayerErrorCode) {
    /** {en}
     * @brief Success.
     */
    /** {zh}
     * @brief 成功。
     */
    KTVPlayerErrorCode[KTVPlayerErrorCode["kKTVPlayerErrorCodeOK"] = 0] = "kKTVPlayerErrorCodeOK";
    /** {en}
     * @brief Failed to play the music. Download first.
     */
    /** {zh}
     * @brief 播放错误，请下载后播放。
     */
    KTVPlayerErrorCode[KTVPlayerErrorCode["kKTVPlayerErrorCodeFileNotExist"] = -3020] = "kKTVPlayerErrorCodeFileNotExist";
    /** {en}
     * @brief Failed to play the music. Check the file's format.
     */
    /** {zh}
     * @brief 播放错误，请确认文件播放格式。
     */
    KTVPlayerErrorCode[KTVPlayerErrorCode["kKTVPlayerErrorCodeFileError"] = -3021] = "kKTVPlayerErrorCodeFileError";
    /** {en}
     * @brief Failed to play the music. Join a room first.
     */
    /** {zh}
     * @brief 播放错误，未进入房间。
     */
    KTVPlayerErrorCode[KTVPlayerErrorCode["kKTVPlayerErrorCodeNotJoinRoom"] = -3022] = "kKTVPlayerErrorCodeNotJoinRoom";
    /** {en}
     * @brief Invalid parameter.
     */
    /** {zh}
     * @brief 参数错误。
     */
    KTVPlayerErrorCode[KTVPlayerErrorCode["kKTVPlayerErrorCodeParam"] = -3023] = "kKTVPlayerErrorCodeParam";
    /** {en}
     * @brief Failed to play the music. Invalid path or failed to open the file.
     */
    /** {zh}
     * @brief 播放失败，找不到文件或文件打开失败。
     */
    KTVPlayerErrorCode[KTVPlayerErrorCode["kKTVPlayerErrorCodeStartError"] = -3024] = "kKTVPlayerErrorCodeStartError";
    /** {en}
     * @brief Invalid mixing ID.
     */
    /** {zh}
     * @brief 混音 ID 异常。
     */
    KTVPlayerErrorCode[KTVPlayerErrorCode["kKTVPlayerErrorCodeMixIdError"] = -3025] = "kKTVPlayerErrorCodeMixIdError";
    /** {en}
     * @brief Invalid position.
     */
    /** {zh}
     * @brief 设置播放位置出错。
     */
    KTVPlayerErrorCode[KTVPlayerErrorCode["kKTVPlayerErrorCodePositionError"] = -3026] = "kKTVPlayerErrorCodePositionError";
    /** {en}
     * @brief Invalid volume.
     */
    /** {zh}
     * @brief 音量参数不合法，可设置的取值范围为 [0,400]。
     */
    KTVPlayerErrorCode[KTVPlayerErrorCode["kKTVPlayerErrorCodeAudioVolumeError"] = -3027] = "kKTVPlayerErrorCodeAudioVolumeError";
    /** {en}
     * @brief Do not support the mix type.
     */
    /** {zh}
     * @brief 不支持此混音类型。
     */
    KTVPlayerErrorCode[KTVPlayerErrorCode["kKTVPlayerErrorCodeTypeError"] = -3028] = "kKTVPlayerErrorCodeTypeError";
    /** {en}
     * @brief Invalid pitch.
     */
    /** {zh}
     * @brief 音调文件不合法。
     */
    KTVPlayerErrorCode[KTVPlayerErrorCode["kKTVPlayerErrorCodePitchError"] = -3029] = "kKTVPlayerErrorCodePitchError";
    /** {en}
     * @brief Invalid audio track.
     */
    /** {zh}
     * @brief 音轨不合法。
     */
    KTVPlayerErrorCode[KTVPlayerErrorCode["kKTVPlayerErrorCodeAudioTrackError"] = -3030] = "kKTVPlayerErrorCodeAudioTrackError";
    /** {en}
     * @brief Mixing in process.
     */
    /** {zh}
     * @brief 混音启动中。
     */
    KTVPlayerErrorCode[KTVPlayerErrorCode["kKTVPlayerErrorCodeStartingError"] = -3031] = "kKTVPlayerErrorCodeStartingError";
})(KTVPlayerErrorCode = exports.KTVPlayerErrorCode || (exports.KTVPlayerErrorCode = {}));
var AnsMode;
(function (AnsMode) {
    /**
     * @brief 禁用音频降噪。
     */
    AnsMode[AnsMode["kAnsModeDisable"] = 0] = "kAnsModeDisable";
    /**
     * @brief 适用于微弱降噪。
     */
    AnsMode[AnsMode["kAnsModeLow"] = 1] = "kAnsModeLow";
    /**
     * @brief 适用于抑制中度平稳噪音，如空调声、风扇声。
     */
    AnsMode[AnsMode["kAnsModeMedium"] = 2] = "kAnsModeMedium";
    /**
     * @brief 适用于抑制嘈杂非平稳噪音，如键盘声、敲击声、碰撞声、动物叫声。
     */
    AnsMode[AnsMode["kAnsModeHigh"] = 3] = "kAnsModeHigh";
    /**
     * @brief 启用音频降噪能力。具体的降噪算法由 RTC 决定。
     */
    AnsMode[AnsMode["kAnsModeAutomatic"] = 4] = "kAnsModeAutomatic";
})(AnsMode = exports.AnsMode || (exports.AnsMode = {}));
/** {en}
 * @brief Super-resolution mode.
 */
/** {zh}
 * @brief 超分模式。
 */
var VideoSuperResolutionMode;
(function (VideoSuperResolutionMode) {
    /** {en}
     * @brief Turn off super-resolution mode.
     */
    /** {zh}
     * @brief 关闭超分。
     */
    VideoSuperResolutionMode[VideoSuperResolutionMode["kVideoSuperResolutionModeOff"] = 0] = "kVideoSuperResolutionModeOff";
    /** {en}
     * @brief Turn on super-resolution mode.
     */
    /** {zh}
     * @brief 开启超分。
     */
    VideoSuperResolutionMode[VideoSuperResolutionMode["kVideoSuperResolutionModeOn"] = 1] = "kVideoSuperResolutionModeOn";
})(VideoSuperResolutionMode = exports.VideoSuperResolutionMode || (exports.VideoSuperResolutionMode = {}));
/** {en}
 * @brief The reason for the change in super resolution mode.
 */
/** {zh}
 * @brief 超分状态改变原因。
 */
var VideoSuperResolutionModeChangedReason;
(function (VideoSuperResolutionModeChangedReason) {
    /** {en}
     * @brief Successfully turned off the super resolution mode by calling [setRemoteVideoSuperResolution](85532#setremotevideosuperresolution).
     */
    /** {zh}
     * @brief 调用 [setRemoteVideoSuperResolution](85532#setremotevideosuperresolution) 成功关闭超分。
     */
    VideoSuperResolutionModeChangedReason[VideoSuperResolutionModeChangedReason["kVideoSuperResolutionModeChangedReasonAPIOff"] = 0] = "kVideoSuperResolutionModeChangedReasonAPIOff";
    /** {en}
     * @brief Successfully turned on the super resolution mode by calling [setRemoteVideoSuperResolution](85532#setremotevideosuperresolution).
     */
    /** {zh}
     * @brief 调用 [setRemoteVideoSuperResolution](85532#setremotevideosuperresolution) 成功开启超分。
     */
    VideoSuperResolutionModeChangedReason[VideoSuperResolutionModeChangedReason["kVideoSuperResolutionModeChangedReasonAPIOn"] = 1] = "kVideoSuperResolutionModeChangedReasonAPIOn";
    /** {en}
     * @brief Failed to turn on super-resolution mode. The original resolution of the remote video stream should not exceed 640 × 360 pixels.
     */
    /** {zh}
     * @brief 开启超分失败，远端视频流的原始视频分辨率超过 640 × 360 px。
     */
    VideoSuperResolutionModeChangedReason[VideoSuperResolutionModeChangedReason["kVideoSuperResolutionModeChangedReasonResolutionExceed"] = 2] = "kVideoSuperResolutionModeChangedReasonResolutionExceed";
    /** {en}
     * @brief Failed to turn on super-resolution mode. You can only turn on super-resolution mode for one stream.
     */
    /** {zh}
     * @brief 开启超分失败，已对一路远端流开启超分。
     */
    VideoSuperResolutionModeChangedReason[VideoSuperResolutionModeChangedReason["kVideoSuperResolutionModeChangedReasonOverUse"] = 3] = "kVideoSuperResolutionModeChangedReasonOverUse";
    /** {en}
     * @brief Incompatible device for super resolution.
     */
    /** {zh}
     * @brief 设备不支持使用超分辨率。
     */
    VideoSuperResolutionModeChangedReason[VideoSuperResolutionModeChangedReason["kVideoSuperResolutionModeChangedReasonDeviceNotSupport"] = 4] = "kVideoSuperResolutionModeChangedReasonDeviceNotSupport";
    /** {en}
     * @brief The super-resolution mode is turned off because of lacking device capabilities.
     */
    /** {zh}
     * @brief 当前设备性能存在风险，已动态关闭超分。
     */
    VideoSuperResolutionModeChangedReason[VideoSuperResolutionModeChangedReason["kVideoSuperResolutionModeChangedReasonDynamicClose"] = 5] = "kVideoSuperResolutionModeChangedReasonDynamicClose";
    /** {en}
     * @brief The super-resolution mode is turned off for other reasons.
     */
    /** {zh}
     * @brief 超分因其他原因关闭。
     */
    VideoSuperResolutionModeChangedReason[VideoSuperResolutionModeChangedReason["kVideoSuperResolutionModeChangedReasonOtherSettingDisabled"] = 6] = "kVideoSuperResolutionModeChangedReasonOtherSettingDisabled";
    /** {en}
     * @brief The super-resolution mode is turned on for other reasons.
     */
    /** {zh}
     * @brief 超分因其他原因开启。
     */
    VideoSuperResolutionModeChangedReason[VideoSuperResolutionModeChangedReason["kVideoSuperResolutionModeChangedReasonOtherSettingEnabled"] = 7] = "kVideoSuperResolutionModeChangedReasonOtherSettingEnabled";
    /** {en}
     * @brief The super-resolution mode is not compiled in the SDK.
     */
    /** {zh}
     * @brief SDK 没有编译超分组件。
     */
    VideoSuperResolutionModeChangedReason[VideoSuperResolutionModeChangedReason["kVideoSuperResolutionModeChangedReasonNoComponent"] = 8] = "kVideoSuperResolutionModeChangedReasonNoComponent";
    /** {zh}
     * @brief 远端流不存在。房间 ID 或用户 ID 无效，或对方没有发布流。
     */
    /** {en}
     * @brief The remote stream does not exist. Reasons include invalid room ID, user ID, or the stream is not published.
     */
    VideoSuperResolutionModeChangedReason[VideoSuperResolutionModeChangedReason["kVideoSuperResolutionModeChangedReasonStreamNotExist"] = 9] = "kVideoSuperResolutionModeChangedReasonStreamNotExist";
})(VideoSuperResolutionModeChangedReason = exports.VideoSuperResolutionModeChangedReason || (exports.VideoSuperResolutionModeChangedReason = {}));
/** {en}
 * @brief The encoding modes for shared-screen streams. The default mode is the high-resolution mode. If you exclude specific windows by setting [filter_config](#screencaptureparameters-filter_config), the frame rate of the shared-screen stream will be slower than 30fps。
 */
/** {zh}
 * @brief 屏幕流编码模式。默认采用清晰模式。若在采集时设置 [filter_config](#screencaptureparameters-filter_config) 排除指定窗口，共享视频时帧率无法达到 30fps。
 */
var ScreenVideoEncodePreference;
(function (ScreenVideoEncodePreference) {
    /** {en}
     * @brief The automatic mode. The encoding mode is dynamically determined by RTC based on the content.
     */
    /** {zh}
     * @brief 智能模式。根据屏幕内容智能决策选择流畅模式或清晰模式。
     */
    ScreenVideoEncodePreference[ScreenVideoEncodePreference["kScreenVideoEncodePreferenceAuto"] = 0] = "kScreenVideoEncodePreferenceAuto";
    /** {en}
     * @brief The high frame rate mode. Ensure the highest framerate possible under challenging network conditions. This mode is designed to share audiovisual content, including games and videos.
     */
    /** {zh}
     * @brief 流畅模式，优先保障帧率。适用于共享游戏、视频等动态画面。
     */
    ScreenVideoEncodePreference[ScreenVideoEncodePreference["kScreenVideoEncodePreferenceFramerate"] = 1] = "kScreenVideoEncodePreferenceFramerate";
    /** {en}
     * @brief The high-resolution mode. Ensure the highest resolution possible under challenging network conditions. This mode is designed to share micro-detailed content, including slides, documents, images, illustrations, or graphics.
     */
    /** {zh}
     * @brief 清晰模式，优先保障分辨率。适用于共享PPT、文档、图片等静态画面。
     */
    ScreenVideoEncodePreference[ScreenVideoEncodePreference["kScreenVideoEncodePreferenceQuality"] = 2] = "kScreenVideoEncodePreferenceQuality";
})(ScreenVideoEncodePreference = exports.ScreenVideoEncodePreference || (exports.ScreenVideoEncodePreference = {}));
/** {en}
 * @brief SEI sending mode.
 */
/** {zh}
 * @brief SEI 发送模式。
 */
var SEICountPerFrame;
(function (SEICountPerFrame) {
    /** {en}
     * @brief Single-SEI mode. When you send multiple SEI messages in 1 frame, they will be sent frame by frame in a queue.
     */
    /** {zh}
     * @brief 单发模式。即在 1 帧间隔内多次发送 SEI 数据时，多个 SEI 按队列逐帧发送。
     */
    SEICountPerFrame[SEICountPerFrame["kSingleSEIPerFrame"] = 0] = "kSingleSEIPerFrame";
    /** {en}
     * @brief Multi-SEI mode. When you send multiple SEI messages in 1 frame, they will be sent together in the next frame.
     */
    /** {zh}
     * @brief 多发模式。即在 1 帧间隔内多次发送 SEI 数据时，多个 SEI 随下个视频帧同时发送。
     */
    SEICountPerFrame[SEICountPerFrame["kMultiSEIPerFrame"] = 1] = "kMultiSEIPerFrame";
})(SEICountPerFrame = exports.SEICountPerFrame || (exports.SEICountPerFrame = {}));
/** {en}
 * @brief  Stream type for media stream information synchronization
 */
/** {zh}
 * @brief 媒体流信息同步的流类型
 */
var SyncInfoStreamType;
(function (SyncInfoStreamType) {
    /** {en}
     * @brief Audio stream
     */
    /** {zh}
     * @brief 音频流
     */
    SyncInfoStreamType[SyncInfoStreamType["kSyncInfoStreamTypeAudio"] = 0] = "kSyncInfoStreamTypeAudio";
})(SyncInfoStreamType = exports.SyncInfoStreamType || (exports.SyncInfoStreamType = {}));
/** {en}
 * @brief SEI data source type.
 */
/** {zh}
 * @brief SEI 信息来源。
 */
var DataMessageSourceType;
(function (DataMessageSourceType) {
    /**
     * @brief 通过客户端或服务端的插入的自定义消息。
     */
    DataMessageSourceType[DataMessageSourceType["kDataMessageSourceTypeDefault"] = 0] = "kDataMessageSourceTypeDefault";
    /**
     * @brief 系统数据，包含音量指示信息。
     */
    DataMessageSourceType[DataMessageSourceType["kDataMessageSourceTypeSystem"] = 1] = "kDataMessageSourceTypeSystem";
})(DataMessageSourceType = exports.DataMessageSourceType || (exports.DataMessageSourceType = {}));
/** {en}
 * @brief Karaoke scoring mode.
 */
/** {zh}
 * @brief K 歌打分维度。
 */
var MulDimSingScoringMode;
(function (MulDimSingScoringMode) {
    /** {en}
     * @brief The score is provided based on the pitch.
     */
    /** {zh}
     * @brief 按照音高进行评分。
     */
    MulDimSingScoringMode[MulDimSingScoringMode["kMulDimSingScoringModeNote"] = 0] = "kMulDimSingScoringModeNote";
})(MulDimSingScoringMode = exports.MulDimSingScoringMode || (exports.MulDimSingScoringMode = {}));
/** {en}
 * @brief Type of audio device
 */
/** {zh}
 * @brief 音频设备类型
 */
var RTCAudioDeviceType;
(function (RTCAudioDeviceType) {
    /** {en}
     * @brief Unknown device
     */
    /** {zh}
     * @brief 未知设备类型
     */
    RTCAudioDeviceType[RTCAudioDeviceType["kRTCAudioDeviceTypeUnknown"] = -1] = "kRTCAudioDeviceTypeUnknown";
    /** {en}
     * @brief Speaker or headphone
     */
    /** {zh}
     * @brief 音频渲染设备
     */
    RTCAudioDeviceType[RTCAudioDeviceType["kRTCAudioDeviceTypeRenderDevice"] = 0] = "kRTCAudioDeviceTypeRenderDevice";
    /** {en}
     * @brief Microphone
     */
    /** {zh}
     * @brief 音频采集设备
     */
    RTCAudioDeviceType[RTCAudioDeviceType["kRTCAudioDeviceTypeCaptureDevice"] = 1] = "kRTCAudioDeviceTypeCaptureDevice";
    /** {en}
     * @brief Screen capturing audio device
     */
    /** {zh}
     * @brief 屏幕流音频设备
     */
    RTCAudioDeviceType[RTCAudioDeviceType["kRTCAudioDeviceTypeScreenCaptureDevice"] = 2] = "kRTCAudioDeviceTypeScreenCaptureDevice";
})(RTCAudioDeviceType = exports.RTCAudioDeviceType || (exports.RTCAudioDeviceType = {}));
/** {en}
 * @brief Audio Equalization effect.
 */
/** {zh}
 * @brief 音频均衡效果。
 */
var VoiceEqualizationBandFrequency;
(function (VoiceEqualizationBandFrequency) {
    /** {en}
     * @brief The frequency band with a center frequency of 31Hz.
     */
    /** {zh}
     * @brief 中心频率为 31Hz 的频带。
     */
    VoiceEqualizationBandFrequency[VoiceEqualizationBandFrequency["kVoiceEqualizationBandFrequency31"] = 0] = "kVoiceEqualizationBandFrequency31";
    /** {en}
     * @brief The frequency band with a center frequency of 62Hz.
     */
    /** {zh}
     * @brief 中心频率为 62Hz 的频带。
     */
    VoiceEqualizationBandFrequency[VoiceEqualizationBandFrequency["kVoiceEqualizationBandFrequency62"] = 1] = "kVoiceEqualizationBandFrequency62";
    /** {en}
     * @brief The frequency band with a center frequency of 125Hz.
     */
    /** {zh}
     * @brief 中心频率为 125Hz 的频带。
     */
    VoiceEqualizationBandFrequency[VoiceEqualizationBandFrequency["kVoiceEqualizationBandFrequency125"] = 2] = "kVoiceEqualizationBandFrequency125";
    /** {en}
     * @brief The frequency band with a center frequency of 250Hz.
     */
    /** {zh}
     * @brief 中心频率为 250Hz 的频带。
     */
    VoiceEqualizationBandFrequency[VoiceEqualizationBandFrequency["kVoiceEqualizationBandFrequency250"] = 3] = "kVoiceEqualizationBandFrequency250";
    /** {en}
     * @brief The frequency band with a center frequency of 500Hz.
     */
    /** {zh}
     * @brief 中心频率为 500Hz 的频带。
     */
    VoiceEqualizationBandFrequency[VoiceEqualizationBandFrequency["kVoiceEqualizationBandFrequency500"] = 4] = "kVoiceEqualizationBandFrequency500";
    /** {en}
     * @brief The frequency band with a center frequency of 1kHz.
     */
    /** {zh}
     * @brief 中心频率为 1kHz 的频带。
     */
    VoiceEqualizationBandFrequency[VoiceEqualizationBandFrequency["kVoiceEqualizationBandFrequency1k"] = 5] = "kVoiceEqualizationBandFrequency1k";
    /** {en}
     * @brief The frequency band with a center frequency of 2kHz.
     */
    /** {zh}
     * @brief 中心频率为 2kHz 的频带。
     */
    VoiceEqualizationBandFrequency[VoiceEqualizationBandFrequency["kVoiceEqualizationBandFrequency2k"] = 6] = "kVoiceEqualizationBandFrequency2k";
    /** {en}
     * @brief The frequency band with a center frequency of 4kHz.
     */
    /** {zh}
     * @brief 中心频率为 4kHz 的频带。
     */
    VoiceEqualizationBandFrequency[VoiceEqualizationBandFrequency["kVoiceEqualizationBandFrequency4k"] = 7] = "kVoiceEqualizationBandFrequency4k";
    /** {en}
     * @brief The frequency band with a center frequency of 8kHz.
     */
    /** {zh}
     * @brief 中心频率为 8kHz 的频带。
     */
    VoiceEqualizationBandFrequency[VoiceEqualizationBandFrequency["kVoiceEqualizationBandFrequency8k"] = 8] = "kVoiceEqualizationBandFrequency8k";
    /** {en}
     * @brief The frequency band with a center frequency of 16kHz.
     */
    /** {zh}
     * @brief 中心频率为 16kHz 的频带。
     */
    VoiceEqualizationBandFrequency[VoiceEqualizationBandFrequency["kVoiceEqualizationBandFrequency16k"] = 9] = "kVoiceEqualizationBandFrequency16k";
})(VoiceEqualizationBandFrequency = exports.VoiceEqualizationBandFrequency || (exports.VoiceEqualizationBandFrequency = {}));
/** {en}
 * @brief Audio file recording source type.
 */
/** {zh}
 * @brief 音频文件录制内容来源。
 */
var AudioFrameSource;
(function (AudioFrameSource) {
    /** {en}
     * @brief The audio captured by the local microphone.
     */
    /** {zh}
     * @brief 本地麦克风采集的音频数据。
     */
    AudioFrameSource[AudioFrameSource["kAudioFrameSourceMic"] = 0] = "kAudioFrameSourceMic";
    /** {en}
     * @brief The audio got by mixing all remote user's audio.
     */
    /** {zh}
     * @brief 远端所有用户混音后的数据
     */
    AudioFrameSource[AudioFrameSource["kAudioFrameSourcePlayback"] = 1] = "kAudioFrameSourcePlayback";
    /** {en}
     * @brief The audio got by mixing the local captured audio and all remote user's audio.
     */
    /** {zh}
     * @brief 本地麦克风和所有远端用户音频流的混音后的数据
     */
    AudioFrameSource[AudioFrameSource["kAudioFrameSourceMixed"] = 2] = "kAudioFrameSourceMixed";
})(AudioFrameSource = exports.AudioFrameSource || (exports.AudioFrameSource = {}));
/** {en}
 * @brief Audio quality.
 */
/** {zh}
 * @brief 音频质量。
 */
var AudioQuality;
(function (AudioQuality) {
    /** {en}
     * @brief low quality
     */
    /** {zh}
     * @brief 低音质
     */
    AudioQuality[AudioQuality["kAudioQualityLow"] = 0] = "kAudioQualityLow";
    /** {en}
     * @brief medium quality
     */
    /** {zh}
     * @brief 中音质
     */
    AudioQuality[AudioQuality["kAudioQualityMedium"] = 1] = "kAudioQualityMedium";
    /** {en}
     * @brief high quality
     */
    /** {zh}
     * @brief 高音质
     */
    AudioQuality[AudioQuality["kAudioQualityHigh"] = 2] = "kAudioQualityHigh";
    /** {en}
     * @brief ultra high quality
     */
    /** {zh}
     * @brief 超高音质
     */
    AudioQuality[AudioQuality["kAudioQualityUltraHigh"] = 3] = "kAudioQualityUltraHigh";
})(AudioQuality = exports.AudioQuality || (exports.AudioQuality = {}));
/** {en}
 * @brief Audio recording config
 */
/** {zh}
 * @brief 录音配置
 */
var AudioRecordingState;
(function (AudioRecordingState) {
    /** {en}
     * @brief Recording exception
     */
    /** {zh}
     * @brief 录制异常
     */
    AudioRecordingState[AudioRecordingState["kAudioRecordingStateError"] = 0] = "kAudioRecordingStateError";
    /** {en}
     * @brief Recording in progress
     */
    /** {zh}
     * @brief 录制进行中
     */
    AudioRecordingState[AudioRecordingState["kAudioRecordingStateProcessing"] = 1] = "kAudioRecordingStateProcessing";
    /** {en}
     * @brief The recording task ends, and the file is saved.
     */
    /** {zh}
     * @brief 已结束录制，并且录制文件保存成功。
     */
    AudioRecordingState[AudioRecordingState["kAudioRecordingStateSuccess"] = 2] = "kAudioRecordingStateSuccess";
})(AudioRecordingState = exports.AudioRecordingState || (exports.AudioRecordingState = {}));
/** {zh}
 * @detail 85534
 * @brief 音频文件录制的错误码
 */
/** {en}
 * @detail 85534
 * @brief Error code for audio recording.
 */
var AudioRecordingErrorCode;
(function (AudioRecordingErrorCode) {
    /** {en}
     * @brief OK
     */
    /** {zh}
     * @brief 录制正常
     */
    AudioRecordingErrorCode[AudioRecordingErrorCode["kAudioRecordingErrorCodeOk"] = 0] = "kAudioRecordingErrorCodeOk";
    /** {en}
     * @brief No file write permissions.
     */
    /** {zh}
     * @brief 没有文件写权限
     */
    AudioRecordingErrorCode[AudioRecordingErrorCode["kAudioRecordingErrorCodeNoPermission"] = -1] = "kAudioRecordingErrorCodeNoPermission";
    /** {en}
     * @brief Not in the room.
     */
    /** {zh}
     * @brief 没有进入房间
     */
    AudioRecordingErrorCode[AudioRecordingErrorCode["kAudioRecordingErrorNotInRoom"] = -2] = "kAudioRecordingErrorNotInRoom";
    /** {en}
     * @brief Started.
     */
    /** {zh}
     * @brief 录制已经开始
     */
    AudioRecordingErrorCode[AudioRecordingErrorCode["kAudioRecordingAlreadyStarted"] = -3] = "kAudioRecordingAlreadyStarted";
    /** {en}
     * @brief Not started.
     */
    /** {zh}
     * @brief 录制还未开始
     */
    AudioRecordingErrorCode[AudioRecordingErrorCode["kAudioRecordingNotStarted"] = -4] = "kAudioRecordingNotStarted";
    /** {en}
     * @brief Failure. Invalid file format.
     */
    /** {zh}
     * @brief 录制失败。文件格式不支持。
     */
    AudioRecordingErrorCode[AudioRecordingErrorCode["kAudioRecordingErrorCodeNotSupport"] = -5] = "kAudioRecordingErrorCodeNotSupport";
    /** {en}
     * @brief Other error.
     */
    /** {zh}
     * @brief 其他异常
     */
    AudioRecordingErrorCode[AudioRecordingErrorCode["kAudioRecordingErrorCodeOther"] = -6] = "kAudioRecordingErrorCodeOther";
})(AudioRecordingErrorCode = exports.AudioRecordingErrorCode || (exports.AudioRecordingErrorCode = {}));
/** {en}
 * @brief Types of local proxies.
 */
/** {zh}
 * @brief 本地代理的类型。
 */
var LocalProxyType;
(function (LocalProxyType) {
    /** {en}
     * @brief Socks5 proxy. If you chose Socks5 as the local proxy, you need to make sure all requirements listed in the Socks5 document are satisfied.
     */
    /** {zh}
     * @brief Socks5 代理。选用此代理服务器，需满足 Socks5 协议标准文档的要求。
     */
    LocalProxyType[LocalProxyType["kLocalProxyTypeSocks5"] = 1] = "kLocalProxyTypeSocks5";
    /** {en}
     * @brief Http tunnel proxy.
     */
    /** {zh}
     * @brief Http 隧道代理。
     */
    LocalProxyType[LocalProxyType["kLocalProxyTypeHttpTunnel"] = 2] = "kLocalProxyTypeHttpTunnel";
})(LocalProxyType = exports.LocalProxyType || (exports.LocalProxyType = {}));
/** {en}
 * @brief The states of local proxy connection.
 */
/** {zh}
 * @brief 本地代理连接状态。
 */
var LocalProxyState;
(function (LocalProxyState) {
    /** {en}
     * @brief TCP proxy server is connected.
     */
    /** {zh}
     * @brief TCP 代理服务器连接成功。
     */
    LocalProxyState[LocalProxyState["kLocalProxyStateInited"] = 0] = "kLocalProxyStateInited";
    /** {en}
     * @brief The local proxy is connected.
     */
    /** {zh}
     * @brief 本地代理连接成功。
     */
    LocalProxyState[LocalProxyState["kLocalProxyStateConnected"] = 1] = "kLocalProxyStateConnected";
    /** {en}
     * @brief Errors occurred when connecting to the local proxy.
     */
    /** {zh}
     * @brief 本地代理连接出现错误。
     */
    LocalProxyState[LocalProxyState["kLocalProxyStateError"] = 2] = "kLocalProxyStateError";
})(LocalProxyState = exports.LocalProxyState || (exports.LocalProxyState = {}));
/** {en}
 * @detail 85534
 * @brief The errors of local proxy connection.
 */
/** {zh}
 * @detail 85534
 * @brief 本地代理错误信息。
 */
var LocalProxyError;
(function (LocalProxyError) {
    /** {en}
     * @brief There are no errors in local proxies.
     */
    /** {zh}
     * @brief 代理无错误
     */
    LocalProxyError[LocalProxyError["kLocalProxyErrorOK"] = 0] = "kLocalProxyErrorOK";
    /** {en}
     * @brief The connection to Socks5 proxy failed because the proxy server replies wrong version numbers which don't accord with the Socks5 document. Please check the proxy server.
     */
    /** {zh}
     * @brief 代理服务器回复的版本号错误，导致 socks5 连接失败。
     */
    LocalProxyError[LocalProxyError["kLocalProxyErrorSocks5VersionError"] = 1] = "kLocalProxyErrorSocks5VersionError";
    /** {en}
     * @brief The connection to Socks5 proxy failed because the format of the proxy's replies doesn't accord with the Socks5 document. Please check the proxy server.
     */
    /** {zh}
     * @brief 代理服务器回复的格式错误，导致 socks5 连接失败。
     */
    LocalProxyError[LocalProxyError["kLocalProxyErrorSocks5FormatError"] = 2] = "kLocalProxyErrorSocks5FormatError";
    /** {en}
     * @brief The connection to Socks5 proxy failed because the proxy replies wrong information which doesn't accord with the Socks5 document. Please check the proxy server.
     */
    /** {zh}
     * @brief 代理服务器回复的字段值错误，导致 socks5 连接失败。
     */
    LocalProxyError[LocalProxyError["kLocalProxyErrorSocks5InvalidValue"] = 3] = "kLocalProxyErrorSocks5InvalidValue";
    /** {en}
     * @brief The connection to Socks5 proxy failed because the username and password of the local proxy are not provided. Please call `setLocalProxy` and enter your username and password.
     */
    /** {zh}
     * @brief 未提供本地代理的用户名及密码，导致 socks5 连接失败。
     */
    LocalProxyError[LocalProxyError["kLocalProxyErrorSocks5UserPassNotGiven"] = 4] = "kLocalProxyErrorSocks5UserPassNotGiven";
    /** {en}
     * @brief The connection to Socks5 proxy failed because TCP is closed. Please check the proxy server and your network connection status.
     */
    /** {zh}
     * @brief TCP 关闭，导致 socks5 连接失败。
     */
    LocalProxyError[LocalProxyError["kLocalProxyErrorSocks5TcpClosed"] = 5] = "kLocalProxyErrorSocks5TcpClosed";
    /** {en}
     * @brief Errors in Http tunnel proxy. Please check Http tunnel proxy and your network connection status.
     */
    /** {zh}
     * @brief http隧道代理错误。
     */
    LocalProxyError[LocalProxyError["kLocalProxyErrorHttpTunnelFailed"] = 6] = "kLocalProxyErrorHttpTunnelFailed";
})(LocalProxyError = exports.LocalProxyError || (exports.LocalProxyError = {}));
/** {en}
 * @brief Result of the detection inited before joining a room
 */
/** {zh}
 * @brief 通话前回声检测结果
 */
var HardwareEchoDetectionResult;
(function (HardwareEchoDetectionResult) {
    /** {en}
     * @brief Detection is stopped by the call of `stopHardwareEchoDetection` before the SDK reports the detection result.
     */
    /** {zh}
     * @brief 主动调用 `stopHardwareEchoDetection` 结束流程时，未有回声检测结果。
     */
    HardwareEchoDetectionResult[HardwareEchoDetectionResult["kHardwareEchoDetectionCanceled"] = 0] = "kHardwareEchoDetectionCanceled";
    /** {en}
     * @brief Unknown state
     *        Contact us if you retry several times but keep failing.
     */
    /** {zh}
     * @brief 未检测出结果。建议重试，如果仍然失败请联系技术支持协助排查。
     */
    HardwareEchoDetectionResult[HardwareEchoDetectionResult["kHardwareEchoDetectionUnknown"] = 1] = "kHardwareEchoDetectionUnknown";
    /** {en}
     * @brief Excellent
     *        No echo issue is detected.
     */
    /** {zh}
     * @brief 无回声
     */
    HardwareEchoDetectionResult[HardwareEchoDetectionResult["kHardwareEchoDetectionNormal"] = 2] = "kHardwareEchoDetectionNormal";
    /** {en}
     * @brief Echo
     *        Echo issue is detected. Recommend the user join the call with a headset through the interface.
     */
    /** {zh}
     * @brief 有回声。可通过 UI 建议用户使用耳机设备入会。
     */
    HardwareEchoDetectionResult[HardwareEchoDetectionResult["kHardwareEchoDetectionPoor"] = 3] = "kHardwareEchoDetectionPoor";
})(HardwareEchoDetectionResult = exports.HardwareEchoDetectionResult || (exports.HardwareEchoDetectionResult = {}));
/** {en}
 * @brief User priority in the audio selection
 */
/** {zh}
 * @brief 音频选路优先级设置
 */
var AudioSelectionPriority;
(function (AudioSelectionPriority) {
    /** {en}
     * @brief Normal whether the stream can be subscribed is determined by the result of audio selection.
     */
    /** {zh}
     * @brief 正常，参加音频选路
     */
    AudioSelectionPriority[AudioSelectionPriority["kAudioSelectionPriorityNormal"] = 0] = "kAudioSelectionPriorityNormal";
    /** {en}
     * @brief Hight priority with which the stream can skip the audio selection and always be subscribable.
     */
    /** {zh}
     * @brief 高优先级，跳过音频选路
     */
    AudioSelectionPriority[AudioSelectionPriority["kAudioSelectionPriorityHigh"] = 1] = "kAudioSelectionPriorityHigh";
})(AudioSelectionPriority = exports.AudioSelectionPriority || (exports.AudioSelectionPriority = {}));
/** {en}
 * @brief Extra information setting result.
 */
/** {zh}
 * @brief 设置房间附加消息结果。
 */
var SetRoomExtraInfoResult;
(function (SetRoomExtraInfoResult) {
    /** {en}
     * @brief Success.
     */
    /** {zh}
     * @brief 设置房间附加信息成功
     */
    SetRoomExtraInfoResult[SetRoomExtraInfoResult["kSetRoomExtraInfoSuccess"] = 0] = "kSetRoomExtraInfoSuccess";
    /** {en}
     * @brief Failure. You are not in the room.
     */
    /** {zh}
     * @brief 设置失败，尚未加入房间
     */
    SetRoomExtraInfoResult[SetRoomExtraInfoResult["kSetRoomExtraInfoErrorNotJoinRoom"] = -1] = "kSetRoomExtraInfoErrorNotJoinRoom";
    /** {en}
     * @brief Failure. The key pointer is null.
     */
    /** {zh}
     * @brief 设置失败，key 指针为空
     */
    SetRoomExtraInfoResult[SetRoomExtraInfoResult["kSetRoomExtraInfoErrorKeyIsNull"] = -2] = "kSetRoomExtraInfoErrorKeyIsNull";
    /** {en}
     * @brief Failure. The value pointer is null.
     */
    /** {zh}
     * @brief 设置失败，value 指针为空
     */
    SetRoomExtraInfoResult[SetRoomExtraInfoResult["kSetRoomExtraInfoErrorValueIsNull"] = -3] = "kSetRoomExtraInfoErrorValueIsNull";
    /** {en}
     * @brief Failure. Unknown error.
     */
    /** {zh}
     * @brief 设置失败，未知错误
     */
    SetRoomExtraInfoResult[SetRoomExtraInfoResult["kSetRoomExtraInfoResultUnknow"] = -99] = "kSetRoomExtraInfoResultUnknow";
    /** {en}
     * @brief Failure. The key length is 0.
     */
    /** {zh}
     * @brief 设置失败，key 长度为 0
     */
    SetRoomExtraInfoResult[SetRoomExtraInfoResult["kSetRoomExtraInfoErrorKeyIsEmpty"] = -400] = "kSetRoomExtraInfoErrorKeyIsEmpty";
    /** {en}
     * @brief Failure. Excessively frequent setting. 10 times per second is preferable.
     */
    /** {zh}
     * @brief 调用 `setRoomExtraInfo` 过于频繁，建议不超过 10 次/秒。
     */
    SetRoomExtraInfoResult[SetRoomExtraInfoResult["kSetRoomExtraInfoErrorTooOften"] = -406] = "kSetRoomExtraInfoErrorTooOften";
    /** {en}
     * @brief Failure. Invisible users are not allowed to call `setRoomExtraInfo`.
     */
    /** {zh}
     * @brief 设置失败，用户已调用 `setUserVisibility` 将自身设为隐身状态。
     */
    SetRoomExtraInfoResult[SetRoomExtraInfoResult["kSetRoomExtraInfoErrorSilentUser"] = -412] = "kSetRoomExtraInfoErrorSilentUser";
    /** {en}
     * @brief Failure. Key length exceeds 10 bytes.
     */
    /** {zh}
     * @brief 设置失败，Key 长度超过 10 字节
     */
    SetRoomExtraInfoResult[SetRoomExtraInfoResult["kSetRoomExtraInfoErrorKeyTooLong"] = -413] = "kSetRoomExtraInfoErrorKeyTooLong";
    /** {en}
     * @brief Failure. Value length exceeds 128 bytes.
     */
    /** {zh}
     * @brief 设置失败，value 长度超过 128 字节
     */
    SetRoomExtraInfoResult[SetRoomExtraInfoResult["kSetRoomExtraInfoErrorValueTooLong"] = -414] = "kSetRoomExtraInfoErrorValueTooLong";
    /** {en}
     * @brief Failure. Server error.
     */
    /** {zh}
     * @brief 设置失败，服务器错误
     */
    SetRoomExtraInfoResult[SetRoomExtraInfoResult["kSetRoomExtraInfoErrorServer"] = -500] = "kSetRoomExtraInfoErrorServer";
})(SetRoomExtraInfoResult = exports.SetRoomExtraInfoResult || (exports.SetRoomExtraInfoResult = {}));
/** {en}
 * @hidden
 * @brief The states of the subtitling task.
 */
/** {zh}
 * @brief 字幕任务状态。
 */
var SubtitleState;
(function (SubtitleState) {
    /** {en}
     * @brief Subtitles are on.
     */
    /** {zh}
     * @brief 开启字幕。
     */
    SubtitleState[SubtitleState["kSubtitleStateStarted"] = 0] = "kSubtitleStateStarted";
    /** {en}
     * @brief Subtitles are off.
     */
    /** {zh}
     * @brief 关闭字幕。
     */
    SubtitleState[SubtitleState["kSubtitleStateStoped"] = 1] = "kSubtitleStateStoped";
    /** {en}
     * @brief Errors occurred concerning the subtitling task.
     */
    /** {zh}
     * @brief 字幕任务出现错误。
     */
    SubtitleState[SubtitleState["kSubtitleStateError"] = 2] = "kSubtitleStateError";
})(SubtitleState = exports.SubtitleState || (exports.SubtitleState = {}));
/** {en}
 * @hidden
 * @brief Subtitle modes.
 */
/** {zh}
 * @brief 字幕模式。
 */
var SubtitleMode;
(function (SubtitleMode) {
    /** {en}
     * @brief The recognition mode. In this mode, the speech of a users in the room will be recognized and converted into captions.
     */
    /** {zh}
     * @brief 识别模式。在此模式下，房间内用户语音会被转为文字。
     */
    SubtitleMode[SubtitleMode["kSubtitleModeRecognition"] = 0] = "kSubtitleModeRecognition";
    /** {en}
     * @brief The translation mode. In this mode, the speech of a users in the room will be converted into captions and then translated.
     */
    /** {zh}
     * @brief 翻译模式。在此模式下，房间内用户语音会先被转为文字，再被翻译为目标语言。
     */
    SubtitleMode[SubtitleMode["kSubtitleModeTranslation"] = 1] = "kSubtitleModeTranslation";
})(SubtitleMode = exports.SubtitleMode || (exports.SubtitleMode = {}));
/** {en}
 * @hidden
 * @brief Error codes of the subtitling task.
 */
/** {zh}
 * @detail 85534
 * @brief 字幕任务错误码。
 */
var SubtitleErrorCode;
(function (SubtitleErrorCode) {
    /** {en}
     * @brief The client side failed to identity error codes sent by cloud media processing. Please contact the technical support.
     */
    /** {zh}
     * @brief 客户端无法识别云端媒体处理发送的错误码。请联系技术支持。
     */
    SubtitleErrorCode[SubtitleErrorCode["kSubtitleErrorCodeUnknow"] = -1] = "kSubtitleErrorCodeUnknow";
    /** {en}
     * @brief Subtitles are turned on.
     */
    /** {zh}
     * @brief 字幕已开启。
     */
    SubtitleErrorCode[SubtitleErrorCode["kSubtitleErrorCodeSuccess"] = 0] = "kSubtitleErrorCodeSuccess";
    /** {en}
     * @brief Errors occurred concerning cloud media processing. Please contact the technical support.
     */
    /** {zh}
     * @brief 云端媒体处理内部出现错误，请联系技术支持。
     */
    SubtitleErrorCode[SubtitleErrorCode["kSubtitleErrorCodePostProcessError"] = 1] = "kSubtitleErrorCodePostProcessError";
    /** {en}
     * @brief Failed to connect to the third-party service. Please contact the technical support.
     */
    /** {zh}
     * @brief 第三方服务连接失败，请联系技术支持。
     */
    SubtitleErrorCode[SubtitleErrorCode["kSubtitleErrorCodeASRConnectionError"] = 2] = "kSubtitleErrorCodeASRConnectionError";
    /** {en}
     * @brief Errors occurred concerning the third-party service. Please contact the technical support.
     */
    /** {zh}
     * @brief 第三方服务内部出现错误，请联系技术支持。
     */
    SubtitleErrorCode[SubtitleErrorCode["kSubtitleErrorCodeASRServiceError"] = 3] = "kSubtitleErrorCodeASRServiceError";
    /** {en}
     * @brief Failed to call `startSubtitle`. Please join the room first.
     */
    /** {zh}
     * @brief 未进房导致调用`startSubtitle`失败。请加入房间后再调用此方法。
     */
    SubtitleErrorCode[SubtitleErrorCode["kSubtitleErrorCodeBeforeJoinRoom"] = 4] = "kSubtitleErrorCodeBeforeJoinRoom";
    /** {en}
     * @brief Subtitles are already on. There is no need to call `startSubtitle` again.
     */
    /** {zh}
     * @brief 重复调用 `startSubtitle`。
     */
    SubtitleErrorCode[SubtitleErrorCode["kSubtitleErrorCodeAlreadyOn"] = 5] = "kSubtitleErrorCodeAlreadyOn";
    /** {en}
     * @brief The target language you chose is not Unsupported.
     */
    /** {zh}
     * @brief 用户选择的目标语言目前暂不支持。
     */
    SubtitleErrorCode[SubtitleErrorCode["kSubtitleErrorCodeUnsupportedLanguage"] = 6] = "kSubtitleErrorCodeUnsupportedLanguage";
    /** {en}
     * @brief Cloud media processing is timeout. Please contact the technical support.
     */
    /** {zh}
     * @brief 云端媒体处理超时未响应，请联系技术支持。
     */
    SubtitleErrorCode[SubtitleErrorCode["kSubtitleErrorCodePostProcessTimeout"] = 7] = "kSubtitleErrorCodePostProcessTimeout";
})(SubtitleErrorCode = exports.SubtitleErrorCode || (exports.SubtitleErrorCode = {}));
/** {en}
 * @brief Digital Zoom type
 */
/** {zh}
 * @brief 数码变焦参数类型
 */
var ZoomConfigType;
(function (ZoomConfigType) {
    /** {en}
     * @brief To set the offset for zooming in and zooming out.
     */
    /** {zh}
     * @brief 设置缩放系数
     */
    ZoomConfigType[ZoomConfigType["kZoomFocusOffset"] = 0] = "kZoomFocusOffset";
    /** {en}
     * @brief To set the offset for panning and tiling.
     */
    /** {zh}
     * @brief 设置移动步长
     */
    ZoomConfigType[ZoomConfigType["kZoomMoveOffset"] = 1] = "kZoomMoveOffset";
})(ZoomConfigType = exports.ZoomConfigType || (exports.ZoomConfigType = {}));
/** {en}
 * @brief Action of the digital zoom control
 */
/** {zh}
 * @brief 数码变焦操作类型
 */
var ZoomDirectionType;
(function (ZoomDirectionType) {
    /** {en}
     * @brief Move to the left.
     */
    /** {zh}
     * @brief 相机向左移动
     */
    ZoomDirectionType[ZoomDirectionType["kCameraMoveLeft"] = 0] = "kCameraMoveLeft";
    /** {en}
     * @brief Move to the right.
     */
    /** {zh}
     * @brief 相机向右移动
     */
    ZoomDirectionType[ZoomDirectionType["kCameraMoveRight"] = 1] = "kCameraMoveRight";
    /** {en}
     * @brief Move upwards.
     */
    /** {zh}
     * @brief 相机向上移动
     */
    ZoomDirectionType[ZoomDirectionType["kCameraMoveUp"] = 2] = "kCameraMoveUp";
    /** {en}
     * @brief Move downwards.
     */
    /** {zh}
     * @brief 相机向下移动
     */
    ZoomDirectionType[ZoomDirectionType["kCameraMoveDown"] = 3] = "kCameraMoveDown";
    /** {en}
     * @brief Zoom out.
     */
    /** {zh}
     * @brief 相机缩小焦距
     */
    ZoomDirectionType[ZoomDirectionType["kCameraZoomOut"] = 4] = "kCameraZoomOut";
    /** {en}
     * @brief Zoom in.
     */
    /** {zh}
     * @brief 相机放大焦距
     */
    ZoomDirectionType[ZoomDirectionType["kCameraZoomIn"] = 5] = "kCameraZoomIn";
    /** {en}
     * @brief Reset digital zoom.
     */
    /** {zh}
     * @brief 恢复到原始画面
     */
    ZoomDirectionType[ZoomDirectionType["kCameraReset"] = 6] = "kCameraReset";
})(ZoomDirectionType = exports.ZoomDirectionType || (exports.ZoomDirectionType = {}));
/** {zh}
 * @brief 视频降噪模式状态改变原因。
 */
var VideoDenoiseModeChangedReason;
(function (VideoDenoiseModeChangedReason) {
    /** {zh}
     * @brief 未知原因导致视频降噪状态改变。
     */
    VideoDenoiseModeChangedReason[VideoDenoiseModeChangedReason["kVideoDenoiseModeChangedReasonNull"] = -1] = "kVideoDenoiseModeChangedReasonNull";
    /** {zh}
     * @brief 通过调用 [setVideoDenoiser](85532#rtcvideo-setvideodeniser) 成功关闭视频降噪。
     */
    VideoDenoiseModeChangedReason[VideoDenoiseModeChangedReason["kVideoDenoiseModeChangedReasonApiOff"] = 0] = "kVideoDenoiseModeChangedReasonApiOff";
    /** {zh}
     * @brief 通过调用 [setVideoDenoiser](85532#rtcvideo-setvideodeniser) 成功开启视频降噪。
     */
    VideoDenoiseModeChangedReason[VideoDenoiseModeChangedReason["kVideoDenoiseModeChangedReasonApiOn"] = 1] = "kVideoDenoiseModeChangedReasonApiOn";
    /** {zh}
     * @brief 后台未配置视频降噪，视频降噪开启失败，请联系技术人员解决。
     */
    VideoDenoiseModeChangedReason[VideoDenoiseModeChangedReason["kVideoDenoiseModeChangedReasonConfigDisabled"] = 2] = "kVideoDenoiseModeChangedReasonConfigDisabled";
    /** {zh}
     * @brief 后台配置开启了视频降噪。
     */
    VideoDenoiseModeChangedReason[VideoDenoiseModeChangedReason["kVideoDenoiseModeChangedReasonConfigEnabled"] = 3] = "kVideoDenoiseModeChangedReasonConfigEnabled";
    /** {zh}
     * @brief 由于内部发生了异常，视频降噪关闭。
     */
    VideoDenoiseModeChangedReason[VideoDenoiseModeChangedReason["kVideoDenoiseModeChangedReasonInternalException"] = 4] = "kVideoDenoiseModeChangedReasonInternalException";
    /** {zh}
     * @brief 当前设备性能过载，已动态关闭视频降噪。
     */
    VideoDenoiseModeChangedReason[VideoDenoiseModeChangedReason["kVideoDenoiseModeChangedReasonDynamicClose"] = 5] = "kVideoDenoiseModeChangedReasonDynamicClose";
    /** {zh}
     * @brief 当前设备性能裕量充足，已动态开启视频降噪。
     */
    VideoDenoiseModeChangedReason[VideoDenoiseModeChangedReason["kVideoDenoiseModeChangedReasonDynamicOpen"] = 6] = "kVideoDenoiseModeChangedReasonDynamicOpen";
    /** {zh}
     * @brief 分辨率导致视频降噪状态发生改变。分辨率过高会导致性能消耗过大，从而导致视频降噪关闭。若希望继续使用视频降噪，可选择降低分辨率。
     */
    VideoDenoiseModeChangedReason[VideoDenoiseModeChangedReason["kVideoDenoiseModeChangedReasonResolution"] = 7] = "kVideoDenoiseModeChangedReasonResolution";
})(VideoDenoiseModeChangedReason = exports.VideoDenoiseModeChangedReason || (exports.VideoDenoiseModeChangedReason = {}));
/** {zh}
 * @brief 合流类型(新)
 */
var MixedStreamType;
(function (MixedStreamType) {
    /** {en}
     * @brief Server-side stream mixing
     */
    /** {zh}
     * @brief 服务端合流
     */
    MixedStreamType[MixedStreamType["kMixedStreamTypeByServer"] = 0] = "kMixedStreamTypeByServer";
    /** {en}
     * @brief Intelligent stream mixing. The SDK will intelligently decide that a stream mixing task would be done on the client or the server.
     */
    /** {zh}
     * @brief 端云一体合流。SDK 智能决策在客户端或服务端完成合流。
     */
    MixedStreamType[MixedStreamType["kMixedStreamTypeByClient"] = 1] = "kMixedStreamTypeByClient";
})(MixedStreamType = exports.MixedStreamType || (exports.MixedStreamType = {}));
/** {en}
 * @brief Advanced Audio Coding (AAC) profile.
 */
/** {zh}
 * @brief AAC 编码规格(新)。
 */
var MixedStreamAudioProfile;
(function (MixedStreamAudioProfile) {
    /** {en}
     * @brief (Default) AAC Low-Complexity profile (AAC-LC).
     */
    /** {zh}
     * @brief AAC-LC 规格，默认值。
     */
    MixedStreamAudioProfile[MixedStreamAudioProfile["kMixedStreamAudioProfileLC"] = 0] = "kMixedStreamAudioProfileLC";
    /** {en}
     * @brief HE-AAC v1 profile (AAC LC with SBR).
     */
    /** {zh}
     * @brief HE-AAC v1 规格。
     */
    MixedStreamAudioProfile[MixedStreamAudioProfile["kMixedStreamAudioProfileHEv1"] = 1] = "kMixedStreamAudioProfileHEv1";
    /** {en}
     * @brief HE-AAC v2 profile (AAC LC with SBR and Parametric Stereo).
     */
    /** {zh}
     * @brief HE-AAC v2 规格。
     */
    MixedStreamAudioProfile[MixedStreamAudioProfile["kMixedStreamAudioProfileHEv2"] = 2] = "kMixedStreamAudioProfileHEv2";
})(MixedStreamAudioProfile = exports.MixedStreamAudioProfile || (exports.MixedStreamAudioProfile = {}));
/** {en}
 * @brief The audio codec.
 */
/** {zh}
 * @brief 音频编码格式(新)。
 */
var MixedStreamAudioCodecType;
(function (MixedStreamAudioCodecType) {
    /** {en}
     * @brief AAC format.
     */
    /** {zh}
     * @brief AAC 格式。
     */
    MixedStreamAudioCodecType[MixedStreamAudioCodecType["kMixedStreamAudioCodecTypeAAC"] = 0] = "kMixedStreamAudioCodecTypeAAC";
})(MixedStreamAudioCodecType = exports.MixedStreamAudioCodecType || (exports.MixedStreamAudioCodecType = {}));
/** {en}
 * @brief The video codec.
 */
/** {zh}
 * @brief 视频编码格式(新)。
 */
var MixedStreamVideoCodecType;
(function (MixedStreamVideoCodecType) {
    /** {en}
     * @brief (Default) H.264 format.
     */
    /** {zh}
     * @brief H.264 格式，默认值。
     */
    MixedStreamVideoCodecType[MixedStreamVideoCodecType["kMixedStreamVideoCodecTypeH264"] = 0] = "kMixedStreamVideoCodecTypeH264";
    /** {en}
     * @brief ByteVC1 format.
     */
    /** {zh}
     * @brief ByteVC1 格式。
     */
    MixedStreamVideoCodecType[MixedStreamVideoCodecType["kMixedStreamVideoCodecTypeByteVC1"] = 1] = "kMixedStreamVideoCodecTypeByteVC1";
})(MixedStreamVideoCodecType = exports.MixedStreamVideoCodecType || (exports.MixedStreamVideoCodecType = {}));
/** {en}
 * @brief The render mode.
 */
/** {zh}
 * @brief 图片或视频流的缩放模式(新)。
 */
var MixedStreamRenderMode;
(function (MixedStreamRenderMode) {
    /** {en}
     * @brief (Default) Fill and Crop.
     *        The video frame is scaled with fixed aspect ratio, until it completely fills the canvas. The region of the video exceeding the canvas will be cropped.
     */
    /** {zh}
     * @brief 视窗填满优先，默认值。
     *        视频尺寸等比缩放，直至视窗被填满。当视频尺寸与显示窗口尺寸不一致时，多出的视频将被截掉。
     */
    MixedStreamRenderMode[MixedStreamRenderMode["kMixedStreamRenderModeHidden"] = 1] = "kMixedStreamRenderModeHidden";
    /** {en}
     * @brief Fit.
     *        The video frame is scaled with fixed aspect ratio, until it fits just within the canvas. Other part of the canvas is filled with the background color.
     */
    /** {zh}
     * @brief 视频帧内容全部显示优先。
     *        视频尺寸等比缩放，优先保证视频内容全部显示。当视频尺寸与显示窗口尺寸不一致时，会把窗口未被填满的区域填充成背景颜色。
     */
    MixedStreamRenderMode[MixedStreamRenderMode["kMixedStreamRenderModeFit"] = 2] = "kMixedStreamRenderModeFit";
    /** {en}
     * @brief Fill the canvas.
     *        The video frame is scaled to fill the canvas. During the process, the aspect ratio may change.
     */
    /** {zh}
     * @brief 视频帧自适应画布。
     *        视频尺寸非等比例缩放，把窗口充满。在此过程中，视频帧的长宽比例可能会发生变化。
     */
    MixedStreamRenderMode[MixedStreamRenderMode["kMixedStreamRenderModeAdaptive"] = 3] = "kMixedStreamRenderModeAdaptive";
})(MixedStreamRenderMode = exports.MixedStreamRenderMode || (exports.MixedStreamRenderMode = {}));
/** {en}
 * @brief Types of streams to be mixed
 */
/** {zh}
 * @brief 合流输出内容类型(新)。
 */
var MixedStreamMediaType;
(function (MixedStreamMediaType) {
    /** {en}
     * @brief Audio and video
     */
    /** {zh}
     * @brief 输出的混流包含音频和视频
     */
    MixedStreamMediaType[MixedStreamMediaType["kMixedStreamMediaTypeAudioAndVideo"] = 0] = "kMixedStreamMediaTypeAudioAndVideo";
    /** {en}
     * @brief Audio only
     */
    /** {zh}
     * @brief 输出的混流只包含音频
     */
    MixedStreamMediaType[MixedStreamMediaType["kMixedStreamMediaTypeAudioOnly"] = 1] = "kMixedStreamMediaTypeAudioOnly";
    /** {en}
     * @brief Video only
     */
    /** {zh}
     * @brief 输出的混流只包含视频
     */
    MixedStreamMediaType[MixedStreamMediaType["kMixedStreamMediaTypeVideoOnly"] = 2] = "kMixedStreamMediaTypeVideoOnly";
})(MixedStreamMediaType = exports.MixedStreamMediaType || (exports.MixedStreamMediaType = {}));
/** {en}
 * @brief Stream mixing region type
 */
/** {zh}
 * @brief 合流布局区域类型(新)。
 */
var MixedStreamLayoutRegionType;
(function (MixedStreamLayoutRegionType) {
    /** {en}
     * @brief The region type is a video stream.
     */
    /** {zh}
     * @brief 合流布局区域类型为视频。
     */
    MixedStreamLayoutRegionType[MixedStreamLayoutRegionType["kMixedStreamLayoutRegionTypeVideoStream"] = 0] = "kMixedStreamLayoutRegionTypeVideoStream";
    /** {en}
     * @brief The region type is an image.
     */
    /** {zh}
     * @brief 合流布局区域类型为图片。
     */
    MixedStreamLayoutRegionType[MixedStreamLayoutRegionType["kMixedStreamLayoutRegionTypeImage"] = 1] = "kMixedStreamLayoutRegionTypeImage";
})(MixedStreamLayoutRegionType = exports.MixedStreamLayoutRegionType || (exports.MixedStreamLayoutRegionType = {}));
/** {en}
 * @brief The video format for client stream mixing callback. If the format you set is not adaptable to the system, the format will be set as the default value.
 */
/** {zh}
 * @brief 客户端合流回调视频格式(新)。设置为系统不支持的格式时，自动回调系统默认格式。
 */
var MixedStreamClientMixVideoFormat;
(function (MixedStreamClientMixVideoFormat) {
    /** {en}
     * @brief YUV I420 format. The default format for Android and Windows. Supported system: Android, Windows.
     */
    /** {zh}
     * @brief YUV I420。Android、Windows 默认回调格式。支持系统：Android、Windows。
     */
    MixedStreamClientMixVideoFormat[MixedStreamClientMixVideoFormat["kMixedStreamClientMixVideoFormatI420"] = 0] = "kMixedStreamClientMixVideoFormatI420";
    /** {en}
     * @brief OpenGL GL_TEXTURE_2D format. Supported system: Android.
     */
    /** {zh}
     * @brief OpenGL GL_TEXTURE_2D 格式纹理。支持系统：安卓。
     */
    MixedStreamClientMixVideoFormat[MixedStreamClientMixVideoFormat["kMixedStreamClientMixVideoFormatTexture2D"] = 1] = "kMixedStreamClientMixVideoFormatTexture2D";
    /** {en}
     * @brief CVPixelBuffer BGRA format. The default format for iOS. support system: iOS.
     */
    /** {zh}
     * @brief CVPixelBuffer BGRA。iOS 默认回调格式。支持系统: iOS。
     */
    MixedStreamClientMixVideoFormat[MixedStreamClientMixVideoFormat["kMixedStreamClientMixVideoFormatCVPixelBufferBGRA"] = 2] = "kMixedStreamClientMixVideoFormatCVPixelBufferBGRA";
    /** {zh}
     * @brief YUV NV12。macOS 默认回调格式。支持系统: macOS。
     */
    /** {en}
     * @brief YUV NV12 format. The default format for macOS. Supported system: macOS.
     */
    MixedStreamClientMixVideoFormat[MixedStreamClientMixVideoFormat["kMixedStreamClientMixVideoFormatNV12"] = 3] = "kMixedStreamClientMixVideoFormatNV12";
})(MixedStreamClientMixVideoFormat = exports.MixedStreamClientMixVideoFormat || (exports.MixedStreamClientMixVideoFormat = {}));
/** {en}
 * @brief Stream type
 */
/** {zh}
 * @brief region中流的类型属性
 */
var MixedStreamVideoType;
(function (MixedStreamVideoType) {
    /** {en}
     * @brief Mainstream, including:
     *       + Video/audio captured by the the camera/microphone using internal capturing;
     *       + Video/audio captured by custom method.
     */
    /** {zh}
     * @brief 主流。包括：
     * + 由摄像头/麦克风通过内部采集机制，采集到的流
     * + 通过自定义采集，采集到的流。
     */
    MixedStreamVideoType[MixedStreamVideoType["kMixedStreamVideoTypeMain"] = 0] = "kMixedStreamVideoTypeMain";
    /** {en}
     * @brief Screen-sharing stream.
     */
    /** {zh}
     * @brief 屏幕流。
     */
    MixedStreamVideoType[MixedStreamVideoType["kMixedStreamVideoTypeScreen"] = 1] = "kMixedStreamVideoTypeScreen";
})(MixedStreamVideoType = exports.MixedStreamVideoType || (exports.MixedStreamVideoType = {}));
/** {en}
 * @detail 85534
 * @brief Errors occurring during pushing streams to CDN
 */
/** {zh}
 * @detail 85534
 * @brief 转推直播错误码
 */
var StreamMixingErrorCode;
(function (StreamMixingErrorCode) {
    /** {en}
     * @brief Successfully pushed streams to target CDN.
     */
    /** {zh}
     * @brief 推流成功。
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorOK"] = 0] = "kStreamMixingErrorOK";
    /** {en}
     * @brief Undefined error
     */
    /** {zh}
     * @brief 未定义的合流错误
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorBase"] = 1090] = "kStreamMixingErrorBase";
    /** {en}
     * @brief Invalid parameters detected by Client SDK.
     */
    /** {zh}
     * @brief 客户端 SDK 检测到无效推流参数。
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorInvalidParam"] = 1091] = "kStreamMixingErrorInvalidParam";
    /** {en}
     * @brief Program runs with an error, the state machine is in abnormal condition.
     */
    /** {zh}
     * @brief 状态错误，需要在状态机正常状态下发起操作
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorInvalidState"] = 1092] = "kStreamMixingErrorInvalidState";
    /** {en}
     * @brief Invalid operation
     */
    /** {zh}
     * @brief 无效操作
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorInvalidOperator"] = 1093] = "kStreamMixingErrorInvalidOperator";
    /** {en}
     * @brief Request timed out. Please check network status and retry.
     */
    /** {zh}
     * @brief 转推直播任务处理超时，请检查网络状态并重试
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorTimeout"] = 1094] = "kStreamMixingErrorTimeout";
    /** {en}
     * @brief Invalid parameters detected by the server
     */
    /** {zh}
     * @brief 服务端检测到错误的推流参数
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorInvalidParamByServer"] = 1095] = "kStreamMixingErrorInvalidParamByServer";
    /** {en}
     * @brief Subscription to the stream has expired.
     */
    /** {zh}
     * @brief 对流的订阅超时
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorSubTimeoutByServer"] = 1096] = "kStreamMixingErrorSubTimeoutByServer";
    /** {en}
     * @brief Internal server error.
     */
    /** {zh}
     * @brief 合流服务端内部错误。
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorInvalidStateByServer"] = 1097] = "kStreamMixingErrorInvalidStateByServer";
    /** {en}
     * @brief The server failed to push streams to CDN.
     */
    /** {zh}
     * @brief 合流服务端推 CDN 失败。
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorAuthenticationByCDN"] = 1098] = "kStreamMixingErrorAuthenticationByCDN";
    /** {en}
     * @brief Signaling connection timeout error. Please check network status and retry.
     */
    /** {zh}
     * @brief 服务端接收信令超时，请检查网络状态并重试。
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorTimeoutBySignaling"] = 1099] = "kStreamMixingErrorTimeoutBySignaling";
    /** {en}
     * @brief Failed to mix image.
     */
    /** {zh}
     * @brief 图片合流失败。
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorMixImageFail"] = 1100] = "kStreamMixingErrorMixImageFail";
    /** {en}
     * @brief Unknown error from server.
     */
    /** {zh}
     * @brief 服务端未知错误。
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorUnKnownByServer"] = 1101] = "kStreamMixingErrorUnKnownByServer";
    /** {en}
     * @hidden internal use only
     * @brief The cache is not synchronized.
     */
    /** {zh}
     * @hidden internal use only
     * @valid since 3.50
     * @brief 缓存未同步。
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorStreamSyncWorse"] = 1102] = "kStreamMixingErrorStreamSyncWorse";
    /** {en}
     * @hidden for internal use only
     * @brief The ‘regions’ field in transcoding message is changed.
     */
    /** {zh}
     * @hidden 只供内部使用
     * @brief 合流消息中的用户布局信息发生了变化。
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorUpdateRegionChanged"] = 1103] = "kStreamMixingErrorUpdateRegionChanged";
    /** {en}
     * @hidden for internal use only
     */
    /** {zh}
     * @hidden for internal use only
     */
    StreamMixingErrorCode[StreamMixingErrorCode["kStreamMixingErrorMax"] = 1199] = "kStreamMixingErrorMax";
})(StreamMixingErrorCode = exports.StreamMixingErrorCode || (exports.StreamMixingErrorCode = {}));
/** {en}
 * @brief  Whether to turn on the earphone monitoring function
 */
/** {zh}
 * @brief 是否开启耳返功能
 */
var EarMonitorMode;
(function (EarMonitorMode) {
    /** {en}
     * @brief Not open
     */
    /** {zh}
     * @brief 不开启
     */
    EarMonitorMode[EarMonitorMode["kEarMonitorModeOff"] = 0] = "kEarMonitorModeOff";
    /** {en}
     * @brief Open
     */
    /** {zh}
     * @brief 开启
     */
    EarMonitorMode[EarMonitorMode["kEarMonitorModeOn"] = 1] = "kEarMonitorModeOn";
})(EarMonitorMode = exports.EarMonitorMode || (exports.EarMonitorMode = {}));
var ReturnStatus;
(function (ReturnStatus) {
    /**
     * @brief 成功。
     */
    ReturnStatus[ReturnStatus["kReturnStatusSuccess"] = 0] = "kReturnStatusSuccess";
    /**
     * @brief 失败。
     */
    ReturnStatus[ReturnStatus["kReturnStatusFailure"] = -1] = "kReturnStatusFailure";
    /**
     * @brief 参数错误。
     */
    ReturnStatus[ReturnStatus["kReturnStatusParameterErr"] = -2] = "kReturnStatusParameterErr";
    /**
     * @brief 接口状态错误。
     */
    ReturnStatus[ReturnStatus["kReturnStatusWrongState"] = -3] = "kReturnStatusWrongState";
    /**
     * @brief 失败，用户已在房间内。
     */
    ReturnStatus[ReturnStatus["kReturnStatusHasInRoom"] = -4] = "kReturnStatusHasInRoom";
    /**
     * @brief 失败，用户已登录。
     */
    ReturnStatus[ReturnStatus["kReturnStatusHasInLogin"] = -5] = "kReturnStatusHasInLogin";
    /**
     * @brief 失败，用户已经在进行通话回路测试中。
     */
    ReturnStatus[ReturnStatus["kReturnStatusHasInEchoTest"] = -6] = "kReturnStatusHasInEchoTest";
    /**
     * @brief 失败，音视频均未采集。
     */
    ReturnStatus[ReturnStatus["kReturnStatusNeitherVideoNorAudio"] = -7] = "kReturnStatusNeitherVideoNorAudio";
    /**
     * @brief 失败，该 roomId 已被使用。
     */
    ReturnStatus[ReturnStatus["kReturnStatusRoomIdInUse"] = -8] = "kReturnStatusRoomIdInUse";
    /**
     * @brief 失败，屏幕流不支持。
     */
    ReturnStatus[ReturnStatus["kReturnStatusScreenNotSupport"] = -9] = "kReturnStatusScreenNotSupport";
    /**
     * @brief 失败，不支持该操作。
     */
    ReturnStatus[ReturnStatus["kReturnStatusNotSupport"] = -10] = "kReturnStatusNotSupport";
    /**
     * @brief 失败，资源已占用。
     */
    ReturnStatus[ReturnStatus["kReturnStatusResourceOverflow"] = -11] = "kReturnStatusResourceOverflow";
    /**
     * @brief 失败，不支持视频接口调用。
     */
    ReturnStatus[ReturnStatus["kReturnStatusVideoNotSupport"] = -12] = "kReturnStatusVideoNotSupport";
    /**
     * @brief 失败，没有音频帧。
     */
    ReturnStatus[ReturnStatus["kReturnStatusAudioNoFrame"] = -101] = "kReturnStatusAudioNoFrame";
    /**
     * @brief 失败，未实现。
     */
    ReturnStatus[ReturnStatus["kReturnStatusAudioNotImplemented"] = -102] = "kReturnStatusAudioNotImplemented";
    /**
     * @brief 失败，采集设备无麦克风权限，尝试初始化设备失败。
     */
    ReturnStatus[ReturnStatus["kReturnStatusAudioNoPermission"] = -103] = "kReturnStatusAudioNoPermission";
    /**
     * @brief 失败，设备不存在。当前没有设备或设备被移除时返回该值。
     */
    ReturnStatus[ReturnStatus["kReturnStatusAudioDeviceNotExists"] = -104] = "kReturnStatusAudioDeviceNotExists";
    /**
     * @brief 失败，设备音频格式不支持。
     */
    ReturnStatus[ReturnStatus["kReturnStatusAudioDeviceFormatNotSupport"] = -105] = "kReturnStatusAudioDeviceFormatNotSupport";
    /**
     * @brief 失败，系统无可用设备。
     */
    ReturnStatus[ReturnStatus["kReturnStatusAudioDeviceNoDevice"] = -106] = "kReturnStatusAudioDeviceNoDevice";
    /**
     * @brief 失败，当前设备不可用，需更换设备。
     */
    ReturnStatus[ReturnStatus["kReturnStatusAudioDeviceCannotUse"] = -107] = "kReturnStatusAudioDeviceCannotUse";
    /**
     * @brief 系统错误，设备初始化失败。
     */
    ReturnStatus[ReturnStatus["kReturnStatusAudioDeviceInitFailed"] = -108] = "kReturnStatusAudioDeviceInitFailed";
    /**
     * @brief 系统错误，设备开启失败。
     */
    ReturnStatus[ReturnStatus["kReturnStatusAudioDeviceStartFailed"] = -109] = "kReturnStatusAudioDeviceStartFailed";
    /**
     * @brief 失败，无效对象。
     */
    ReturnStatus[ReturnStatus["kReturnStatusNativeInvalid"] = -201] = "kReturnStatusNativeInvalid";
})(ReturnStatus = exports.ReturnStatus || (exports.ReturnStatus = {}));
var UserVisibilityChangeError;
(function (UserVisibilityChangeError) {
    /**
     * @brief 成功。
     */
    UserVisibilityChangeError[UserVisibilityChangeError["kUserVisibilityChangeErrorOk"] = 0] = "kUserVisibilityChangeErrorOk";
    /**
     * @brief 未知错误。
     */
    UserVisibilityChangeError[UserVisibilityChangeError["kUserVisibilityChangeErrorUnknown"] = 1] = "kUserVisibilityChangeErrorUnknown";
    /**
     * @brief 房间内可见用户达到上限。
     */
    UserVisibilityChangeError[UserVisibilityChangeError["kUserVisibilityChangeErrorTooManyVisibleUser"] = 2] = "kUserVisibilityChangeErrorTooManyVisibleUser";
})(UserVisibilityChangeError = exports.UserVisibilityChangeError || (exports.UserVisibilityChangeError = {}));
/** {en}
 * @brief Local log parameters.
 */
/** {zh}
 * @brief 本地日志输出等级。
 */
var LocalLogLevel;
(function (LocalLogLevel) {
    /** {en}
     * @brief Info level.
     */
    /** {zh}
     * @brief 信息级别。
     */
    LocalLogLevel[LocalLogLevel["kInfo"] = 0] = "kInfo";
    /** {en}
     * @brief (Default) Warning level.
     */
    /** {zh}
     * @brief （默认值）警告级别。
     */
    LocalLogLevel[LocalLogLevel["kWarning"] = 1] = "kWarning";
    /** {en}
     * @brief Error level.
     */
    /** {zh}
     * @brief 错误级别。
     */
    LocalLogLevel[LocalLogLevel["kError"] = 2] = "kError";
    /** {en}
     * @brief Turn off logging.
     */
    /** {zh}
     * @brief 关闭日志。
     */
    LocalLogLevel[LocalLogLevel["kNone"] = 3] = "kNone";
})(LocalLogLevel = exports.LocalLogLevel || (exports.LocalLogLevel = {}));
var PlayerState;
(function (PlayerState) {
    /**
     * @brief 播放未启动
     */
    PlayerState[PlayerState["kPlayerStateIdle"] = 0] = "kPlayerStateIdle";
    /**
     * @brief 已加载
     */
    PlayerState[PlayerState["kPlayerStatePreloaded"] = 1] = "kPlayerStatePreloaded";
    /**
     * @brief 播放文件已打开
     */
    PlayerState[PlayerState["kPlayerStateOpened"] = 2] = "kPlayerStateOpened";
    /**
     * @brief 正在播放
     */
    PlayerState[PlayerState["kPlayerStatePlaying"] = 3] = "kPlayerStatePlaying";
    /**
     * @brief 播放已暂停
     */
    PlayerState[PlayerState["kPlayerStatePaused"] = 4] = "kPlayerStatePaused";
    /**
     * @brief 播放已停止
     */
    PlayerState[PlayerState["kPlayerStateStopped"] = 5] = "kPlayerStateStopped";
    /**
     * @brief 播放失败
     */
    PlayerState[PlayerState["kPlayerStateFailed"] = 6] = "kPlayerStateFailed";
})(PlayerState = exports.PlayerState || (exports.PlayerState = {}));
var PlayerError;
(function (PlayerError) {
    /**
     * @brief 正常
     */
    PlayerError[PlayerError["kPlayerErrorOK"] = 0] = "kPlayerErrorOK";
    /**
     * @brief 不支持此类型
     */
    PlayerError[PlayerError["kPlayerErrorFormatNotSupport"] = 1] = "kPlayerErrorFormatNotSupport";
    /**
     * @brief 无效的播放路径
     */
    PlayerError[PlayerError["kPlayerErrorInvalidPath"] = 2] = "kPlayerErrorInvalidPath";
    /**
     * @brief 无效的状态
     */
    PlayerError[PlayerError["kPlayerErrorInvalidState"] = 3] = "kPlayerErrorInvalidState";
    /**
     * @brief 设置播放位置出错
     */
    PlayerError[PlayerError["kPlayerErrorInvalidPosition"] = 4] = "kPlayerErrorInvalidPosition";
    /**
     * @brief 音量参数不合法，仅支持设置的音量值为[0, 400]
     */
    PlayerError[PlayerError["kPlayerErrorInvalidVolume"] = 5] = "kPlayerErrorInvalidVolume";
    /**
     * @brief 音调参数设置不合法
     */
    PlayerError[PlayerError["kPlayerErrorInvalidPitch"] = 6] = "kPlayerErrorInvalidPitch";
    /**
     * @brief 音轨参数设置不合法
     */
    PlayerError[PlayerError["kPlayerErrorInvalidAudioTrackIndex"] = 7] = "kPlayerErrorInvalidAudioTrackIndex";
    /**
     * @brief 播放速度参数设置不合法
     */
    PlayerError[PlayerError["kPlayerErrorInvalidPlaybackSpeed"] = 8] = "kPlayerErrorInvalidPlaybackSpeed";
    /**
     * @brief 音效 ID 异常
     */
    PlayerError[PlayerError["kPlayerErrorInvalidEffectId"] = 9] = "kPlayerErrorInvalidEffectId";
})(PlayerError = exports.PlayerError || (exports.PlayerError = {}));
/** {en}
 * @hidden
 * @type keytype
 * @brief The filter type of the music list.
 */
/** {zh}
 * @type keytype
 * @brief 歌曲过滤方式。
 */
var MusicFilterType;
(function (MusicFilterType) {
    /** {en}
     * @brief No filter.
     */
    /** {zh}
     * @brief 不过滤。
     */
    MusicFilterType[MusicFilterType["kMusicFilterTypeNone"] = 0] = "kMusicFilterTypeNone";
    /** {en}
     * @brief Remove music that does not have lyrics.
     */
    /** {zh}
     * @brief 过滤没有歌词的歌曲。
     */
    MusicFilterType[MusicFilterType["kMusicFilterTypeWithoutLyric"] = 1] = "kMusicFilterTypeWithoutLyric";
    /** {en}
     * @brief Remove music that does not support scoring.
     */
    /** {zh}
     * @brief 过滤不支持打分的歌曲。
     */
    MusicFilterType[MusicFilterType["kMusicFilterTypeUnsupportedScore"] = 2] = "kMusicFilterTypeUnsupportedScore";
    /** {en}
     * @brief Remove music that does not support accompany mode.
     */
    /** {zh}
     * @brief 过滤不支持伴唱切换的歌曲。
     */
    MusicFilterType[MusicFilterType["kMusicFilterTypeUnsupportedAccopmay"] = 4] = "kMusicFilterTypeUnsupportedAccopmay";
    /** {en}
     * @brief Remove music that does not have a climax part.
     */
    /** {zh}
     * @brief 过滤没有高潮片段的歌曲。
     */
    MusicFilterType[MusicFilterType["kMusicFilterTypeUnsupportedClimx"] = 8] = "kMusicFilterTypeUnsupportedClimx";
})(MusicFilterType = exports.MusicFilterType || (exports.MusicFilterType = {}));
/** {en}
 * @brief Audio data callback method
 */
/** {zh}
 * @brief 音频回调方法
 */
var AudioFrameCallbackMethod;
(function (AudioFrameCallbackMethod) {
    /** {en}
     * @brief The callback of the audio data recorded by local microphone.
     */
    /** {zh}
     * @brief 本地麦克风录制的音频数据回调
     */
    AudioFrameCallbackMethod[AudioFrameCallbackMethod["kAudioFrameCallbackRecord"] = 0] = "kAudioFrameCallbackRecord";
    /** {en}
     * @brief The callback of the mixed audio data of all remote users subscribed by the local user.
     */
    /** {zh}
     * @brief 订阅的远端所有用户混音后的音频数据回调
     */
    AudioFrameCallbackMethod[AudioFrameCallbackMethod["kAudioFrameCallbackPlayback"] = 1] = "kAudioFrameCallbackPlayback";
    /** {en}
     * @brief The callback of the mixed audio data including the data recorded by local microphone and that of all remote users subscribed by the local user.
     */
    /** {zh}
     * @brief 本地麦克风录制和订阅的远端所有用户混音后的音频数据回调
     */
    AudioFrameCallbackMethod[AudioFrameCallbackMethod["kAudioFrameCallbackMixed"] = 2] = "kAudioFrameCallbackMixed";
    /** {en}
     * @brief The callback of the audio data before mixing of each remote user subscribed by the local user.
     */
    /** {zh}
     * @brief 订阅的远端每个用户混音前的音频数据回调
     */
    AudioFrameCallbackMethod[AudioFrameCallbackMethod["kAudioFrameCallbackRemoteUser"] = 3] = "kAudioFrameCallbackRemoteUser";
    /** {en}
     * @brief The callback of screen audio data captured locally.
     */
    /** {zh}
     * @brief 本地屏幕录制的音频数据回调
     */
    AudioFrameCallbackMethod[AudioFrameCallbackMethod["kAudioFrameCallbackRecordScreen"] = 4] = "kAudioFrameCallbackRecordScreen";
})(AudioFrameCallbackMethod = exports.AudioFrameCallbackMethod || (exports.AudioFrameCallbackMethod = {}));
/** {zh}
 * @brief 远端音频流精准对齐模式
 */
/** {en}
 * @brief The alignment mode of remote audio streams
 */
var AudioAlignmentMode;
(function (AudioAlignmentMode) {
    /** {en}
     * @brief Disabled
     */
    /** {zh}
     * @brief 不对齐
     */
    AudioAlignmentMode[AudioAlignmentMode["kAudioAlighmentModeOff"] = 0] = "kAudioAlighmentModeOff";
    /** {en}
     * @brief All subscribed audio streams are aligned based on the process of the background music.
     */
    /** {zh}
     * @brief 远端音频流都对齐伴奏进度同步播放
     */
    AudioAlignmentMode[AudioAlignmentMode["kAudioAlighmentModeAudioMixing"] = 1] = "kAudioAlighmentModeAudioMixing";
})(AudioAlignmentMode = exports.AudioAlignmentMode || (exports.AudioAlignmentMode = {}));
/** {en}
 * @brief Media device warning
 */
/** {zh}
 * @brief 媒体设备警告
 */
var MediaDeviceWarning;
(function (MediaDeviceWarning) {
    /** {en}
     * @brief No warning
     */
    /** {zh}
     * @brief 无警告
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningOK"] = 0] = "kMediaDeviceWarningOK";
    /** {en}
     * @brief Illegal device operation. Calls the API for internal device when using the external device.
     */
    /** {zh}
     * @brief 非法设备操作。在使用外部设备时，调用了 SDK 内部设备 API。
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningOperationDenied"] = 1] = "kMediaDeviceWarningOperationDenied";
    /** {zh}
     * @brief 采集静音。
     */
    /** {en}
     * @brief No audio is captured.
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningCaptureSilence"] = 2] = "kMediaDeviceWarningCaptureSilence";
    /** {zh}
     * @hidden
     * @brief Android 特有的静音，系统层面的静音上报
     */
    /** {en}
     * @hidden
     * @brief Silence warning by Android system.
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningAndroidSysSilence"] = 3] = "kMediaDeviceWarningAndroidSysSilence";
    /** {zh}
     * @hidden
     * @brief Android 特有的静音消失
     */
    /** {en}
     * @hidden
     * @brief Silence disappearing warning by Android system.
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningAndroidSysSilenceDisappear"] = 4] = "kMediaDeviceWarningAndroidSysSilenceDisappear";
    /** {zh}
     * @hidden
     * @brief 音量过大，超过设备采集范围。建议降低麦克风音量或者降低声源音量。
     */
    /** {en}
     * @hidden
     * @brief The volume is too loud and exceeds the acquisition range of the device. Lower the microphone volume or
     * lower the volume of the audio source.
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningDetectClipping"] = 10] = "kMediaDeviceWarningDetectClipping";
    /** {en}
     * @brief Echos between mics and speakers are detected during a call.
     *        `onAudioDeviceWarning` notifies you with this enum of echo issue. During a call, SDK will detect echo
     * issue only when [RoomProfileType](85535#roomprofiletype) is set to `kRoomProfileTypeMeeting` or
     * `kRoomProfileTypeMeetingRoom` and AEC is disabled.
     */
    /** {zh}
     * @brief 通话中出现回声现象。
     *        当 [RoomProfileType](85535#roomprofiletype) 为 `kRoomProfileTypeMeeting` 和
     * `kRoomProfileTypeMeetingRoom`，且 AEC 关闭时，SDK 自动启动回声检测，如果检测到回声问题，将通过
     * `onAudioDeviceWarning` 返回本枚举值。
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningDetectLeakEcho"] = 11] = "kMediaDeviceWarningDetectLeakEcho";
    /** {zh}
     * @hidden
     * @brief 低信噪比
     */
    /** {en}
     * @hidden
     * @brief Low SNR.
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningDetectLowSNR"] = 12] = "kMediaDeviceWarningDetectLowSNR";
    /** {zh}
     * @hidden
     * @brief 采集插零现象
     */
    /** {en}
     * @hidden
     * @brief Silence inserted during capture.
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningDetectInsertSilence"] = 13] = "kMediaDeviceWarningDetectInsertSilence";
    /** {zh}
     * @hidden
     * @brief 设备采集静音（算法层）
     */
    /** {en}
     * @hidden
     * @brief Silence during capture.
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningCaptureDetectSilence"] = 14] = "kMediaDeviceWarningCaptureDetectSilence";
    /** {zh}
     * @hidden
     * @brief 设备采集静音消失
     */
    /** {en}
     * @hidden
     * @brief Silence disappears during capture.
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningCaptureDetectSilenceDisappear"] = 15] = "kMediaDeviceWarningCaptureDetectSilenceDisappear";
    /** {zh}
     * @brief 啸叫。触发该回调的情况如下：1）不支持啸叫抑制的房间模式下，检测到啸叫；2）支持啸叫抑制的房间模式下，检测到未被抑制的啸叫。
     *        仅 kRoomProfileTypeCommunication、kRoomProfileTypeMeeting、kRoomProfileTypeMeetingRoom
     * 三种房间模式支持啸叫抑制。 建议提醒用户检查客户端的距离或将麦克风和扬声器调至静音。
     */
    /** {en}
     * @brief Howling detected.
     *        You will receive this callback in the following scenarios: 1) Howling is detected under the room profiles
     * that do not support howling suppression; 2) Detect howling that is not suppressed under the room profiles that
     * support howling suppression. You can only enable howling suppression by calling [joinRoom](85532#rtcroom-joinroom) to set your room profile as kRoomProfileTypeCommunication, kRoomProfileTypeMeeting, and
     * kRoomProfileTypeMeetingRoom. We recommend that you remind your users to adjust the physical distance between two
     * devices or disable all unused devices except the connecting one.
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningCaptureDetectHowling"] = 16] = "kMediaDeviceWarningCaptureDetectHowling";
    /**
     * @hidden
     * @brief sudden impluse noise detected
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningSuddenImpluseDetected"] = 17] = "kMediaDeviceWarningSuddenImpluseDetected";
    /**
     * @hidden
     * @brief sudden impluse noise detected
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningSquareWavSoundDetected"] = 18] = "kMediaDeviceWarningSquareWavSoundDetected";
    /** {zh}
     * @hidden
     * @brief setAudioRoute结果回调, 该scenario下不支持设置
     */
    /** {en}
     * @hidden
     * @brief result of api setAudioRoute callback, not support called to setAudioRoute in this scenario
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningSetAudioRouteInvalidScenario"] = 20] = "kMediaDeviceWarningSetAudioRouteInvalidScenario";
    /** {zh}
     * @hidden
     * @brief setAudioRoute结果回调, routing device 不存在 (Android)
     */
    /** {en}
     * @hidden
     * @brief result of api setAudioRoute callback, routing device not exists (Andorid)
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningSetAudioRouteNotExists"] = 21] = "kMediaDeviceWarningSetAudioRouteNotExists";
    /**
     * @hidden
     * @brief setAudioRoute结果回调, 系统高优先级路由占用 (IOS)
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningSetAudioRouteFailedByPriority"] = 22] = "kMediaDeviceWarningSetAudioRouteFailedByPriority";
    /**
     * @hidden
     * @brief 当前非通话模式 kAudioScenarioTypeCommunication，不支持设置音频路由
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningSetAudioRouteNotVoipMode"] = 23] = "kMediaDeviceWarningSetAudioRouteNotVoipMode";
    /**
     * @hidden
     * @brief setAudioRoute结果回调, 设备没有启动
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningSetAudioRouteDeviceNotStart"] = 24] = "kMediaDeviceWarningSetAudioRouteDeviceNotStart";
    /**
     * @hidden
     * @brief setBluetoothMode结果回调, 当前场景不会立即生效
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningSetBluetoothModeScenarioUnsupport"] = 25] = "kMediaDeviceWarningSetBluetoothModeScenarioUnsupport";
    /**
     * @hidden
     * @brief setBluetoothMode 结果回调, 当前不支持设置蓝牙模式
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningSetBluetoothModeUnsupport"] = 26] = "kMediaDeviceWarningSetBluetoothModeUnsupport";
    /**
     * @hidden
     * @brief 使用无声的采集设备
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningRecordingUseSilentDevice"] = 27] = "kMediaDeviceWarningRecordingUseSilentDevice";
    /** {zh}
     * @hidden
     * @brief 使用无声的采集设备
     */
    /** {en}
     * @hidden
     * @brief use silent record device
     */
    MediaDeviceWarning[MediaDeviceWarning["kMediaDeviceWarningPlayoutUseSilentDevice"] = 28] = "kMediaDeviceWarningPlayoutUseSilentDevice";
})(MediaDeviceWarning = exports.MediaDeviceWarning || (exports.MediaDeviceWarning = {}));
/** {en}
 * @brief State of the black frame video stream
 */
/** {zh}
 * @brief 黑帧视频流状态
 */
var SEIStreamEventType;
(function (SEIStreamEventType) {
    /** {zh}
     * @brief 远端用户发布黑帧视频流。
     *        纯语音通话场景下，远端用户调用 [sendSEIMessage](85532#rtcvideo-sendseimessage) 发送 SEI 数据时，SDK 会自动发布一路黑帧视频流，并触发该回调。
     */
    /** {en}
     * @brief A black frame video stream is published from the remote user.
     *        In a voice call, when the remote user calls [sendSEIMessage](85532#rtcvideo-sendseimessage) to send SEI data, SDK will automatically publish a black frame video stream, and trigger this callback.
     */
    SEIStreamEventType[SEIStreamEventType["kSEIStreamEventTypeStreamAdd"] = 0] = "kSEIStreamEventTypeStreamAdd";
    /** {zh}
     * @brief 远端黑帧视频流移除。该回调的触发时机包括：
     * + 远端用户开启摄像头采集，由语音通话切换至视频通话，黑帧视频流停止发布；
     * + 远端用户调用 [sendSEIMessage](85532#rtcvideo-sendseimessage) 后 1min 内未有 SEI 数据发送，黑帧视频流停止发布；
     * + 远端用户切换至自定义视频采集时，黑帧视频流停止发布。
     */
    /** {en}
    * @brief The black frame video stream is removed. The timing this callback will be triggered is as following:
    * + The remote user turns on their camera, switching from a voice call to a video call.
    * + No SEI data is sent within 1min after the remote user calls [sendSEIMessage](85532#rtcvideo-sendseimessage).
    * + The black frame video stream stops when the remote user switch to custom video capture.
    */
    SEIStreamEventType[SEIStreamEventType["kSEIStreamEventTypeStreamRemove"] = 1] = "kSEIStreamEventTypeStreamRemove";
})(SEIStreamEventType = exports.SEIStreamEventType || (exports.SEIStreamEventType = {}));
//# sourceMappingURL=index.js.map