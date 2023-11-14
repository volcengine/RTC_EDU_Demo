/** {en}
 * @brief Video rendering scale mode
 */
/** {zh}
 * @brief 渲染时，视频内容缩放模式
 */
export declare enum RenderMode {
    /** {en}
     * @brief Fit.
     *        The video frame is scaled with fixed aspect ratio, until it fits just within the canvas. Other part of the canvas is filled with the background color.
     */
    /** {zh}
     * @brief 视频帧内容全部显示优先。
     * 视频帧等比缩放，直至视频帧能够在视窗上全部显示。如果视频帧长宽比例与视窗不同，视窗上未被视频帧填满区域将被涂黑。
     * 缩放完成后，视频帧的一边长和视窗的对应边长一致，另一边长小于等于视窗对应边长。
     */
    FIT = 1,
    /** {en}
     * @brief Fill and Crop.
     *        The video frame is scaled with fixed aspect ratio, until it completely fills the canvas. The region of the video exceeding the canvas will be cropped.
     */
    /** {zh}
     * @brief 视窗填满优先。
     * 视频帧等比缩放，直至视窗被视频填满。如果视频帧长宽比例与视窗不同，视频帧的多出部分将无法显示。
     * 缩放完成后，视频帧的一边长和视窗的对应边长一致，另一边长大于等于视窗对应边长。
     */
    HIDDEN = 2
}
/** {en}
 * @brief Render options
 */
/** {zh}
 * @brief 本地渲染选项
 */
export interface RenderOptions {
    /** {en}
     * @brief Scale mode when rendering
     */
    /** {zh}
     * @brief 渲染时，视频内容缩放模式
     */
    render_mode: RenderMode;
    /** {en}
     * @brief Whether to turn on mirror mode
     */
    /** {zh}
     * @brief 是否镜像渲染
     */
    mirror: boolean;
}
/** {en}
 * @brief rendering type
 */
/** {zh}
 * @brief 渲染类型
 */
export declare enum RenderType {
    /** {en}
     * @brief WebGL render.
     */
    /** {zh}
     * @brief WebGL渲染。
     */
    kRenderTypeWebGL = 1,
    /** {en}
     * @brief Software render.
     */
    /** {zh}
     * @brief Software渲染。
     */
    kRenderTypeSoftware = 2
}
/** {en}
 * @brief Subscription status of media streams
 */
/** {zh}
 * @brief 订阅媒体流状态
 */
export declare enum SubscribeState {
    /** {en}
     * @brief Successfully changed the subscription status
     */
    /** {zh}
     * @brief 订阅/取消订阅流成功
     */
    kSubscribeStateSuccess = 0,
    /** {en}
     * @brief Failed to change the subscription status, because you were not in the room.
     */
    /** {zh}
     * @brief 订阅/取消订阅流失败，本地用户未在房间中
     */
    kSubscribeStateFailedNotInRoom = 1,
    /** {en}
     * @brief Failed to change the subscription status, because the target audio/video stream was not found.
     */
    /** {zh}
     * @brief 订阅/取消订阅流失败，房间内未找到指定的音视频流
     */
    kSubscribeStateFailedStreamNotFound = 2,
    /** {en}
     * @brief Failed to change the subscription status, because the number of streams you have subscribed to has exceeded the limit.
     */
    /** {zh}
     * @brief 超过订阅流数上限
     */
    kSubscribeStateFailedOverLimit = 3
}
/** {en}
 * @brief Configuration information for manual subscription flows.
 */
/** {zh}
 * @brief 手动订阅流的配置信息。
 */
export interface SubscribeConfig {
    /** {en}
     * @brief Whether it is a screen stream (default is no).
     */
    /** {zh}
     * @brief 是否是屏幕流，默认为否。
     */
    is_screen: boolean;
    /** {en}
     * @brief Whether to subscribe to videos.
     */
    /** {zh}
     * @brief 是否订阅视频。
     */
    sub_video: boolean;
    /** {en}
     * @brief Whether to subscribe to audio.
     */
    /** {zh}
     * @brief 是否订阅音频。
     */
    sub_audio: boolean;
    /** {en}
     * @brief Subscribed video stream resolution subscript.
     *        Users can publish multiple videos of different resolutions in a stream by calling the [setVideoEncoderConfig](85532#setvideoencoderconfig) method. Therefore, when subscribing to a stream, you need to specify the specific resolution of the subscription. This parameter is used to specify the subscript of the resolution to be subscribed to, and the default value is 0.
     */
    /** {zh}
     * @brief 订阅的视频流分辨率下标。
     *        用户可以通过调用 [setVideoEncoderConfig](85532#setvideoencoderconfig) 方法在一路流中发布多个不同分辨率的视频。因此订阅流时，需要指定订阅的具体分辨率。此参数即用于指定需订阅的分辨率的下标，默认值为 0 。
     */
    video_index: number;
    /** {en}
     * @brief For the remote user's requirement priority. It defaults to 0, meaning the lowest priority.
     * + `100`: Normal
     * + `200`: High priory
     *         When the subscription flow fallback option function is turned on (see [setSubscribeFallbackOption](85532#setsubscribefallbackoption) method for details), weak connections or insufficient performance will give priority to ensuring the quality of the received high-priority user's flow.
     */
    /** {zh}
     * @brief 远端用户的需求优先级，0 为默认值。
     * + `0`: 默认，用户优先级为低
     * + `100`: 用户优先级为正常
     * + `200`: 用户优先级为高
     * 当开启了订阅流回退选项功能（详见 [setSubscribeFallbackOption](85532#setsubscribefallbackoption) 方法），弱网或性能不足时会优先保证收到的高优先级用户的流的质量。
     */
    priority: number;
    /** {en}
     * @brief The time domain hierarchy of the remote user. It defaults to 0
     *         This only works if the stream supports the SVC feature.
     */
    /** {zh}
     * @brief 远端用户的时域分层，0 为默认值。
     * 仅码流支持 SVC 特性时可以生效。
     */
    svc_layer: number;
    /** {en}
     * @brief Expected maximum frame rate of the subscribed stream in px. The default value is 0, values greater than 10 are valid.
     *        If the frame rate of the stream published is lower than the value you set, or if your subscribed stream falls back under limited network conditions, the frame rate you set will drop accordingly.
     *        Only valid if the stream is coded with SVC technique.
     */
    /** {zh}
     * @brief 期望订阅的最高帧率，单位：fps，默认值为 0，设为大于 0 的值时开始生效。
     * 当发布端帧率低于设定帧率，或订阅端开启性能回退后下行弱网，则帧率会相应下降。
     * 仅码流支持 SVC 分级编码特性时方可生效。
     */
    framerate: number;
    /** {en}
     * @brief The user specifies the width(px) of the most appropriate stream corresponding to the UI by specifying
     */
    /** {zh}
     * @brief 用户通过指定 UI 对应的最合适的流的宽度，单位：px
     */
    sub_width: number;
    /** {en}
     * @brief The user specifies the height(px) of the most appropriate stream corresponding to the UI by specifying
     */
    /** {zh}
     * @brief 用户通过指定 UI 对应的最合适的流的高度，单位：px
     */
    sub_height: number;
    /** {en}
     * @hidden
     */
    /** {zh}
     * @hidden
     */
    sub_video_index: number;
}
/** {en}
 * @brief Coordinates of the screen-sharing object.
 * + When there are several screens, the origin (0, 0) is different for different platforms:
 *         - For Windows, the origin (0, 0) is the top-left corner of the main screen.
 *         - For Linux, the origin (0, 0) is the top-left corner of the rectangle that merely covers all screens.
 * + The region of the window is different for different platforms:
 *         - For Windows and macOS, the region includes the system title bar of the window.
 *         - For Linux, the region does not includes the system title bar of the window.
 */
/** {zh}
 * @brief 矩形区域，用于指定屏幕区域
 * + 对于多屏幕的场景，不同平台的坐标系原点不同：
 *          - 对于 Windows 平台，屏幕坐标以主屏左上角为原点 (0, 0)，向右向下扩展。
 *          — 对于 Linux 平台，屏幕坐标以 **恰好包住所有显示器的矩形区域的左上角** 为原点 (0, 0)，向右向下扩展。
 * + 对于不同平台，窗口区域不同：
 *          - 对于 Windows 和 macOS 平台，窗口区域包含系统标题栏。
 *          - 对于 Linux 平台，窗口区域不包含系统标题栏。
 */
export interface Rectangle {
    /** {en}
     * @brief The x coordinate of the upper left corner of the rectangular area
     */
    /** {zh}
     * @brief 矩形区域左上角的 x 坐标
     */
    x?: number;
    /** {en}
     * @brief The y coordinate of the upper left corner of the rectangular area
     */
    /** {zh}
     * @brief 矩形区域左上角的 y 坐标
     */
    y?: number;
    /** {en}
     * @brief Rectangle width
     */
    /** {zh}
     * @brief 矩形宽度
     */
    width?: number;
    /** {en}
     * @brief Rectangular height
     */
    /** {zh}
     * @brief 矩形高度
     */
    height?: number;
}
/** {en}
 * @brief Border highlighting settings for screen sharing
 */
/** {zh}
 * @brief 屏幕共享时的边框高亮设置
 */
export interface HighlightConfig {
    /** {en}
     * @brief Whether to display a highlighted border. Yes by default.
     */
    /** {zh}
     * @brief 是否显示高亮边框，默认显示。
     */
    enable_highlight?: boolean;
    /** {en}
     * @brief The color of the border in hexadecimal ARGB: 0xAARRGGBB. It defaults to 0xFF29CCA3.
     */
    /** {zh}
     * @brief 边框的颜色, 颜色格式为十六进制 ARGB:  0xAARRGGBB, 默认为 0xFF29CCA3
     */
    border_color?: number;
    /** {en}
     * @brief The width of the border in pixel. It defaults to 4.
     */
    /** {zh}
     * @brief 边框的宽度, 单位：像素，默认为: 4
     */
    border_width?: number;
}
/** {en}
 * @brief  Video frame scale mode
 */
/** {zh}
 * @brief 视频帧缩放模式，默认使用FitWithCropping模式
 */
export declare enum ScaleMode {
    /** {en}
     * @brief Auto mode, default to FitWithCropping.
     */
    /** {zh}
     * @brief 自动模式
     */
    Auto = 0,
    /** {en}
     * @brief Stretch the video frame until the video frame and the window have the same resolution. The video frame's aspect ratio can be changed as it is automatically stretched to fill the window, but the whole image is visible.
     */
    /** {zh}
     * @brief 视频尺寸进行缩放和拉伸以充满显示视窗
     */
    Stretch = 1,
    /** {en}
     * @brief  Fit the window with cropping
     *         Scale the video frame uniformly until the window is filled. If the video frame's aspect ratio is different from that of the window, the extra part of the video frame will be cropped.
     *         After the scaling process is completed, the width or height of the video frame will be consistent with that of the window, and the other dimension will be greater than or equal to that of the window.
     */
    /** {zh}
     * @brief
     * 优先保证视窗被填满。视频尺寸等比缩放，直至整个视窗被视频填满。如果视频长宽与显示窗口不同，多出的视频将被截掉
     */
    FitWithCropping = 2,
    /** {en}
     * @brief  Fit the window with filling
     *         Scale the video frame uniformly until its width or height reaches the boundary of the window. If the video frame's aspect ratio is different from that of the window, the area that is not filled will be black.
     *         After the scaling process is completed, the width or height of the video frame will be consistent with that of the window, and the other dimension will be less than or equal to that of the window.
     */
    /** {zh}
     * @brief
     * 优先保证视频内容全部显示。视频尺寸等比缩放，直至视频窗口的一边与视窗边框对齐。如果视频长宽与显示窗口不同，视窗上未被填满的区域将被涂黑
     */
    FitWithFilling = 3
}
/** {en}
 * @brief Video encoder type
 */
/** {zh}
 * @brief 视频的编码类型
 */
export declare enum VideoCodecType {
    /** {en}
     * @brief Unknown
     */
    /** {zh}
     * @brief 未知类型
     */
    kVideoCodecUnknown = 0,
    /** {en}
     * @brief H264
     */
    /** {zh}
     * @brief 标准H264
     */
    kVideoCodecH264 = 1,
    /** {en}
     * @hidden
     * @brief
     */
    /** {zh}
     * @hidden
     * @brief 标准ByteVC1
     */
    kVideoCodecByteVC1 = 2
}
/** {en}
 * @brief  Video encoding mode
 */
/** {zh}
 * @brief 视频编码模式
 */
export declare enum CodecMode {
    /** {en}
     * @brief Automatic
     */
    /** {zh}
     * @brief 自动选择
     */
    AutoMode = 0,
    /** {en}
     * @brief Hardware encoding
     */
    /** {zh}
     * @brief 硬编码
     */
    HardwareMode = 1,
    /** {en}
     * @brief Software encoding
     */
    /** {zh}
     * @brief 软编码
     */
    SoftwareMode = 2
}
/** {en}
 * @brief Auto
 */
/** {zh}
 * @brief 自动最高编码码率
 */
export declare const SEND_KBPS_AUTO_CALCULATE = -1;
/** {en}
 * @brief Disable
 */
/** {zh}
 * @brief 不设置最高编码码率
 */
export declare const SEND_KBPS_DISABLE_VIDEO_SEND = 0;
/** {en}
 * @brief Video encoding configuration. Refer to [Setting Video Encoder Configuration](https://docs.byteplus.com/byteplus-rtc/docs/70122) to learn more.
 */
/** {zh}
 * @brief 视频流参数
 */
export interface VideoEncoderConfig {
    /** {en}
     * @brief Width of the video frame in px
     */
    /** {zh}
     * @brief 视频宽度，单位：像素
     */
    width: number;
    /** {en}
     * @brief Height of the video frame in px
     */
    /** {zh}
     * @brief 视频高度，单位：像素
     */
    height: number;
    /** {en}
     * @brief Video frame rate in fps
     */
    /** {zh}
     * @brief 视频帧率，单位：fps
     */
    frameRate: number;
    /** {en}
     * @brief Maximum bit rate in kbps. Optional for internal capturing while mandatory for custom capturing.
     *        The default value is -1 in internal capturing mode, SDK will automatically calculate the applicable bit rate based on the input resolution and frame rate.
     *        No stream will be encoded and published if you set this parameter to 0.
     */
    /** {zh}
     * @brief 最大发送编码码率（kbps），建议使用默认的自动码率。<li>-1: 自动码率</li><li>0: 不开启上限</li><li>>0: 填写预估码率<li>
     * 设为 0 则不对视频流进行编码发送。
     */
    maxBitrate?: number;
    /** {en}
     * @brief Minimum video encoding bitrate in kbps. The encoding bitrate will not be lower than the `minBitrate`.
     *        It defaults to `0`.
     *        It ranges within [0, maxBitrate). When `maxBitrate` < `minBitrate`, the bitrate is self-adpapted.
     *        In the following circumstance, the assignment to this variable has no effect:
     * + When `maxBitrate` = `0`, the video encoding is disabled.
     * + When `maxBitrate` < `0`, the bitrate is self-adapted.
     */
    /** {zh}
     * @brief 视频最小编码码率, 单位 kbps。编码码率不会低于 `minBitrate`。
     *        默认值为 `0`。
     *        范围：[0, maxBitrate)，当 `maxBitrate` < `minBitrate` 时，为适配码率模式。
     *        以下情况，设置本参数无效：
     * + 当 `maxBitrate` 为 `0` 时，不对视频流进行编码发送。
     * + 当 `maxBitrate` < `0` 时，适配码率模式。
     */
    minBitrate?: number;
    /** {en}
     * @brief Encoding policy preference. The default policy is quality first.
     */
    /** {zh}
     * @brief 视频编码质量策略
     */
    encoderPreference?: VideoEncodePreference;
}
/** {en}
 * @brief Call related statistics
 */
/** {zh}
 * @brief 通话相关的统计信息
 */
export interface RtcRoomStats {
    /** {en}
     * @brief Current Tx packet loss rate. The range is [0,1].
     */
    /** {zh}
     * @brief 当前应用的上行丢包率，取值范围为 [0, 1]。
     */
    txLostrate: number;
    /** {en}
     * @brief Current Rx packet loss rate. The range is [0,1].
     */
    /** {zh}
     * @brief 当前应用的下行丢包率，取值范围为 [0, 1]。
     */
    rxLostrate: number;
    /** {en}
     * @brief Round-trip time (in ms) from client side to server side
     */
    /** {zh}
     * @brief 客户端到服务端数据传输的往返时延（单位 ms）
     */
    rtt: number;
    /** {en}
     * @brief Cumulative time between the user joining the room and leaving the room in seconds.
     */
    /** {zh}
     * @brief 进房到退房之间累计时长，单位为 s
     */
    duration: number;
    /** {en}
     * @brief Cumulative data sent by the user in bytes.
     */
    /** {zh}
     * @brief 本地用户的总发送字节数 (bytes)，累计值
     */
    tx_bytes: number;
    /** {en}
     * @brief Cumulative data received by the user in bytes.
     */
    /** {zh}
     * @brief 本地用户的总接收字节数 (bytes)，累计值
     */
    rx_bytes: number;
    /** {en}
     * @brief The instantaneous value of Tx bitrate in kbps
     */
    /** {zh}
     * @brief 发送码率 (kbps)，获取该数据时的瞬时值
     */
    tx_kbitrate: number;
    /** {en}
     * @brief The instantaneous value of Rx bitrate in kbps
     */
    /** {zh}
     * @brief 接收码率 (kbps)，获取该数据时的瞬时值
     */
    rx_kbitrate: number;
    /** {en}
     * @brief The instantaneous value of audio Rx bitrate in kbps
     */
    /** {zh}
     * @brief 音频接收码率 (kbps)，获取该数据时的瞬时值
     */
    rx_audio_kbitrate: number;
    /** {en}
     * @brief The instantaneous value of audio Tx bitrate in kbps
     */
    /** {zh}
     * @brief 音频发送码率 (kbps)，获取该数据时的瞬时值
     */
    tx_audio_kbitrate: number;
    /** {en}
     * @brief The instantaneous value of video Rx bitrate in kbps
     */
    /** {zh}
     * @brief 视频接收码率 (kbps)，获取该数据时的瞬时值
     */
    rx_video_kbitrate: number;
    /** {en}
     * @brief The instantaneous value of video Tx bitrate in kbps
     */
    /** {zh}
     * @brief 视频发送码率 (kbps)，获取该数据时的瞬时值
     */
    tx_video_kbitrate: number;
    /** {en}
     * @brief The instantaneous RX bitrate of screen-sharing video in Kbps
     */
    /** {zh}
     * @brief 屏幕接收码率，获取该数据时的瞬时值，单位为 Kbps
     */
    rx_screen_kbitrate: number;
    /** {en}
     * @brief The instantaneous TX bitrate of screen-sharing video in Kbps
     */
    /** {zh}
     * @brief 屏幕发送码率，获取该数据时的瞬时值，单位为 Kbps
     */
    tx_screen_kbitrate: number;
    /** {en}
     * @brief Number of visible users in the current room
     */
    /** {zh}
     * @brief 当前房间内的用户人数
     */
    user_count: number;
    /** {en}
     * @hidden
     * @brief CPU usage (%) of the application
     */
    /** {zh}
     * @hidden
     * @brief 当前应用程序的 CPU 使用率（%），暂未被使用
     */
    cpu_app_usage: number;
    /** {en}
     * @hidden
     * @brief Current CPU usage (%)
     */
    /** {zh}
     * @hidden
     * @brief 当前系统的 CPU 使用率（%），暂未被使用
     */
    cpu_total_usage: number;
    /** {en}
     * @brief Tx jitter(ms)
     */
    /** {zh}
     * @brief 系统上行网络抖动（ms）
     */
    tx_jitter: number;
    /** {en}
     * @brief Rx jitter(ms)
     */
    /** {zh}
     * @brief 系统下行网络抖动（ms）
     */
    rx_jitter: number;
    /** {en}
     * @brief Cellular Link Send bit rate  (kbps), get the instantaneous value of the data
     */
    /** {zh}
     * @brief 蜂窝路径发送的码率 (kbps)，获取该数据时的瞬时值
     */
    tx_cellular_kbitrate: number;
    /** {en}
     * @brief Cellular Link Receive bit rate  (kbps), get the instantaneous value of the data
     */
    /** {zh}
     * @brief 蜂窝路径接收码率 (kbps)，获取该数据时的瞬时值
     */
    rx_cellular_kbitrate: number;
}
/** {en}
 * @brief Sets the video frame
 */
/** {zh}
 * @brief 设置视频帧
 */
export interface IVideoFrame {
    /** {en}
     * @brief Room ID
     */
    /** {zh}
     * @brief 房间 ID
     */
    channel_id: string;
    /** {en}
     * @brief User ID
     */
    /** {zh}
     * @brief 用户 ID
     */
    user_id: string;
    /** {en}
     * @brief Video data buffer in plane Y
     */
    /** {zh}
     * @brief 视频数据缓冲区 Y
     */
    plane_y: Uint8Array;
    /** {en}
     * @brief Video data buffer in plane U
     */
    /** {zh}
     * @brief 视频数据缓冲区 U
     */
    plane_u: Uint8Array;
    /** {en}
     * @brief Video data buffer in plane V
     */
    /** {zh}
     * @brief 视频数据缓冲区 V
     */
    plane_v: Uint8Array;
    /** {en}
     * @brief Pixel of the width of the video
     */
    /** {zh}
     * @brief 视频分辨率宽度，单位：像素
     */
    width: number;
    /** {en}
     * @brief Pixel of the height of the video
     */
    /** {zh}
     * @brief 视频分辨率高度，单位：像素
     */
    height: number;
    /** {en}
     * @brief Size of Plane Y of the video data buffer
     */
    /** {zh}
     * @brief 视频数据缓冲区 Y 大小
     */
    plane_size_y: number;
    /** {en}
     * @brief Size of Plane U of the video data buffer
     */
    /** {zh}
     * @brief 视频数据缓冲区 U 大小
     */
    plane_size_u: number;
    /** {en}
     * @brief Size of Plane V of the video data buffer
     */
    /** {zh}
     * @brief 视频数据缓冲区 V 大小
     */
    plane_size_v: number;
    /** {en}
     * @brief Format of the video frames
     */
    /** {zh}
     * @brief 视频帧数据格式
     */
    format: VideoPixelFormat;
    /** {en}
     * @brief Rotation angles of the video frame
     */
    /** {zh}
     * @brief 视频帧旋转角度
     */
    rotation: number;
    /** {en}
     * @brief Video data buffer RGBA
     */
    /** {zh}
     * @brief 视频数据缓冲区 RGBA
     */
    rgba: Uint8Array;
    /** {en}
     * @brief Video data buffer RGBA size
     */
    /** {zh}
     * @brief 视频数据缓冲区 RGBA 大小
     */
    rgba_size: number;
    /** {en}
     * @hidden
     * @brief Public stream ID
     */
    /** {zh}
     * @brief 公共流 ID
     */
    public_stream_id: number;
    /** {en}
     * @brief Steam-mixing task ID
     */
    /** {zh}
     * @brief 合流任务 ID
     */
    task_id: string;
}
/** {en}
 * @brief Audio frame
 */
/** {zh}
 * @brief 设置音频帧
 */
export interface IAudioFrame {
    /** {en}
     * @brief Audio frame type
     */
    /** {zh}
     * @brief 音频帧类型
     */
    frame_type: AudioFrameType;
    /** {en}
     * @brief Audio channel.
     *        For dual channels, the audio frames are interleaved.
     */
    /** {zh}
     * @brief 音频通道数
     *        双声道的情况下，左右声道的音频帧数据以 LRLRLR 形式排布。
     */
    channels: number;
    /** {en}
     * @brief Sample rate.
     */
    /** {zh}
     * @brief 音频采样率
     */
    sample_rate: number;
    /** {en}
     * @brief Address of the audio data buffer
     */
    /** {zh}
     * @brief 音频数据内存地址
     */
    buffer: Uint8Array;
    /** {en}
     * @brief Audio frame timestamp in milliseconds
     */
    /** {zh}
     * @brief 音频帧时间戳，单位：毫秒
     */
    render_time_ms: number;
    /** {en}
     * @region Audio Management
     * @brief Gets audio mute state identifier
     * @return Is the data muted:
     * + True: Yes
     * + False: No
     */
    /** {zh}
     * @region 音频管理
     * @brief 获取音频静音标志
     * @return 是否静音数据
     * + true: 是
     * + false: 否
     */
    mute: boolean;
}
/** {en}
 * @brief  Data frame
 */
/** {zh}
 * @brief 数据帧
 */
export interface IDataFrame {
    /** {zh}
     * @brief 数据帧类型
     */
    /** {en}
     * @brief Data frame type
     */
    frame_type: DataFrameType;
    /** {zh}
     * @brief 数据帧数据
     */
    /** {en}
     * @brief Data frame data
     */
    u8_data: Uint8Array;
    /** {zh}
     * @brief 数据帧时间戳，单位：微秒
     */
    /** {en}
     * @brief Data frame timestamp in microseconds
     */
    u64_ts_us: number;
}
/** {en}
 * @brief  Data frame type
 */
/** {zh}
 * @brief 数据帧类型
 */
export declare enum DataFrameType {
    /** {en}
     * @brief SEI  video frame
     */
    /** {zh}
     * @brief SEI 视频帧
     */
    kDataFrameTypeSei = 0
}
/** {en}
 * @brief Audio frame type
 */
/** {zh}
 * @brief 音频帧类型
 */
export declare enum AudioFrameType {
    /** {en}
     * @brief PCM 16bit
     */
    /** {zh}
     * @brief PCM 16bit
     */
    kFrameTypePCM16 = 0
}
/** {zh}
 * @brief 音频声道。
 */
export declare enum AudioChannel {
    /** {zh}
     * @brief 自动声道，适用于从 SDK 获取音频数据，使用 SDK 内部处理的声道，不经过 resample。
     *        当你需要从 SDK 获取音频数据时，若对声道没有强依赖，建议设置成该值，可以通过避免 resample 带来一些性能优化。
     */
    kAudioChannelAuto = -1,
    /** {zh}
     * @brief 单声道
     */
    kAudioChannelMono = 1,
    /** {zh}
     * @brief 双声道
     */
    kAudioChannelStereo = 2
}
/** {zh}
 * @brief 音频采样率，单位为 HZ。
 */
export declare enum AudioSampleRate {
    /** {zh}
     * @brief 自动采样率，适用于从 SDK 获取音频数据，使用 SDK 内部处理的采样率，不经过 resample。
     *        当你需要从 SDK 获取音频数据时，若对采样率没有强依赖，建议设置成该值，可以通过避免 resample 带来一些性能优化。
     */
    kAudioSampleRateAuto = -1,
    /** {zh}
     * @brief 8000 Hz 采样率
     */
    kAudioSampleRate8000 = 8000,
    /** {zh}
     * @brief 16000 Hz 采样率
     */
    kAudioSampleRate16000 = 16000,
    /** {zh}
     * @brief 32000 Hz 采样率
     */
    kAudioSampleRate32000 = 32000,
    /** {zh}
     * @brief 44100 Hz 采样率
     */
    kAudioSampleRate44100 = 44100,
    /** {zh}
     * @brief 48000 Hz 采样率
     */
    kAudioSampleRate48000 = 48000
}
/** {en}
 * @brief SDK  Connection status with the signaling server.
 */
/** {zh}
 * @brief SDK 与信令服务器连接状态。
 */
export declare enum ConnectionState {
    /** {en}
     * @brief Disconnected for 12s, SDK will try to reconnect automatically.
     */
    /** {zh}
     * @brief 连接断开。
     */
    kConnectionStateDisconnected = 1,
    /** {en}
     * @brief The first request to connect to the server. Connecting.
     */
    /** {zh}
     * @brief 首次连接，正在连接中。
     */
    kConnectionStateConnecting = 2,
    /** {en}
     * @brief The first connection was successful.
     */
    /** {zh}
     * @brief 涵盖了以下情况：
     * + 首次连接时，10秒连接不成功;
     * + 连接成功后，断连 10 秒。自动重连中。
     */
    kConnectionStateConnected = 3,
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
    kConnectionStateReconnecting = 4,
    /** {en}
     * @brief Successful reconnection after disconnection.
     */
    /** {zh}
     * @brief 连接断开后重连成功。
     */
    kConnectionStateReconnected = 5,
    /** {en}
     * @brief In status `kConnectionStateDisconnected` for more than 10s without a successful reconnection. SDK will still continue to try to reconnect.
     */
    /** {zh}
     * @brief 处于 `kConnectionStateDisconnected` 状态超过 10 秒，且期间重连未成功。SDK 仍将继续尝试重连。
     */
    kConnectionStateLost = 6
}
/** {en}
 * @brief Reason to leave the room
 */
/** {zh}
 * @brief 用户离线原因。
 *        房间内的远端用户离开房间时，本端用户会收到 [`onUserLeave`](85533#onuserleave) 回调通知，此枚举类型为回调的用户离线原因。
 */
export declare enum UserOfflineReasonType {
    /** {en}
     * @brief The remote client calls [leaveRoom](85532#leaveroom) to leave the room.
     */
    /** {zh}
     * @brief 远端用户调用 [leaveRoom](85532#leaveroom) 方法退出房间。
     */
    kUserOfflineReasonQuit = 0,
    /** {en}
     * @brief The remote client is disconnected because of poor network connection or expired Token.
     */
    /** {zh}
     * @brief 远端用户因网络等原因掉线。
     */
    kUserOfflineReasonDropped = 1,
    /** {en}
     * @brief The remote client calls [setUserVisibility](#setuservisibility) to turn invisible.
     */
    /** {zh}
     * @brief 远端用户切换至隐身状态。
     */
    kUserOfflineReasonSwitchToInvisible = 2,
    /** {en}
     * @brief The remote user has been removed from the room by the administrator via a OpenAPI call.
     */
    /** {zh}
     * @brief 远端用户被踢出出房间。
              因调用踢出用户的 OpenAPI，远端用户被踢出房间。
     */
    kUserOfflineReasonKickedByAdmin = 3
}
/** {zh}
 * @brief 媒体设备类型
 */
export declare enum MediaDeviceType {
    /** {zh}
     * @brief 音频渲染设备
     */
    kMediaDeviceTypeAudioRenderDevice = 0,
    /** {zh}
     * @brief 音频采集设备
     */
    kMediaDeviceTypeAudioCaptureDevice = 1,
    /** {zh}
     *@hidden
     * @brief 视频渲染设备类型，该类型暂无使用
     */
    kMediaDeviceTypeVideoRenderDevice = 2,
    /** {zh}
     * @brief 视频采集设备
     */
    kMediaDeviceTypeVideoCaptureDevice = 3
}
/** {zh}
 * @brief 媒体设备事件类型
 */
export declare enum MediaDeviceNotification {
    /** {zh}
     * @brief 设备已就绪
     */
    kMediaDeviceNotificationActive = 1,
    /** {zh}
     * @brief 设备被禁用
     */
    kMediaDeviceNotificationDisabled = 2,
    /** {zh}
     * @brief 没有此设备
     */
    kMediaDeviceNotificationNotPresent = 4,
    /** {zh}
     * @brief 设备被拔出
     */
    kMediaDeviceNotificationUnplugged = 8
}
/** {en}
 * @brief Type of the screen capture object
 */
/** {zh}
 * @brief 屏幕采集对象的类型
 */
export declare enum ScreenCaptureSourceType {
    /** {en}
     * @brief Type unknown
     */
    /** {zh}
     * @brief 类型未知
     */
    kScreenCaptureSourceTypeUnknown = 0,
    /** {en}
     * @brief Application window
     */
    /** {zh}
     * @brief 应用程序的窗口
     */
    kScreenCaptureSourceTypeWindow = 1,
    /** {en}
     * @brief Desktop
     */
    /** {zh}
     * @brief 桌面
     */
    kScreenCaptureSourceTypeScreen = 2
}
/** {en}
 * @brief Priority of the publisher. When a user encounters performance insufficiency of either the network or the device, the media stream  will fall back in the ascending order of `RemoteUserPriority`.
 */
/** {zh}
 * @brief 远端用户优先级，在性能不足需要回退时，会优先回退优先级低的用户的音视频流
 */
export declare enum RemoteUserPriority {
    /** {en}
     * @brief Low, the default
     */
    /** {zh}
     * @brief 用户优先级为低（默认值）
     */
    kRemoteUserPriorityLow = 0,
    /** {en}
     * @brief Medium
     */
    /** {zh}
     * @brief 用户优先级为正常
     */
    kRemoteUserPriorityMedium = 100,
    /** {en}
     * @brief High
     */
    /** {zh}
     * @brief 用户优先级为高
     */
    kRemoteUserPriorityHigh = 200
}
/** {en}
 * @brief Detailed information of the screen sharing object
 * Parameter type of the [startScreenVideoCapture](85532#startscreenvideocapture)
 */
/** {zh}
 * @brief 屏幕共享对象信息
 *        [startScreenVideoCapture](85532#startscreenvideocapture) 接口的中的参数类型
 */
export interface ScreenCaptureSourceInfo {
    /** {en}
     * @brief Type of the screen-sharing object.
     */
    /** {zh}
     * @brief 共享对象类型，屏幕或应用窗体
     */
    type: ScreenCaptureSourceType;
    /** {en}
     * @brief ID of the screen-sharing object
     */
    /** {zh}
     * @brief 共享对象 ID
     */
    source_id: number;
    /** {en}
     * @brief Name of the screen-sharing object
     */
    /** {zh}
     * @brief 屏幕共享对象的名称
     */
    source_name: string;
    /** {en}
     * @brief The title of the application to be shared.
     *        Only available if the sharing object is an application windows.
     */
    /** {zh}
     * @brief 共享的应用窗体所属应用的名称
     *        当共享对象为应用窗体时有效
     */
    application: string;
    /** {en}
     * @brief Tag for the screen to be shared identifying whether it is the primary screen
     *        Only available when the screen-sharing object is a screen.
     */
    /** {zh}
     * @brief 共享的屏幕是否为主屏。
     *        当共享对象为屏幕时有效
     */
    primaryMonitor: boolean;
    /** {en}
     * @brief Process pid of the application to be shared.
     *        Only available if the sharing object is an application windows.
     */
    /** {zh}
     * @brief 共享的应用窗体所属应用进程的 pid
     * 当共享对象为应用窗体时有效
     */
    pid: number;
    /** {en}
     * @brief Coordinate of the screen-sharing object. (0, 0), the origin is the top left on the main screen for clients with multiple screens.
     */
    /** {zh}
     * @brief 屏幕共享对象的坐标。多显示器的场景下，屏幕坐标系统以主屏左上角为原点 (0, 0)，向右向下扩展。
     */
    region_rect: Rectangle;
}
/** {zh}
 * @brief 屏幕共享对象缩略图
 *        调用 [getThumbnail](85532#getthumbnail) 后返回本对象
 */
export interface ThumbnailInfo {
    /** {zh}
     * @brief 宽度，单位：像素
     */
    width: number;
    /** {zh}
     * @brief 高度，单位：像素
     */
    height: number;
    /** {zh}
     * @brief 数据，采用 base64 编码的 png 字符串
     */
    data: string;
}
/** {zh}
 * @brief 共享窗体的图标信息
 * 调用 [getWindowAppIcon](85532#getwindowappicon) 后返回本对象
 */
export interface AppIconInfo {
    /** {zh}
     * @brief 宽度，单位：像素
     */
    width: number;
    /** {zh}
     * @brief 高度，单位：像素
     */
    height: number;
    /** {zh}
     * @brief 数据，采用 base64 编码的 png 字符串
     */
    data: string;
}
/** {en}
 * @brief Properties of the public audio stream
 */
/** {zh}
 * @brief 公共流音频编码参数
 */
export interface PublicStreamAudioParam {
    /** {en}
     * @brief Required. Audio sample rate in Hz. Options: 16000, 32000, 44100, or 48000
     */
    /** {zh}
     * @brief 音频采样率，必填。单位为 Hz。可选取值：16000, 32000, 44100 和 48000
     */
    sample_rate: number;
    /** {en}
     * @brief Required. Number of the audio channels.
     * + 1: Mono
     * + 2: Dual
     */
    /** {zh}
     * @brief 音频声道数，必填。
     * + 1: 单声道
     * + 2: 双声道
     */
    channel_num: number;
    /** {zh}
     * @brief 音频码率，必填。单位为 kbps。
     * 正整数，可选取值：16, 32, 64。
     */
    bitrate_kbps: number;
}
/** {en}
 * @brief Encoding properties of the public video stream
 */
/** {zh}
 * @brief 公共流视频编码参数
 */
export interface PublicStreamVideoParam {
    /** {en}
     * @brief Required. Width of the video frame. Unit: px. Ranging: [16, 1920], even value is effective.
     */
    /** {zh}
     * @brief 公共流视频宽度，必填。单位为 px，范围为 [2, 1920]，必须是偶数。
     */
    width: number;
    /** {en}
     * @brief Required. Width of the video frame. Unit: px. Ranging: [16, 1280], even value is effective.
     */
    /** {zh}
     * @brief 公共流视频高度，必填。单位为 px，范围为 [16, 1280]，必须是偶数。
     */
    height: number;
    /** {en}
     * @brief Required. Frame rate in fps
     *        Range: [1, 60]
     */
    /** {zh}
     * @brief 公共流视频帧率。必填
     *        范围：[1, 60]
     */
    fps: number;
    /** {en}
     * @brief Required. Bitrate in bps
     *        Range: [1,10000000]
     */
    /** {zh}
     * @brief 视频码率，必填
     *        范围：[1,10000000]
     *        单位为 bps
     */
    bitrate_kpbs: number;
}
/** {en}
 * @brief Rendering mode
 */
/** {zh}
 * @brief 渲染模式
 */
export declare enum PublicStreamRenderMode {
    /** {en}
     * @brief Fill and Crop.
     *        The video frame is scaled with fixed aspect ratio, and completely fills the canvas. The region of the video exceeding the canvas will be cropped.
     */
    /** {zh}
     * @brief 视窗填满优先。
     *        视频帧等比缩放，直至视窗被视频填满。如果视频帧长宽比例与视窗不同，视频帧的多出部分将无法显示。
     *        缩放完成后，视频帧的一边长和视窗的对应边长一致，另一边长大于等于视窗对应边长。
     */
    kRenderModeHidden = 1,
    /** {en}
     * @brief Fit.
     *        The video frame is scaled with fixed aspect ratio, and is shown completely in the canvas. The region of the canvas not filled with video frame, is filled with `background`.
     */
    /** {zh}
     * @brief 视频帧内容全部显示优先。
     *        视频帧等比缩放，直至视频帧能够在视窗上全部显示。如果视频帧长宽比例与视窗不同，视窗上未被视频帧填满区域将被涂黑。
     *        缩放完成后，视频帧的一边长和视窗的对应边长一致，另一边长小于等于视窗对应边长。
     */
    kRenderModeFit = 2,
    /** {en}
     *  @brief Fill the canvas.
     *         The video frame is scaled to fill the canvas. During the process, the aspect ratio may change.
     */
    /** {zh}
     *  @brief 视频帧自适应画布
     *         视频帧非等比缩放，直至画布被填满。在此过程中，视频帧的长宽比例可能会发生变化。
     */
    kRenderModeFill = 3
}
/** {en}
 * @brief Configurations on how to crop the public stream
 */
/** {zh}
 * @brief 公共流视频裁剪配置
 */
export interface SourceCrop {
    /** {en}
     * @brief The normalized horizontal coordinate value of the top left vertex of the cropped image to width of the original image, ranging within [0.0, 1.0).
     */
    /** {zh}
     * @brief 裁剪后得到的视频帧左上角横坐标相对于裁剪前整体画面的归一化比例，取值范围[0.0, 1.0)
     */
    LocationX: number;
    /** {en}
     * @brief The normalized vertical coordinate value of the top left vertex of the cropped image to height of the original image, ranging within [0.0, 1.0).
     */
    /** {zh}
     * @brief 裁剪后得到的视频帧左上角纵坐标相对于裁剪前整体画面的归一化比例，取值范围[0.0, 1.0)
     */
    LocationY: number;
    /** {en}
     * @brief The normalized ratio of the width of the cropped image to that of the original image, ranging within [0.0, 1.0).
     */
    /** {zh}
     * @brief 裁剪后得到的视频帧宽度相对于裁剪前整体画面的归一化比例，取值范围(0.0, 1.0]
     */
    WidthProportion: number;
    /** {en}
     * @brief The normalized ratio of the height of the cropped image to that of the original image, ranging within [0.0, 1.0).
     */
    /** {zh}
     * @brief 裁剪后得到的视频帧高度相对于裁剪前整体画面的归一化比例，取值范围(0.0, 1.0]
     */
    HeightProportion: number;
}
/** {en}
 * @brief Layout of each stream to be mixed into the public stream
 *        You can configure each of the video streams for the public stream.
 */
/** {zh}
 * @brief 单个视频流在公共流中的布局信息。
 *        在多路视频流公共流时，你需要设置每一路视频流在公共流中的布局信息。
 */
export interface PublicStreamLayoutRegion {
    /** {en}
     * @brief ID of the public stream，must not be empty
     */
    /** {zh}
     * @brief 目标公共流用户的 ID, 不能为空
     */
    user_id: string;
    /** {en}
     * @brief ID of the room from which the stream is intended to be sent as a public stream，
     * must not be empty
     */
    /** {zh}
     * @brief 跨房间订阅流时，目标流所在的房间 ID, 不能为空
     */
    room_id: string;
    /** {en}
     * @brief Uniform resource identifier(URI) of the background image
     */
    /** {zh}
     * @brief 背景图片地址
     */
    alternate_image_uri: string;
    /** {en}
     * @brief Required. Left offset of the video against the local client' view, ranging [0.0, 1.0)
     */
    /** {zh}
     * @brief 用户视频布局相对画布左侧的偏移量，取值的范围为 [0.0, 1.0)。必填。
     */
    x: number;
    /** {en}
     * @brief Required. Top offset of the video against the local client' view, ranging [0.0, 1.0)
     */
    /** {zh}
     * @brief 用户视频布局相对画布顶端的偏移量，取值的范围为 [0.0, 1.0)。必填。
     */
    y: number;
    /** {en}
     * @brief Required. Ratio of the width of the video to that of the client's view, ranging [0.0, 1.0)
     */
    /** {zh}
     * @brief 用户视频宽度相对画布宽度的比例，取值的范围为 (0.0, 1.0]。必填。
     */
    width: number;
    /** {en}
     * @brief Required. Ratio of the height of the video to that of the client's view, ranging [0.0, 1.0)
     */
    /** {zh}
     * @brief 用户视频高度相对画布高度的比例，取值的范围为 (0.0, 1.0]。必填。
     */
    height: number;
    /** {en}
     * @brief Transparency, ranging [0，255], 0 for transparent. 255 for solid.
     */
    /** {zh}
     * @brief 透明度，取值范围 [0，255], 0 为全透明，255 为不透明
     */
    alpha: number;
    /** {en}
     * @brief Stack's layer order (also known as the z-order) of videos in the public stream.
     *        Ranging [0, 100]. 0 for the bottom, by default. 100 for the top.
     */
    /** {zh}
     * @brief 用户视频布局在画布中的层级，取值范围 [0，100]，0(默认）为底层，100 为顶层。
     */
    z_order: number;
    /** {en}
     * @brief Required. Stream index:
     * + 0: Main stream which is video or audio stream captured by media device or externally sourced media stream.
     * + 1: Screen-sharing stream
     */
    /** {zh}
     * @brief 必填。媒体流类型：
     * + 0: 普通流（默认设置）
     * + 1: 屏幕流
     */
    stream_type: number;
    /** {en}
     * @brief Media type of the public stream.
     */
    /** {zh}
     * @brief 公共流输出类型。
     */
    media_type: TranscoderContentControlType;
    /** {en}
     * @brief Required. The fit mode when rendering.
     */
    /** {zh}
     * @brief 渲染时，视频内容缩放模式，必填。
     */
    render_mode: PublicStreamRenderMode;
    /** {en}
     * @brief Configurations on how to crop the public stream.
     */
    /** {zh}
     * @brief 支持对每一路参与公共流的视频进行裁剪。
     */
    source_crop: SourceCrop;
}
/** {en}
 * @hidden
 * @brief State and errors for publishing or subscribing public streams
 */
/** {zh}
 * @detail 85534
 * @brief 公共流状态码
 */
export declare enum PublicStreamErrorCode {
    /** {en}
     * @brief Published or subscribed successfully.
     */
    /** {zh}
     * @brief 发布或订阅成功。
     */
    kPublicStreamErrorCodeOK = 0,
    /** {en}
     * @brief Invalid parameter(s). Please revise the parameter(s) and retry.
     */
    /** {zh}
     * @brief 公共流的参数异常，请修改参数后重试。
     */
    kPublicStreamErrorCodePushInvalidParam = 1191,
    /** {en}
     * @brief Error for the task at the server side. The server will retry upon the failure.
     */
    /** {zh}
     * @brief 服务端状态异常，将自动重试。
     */
    kPublicStreamErrorCodePushInvalidStatus = 1192,
    /** {en}
     * @brief Unrecoverable error of publishing the public stream. Please start the task again.
     */
    /** {zh}
     * @brief 内部错误，不可恢复，请重试。
     */
    kPublicStreamErrorCodePushInternalError = 1193,
    /** {en}
     * @brief Failed to publish. The SDK will retry upon the failure. We recommend to keep listening to the publishing result.
     */
    /** {zh}
     * @brief 发布失败，将自动重试，请关注重试结果。
     */
    kPublicStreamErrorCodePushFailed = 1195,
    /** {en}
     * @brief Failed to publish the public stream for time-out error. The SDK will retry 10 s after the timeout. The maximum number of retry attempts is 3.
     */
    /** {zh}
     * @brief 发布失败，10 s 后会重试，重试 3 次后自动停止。
     */
    kPublicStreamErrorCodePushTimeout = 1196,
    /** {en}
     * @brief Failed to play a public stream because the publisher has not started publishing.
     */
    /** {zh}
     * @brief 订阅失败，发布端未开始发布流。
     */
    kPublicStreamErrorCodePullNoPushStream = 1300
}
/** {en}
 * @hidden
 * @brief Layout mode of the public stream
 */
/** {zh}
 * @brief 公共流的布局模式
 */
export declare enum StreamLayoutMode {
    /** {en}
     * @brief auto mode
     */
    /** {zh}
     * @brief 自动布局
     */
    kLayoutAutoMode = 0,
    /** {en}
     * @brief Customer mode
     */
    /** {zh}
     * @brief 自定义
     */
    kLayoutCustomerMode = 2
}
/** {en}
 * @hidden
 * @brief Properties of the public stream
 */
/** {zh}
 * @brief 公共流参数
 */
export interface IPublicStreamParam {
    /** {en}
     * @brief Interpolation mode of the public stream.
     * + `0`: Insert with the last frame
     * + `1`: Insert with the background image. RTC will insert frames of black if no background image has been set.
     */
    /** {zh}
     * @brief 补帧模式
     * + `0`: 补最后一帧
     * + `1`: 补背景图片，如果没有设置背景图片则补黑帧
     */
    interpolation_mode: number;
    /** {en}
     * @brief Confluence room ID. Required.
     */
    /** {zh}
     * @brief 合流房间 ID，必填
     */
    room_id: string;
    /** {en}
     * @brief The URI of the background image
     */
    /** {zh}
     * @brief 背景图片链接
     */
    background_image_uri: string;
    /** {en}
     * @hidden
     * @brief Properties of the public audio stream.
     */
    /** {zh}
     * @hidden
     * @brief 公共流音频编码参数。
     */
    audio_param: PublicStreamAudioParam;
    /** {en}
     * @brief Properties of the public video stream.
     */
    /** {zh}
     * @brief 公共流视频参数。
     */
    video_param: PublicStreamVideoParam;
    /** {en}
     * @brief Layout of the region in the public stream.
     */
    /** {zh}
     * @brief 公共流视窗布局信息。
     */
    layout_regions: PublicStreamLayoutRegion[];
    /** {zh}
     * @brief 公共流的布局模式
     */
    /** {en}
     * @hidden
     * @brief Layout mode of the public stream
     */
    layout_mode: StreamLayoutMode;
    /** {en}
     * @brief Background color of the mixed stream
     */
    /** {zh}
     * @brief 背景颜色
     */
    bg_color: string;
}
/** {en}
 * @brief Configurations to be set when pushing media streams to CDN.
 */
/** {zh}
 * @brief 转推直播配置参数
 */
export interface ITranscoderParam {
    /** {en}
     * @brief Stream mixing type. This parameter cannot be updated while pushing stream to the CDN.
     */
    /** {zh}
     * @brief 设置合流类型。本参数不支持过程中更新。
     */
    expected_mix_type: StreamMixingType;
    /** {en}
     * @brief The room ID of the media stream. Required.
     */
    /** {zh}
     * @brief 媒体流所在的房间 ID。必填。
     */
    room_id: string;
    /** {en}
     * @brief The user ID of the media stream
     */
    /** {zh}
     * @brief 媒体流所属的用户 ID
     */
    user_id: string;
    /** {en}
     * @brief the target address of the CDN
     */
    /** {zh}
     * @brief 推流地址
     */
    uri: string;
    /** {en}
     * @brief Audio transcoding configurations.
     */
    /** {zh}
     * @brief 音频参数
     */
    audio_param: TranscoderAudioParam;
    /** {en}
     * @brief Video transcoding configurations.
     */
    /** {zh}
     * @brief 视频参数
     */
    video_param: TranscoderVideoParam;
    /** {en}
     * @brief Stream mixing region configuration. Required.
     */
    /** {zh}
     * @brief 布局设置。必填。
     */
    layout_regions: TranscoderLayoutRegion[];
    /** {en}
     * @brief Background color of the mixed stream
     */
    /** {zh}
     * @brief 背景颜色
     */
    background_color: string;
    /** {en}
     * @brief Additional data that you want to import
     */
    /** {zh}
     * @brief 设置透传的 App 数据
     */
    app_data: string;
}
/** {en}
 * @brief Configurations to be set when pushing media streams to CDN.(new)
 */
/** {zh}
 * @brief 转推直播配置参数(新)
 */
export interface IMixedStreamConfig {
    /** {en}
     * @brief Indicate whether the client has the capability to perform a mixed stream task. Only set it to true if you need to activate Push-to-CDN on client/cloud with your application, which includes librtmp that enables your application to combine streams.
     */
    /** {zh}
     * @brief 本端是否具有推流能力。如果需要开启端云一体转推直播功能，你必须确保你的 App 包含 librtmp，具有推流能力。此时，设置该回调为 true
     */
    is_support_client_push_stream: boolean;
    /** {en}
     * @brief Stream mixing type. This parameter cannot be updated while pushing stream to the CDN.
     */
    /** {zh}
     * @brief 设置合流类型。本参数不支持过程中更新。
     */
    expected_mix_type: MixedStreamType;
    /** {en}
     * @brief The room ID of the media stream. Required.
     */
    /** {zh}
     * @brief 媒体流所在的房间 ID。必填。
     */
    room_id: string;
    /** {en}
     * @brief The user ID of the media stream
     */
    /** {zh}
     * @brief 媒体流所属的用户 ID
     */
    user_id: string;
    /** {en}
     * @brief the target address of the CDN
     */
    /** {zh}
     * @brief 设置推流 CDN 地址。仅支持 RTMP 协议，Url 必须满足正则 `/^rtmps?:\/\//`
     */
    push_url: string;
    /** {en}
     * @brief Audio transcoding configurations.
     */
    /** {zh}
     * @brief 音频参数
     */
    audio_config: MixedStreamAudioConfig;
    /** {en}
     * @brief Video transcoding configurations.
     */
    /** {zh}
     * @brief 视频参数
     */
    video_config: MixedStreamVideoConfig;
    /** {zh}
     * @brief 设置客户端合流信息
     */
    client_mix_config: MixedStreamClientMixConfig;
    /** {en}
     * @brief Stream mixing region configuration. Required.
     */
    /** {zh}
     * @brief 设置视频流合流整体布局信息。必填。
     */
    layout_regions: MixedStreamLayoutRegionConfig[];
    /** {en}
     * @brief Background color of the mixed stream
     */
    /** {zh}
     * @brief 背景颜色
     */
    background_color: string;
    /** {en}
     * @brief Additional data that you want to import
     */
    /** {zh}
     * @brief 设置透传的 App 数据
     */
    user_config_extra_info: string;
}
/** {en}
 * @brief Configurations to be set when pushing media streams to CDN.
 */
/** {zh}
 * @brief 单流转推直播配置参数。
 */
export interface PushSingleStreamParam {
    /** {en}
     * @brief The room ID of the media stream
     */
    /** {zh}
     * @brief 媒体流所在的房间 ID。必填。
     */
    room_id: string;
    /** {en}
     * @brief The user ID of the media stream
     */
    /** {zh}
     * @brief 媒体流所属的用户 ID
     */
    user_id: string;
    /** {en}
     * @brief the target address of the CDN
     */
    /** {zh}
     * @brief 推流地址
     */
    uri: string;
    /** {en}
     * @brief Background color of the mixed stream
     */
    /** {zh}
     * @brief 媒体流是否为屏幕流。
     */
    is_screen_stream: boolean;
}
/** {en}
 * @brief Audio transcoding configurations.
 */
/** {zh}
 * @brief 音频转码配置参数
 */
export interface TranscoderAudioParam {
    /** {en}
     * @brief The sample rate(kHz). Supported sample rates: 32Khz, 44.1Khz, 48Khz. Defaults to 48Khz.
     */
    /** {zh}
     * @brief 音频采样率，单位 kHz。可取 32Khz、44.1Khz、48Khz，默认值为 48Khz。
     */
    i32_sample_rate: number;
    /** {en}
     * @brief The number of channels. Supported channels: 1, 2.  Defaults to 2.
     */
    /** {zh}
     * @brief 音频声道数。可取 1、2，默认值为 2。
     */
    i32_channel_num: number;
    /** {en}
     * @brief The bitrate(Kbps) in range of [32Kbps, 192Kbps]. Defaults to 64Kbps.
     */
    /** {zh}
     * @brief 音频码率，单位 Kbps。可取范围 [32Kbps, 192Kbps]，默认值为 64Kbps。
     */
    i32_bitrate_kbps: number;
    /** {en}
     * @brief AAC profile.  Defaults to `0`.
     */
    /** {zh}
     * @brief AAC 等级。默认值为 0。
     */
    audio_codec_profile: TranscoderAudioCodecProfile;
    /** {en}
     * @brief AAC profile. Defaults to `0`.
     */
    /** {zh}
     * @brief 音频编码格式。默认值为 `0`。
     */
    audio_codec_type: TranscoderAudioCodecType;
}
/** {en}
 * @brief Video configurations in stream mixing
 */
/** {zh}
 * @brief 合流视频转码参数
 */
/** {zh}
 * @brief Video configurations in stream mixing
 */
export interface TranscoderVideoParam {
    /** {en}
     * @brief Width in px of the mixed video stream.
     *        The value must be an even number. Odd number will be directly rejected, causing the stream mixing to fail.
     */
    /** {zh}
     * @brief 合流视频宽度，单位：px。
     * 仅支持设为偶数，如果设为奇数，后处理会直接拒绝，导致合流失败。
     */
    i32_width: number;
    /** {en}
     * @brief Height in px of the mixed video stream.
     *        The value must be an even number. Odd number will be directly rejected, causing the stream mixing to fail.
     */
    /** {zh}
     * @brief 合流视频高度，单位：px。
     * 仅支持设为偶数，如果设为奇数，后处理会直接拒绝，导致合流失败。
     */
    i32_height: number;
    /** {en}
     * @brief The frame rate. The default value is `15`. The range is `[1, 60]`. If the value is not legal, the SDK uses the default value.
     */
    /** {zh}
     * @brief 合流的视频帧率。默认值为 15，取值范围是 [1, 60]。值不合法时，自动调整为默认值。
     */
    i32_fps: number;
    /** {en}
     * @brief GOP. The default value is `4`. The range is `[1, 5]`. The unit is second. If the value is not legal, the SDK uses the default value.
     */
    /** {zh}
     * @brief I 帧间隔。默认值为 4，取值范围为 [1, 5]，单位为秒。值不合法时，自动调整为默认值。
     */
    i32_gop: number;
    /** {en}
     * @brief The default value is self-adaptive. The range is `[1, 10000]`. The unit is kbps. If the value is not legal, the SDK uses the default value.
     */
    /** {zh}
     * @brief 合流视频码率。单位为 kbps，取值范围为 [1,10000]，默认值为自适应。值不合法时，自动调整为默认值。
     */
    i32_bitrate_kbps: number;
    /** {en}
     * @brief Video encoding profile.
     */
    /** {zh}
     * @brief 编码参数规格
     */
    video_codec_type?: TranscoderVideoCodecType;
    /** {en}
     * @brief Whether to push streams with B frame, only support by server mix:
     * + True: Yes
     * + False: No
     */
    /** {zh}
     * @brief 是否在合流中开启 B 帧，仅服务端合流支持：
     * + true: 是
     * + false: 否
     */
    bFrame?: boolean;
}
/** {en}
 * @brief Layout information for one of the video streams to be mixed.
 *        After starting to push streams to CDN and mixing multiple video streams, you can set the layout information for each of them. All parameters of `TranscoderLayoutRegion` are required.
 */
/** {zh}
 * @brief 单个图片或视频流在合流中的布局信息。
 * 开启转推直播功能后，在多路图片或视频流合流时，你可以设置其中一路流在合流中的预设布局信息。子参数都必填。
 */
export interface TranscoderLayoutRegion {
    /** {en}
     * @brief The user ID of the user who publishes the video stream. Required.
     */
    /** {zh}
     * @brief 合流用户的 ID。必填。
     */
    region_id: string;
    /** {en}
     * @brief The room ID of the media stream. Required.
     *        If the media stream is the stream forwarded by [startForwardStreamToRooms](#startforwardstreamtorooms), you must set the roomID to the room ID of the target room.
     */
    /** {zh}
     * @brief 媒体流所在房间的房间 ID。
     * 如果此图片或视频流是通过 startForwardStreamToRooms 转发到你所在房间的媒体流时，你应将房间 ID 设置为你所在的房间 ID。
     */
    room_id: string;
    /** {en}
     * @brief The normalized horizontal coordinate value of the top left end vertex of the user's view, ranging within [0.0, 1.0).
     *        The view's position is determined by the position of its top left end vertex in the coordinate of the canvas. The coordinate is formed  with the top side of the canvas as the x-axis, the left side as the y-axis, and the top left end vertex as the origin point.
     */
    /** {zh}
     * @brief 用户视频布局相对画布左侧的偏移量，取值的范围为 [0.0, 1.0)
     */
    x: number;
    /** {en}
     * @brief The normalized vertical coordinate value of the top left end vertex of the user's view, ranging within [0.0, 1.0).
     *        The view's position is determined by the position of its top left end vertex in the coordinate of the canvas. The coordinate is formed  with the top side of the canvas as the x-axis, the left side as the y-axis, and the top left end vertex as the origin point.
     */
    /** {zh}
     * @brief 用户视频布局相对画布顶端的偏移量，取值的范围为 [0.0, 1.0)
     */
    y: number;
    /** {en}
     * @brief The normalized width of the user's view, ranging within (0.0, 1.0].
     */
    /** {zh}
     * @brief 用户视频宽度相对画布宽度的比例，取值的范围为 (0.0, 1.0]
     */
    width: number;
    /** {en}
     * @brief The normalized height of the user's view, ranging within (0.0, 1.0].
     */
    /** {zh}
     * @brief 用户视频高度相对画布高度的比例，取值的范围为 (0.0, 1.0]
     */
    height: number;
    /** {en}
     * @brief Transparency value, the range is [0,255]
     */
    /** {zh}
     * @brief 透明度，取值范围 [0，255]
     */
    alpha: number;
    /** {en}
     * @brief The proportion of the radius to the width of the canvas. `0.0` by default.
     * @notes After you set the value, `width_px`, `height_px`, and `corner_radius_px` are calculated based on `width`, `height`, `corner_radius`, and the width of the canvas. If `corner_radius_px < min(width_px/2, height_px/2)` is met, the value of `corner_radius` is set valid; if not, `corner_radius_px` is set to `min(width_px/2, height_px/2)`, and `corner_radius` is set to the proportion of `corner_radius_px` to the width of the canvas.
     */
    /** {zh}
     * @brief 圆角半径相对画布宽度的比例。默认值为 `0.0`。
     * @notes 做范围判定时，首先根据画布的宽高，将 `width`，`height`，和 `corner_radius` 分别转换为像素值：`width_px`，`height_px`，和 `corner_radius_px`。然后判定是否满足 `corner_radius_px < min(width_px/2, height_px/2)`：若满足，则设置成功；若不满足，则将 `corner_radius_px` 设定为 `min(width_px/2, height_px/2)`，然后将 `corner_radius` 设定为 `corner_radius_px` 相对画布宽度的比例值。
     */
    corner_radius: number;
    /** {en}
     * @brief The layer on which the video is rendered. The range is [0, 100]. 0 for the bottom layer, and 100 for the top layer.
     */
    /** {zh}
     * @brief 用户视频布局在画布中的层级，取值范围 [0，100]，0 为底层，值越大层级越高
     */
    i32_z_order: number;
    /** {en}
     * @brief Whether the source user of the stream is a local user:
     * + True: Yes
     * + False: No
     */
    /** {zh}
     * @brief 是否为本地用户
     */
    local_user: boolean;
    /** {en}
     * @brief Whether the stream comes from screen sharing:
     * + True: Yes
     * + False: No
     */
    /** {zh}
     * @brief 是否为屏幕流
     */
    screen_stream: boolean;
    /** {en}
     * @brief The stream mixing content type. The default value is `kHasAudioAndVideo`.
     */
    /** {zh}
     * @brief 合流内容控制。默认值为 `kHasAudioAndVideo`
     */
    content_control: TranscoderContentControlType;
    /** {en}
     * @brief Video rendering scale mode
     */
    /** {zh}
     * @brief 渲染时，视频内容缩放模式
     */
    render_mode: TranscoderRenderMode;
    /** {en}
     * @brief Stream mixing region type
     */
    /** {zh}
     * @brief 合流布局区域类型
     */
    type: TranscoderLayoutRegionType;
    /** {en}
     * @brief The RGBA data of the mixing image. Put in null when mixing video streams.
     */
    /** {zh}
     * @brief 图片合流布局区域类型对应的数据。类型为图片时传入图片 RGBA 数据，当类型为视频流时传空。
     */
    data?: Uint8Array;
    /** {en}
     * @brief  Image parameters for stream mixing
     */
    /** {zh}
     * @brief 图片合流相关参数
     */
    data_param?: TranscoderLayoutRegionDataParam;
    /** {en}
     * @brief spatial position.
     */
    /** {zh}
     * @brief 空间位置
     */
    spatial_position: Position;
    /** {en}
     * @brief Whether to apply spatial audio.
     */
    /** {zh}
     * @brief 是否开启空间音频
     */
    apply_spatial_audio: boolean;
}
/** {en}
 * @brief Stream mixing region type
 */
/** {zh}
 * @brief 合流布局区域类型
 */
export declare enum TranscoderLayoutRegionType {
    /** {en}
     * @brief The region type is a video stream.
     */
    /** {zh}
     * @brief 合流布局区域类型为视频。
     */
    kLayoutRegionTypeVideoStream = 0,
    /** {en}
     * @brief The region type is an image.
     */
    /** {zh}
     * @brief 合流布局区域类型为图片。
     */
    kLayoutRegionTypeImage = 1
}
/** {en}
 * @brief  Image parameters for stream mixing
 */
/** {zh}
 * @brief 图片合流相关参数
 */
export interface TranscoderLayoutRegionDataParam {
    /** {en}
     * @brief Width of the original image in px.
     */
    /** {zh}
     * @brief 原始图片的宽度，单位为 px。
     */
    /** {en}
     * @brief Width of the original image in px.
     */
    image_width: number;
    /** {en}
     * @brief Height of the original image in px.
     */
    /** {zh}
     * @brief 原始图片的高度，单位为 px。
     */
    image_height: number;
}
/** {en}
 * @brief Types of streams to be mixed
 */
/** {zh}
 * @brief 合流输出内容类型
 */
export declare enum TranscoderContentControlType {
    /** {en}
     * @brief Audio and video
     */
    /** {zh}
     * @brief 音视频
     */
    kHasAudioAndVideo = 0,
    /** {en}
     * @brief Audio only
     */
    /** {zh}
     * @brief 音频
     */
    kHasAudioOnly = 1,
    /** {en}
     * @brief Video only
     */
    /** {zh}
     * @brief 视频
     */
    kHasVideoOnly = 2
}
/** {en}
 * @brief Video encoding format
 */
/** {zh}
 * @brief 转推直播视频编码参数
 */
export declare enum TranscoderVideoCodecProfile {
    /** {en}
     * @brief H264 baseline profile
     */
    /** {zh}
     * @brief H264 格式基本规格编码
     */
    kByteH264ProfileBaseline = 0,
    /** {en}
     * @brief H264 main profile
     */
    /** {zh}
     * @brief H264 格式主流规格编码
     */
    kByteH264ProfileMain = 1,
    /** {en}
     * @brief H264 high profile
     */
    /** {zh}
     * @brief H264 格式高规格编码
     */
    kByteH264ProfileHigh = 2,
    /** {en}
     * @brief Custom baseline profile
     */
    /** {zh}
     * @brief ByteVC1 格式基本规格编码
     */
    kByteVC1ProfileBaseline = 3,
    /** {en}
     * @brief Custom main profile
     */
    /** {zh}
     * @brief ByteVC1 格式主流规格编码
     */
    kByteVC1ProfileMain = 4,
    /** {en}
     * @brief Custom high profile
     */
    /** {zh}
     * @brief ByteVC1 格式高规格编码
     */
    kByteVC1ProfileHigh = 5
}
/** {en}
 * @brief The video codec.
 */
/** {zh}
 * @brief 视频编码格式。
 */
export declare enum TranscoderVideoCodecType {
    /** {en}
     * @brief (Default) H.264 format.
     */
    /** {zh}
     * @brief H.264 格式，默认值。
     */
    kTranscodeVideoCodecH264 = 0,
    /** {en}
     * @brief ByteVC1 format.
     */
    /** {zh}
     * @brief ByteVC1 格式。
     */
    kTranscodeVideoCodecH265 = 1
}
/** {en}
 * @brief AAC profile. Defaults to `0`.
 */
/** {zh}
 * @brief 转推直播音频编码 AAC 等级
 */
export declare enum TranscoderAudioCodecProfile {
    /** {en}
     * @brief Low-Complexity profile (AAC-LC)
     */
    /** {zh}
     * @brief AAC-LC
     */
    kByteAACProfileLC = 0,
    /** {en}
     * @brief HE-AAC profile (AAC LC with SBR)
     */
    /** {zh}
     * @brief HE-AAC v1
     */
    kByteAACProfileHEv1 = 1,
    /** {en}
     * @brief HE-AAC v2 profile (AAC LC with SBR and Parametric Stereo)
     */
    /** {zh}
     * @brief HE-AAC v2
     */
    kByteAACProfileHEv2 = 2
}
export declare enum TranscoderAudioCodecType {
    /**
     * @brief AAC 格式。
     */
    kTranscodeAudioCodecAAC = 0
}
/** {en}
 * @brief Video rendering scale mode
 */
/** {zh}
 * @brief 转推直播视频渲染模式
 */
export declare enum TranscoderRenderMode {
    /**
     * @hidden
     */
    kRenderUnknown = 0,
    /** {en}
     * @brief Fill and Crop.
     *        The video frame is scaled with fixed aspect ratio, until it completely fills the canvas. The region of the video exceeding the canvas will be cropped.
     */
    /** {zh}
     * @brief 视频尺寸等比缩放，优先保证窗口被填满。当视频尺寸与显示窗口尺寸不一致时，多出的视频将被截掉。
     */
    kRenderHidden = 1,
    /** {en}
     * @brief Fit.
     *        The video frame is scaled with fixed aspect ratio, until it fits just within the canvas. Other part of the canvas is filled with the background color.
     */
    /** {zh}
     * @brief
     * 视频尺寸等比缩放，优先保证视频内容全部显示。当视频尺寸与显示窗口尺寸不一致时，会把窗口未被填满的区域填充成黑色。
     */
    kRenderFit = 2,
    /** {en}
     * @brief Fill the canvas.
     *        The video frame is scaled to fill the canvas. During the process, the aspect ratio may change.
     */
    /** {zh}
     * @brief 视频尺寸非等比例缩放，把窗口充满。当视频尺寸与显示窗口尺寸不一致时，视频高或宽方向会被拉伸。
     */
    kRenderAdaptive = 3
}
/** {en}
 * @brief Media streaming network quality.
 */
/** {zh}
 * @brief 媒体流网络质量。
 */
export declare enum NetworkQuality {
    /** {en}
     * @brief Network quality unknown.
     */
    /** {zh}
     * @brief 网络质量未知。
     */
    kNetworkQualityUnknown = 0,
    /** {en}
     * @brief The network quality is excellent.
     */
    /** {zh}
     * @brief 网络质量极好。
     */
    kNetworkQualityExcellent = 1,
    /** {en}
     * @brief The subjective feeling is similar to kNetworkQualityExcellent, but the bit rate may be slightly lower.
     */
    /** {zh}
     * @brief 主观感觉和 kNetworkQualityExcellent 差不多，但码率可能略低。
     */
    kNetworkQualityGood = 2,
    /** {en}
     * @brief Subjective feelings are flawed but do not affect communication.
     */
    /** {zh}
     * @brief 主观感受有瑕疵但不影响沟通。
     */
    kNetworkQualityPoor = 3,
    /** {en}
     * @brief Can barely communicate but not smoothly.
     */
    /** {zh}
     * @brief 勉强能沟通但不顺畅。
     */
    kNetworkQualityBad = 4,
    /** {en}
     * @brief The quality of the network is very poor and communication is basically impossible.
     */
    /** {zh}
     * @brief 网络质量非常差，基本不能沟通。
     */
    kNetworkQualityVbad = 5
}
/** {en}
 * @detail 85534
 * @brief Result of sending messages and the reason of failure if it fails.
 */
/** {zh}
 * @detail 85534
 * @brief 发送用户消息或者房间消息的结果
 */
export declare enum MessageSendResultCode {
    /** {en}
     * @brief The P2P message has been sent successfully.
     */
    /** {zh}
     * @brief 用户 P2P 消息发送成功
     */
    MESSAGE_CODE_SUCCESS = 0,
    /** {en}
     * @brief The room-wide broadcasting message has been sent successfully.
     */
    /** {zh}
     * @brief 房间 Broadcast 消息发送成功
     */
    MESSAGE_CODE_ROOM_SUCCESS = 200,
    /** {en}
     * @brief Failure. Sending timeout.
     */
    /** {zh}
     * @brief 发送超时，没有发送
     */
    MESSAGE_CODE_ERROR_TIMEOUT = 1,
    /** {en}
     * @brief Failure. Channel disconnected.
     */
    /** {zh}
     * @brief 通道断开，没有发送
     */
    MESSAGE_CODE_ERROR_BROKEN = 2,
    /** {en}
     * @brief Failure. Recipient not found.
     */
    /** {zh}
     * @brief 找不到接收方
     */
    MESSAGE_CODE_ERROR_NOT_RECEIVER = 3,
    /** {en}
     * @brief Failure. The sender of the message did not join the room
     */
    /** {zh}
     * @brief 消息发送方没有加入房间
     */
    MESSAGE_CODE_ERROR_NOT_JOIN = 100,
    /** {en}
     * @brief Failure. No data transmission channel connection available
     */
    /** {zh}
     * @brief 没有可用的数据传输通道连接
     */
    MESSAGE_CODE_ERROR_NO_CONNECTION = 102,
    /** {en}
     * @brief Failure. Message exceeds the range of the permitted size, 64 KB.
     */
    /** {zh}
     * @brief 消息超过最大长度，当前为64KB
     */
    MESSAGE_CODE_ERROR_EXCEED_MAX_LENGTH = 103,
    /** {en}
     * @brief Failure. The id of the recipient is empty
     */
    /** {zh}
     * @brief 接收消息的单个用户 id 为空
     */
    MESSAGE_CODE_ERROR_EMPTY_USER = 104,
    /** {en}
     * @brief Failure. Unknown error
     */
    /** {zh}
     * @brief 未知错误
     */
    MESSAGE_CODE_ERROR_UNKNOWN = 1000
}
/** {en}
 * @brief Audio mix file playback status.
 */
/** {zh}
 * @brief 音频混音文件播放状态。
 */
export declare enum AudioMixingState {
    /** {en}
     * @brief Mix loaded
     */
    /** {zh}
     * @brief 混音已加载
     */
    kAudioMixingStatePreloaded = 0,
    /** {en}
     * @brief Mix is playing
     */
    /** {zh}
     * @brief 混音正在播放
     */
    kAudioMixingStatePlaying = 1,
    /** {en}
     * @brief Mix Pause
     */
    /** {zh}
     * @brief 混音暂停
     */
    kAudioMixingStatePaused = 2,
    /** {en}
     * @brief Mixing stopped
     */
    /** {zh}
     * @brief 混音停止
     */
    kAudioMixingStateStopped = 3,
    /** {en}
     * @brief Mix playback failed
     */
    /** {zh}
     * @brief 混音播放失败
     */
    kAudioMixingStateFailed = 4,
    /** {en}
     * @brief End of mixing
     */
    /** {zh}
     * @brief 混音播放结束
     */
    kAudioMixingStateFinished = 5
}
/** {en}
 * @detail 85534
 * @brief Error code for audio mixing
 */
/** {zh}
 * @detail 85534
 * @brief 音频混音文件播放错误码。
 */
export declare enum AudioMixingError {
    /** {en}
     * @brief OK
     */
    /** {zh}
     * @brief 正常
     */
    kAudioMixingErrorOk = 0,
    /** {en}
     * @brief Preload failed. Invalid path or the length exceeds 20s.
     */
    /** {zh}
     * @brief 预加载失败，找不到混音文件或者文件长度超出 20s
     */
    kAudioMixingErrorPreloadFailed = 1,
    /** {en}
     * @brief Mixing failed. Invalid path or fail to open the file.
     */
    /** {zh}
     * @brief 混音开启失败，找不到混音文件或者混音文件打开失败
     */
    kAudioMixingErrorStartFailed = 2,
    /** {en}
     * @brief Invalid mixID
     */
    /** {zh}
     * @brief 混音 ID 异常
     */
    kAudioMixingErrorIdNotFound = 3,
    /** {en}
     * @brief Invalid position
     */
    /** {zh}
     * @brief 设置混音文件的播放位置出错
     */
    kAudioMixingErrorSetPositionFailed = 4,
    /** {en}
     * @brief Invalid volume. The range is [0, 400].
     */
    /** {zh}
     * @brief 音量参数不合法，仅支持设置的音量值为[0, 400]
     */
    kAudioMixingErrorInValidVolume = 5,
    /** {en}
     * @brief Another file was preloaded for mixing. Call [unloadAudioMixing](#unloadaudiomixing) first.
     */
    /** {zh}
     * @brief 播放的文件与预加载的文件不一致，请先使用 [unloadAudioMixing](85532#unloadaudiomixing) 卸载文件
     */
    kAudioMixingErrorLoadConflict = 6,
    /** {en}
     * @brief Do not support the mix type.
     */
    /** {zh}
     * @brief 不支持此混音类型。
     */
    kAudioMixingErrorIdTypeNotMatch = 7,
    /** {en}
     * @brief Invalid pitch value.
     */
    /** {zh}
     * @brief 设置混音文件的音调不合法
     */
    kAudioMixingErrorInValidPitch = 8,
    /** {en}
     * @brief Invalid audio track.
     */
    /** {zh}
     * @brief 设置混音文件的音轨不合法
     */
    kAudioMixingErrorInValidAudioTrack = 9,
    /** {en}
     * @brief Mixing starting
     */
    /** {zh}
     * @brief 混音文件正在启动中
     */
    kAudioMixingErrorIsStarting = 10,
    /** {en}
     * @brief Invalid playback speed
     */
    /** {zh}
     * @brief 设置混音文件的播放速度不合法
     */
    kAudioMixingErrorInValidPlaybackSpeed = 11
}
/** {en}
 * @detail 85534
 * @brief Callback warning code. The warning code indicates that there is a problem within the SDK and is trying to recover. Warning codes only serve as notifications.
 */
/** {zh}
 * @detail 85534
 * @brief 回调警告码。警告码说明 SDK 内部遇到问题正在尝试恢复。警告码仅起通知作用。
 */
export declare enum WarningCode {
    /** {en}
     * @brief Failed to enter the room.
     *        When you call the first time to join the room or disconnect and reconnect due to poor network conditions, the room entry fails due to a server error. The SDK automatically retries the room.
     */
    /** {zh}
     * @brief 进房失败。
     *        当你调用初次加入房间或者由于网络状况不佳断网重连时，由于服务器错误导致进房失败。SDK 会自动重试进房。
     */
    kWarningCodeJoinRoomFailed = -2001,
    /** {en}
     * @brief Release audio & video stream failed.
     *        When you publish audio & video streams in your room, the publication fails due to a server error. The SDK automatically retries the release.
     */
    /** {zh}
     * @brief 发布音视频流失败。
     *        当你在所在房间中发布音视频流时，由于服务器错误导致发布失败。SDK 会自动重试发布。
     */
    kWarningCodePublishStreamFailed = -2002,
    /** {en}
     * @brief Subscription to audio & video stream failed.
     *         The subscription failed because the audio & video stream for the subscription could not be found in the current room. The SDK will automatically retry the subscription. If the subscription fails, it is recommended that you exit the retry.
     */
    /** {zh}
     * @brief 订阅音视频流失败。
     *        当前房间中找不到订阅的音视频流导致订阅失败。SDK 会自动重试订阅，若仍订阅失败则建议你退出重试。
     */
    kWarningCodeSubscribeStreamFailed404 = -2003,
    /** {en}
     * @brief Subscription to audio & video stream failed.
     *        When you subscribe to audio & video streams in your room, the subscription fails due to a server error. The SDK automatically retries the subscription.
     */
    /** {zh}
     * @brief 订阅音视频流失败。
     *        当你订阅所在房间中的音视频流时，由于服务器错误导致订阅失败。SDK 会自动重试订阅。
     */
    kWarningCodeSubscribeStreamFailed5xx = -2004,
    /** {en}
     * @brief This warning is triggered when you call `setUserVisibility` to set yourself unvisible to others and then try to publish the flow.
     */
    /** {zh}
     * @brief 当调用 [setUserVisibility](85532#setuservisibility) 将自身可见性设置为 false 后，再尝试发布流会触发此警告。
     */
    kWarningCodePublishStreamForbiden = -2009,
    /** {en}
     * @brief Sending a custom broadcast message failed, you are not currently in the room.
     */
    /** {zh}
     * @brief 发送自定义广播消息失败，当前你未在房间中。
     */
    kWarningCodeSendCustomMessage = -2011,
    /** {en}
     * @brief When the number of people in the room exceeds 500, stop sending `onUserJoined` and `onUserLeave` callbacks to existing users in the room, and prompt all users in the room via broadcast.
     */
    /** {zh}
     * @brief 当房间内人数超过 500 人时，停止向房间内已有用户发送 [onUserJoined](85533#onuserjoined) 和 [onUserLeave](85533#onuserleave) 回调，并通过广播提示房间内所有用户。
     */
    kWarningCodeUserNotifyStop = -2013,
    /** {en}
     * @brief user had published in other room or had published public stream.
     */
    /** {zh}
     * @brief 用户已经在其他房间发布过流，或者用户正在发布公共流。
     */
    kWarningCodeUserInPublish = -2014,
    /** {en}
     * @brief user had published in other room or had published public stream.
     */
    /** {zh}
     * @brief 新生成的房间已经替换了同样roomId的旧房间
     */
    kWarningCodeOldRoomBeenReplaced = -2016,
    /** {en}
     * @brief The old room has been replaced by new room with the same roomId
     */
    /** {zh}
     * @brief 当前正在进行回路测试，该接口调用无效
     */
    kWarningCodeInEchoTestMode = -2017,
    /** {en}
     * @brief The camera permission is abnormal, and the current application does not obtain the camera permission.
     */
    /** {zh}
     * @brief 摄像头权限异常，当前应用没有获取摄像头权限。
     */
    kWarningCodeNoCameraPermission = -5001,
    /** {en}
     * @hidden
     * @brief Setting the screen audio capture type with `setScreenAudioSourceType` after calling `publishScreen` is not supported, please set before `publishScreen`.
     */
    /** {zh}
     * @hidden
     * @brief 不支持在 [publishScreen](85532#publishscreen) 之后设置屏幕音频采集类型
     *        setScreenAudioSourceType，请在 [publishScreen](85532#publishscreen)  之前设置
     */
    kWarningCodeSetScreenAudioSourceTypeFailed = -5009,
    /** {en}
     * @brief Setting the audio capture method for screen sharing via `setScreenAudioStreamIndex` after calling `publishScreen` is not supported.
     */
    /** {zh}
     * @brief 不支持在 [publishScreen](85532#publishscreen) 之后，
     *        通过 [setScreenAudioStreamIndex](85532#setscreenaudiostreamindex) 设置屏幕共享时的音频采集方式。
     */
    kWarningCodeSetScreenAudioStreamIndexFailed = -5010,
    /** {en}
     * @brief Invalid pitch value setting
     */
    /** {zh}
     * @brief 设置语音音高不合法
     */
    kWarningCodeInvalidVoicePitch = -5011,
    /** {en}
     * @brief Invalid audio format setting
     */
    /** {zh}
     * @brief 设置音频格式不合法
     */
    kWarningCodeInvalidAudioFormat = -5012,
    /** {en}
     * @brief Mixed use of old and new interfaces for external audio sources
     */
    /** {zh}
     * @brief 外部音频源新旧接口混用
     */
    kWarningCodeInvalidCallForExtAudio = -5013,
    /** {en}
     * @brief The specified internal rendering canvas handle is invalid.
     *        This callback is triggered when you specify an invalid canvas handle when you call [setupLocalVideo(85532#setuplocalvideo) or [setupRemoteVideo](85532#setupremotevideo).
     */
    /** {zh}
     * @brief 指定的内部渲染画布句柄无效。   当你调用 [setupLocalVideo(85532#setuplocalvideo) 或 [setupRemoteVideo](85532#setupremotevideo) 时指定了无效的画布句柄，触发此回调。
     */
    kWarningCodeInvalidCanvasHandle = -6001,
    /** {en}
     * @brief The authentication file is invalid. When checking the status of the authentication file, if the local file is inconsistent with the remote file, a
     *        second warning will be triggered.
     */
    /** {zh}
     * @brief 鉴权文件失效，当检查鉴权文件状态时，本地文件与远端文件不一致会触发次警告。
     */
    kWarningLicenseFileExpired = -7001,
    /**
     * @brief [音频技术](https://www.volcengine.com/docs/6489/71986) SDK 鉴权失效。联系技术支持人员。
     */
    kWarningInvaildSamiAppkeyORToken = -7002,
    /**
     * @brief [音频技术](https://www.volcengine.com/docs/6489/71986) 资源加载失败。传入正确的 DAT 路径，或联系技术支持人员。
     */
    kWarningInvaildSamiResourcePath = -7003,
    /**
     * @brief [音频技术](https://www.volcengine.com/docs/6489/71986) 库加载失败。使用正确的库，或联系技术支持人员。
     */
    kWarningLoadSamiLibraryFailed = -7004,
    /**
     * @brief [音频技术](https://www.volcengine.com/docs/6489/71986) 不支持此音效。联系技术支持人员。
     */
    kWarningInvaildSamiEffectType = -7005
}
/** {en}
 * @brief The cpu and memory information used by App .
 *         The information is periodically (2s) notified to the user by the SDK via `onSysStats` callback.
 */
/** {zh}
 * @brief App 使用的 cpu 和内存信息。
 *        信息由 SDK 周期性（2s）地通过 [onSysStats](85533#onsysstats) 回调通知给用户。
 */
export interface SysStats {
    /** {en}
     * @brief Current system CPU cores
     */
    /** {zh}
     * @brief 当前系统 CPU 核数
     */
    cpu_cores: number;
    /** {en}
     * @brief The cpu usage rate of the current application, the value range is [0,1].
     */
    /** {zh}
     * @brief 当前应用的 cpu 使用率，取值范围为 [0, 1]。
     */
    cpu_app_usage: number;
    /** {en}
     * @brief The cpu usage rate of the current system, the value range is [0,1].
     */
    /** {zh}
     * @brief 当前系统的 cpu 使用率，取值范围为 [0, 1]。
     */
    cpu_total_usage: number;
    /** {en}
     * @brief The memory usage of the current application (in MB)
     */
    /** {zh}
     * @brief 当前应用的内存使用量（单位 MB）
     */
    memory_usage: number;
    /** {en}
     * @brief Full memory (in MB)
     */
    /** {zh}
     * @brief 全量内存（单位字节）
     */
    full_memory: number;
    /** {en}
     * @brief System used memory (in MB)
     */
    /** {zh}
     * @brief 系统已使用内存（单位字节）
     */
    total_memory_usage: number;
    /** {en}
     * @brief Free allocable memory (in MB)
     */
    /** {zh}
     * @brief 空闲可分配内存（单位字节）
     */
    free_memory: number;
    /** {en}
     * @brief Memory usage of the current application (in %)
     */
    /** {zh}
     * @brief 当前应用的内存使用率（单位 %）
     */
    memory_ratio: number;
    /** {en}
     * @brief System memory usage (in %)
     */
    /** {zh}
     * @brief 系统内存使用率（单位 %）
     */
    total_memory_ratio: number;
}
/** {en}
 * @detail 85534
 * @brief Callback error code.
 *        When an unrecoverable error is encountered inside the SDK, the user is notified via the `onError` callback.
 */
/** {zh}
 * @detail 85534
 * @brief 回调错误码。  SDK 内部遇到不可恢复的错误时，会通过 [onError](85533#onerror) 回调通知用户。
 */
export declare enum ErrorCode {
    /** {en}
     * @brief Token  is invalid.
     *        The Token used when joining the room is invalid or expired. The user is required to retrieve the token and call the `updateToken` to update the token.
     */
    /** {zh}
     * @brief Token 无效。调用 [joinRoom](85532#joinroom) 方法时使用的 Token 无效或过期失效。需要用户重新获取 Token，并调用 [updateToken](85532#updatetoken) 方法更新 Token。
     */
    kErrorCodeInvalidToken = -1000,
    /** {en}
     * @brief Join room error.
     *        An unknown error occurred while joining the room, which caused the joining room to fail. Users are required to rejoin the room.
     */
    /** {zh}
     * @brief 加入房间错误。调用 [joinRoom](85532#joinroom) 方法时发生未知错误导致加入房间失败。需要用户重新加入房间。
     */
    kErrorCodeJoinRoom = -1001,
    /** {en}
     * @brief No permission to publish audio & video streams.
     *        The user failed to publish the audio & video stream in the room. The reason for the failure is that the user does not have permission to publish the stream.
     */
    /** {zh}
     * @brief 没有发布音视频流权限。用户在所在房间中发布音视频流失败，失败原因为用户没有发布流的权限。
     */
    kErrorCodeNoPublishPermission = -1002,
    /** {en}
     * @brief No subscription permissions for audio & video streams.
     *        The user failed to subscribe to the audio & video stream in the room where the user is located. The reason for the failure is that the user does not have permission to subscribe to the stream.
     */
    /** {zh}
     * @brief 没有订阅音视频流权限。用户订阅所在房间中的音视频流失败，失败原因为用户没有订阅流的权限。
     */
    kErrorCodeNoSubscribePermission = -1003,
    /** {en}
     * @brief The user has been removed from the room because the same user joined the room on the other client.
     */
    /** {zh}
     * @brief 用户重复登录。本地用户所在房间中有相同用户 ID 的用户加入房间，导致本地用户被踢出房间。
     */
    kErrorCodeDuplicateLogin = -1004,
    /** {en}
     * @brief The user has been removed from the room by the administrator via a OpenAPI call.
     */
    /** {zh}
     * @brief 服务端调用 OpenAPI 将当前用户踢出房间
     */
    kErrorCodeKickedOut = -1006,
    /** {en}
     * @brief When calling `createRTCRoom`, if the roomid is illegal, it will return null and throw the error
     */
    /** {zh}
     * @brief 当调用 createRTCRoom ，如果roomid 非法，会返回null，并抛出该error
     */
    kRoomErrorCodeRoomIdIllegal = -1007,
    /** {en}
     * @brief Token expired. Call `joinRoom` to rejoin with a valid Token.
     */
    /** {zh}
     * @brief Token 过期。调用 joinRoom 使用新的 Token 重新加入房间。
     */
    kRoomErrorTokenExpired = -1009,
    /** {en}
     * @brief The Token you provided when calling `updateToken` is invalid.
     */
    /** {zh}
     * @brief 调用 updateToken 传入的 Token 无效
     */
    kRoomErrorUpdateTokenWithInvalidToken = -1010,
    /** {en}
     * @brief Users have been removed from the room because the administrator dismissed the room by calling OpenAPI.
     */
    /** {zh}
     * @brief 服务端调用 OpenAPI 解散房间，所有用户被移出房间。
     */
    kErrorCodeRoomDismiss = -1011,
    /** {en}
     * @brief Join room error.
     *        The LICENSE billing account does not use the LICENSE_AUTHENTICATE SDK while entering the room, which caused the joining room to fail.
     */
    /** {zh}
     * @brief 加入房间错误。进房时, LICENSE 计费账号未使用 LICENSE_AUTHENTICATE SDK，加入房间错误。
     */
    kErrorCodeJoinRoomWithoutLicenseAuthenticateSDK = -1012,
    /** {en}
     * @brief there is a room with the same roomId，whose room id is the same with echo test
     */
    /** {zh}
     * @brief 通话回路检测已经存在同样 roomId 的房间了
     */
    kErrorCodeRoomAlreadyExist = -1013,
    /** {en}
     * @brief Subscription to audio & video stream failed, the total number of subscribed audio & video streams exceeded the upper limit.
     *        In the game scenario, in order to ensure the performance and quality of audio & video calls, the server will limit the total number of audio & video streams subscribed by the user. When the total number of audio & video streams subscribed by the user has reached the maximum, continuing to subscribe to more streams will fail, and the user will receive this error notification.
     */
    /** {zh}
     * @brief 订阅音视频流失败，订阅音视频流总数超过上限。游戏场景下，为了保证音视频通话的性能和质量，服务器会限制用户订阅的音视频流总数。当用户订阅的音视频流总数已达上限时，继续订阅更多流时会失败，同时用户会收到此错误通知。
     */
    kErrorCodeOverStreamSubscribeLimit = -1070,
    /** {en}
     * @brief Publishing flow failed, the total number of publishing flows exceeds the upper limit. The
     *        RTC system limits the total number of streams published in a single room, including video streams, audio streams, and screen streams. Local users will fail to publish streams to the room when the maximum number of published streams in the room has been reached, and will receive this error notification.
     */
    /** {zh}
     * @brief 发布流失败，发布流总数超过上限。 RTC 系统会限制单个房间内发布的总流数，总流数包括视频流、音频流和屏幕流。如果房间内发布流数已达上限时，本地用户再向房间中发布流时会失败，同时会收到此错误通知。
     */
    kErrorCodeOverStreamPublishLimit = -1080,
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
    kErrorCodeOverScreenPublishLimit = -1081,
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
    kErrorCodeOverVideoPublishLimit = -1082,
    /** {en}
     * @brief A/V synchronization failed.
     *        Current source audio ID has been set by other video publishers in the same room.
     *        One single audio source cannot be synchronized with multiple video sources at the same time.
     */
    /** {zh}
     * @brief 音视频同步失败。当前音频源已与其他视频源关联同步关系。单个音频源不支持与多个视频源同时同步。
     */
    kErrorCodeInvalidAudioSyncUidRepeated = -1083,
    /** {en}
     * @brief The user has been removed from the room due to the abnormal status of server.
     *        SDK  is disconnected with the signaling server. It will not reconnect automatically. Please contact technical support.
     */
    /** {zh}
     * @brief 服务端异常状态导致退出房间。SDK与信令服务器断开，并不再自动重连，可联系技术支持。
     */
    kErrorCodeAbnormalServerStatus = -1084,
    /** {en}
     * @brief The room has banned before the user calls `joinRoom`.
     */
    /** {zh}
     * @brief 房间被封禁。
     */
    kErrorCodeJoinRoomRoomForbidden = -1025,
    /** {en}
     * @brief The user has banned before calling `joinRoom`.
     */
    /** {zh}
     * @brief 用户被封禁。
     */
    kErrorCodeJoinRoomUserForbidden = -1026,
    /** {en}
     * @brief The license method did not load successfully. Check the corresponding extension.
     */
    /** {zh}
     * @brief license 计费方法没有加载成功。可能是因为 license 相关插件未正确集成。
     */
    kErrorCodeJoinRoomLicenseFunctionNotFound = -1027
}
/** {en}
 * @brief SDK  Network connection type.
 */
/** {zh}
 * @brief SDK 网络连接类型。
 */
export declare enum NetworkType {
    /** {en}
     * @brief Network connection type unknown.
     */
    /** {zh}
     * @brief 网络连接类型未知。
     */
    kNetworkTypeUnknown = -1,
    /** {en}
     * @brief The network connection has been disconnected.
     */
    /** {zh}
     * @brief 网络连接已断开。
     */
    kNetworkTypeDisconnected = 0,
    /** {en}
     * @brief The network connection type is LAN.
     */
    /** {zh}
     * @brief 网络连接类型为 LAN 。
     */
    kNetworkTypeLAN = 1,
    /** {en}
     * @brief The network connection type is Wi-Fi (including hotspots).
     */
    /** {zh}
     * @brief 网络连接类型为 Wi-Fi（包含热点）。
     */
    kNetworkTypeWIFI = 2,
    /** {en}
     * @brief The network connection type is 2G mobile network.
     */
    /** {zh}
     * @brief 网络连接类型为 2G 移动网络。
     */
    kNetworkTypeMobile2G = 3,
    /** {en}
     * @brief The network connection type is 3G mobile network.
     */
    /** {zh}
     * @brief 网络连接类型为 3G 移动网络。
     */
    kNetworkTypeMobile3G = 4,
    /** {en}
     * @brief The network connection type is 4G mobile network.
     */
    /** {zh}
     * @brief 网络连接类型为 4G 移动网络。
     */
    kNetworkTypeMobile4G = 5,
    /** {en}
     * @brief The network connection type is 5G mobile network.
     */
    /** {zh}
     * @brief 网络连接类型为 5G 移动网络。
     */
    kNetworkTypeMobile5G = 6
}
/** {en}
 * @brief Audio & video quality feedback problem
 */
/** {zh}
 * @brief 反馈信息类型
 */
export declare enum ProblemFeedbackOption {
    /** {en}
     * @brief No problem
     */
    /** {zh}
     * @brief 没有问题
     */
    kProblemFeedbackOptionNone = 0,
    /** {en}
     * @brief Other issues
     */
    /** {zh}
     * @brief 其他问题
     */
    kProblemFeedbackOptionOtherMessage = 1,
    /** {en}
     * @brief Connection failed
     */
    /** {zh}
     * @brief 连接失败
     */
    kProblemFeedbackOptionDisconnected = 2,
    /** {en}
     * @brief High latency for the ear monitor
     */
    /** {zh}
     * @brief 耳返延迟大
     */
    kProblemFeedbackOptionEarBackDelay = 3,
    /** {en}
     * @brief Noise on the local end
     */
    /** {zh}
     * @brief 本端有杂音
     */
    kProblemFeedbackOptionLocalNoise = 11,
    /** {en}
     * @brief Audio stall on the local end
     */
    /** {zh}
     * @brief 本端声音卡顿
     */
    kProblemFeedbackOptionLocalAudioLagging = 12,
    /** {en}
     * @brief No sound on the local end
     */
    /** {zh}
     * @brief 本端无声音
     */
    kProblemFeedbackOptionLocalNoAudio = 13,
    /** {en}
     * @brief Too little/loud sound on the local end
     */
    /** {zh}
     * @brief 本端声音大/小
     */
    kProblemFeedbackOptionLocalAudioStrength = 14,
    /** {en}
     * @brief Echo noise on the local end
     */
    /** {zh}
     * @brief 本端有回声
     */
    kProblemFeedbackOptionLocalEcho = 15,
    /** {en}
     * @brief Unclear video on the local end
     */
    /** {zh}
     * @brief 本端视频模糊
     */
    kProblemFeedbackOptionLocalVideoFuzzy = 25,
    /** {en}
     * @brief Unclear video on the local end
     */
    /** {zh}
     * @brief 本端音视频不同步
     */
    kProblemFeedbackOptionLocalNotSync = 26,
    /** {en}
     * @brief Video stall on the local end
     */
    /** {zh}
     * @brief 本端视频卡顿
     */
    kProblemFeedbackOptionLocalVideoLagging = 27,
    /** {en}
     * @brief No picture on the local end
     */
    /** {zh}
     * @brief 本端无画面
     */
    kProblemFeedbackOptionLocalNoVideo = 28,
    /** {en}
     * @brief Noise on the remote end
     */
    /** {zh}
     * @brief 远端有杂音
     */
    kProblemFeedbackOptionRemoteNoise = 38,
    /** {zh}
     * @brief 远端声音卡顿
     */
    kProblemFeedbackOptionRemoteAudioLagging = 39,
    /** {en}
     * @brief No sound on the remote end
     */
    /** {zh}
     * @brief 远端无声音
     */
    kProblemFeedbackOptionRemoteNoAudio = 40,
    /** {en}
     * @brief Too little/loud sound on the remote end
     */
    /** {zh}
     * @brief 远端声音大/小
     */
    kProblemFeedbackOptionRemoteAudioStrength = 41,
    /** {en}
     * @brief Echo noise on the remote end
     */
    /** {zh}
     * @brief 远端有回声
     */
    kProblemFeedbackOptionRemoteEcho = 42,
    /** {en}
     * @brief Unclear video on the remote end
     */
    /** {zh}
     * @brief 远端视频模糊
     */
    kProblemFeedbackOptionRemoteVideoFuzzy = 52,
    /** {en}
     * @brief Audio & video out of sync on the remote end
     */
    /** {zh}
     * @brief 远端音视频不同步
     */
    kProblemFeedbackOptionRemoteNotSync = 53,
    /** {en}
     * @brief Video stall on the remote end
     */
    /** {zh}
     * @brief 远端视频卡顿
     */
    kProblemFeedbackOptionRemoteVideoLagging = 54,
    /** {en}
     * @brief No picture on the remote end
     */
    /** {zh}
     * @brief 远端无画面
     */
    kProblemFeedbackOptionRemoteNoVideo = 55
}
/** {en}
 * @brief Whether to turn on release performance fallback
 */
/** {zh}
 * @brief 是否开启发布性能回退
 */
export declare enum PerformanceAlarmMode {
    /** {en}
     * @brief Not enabled Release performance fallback
     */
    /** {zh}
     * @brief 未开启发布性能回退
     */
    kPerformanceAlarmModeNormal = 0,
    /** {en}
     * @brief Open Release Performance Rollback
     */
    /** {zh}
     * @brief 已开启发布性能回退
     */
    kPerformanceAlarmModeSimulcast = 1
}
/** {en}
 * @brief Reasons of performance-related alarms
 */
/** {zh}
 * @brief [onPerformanceAlarms](85533#onperformancealarms) 告警的原因
 */
export declare enum PerformanceAlarmReason {
    /** {en}
     * @brief The poor network causes the transmission performance to fall back. This reason is only received when sending performance fallback is turned on.
     */
    /** {zh}
     * @brief 网络原因差，造成了发送性能回退。仅在开启发送性能回退时，会收到此原因。
     */
    kPerformanceAlarmReasonBandwidthFallbacked = 0,
    /** {en}
     * @brief Network performance recovery, transmission performance rollback recovery. This reason is only received when sending performance fallback is turned on.
     */
    /** {zh}
     * @brief 网络性能恢复，发送性能回退恢复。仅在开启发送性能回退时，会收到此原因。
     */
    kPerformanceAlarmReasonBandwidthResumed = 1,
    /** {en}
     * @brief If the send performance fallback is not turned on, when receiving this alarm, it means that the performance is insufficient;
     *        If the send performance fallback is turned on, when receiving this alarm, it means that the performance is insufficient and the send performance fallback has occurred.
     */
    /** {zh}
     * @brief 如果未开启发送性能回退，收到此告警时，意味着性能不足；如果开启了发送性能回退，收到此告警时，意味着性能不足，且已发生发送性能回退。
     */
    kPerformanceAlarmReasonPerformanceFallbacked = 2,
    /** {en}
     * @brief If the send performance fallback is not turned on, when receiving this alarm, it means that the performance shortage has been restored;
     *         If the send performance fallback is turned on, when receiving this alarm, it means that the performance shortage has been restored and the send performance fallback has occurred. Recovery.
     */
    /** {zh}
     * @brief 如果未开启发送性能回退，收到此告警时，意味着性能不足已恢复； 如果开启了发送性能回退，收到此告警时，意味着性能不足已恢复，且已发生发送性能回退恢复。
     */
    kPerformanceAlarmReasonPerformanceResumed = 3
}
/** {zh}
 * @brief 媒体设备错误类型
 */
export declare enum MediaDeviceError {
    /**
     * @brief 媒体设备正常
     */
    kMediaDeviceErrorOK = 0,
    /**
     * @brief 没有权限启动媒体设备
     */
    kMediaDeviceErrorDeviceNoPermission = 1,
    /**
     * @brief 媒体设备已经在使用中
     */
    kMediaDeviceErrorDeviceBusy = 2,
    /**
     * @brief 媒体设备错误
     */
    kMediaDeviceErrorDeviceFailure = 3,
    /**
     * @brief 未找到指定的媒体设备
     */
    kMediaDeviceErrorDeviceNotFound = 4,
    /**
     * @brief 媒体设备被移除。
     *        对象为采集屏幕流时，表明窗体被关闭或显示器被移除。
     */
    kMediaDeviceErrorDeviceDisconnected = 5,
    /**
     * @brief 设备没有数据回调
     */
    kMediaDeviceErrorDeviceNoCallback = 6,
    /**
     * @brief 设备采样率不支持
     */
    kMediaDeviceErrorDeviceUNSupportFormat = 7,
    /**
     * @hidden
     * @brief ios 屏幕采集没有 group id 参数
     */
    kMediaDeviceErrorDeviceNotFindGroupId = 8,
    /**
     * @hidden
     * @brief 打断类型：使用camera过程中被送到后台
     */
    kMediaDeviceErrorDeviceNotAvailableInBackground = 9,
    /**
     * @hidden
     * @brief 打断类型：被其他客户端打断，比如一个正在使用capture session的app
     */
    kMediaDeviceErrorDeviceVideoInUseByAnotherClient = 10,
    /**
     * @hidden
     * @brief 打断类型：使用Slide Over,、Split View 或者 PIP时被中断，比如台前调度，画中画
     */
    kMediaDeviceErrorDeviceNotAvailableWithMultipleForegroundApps = 11,
    /**
     * @hidden
     * @brief 打断类型：系统压力，比如过热
     */
    kMediaDeviceErrorDeviceNotAvailableDueToSystemPressure = 12
}
/** {zh}
 * @brief 用户加入房间的类型。
 */
export declare enum JoinRoomType {
    /** {zh}
     * @brief 首次加入房间。用户手动调用 [joinRoom](85532#joinroom)，收到加入成功。
     */
    kJoinRoomTypeFirst = 0,
    /** {zh}
     * @brief 重新加入房间。用户网络较差，失去与服务器的连接，进行重连时收到加入成功。
     */
    kJoinRoomTypeReconnected = 1
}
/** {en}
 * @brief Local audio stream statistics, reference period 2s.
 *         After the local user publishes the audio stream successfully, the SDK will periodically notify the user through `onLocalStreamStats`
 *         The transmission status of the published audio stream during this reference period. This data structure is the type of parameter that is called back to the user.
 */
/** {zh}
 * @brief 本地音频流统计信息，统计周期为 2s 。  本地用户发布音频流成功后，SDK 会周期性地通过 [onLocalStreamStats](85533#onlocalstreamstats) 通知用户发布的音频流在此次统计周期内的发送状况。此数据结构即为回调给用户的参数类型。
 */
export interface LocalAudioStats {
    /** {en}
     * @brief Audio packet loss rate. The audio uplink packet loss rate in this reference period is % and the value range is [0,1].
     */
    /** {zh}
     * @brief 音频丢包率。此次统计周期内的音频上行丢包率，单位为 % ，取值范围为 [0, 1]。
     */
    audio_loss_rate: number;
    /** {en}
     * @brief Send rate. The audio transmission rate in the reference period is kbps.
     */
    /** {zh}
     * @brief 发送码率。此次统计周期内的音频发送码率，单位为 kbps 。
     */
    send_kbitrate: number;
    /** {en}
     * @brief Acquisition sampling rate. Audio sampling rate information collected in the reference period, in units of Hz.
     */
    /** {zh}
     * @brief 采集采样率。此次统计周期内的音频采集采样率信息，单位为 Hz 。
     */
    record_sample_rate: number;
    /** {en}
     * @brief Statistical interval. The interval of this reference period is in ms.
     *        This field is used to set the reference period for the callback. The default setting is 2s.
     */
    /** {zh}
     * @brief 统计间隔。此次统计周期的间隔，单位为 ms 。
     * 此字段用于设置回调的统计周期，默认设置为 2s 。
     */
    stats_interval: number;
    /** {en}
     * @brief Round-trip time. The unit is ms.
     */
    /** {zh}
     * @brief 往返时延。单位为 ms 。
     */
    rtt: number;
    /** {en}
     * @brief Number of audio channels.
     */
    /** {zh}
     * @brief 音频声道数。
     */
    num_channels: number;
    /** {en}
     * @brief Audio transmission sampling rate. Audio transmission sampling rate information in the reference period, in Hz.
     */
    /** {zh}
     * @brief 音频发送采样率。此次统计周期内的音频发送采样率信息，单位为 Hz 。
     */
    sent_sample_rate: number;
    /** {en}
     * @brief Audio uplink network jitter in ms.
     */
    /** {zh}
     * @brief 音频上行网络抖动，单位为 ms 。
     */
    jitter: number;
}
/** {en}
 * @brief Local video stream statistics, reference period 2s.
 *        After a local user publishes a video stream successfully, the SDK will periodically notify the user through `onLocalStreamStats`
 *        The delivery status of the published video stream during this reference period. This data structure is the type of parameter that is called back to the user.
 */
/** {zh}
 * @brief 本地视频流统计信息，统计周期为 2s 。
 *        本地用户发布视频流成功后，SDK 会周期性地通过 [onLocalStreamStats](85533#onlocalstreamstats)  通知用户发布的视频流在此次统计周期内的发送状况。此数据结构即为回调给用户的参数类型。
 */
export interface LocalVideoStats {
    /** {en}
     * @brief TX bitrate in Kbps of the video stream with the highest resolution within the reference period
     */
    /** {zh}
     * @brief 发送码率。此次统计周期内的视频发送码率，单位为 kbps 。
     */
    sent_kbitrate: number;
    /** {en}
     * @brief Sampling frame rate in fps of video capture during this reference period
     */
    /** {zh}
     * @brief 采集帧率。此次统计周期内的视频采集帧率，单位为 fps 。
     */
    input_frame_rate: number;
    /** {en}
     * @brief TX frame rate in fps of the video stream with the highest resolution within the reference period
     */
    /** {zh}
     * @brief 发送帧率。此次统计周期内的视频发送帧率，单位为 fps 。
     */
    sent_frame_rate: number;
    /** {en}
     * @brief Encoder-output frame rate in fps of the video stream with the highest resolution within the reference period
     */
    /** {zh}
     * @brief 编码器输出帧率。当前编码器在此次统计周期内的输出帧率，单位为 fps 。
     */
    encoder_output_frame_rate: number;
    /** {en}
     * @brief Local-rendering frame rate in fps during this reference period
     */
    /** {zh}
     * @brief 本地渲染帧率。此次统计周期内的本地视频渲染帧率，单位为 fps 。
     */
    renderer_output_frame_rate: number;
    /** {en}
     * @brief Statistical interval. The interval of this reference period is in ms.
     *        This field is used to set the reference period for the callback. The default setting is 2s.
     */
    /** {zh}
     * @brief 统计间隔。此次统计周期的间隔，单位为 ms 。
     *        此字段用于设置回调的统计周期，默认设置为 2s 。
     */
    stats_interval: number;
    /** {en}
     * @brief Video packet loss rate. The video uplink packet loss rate in this reference period ranges from  [0,1].
     */
    /** {zh}
     * @brief 视频丢包率。此次统计周期内的视频上行丢包率，取值范围为 [0，1] 。
     */
    video_loss_rate: number;
    /** {en}
     * @brief Round-trip time in ms.
     */
    /** {zh}
     * @brief 往返时延，单位为 ms 。
     */
    rtt: number;
    /** {en}
     * @brief Video encoding bitrate in Kbps of the video stream with the highest resolution within the reference period.
     */
    /** {zh}
     * @brief 视频编码码率。此次统计周期内的视频编码码率，单位为 kbps 。
     */
    encoded_bitrate: number;
    /** {en}
     * @brief Video encoding width in px of the video stream with the highest resolution within the reference period
     */
    /** {zh}
     * @brief 实际发送的分辨率最大的视频流的视频编码宽度，单位为 px 。
     */
    encoded_frame_width: number;
    /** {en}
     * @brief Video encoding height in px of the video stream with the highest resolution within the reference period
     */
    /** {zh}
     * @brief 实际发送的分辨率最大的视频流的视频编码高度，单位为 px 。
     */
    encoded_frame_height: number;
    /** {en}
     * @brief The total number of the video stream with the highest resolution within the reference period sent in the reference period.
     */
    /** {zh}
     * @brief 此次统计周期内实际发送的分辨率最大的视频流的发送的视频帧总数。
     */
    encoded_frame_count: number;
    /** {en}
     * @brief For the encoding type of the video
     */
    /** {zh}
     * @brief 视频的编码类型
     */
    codec_type: VideoCodecType;
    /** {en}
     * @brief Whether the media stream belongs to the user is a screen stream. You can know whether the current statistics come from mainstream or screen stream.
     */
    /** {zh}
     * @brief 所属用户的媒体流是否为屏幕流。你可以知道当前统计数据来自主流还是屏幕流。
     */
    is_screen: boolean;
    /** {en}
     * @brief Video uplink network jitter in ms.
     */
    /** {zh}
     * @brief 视频上行网络抖动，单位为 ms 。
     */
    jitter: number;
    /**
     * @brief 视频编码平均耗时，单位ms。
     */
    codec_elapse_per_frame: number;
}
/** {en}
 * @brief Local audio/video stream statistics and network status, the reference period is 2s.
 *        After the local user publishes the audio/video stream successfully, the SDK will periodically notify the local user through `onLocalStreamStats`
 *        The transmission status of the published audio/video stream during this reference period. This data structure is the type of parameter that is called back to the user.
 */
/** {zh}
 * @brief 本地音/视频流统计信息，统计周期为 2s 。
 *        本地用户发布音/视频流成功后，SDK 会周期性地通过 `onLocalStreamStats` 通知本地用户发布的音/视频流在此次统计周期内的发送状况。此数据结构即为回调给用户的参数类型。
 */
export interface LocalStreamStats {
    /** {en}
     * @brief For statistics on audio streams sent by local devices.
     */
    /** {zh}
     * @brief 本地设备发送音频流的统计信息
     */
    audio_stats: LocalAudioStats;
    /** {en}
     * @brief For statistics on video streams sent by local devices.
     */
    /** {zh}
     * @brief 本地设备发送视频流的统计信息
     */
    video_stats: LocalVideoStats;
    /** {en}
     * @hidden
     * @brief For the media stream uplink network quality of the user you belong to.
     * @deprecated since 336.1, use onNetworkQuality(85533#onnetworkquality) instead
     */
    /** {zh}
     * @hidden
     * @brief 所属用户的媒体流上行网络质量
     * @deprecated since 336.1, use onNetworkQuality(85533#onnetworkquality) instead
     */
    local_tx_quality: NetworkQuality;
    /** {en}
     * @hidden
     * @brief The downlink network quality of the media stream belongs to the user.
     * @deprecated since 336.1, use onNetworkQuality(85533#onnetworkquality) instead
     */
    /** {zh}
     * @hidden
     * @brief 所属用户的媒体流下行网络质量
     */
    local_rx_quality: NetworkQuality;
    /** {en}
     * @brief Whether the media stream belongs to the user is a screen stream. You can know whether the current statistics come from mainstream or screen stream.
     */
    /** {zh}
     * @brief 所属用户的媒体流是否为屏幕流。你可以知道当前统计数据来自主流还是屏幕流。
     */
    is_screen: boolean;
}
/** {en}
 * @brief Remote audio stream statistics, reference period 2s.
 *         After a local user subscribes to a remote audio stream successfully, the SDK periodically notifies the local user of the reception status of the subscribed audio stream during this reference period through `onRemoteStreamStats`. This data structure is the type of parameter that is called back to the local user.
 */
/** {zh}
 * @brief 远端音频流统计信息，统计周期为 2s。
 *        本地用户订阅远端音频流成功后，SDK 会周期性地通过 [onRemoteStreamStats](85533#onremotestreamstats) 通知本地用户订阅的音频流在此次统计周期内的接收状况。此数据结构即为回调给本地用户的参数类型。
 */
export interface RemoteAudioStats {
    /** {en}
     * @brief Audio packet loss rate. The audio downlink packet loss rate in the reference period, the value range is  [0,1].
     */
    /** {zh}
     * @brief 音频丢包率。统计周期内的音频下行丢包率，取值范围为 [0, 1] 。
     */
    audio_loss_rate: number;
    /** {en}
     * @brief Receiving bit rate. The audio reception rate in the reference period in kbps.
     */
    /** {zh}
     * @brief 接收码率。统计周期内的音频接收码率，单位为 kbps 。
     */
    received_kbitrate: number;
    /** {en}
     * @brief Number of audio stalls. Number of stalls in the reference period.
     */
    /** {zh}
     * @brief 音频卡顿次数。统计周期内的卡顿次数。
     */
    stall_count: number;
    /** {en}
     * @brief Audio stall Duration. Stall duration in the reference period in ms.
     */
    /** {zh}
     * @brief 音频卡顿时长。统计周期内的卡顿时长，单位为 ms 。
     */
    stall_duration: number;
    /** {en}
     * @brief End-to-end latency at the user experience level. The delay from the start of encoding at the sending end to the start of decoding at the receiving end, in units of ms.
     */
    /** {zh}
     * @brief 用户体验级别的端到端延时。从发送端采集完成编码开始到接收端解码完成渲染开始的延时，单位为 ms 。
     */
    e2e_delay: number;
    /** {en}
     * @brief Play sample rate. Audio playback sample rate information within the reference period in Hz.
     */
    /** {zh}
     * @brief 播放采样率。统计周期内的音频播放采样率信息，单位为 Hz 。
     */
    playout_sample_rate: number;
    /** {en}
     * @brief Statistical interval. The interval of this reference period is in ms.
     */
    /** {zh}
     * @brief 统计间隔。此次统计周期的间隔，单位为 ms 。
     */
    stats_interval: number;
    /** {en}
     * @brief Round-trip time for client side to server level data transfer in ms.
     */
    /** {zh}
     * @brief 客户端到服务端数据传输的往返时延，单位为 ms。
     */
    rtt: number;
    /** {en}
     * @brief The sender-server level-the receiver-link data transmission round-trip time. The unit is ms.
     */
    /** {zh}
     * @brief 发送端——服务端——接收端全链路数据传输往返时延。单位为 ms 。
     */
    total_rtt: number;
    /** {en}
     * @brief The quality of the audio stream sent by the remote user.
     * + `0`: Network quality unknown.
     * + `1`: The network quality is excellent.
     * + `2`: The subjective feeling is similar to kNetworkQualityExcellent, but the bit rate may be slightly lower.
     * + `3`: Subjective feelings are flawed but do not affect communication.
     * + `4`: Can barely communicate but not smoothly.
     * + `5`: The quality of the network is very poor and communication is basically impossible.
     */
    /** {zh}
     * @brief 远端用户发送的音频流质量。
     * + `0`: 网络质量未知。
     * + `1`: 网络质量极好。
     * + `2`: 主观感觉和 kNetworkQualityExcellent 差不多，但码率可能略低。
     * + `3`: 主观感受有瑕疵但不影响沟通。
     * + `4`: 勉强能沟通但不顺畅。
     * + `5`: 网络质量非常差，基本不能沟通。
     */
    quality: number;
    /** {en}
     * @brief The delay caused by the introduction of the jitter buffer mechanism. The unit is ms.
     */
    /** {zh}
     * @brief 因引入 jitter buffer 机制导致的延时。单位为 ms 。
     */
    jitter_buffer_delay: number;
    /** {en}
     * @brief Number of audio channels.
     */
    /** {zh}
     * @brief 音频声道数。
     */
    num_channels: number;
    /** {en}
     * @brief Audio reception sampling rate. Remote audio sampling rate information received within the reference period, in Hz.
     */
    /** {zh}
     * @brief 音频接收采样率。统计周期内接收到的远端音频采样率信息，单位为 Hz 。
     */
    received_sample_rate: number;
    /** {en}
     * @brief The accumulated length of the audio card occurs after the remote user joins the room as a percentage of the total effective length of the audio. The effective duration of audio refers to the duration of audio other than stopping sending audio streams and disabling audio modules after remote users enter the room to publish audio streams.
     */
    /** {zh}
     * @brief 远端用户在加入房间后发生音频卡顿的累计时长占音频总有效时长的百分比。音频有效时长是指远端用户进房发布音频流后，除停止发送音频流和禁用音频模块之外的音频时长。
     */
    frozen_rate: number;
    /** {en}
     * @brief Audio packet loss compensation (PLC)  total number of sample points.
     */
    /** {zh}
     * @brief 音频 PLC 样点总个数。
     */
    concealed_samples: number;
    /** {en}
     * @brief Audio packet loss compensation (PLC)  cumulative times.
     */
    /** {zh}
     * @brief PLC 累计次数。
     */
    concealment_event: number;
    /** {en}
     * @brief Audio decoding sample rate. Audio decoding sample rate information in the reference period in Hz.
     */
    /** {zh}
     * @brief 音频解码采样率。统计周期内的音频解码采样率信息，单位为 Hz 。
     */
    dec_sample_rate: number;
    /** {en}
     * @brief Decoding duration. The total time-consuming decoding of the remote audio stream received within this reference period, in seconds.
     */
    /** {zh}
     * @brief 解码时长。对此次统计周期内接收的远端音频流进行解码的总耗时，单位为 s 。
     */
    dec_duration: number;
    /** {en}
     * @brief Audio downlink network jitter in ms.
     */
    /** {zh}
     * @brief 音频下行网络抖动，单位为 ms 。
     */
    jitter: number;
}
/** {en}
 * @brief Remote video stream statistics, reference period 2s.
 *         After the local user subscribes to the remote video stream successfully, the SDK will periodically notify the local user of the reception status of the remote video stream subscribed to during this reference period through `onRemoteStreamStats`
 *        . This data structure is the type of parameter that is called back to the local user.
 */
/** {zh}
 * @brief 远端音频流统计信息，统计周期为 2s 。
 *        本地用户订阅远端音频流成功后，SDK 会周期性地通过 [onRemoteStreamStats](85533#onremotestreamstats)
 *        通知本地用户订阅的远端视频流在此次统计周期内的接收状况。此数据结构即为回调给本地用户的参数类型。
 */
export interface RemoteVideoStats {
    /** {en}
     * @brief Video Width
     */
    /** {zh}
     * @brief 视频宽度
     */
    width: number;
    /** {en}
     * @brief Video height
     */
    /** {zh}
     * @brief 视频高度
     */
    height: number;
    /** {en}
     * @brief Video packet loss rate. Video downlink packet loss rate in the reference period, in units of %, and in the range of [0,1].
     */
    /** {zh}
     * @brief 视频丢包率。统计周期内的视频下行丢包率，单位为 % ，取值范围：[0，1] 。
     */
    video_loss_rate: number;
    /** {en}
     * @brief Receiving bit rate. Video reception rate within the reference period, in kbps.
     */
    /** {zh}
     * @brief 接收码率。统计周期内的视频接收码率，单位为 kbps 。
     */
    received_kbitrate: number;
    /** {en}
     * @brief The decoder outputs the frame rate. Video decoder output frame rate within the reference period, in fps.
     */
    /** {zh}
     * @brief 解码器输出帧率。统计周期内的视频解码器输出帧率，单位 fps 。
     */
    decoder_output_frame_rate: number;
    /** {en}
     * @brief Render frame rate. The video rendering frame rate in the reference period, in fps.
     */
    /** {zh}
     * @brief 渲染帧率。统计周期内的视频渲染帧率，单位 fps 。
     */
    renderer_output_frame_rate: number;
    /** {en}
     * @brief Number of stalls. Number of stalls in the reference period.
     */
    /** {zh}
     * @brief 卡顿次数。统计周期内的卡顿次数。
     */
    stall_count: number;
    /** {en}
     * @brief Stall duration. The total duration of the video stall in the reference period. Unit ms.
     */
    /** {zh}
     * @brief 卡顿时长。统计周期内的视频卡顿总时长。单位 ms 。
     */
    stall_duration: number;
    /** {en}
     * @brief End-to-end latency at the user experience level. The delay from the start of encoding at the sending end to the start of decoding at the receiving end, in units of ms.
     */
    /** {zh}
     * @brief 用户体验级别的端到端延时。从发送端采集完成编码开始到接收端解码完成渲染开始的延时，单位为 ms 。
     */
    e2eDelay: number;
    /** {en}
     * @brief Whether the media stream belongs to the user is a screen stream. You can know whether the current data comes from mainstream or screen stream.
     */
    /** {zh}
     * @brief 所属用户的媒体流是否为屏幕流。你可以知道当前数据来自主流还是屏幕流。
     */
    is_screen: number;
    /** {en}
     * @brief Statistical interval, the interval of this reference period, in ms.
     *        This field is used to set the reference period for the callback, currently set to 2s.
     */
    /** {zh}
     * @brief 统计间隔，此次统计周期的间隔，单位为 ms 。
     * @notes 此字段用于设置回调的统计周期，目前设置为 2s 。
     */
    stats_interval: number;
    /** {en}
     * @brief Round-trip time in ms.
     */
    /** {zh}
     * @brief 往返时延，单位为 ms 。
     */
    rtt: number;
    /** {en}
     * @brief The cumulative duration of the video card of the remote user accounts for the percentage (%) of the total effective duration of the video after entering the room. The effective duration of the video refers to the duration of the video other than stopping sending the video stream and disabling the video module after the remote user enters the room to publish the video stream.
     */
    /** {zh}
     * @brief 远端用户在进房后发生视频卡顿的累计时长占视频总有效时长的百分比（%）。视频有效时长是指远端用户进房发布视频流后，除停止发送视频流和禁用视频模块之外的视频时长。
     */
    frozen_rate: number;
    /** {en}
     * @brief For the encoding type of the video
     */
    /** {zh}
     * @brief 视频的编码类型
     */
    codec_type: VideoCodecType;
    /** {en}
     * @brief For subscripts of streams with multiple resolutions.
     */
    /** {zh}
     * @brief 对应多种分辨率的流的下标
     */
    video_index: number;
    /** {en}
     * @brief Video downlink network jitter in ms.
     */
    /** {zh}
     * @brief 视频下行网络抖动，单位为 ms 。
     */
    jitter: number;
    /**
     * @brief 视频解码平均耗时，单位ms。
     */
    codec_elapse_per_frame: number;
}
/** {en}
 * @brief The remote audio/video stream statistics and network status subscribed by the user, with a reference period of 2s.
 *         After the remote user subscribed to successfully publish the audio/video stream, the SDK will periodically notify local users through `onRemoteStreamStats`
 *         The reception status of the remote audio/video stream subscribed during this reference period. This data structure is the type of parameter that is called back to the local user.
 */
/** {zh}
 * @brief 用户订阅的远端音/视频流统计信息以及网络状况，统计周期为 2s 。
 *        订阅远端用户发布音/视频流成功后，SDK 会周期性地通过 [onRemoteStreamStats](85533#onremotestreamstats)
 *        通知本地用户订阅的远端音/视频流在此次统计周期内的接收状况。此数据结构即为回调给本地用户的参数类型。
 */
export interface RemoteStreamStats {
    /** {en}
     * @brief User ID
     */
    /** {zh}
     * @brief 用户 ID 。音频来源的远端用户 ID 。
     */
    uid: string;
    /** {en}
     * @brief User ID. The remote user ID of the audio source.
     */
    /** {zh}
     * @brief 远端音频流的统计信息
     */
    audio_stats: RemoteAudioStats;
    /** {en}
     * @brief For statistics on remote audio streams.
     */
    /** {zh}
     * @brief 远端视频流的统计信息
     */
    video_stats: RemoteVideoStats;
    /** {en}
     * @hidden
     * @brief For the media stream uplink network quality of the user you belong to.
     * @deprecated since 336.1, use onNetworkQuality(85533#onnetworkquality) instead
     */
    /** {zh}
     * @hidden
     * @brief 所属用户的媒体流上行网络质量
     */
    remote_tx_quality: NetworkQuality;
    /** {en}
     * @hidden
     * @brief The downlink network quality of the media stream belongs to the user.
     * @deprecated since 336.1, use onNetworkQuality(85533#onnetworkquality) instead
     */
    /** {zh}
     * @hidden
     * @brief 所属用户的媒体流下行网络质量
     */
    remote_rx_quality: NetworkQuality;
    /** {en}
     * @brief Whether the media stream belongs to the user is a screen stream. You can know whether the current statistics come from mainstream or screen stream.
     */
    /** {zh}
     * @brief 所属用户的媒体流是否为屏幕流。你可以知道当前统计数据来自主流还是屏幕流。
     */
    is_screen: boolean;
}
/** {zh}
 * @brief 停止/启动发送音/视频流的状态
 */
export declare enum MuteState {
    /** {zh}
     * @brief 启动发送音/视频流的状态
     */
    kMuteStateOff = 0,
    /** {zh}
     * @brief 停止发送音/视频流的状态
     */
    kMuteStateOn = 1
}
/** {en}
 * @brief Stream type.
 */
/** {zh}
 * @brief 流属性
 */
export declare enum StreamIndex {
    /** {en}
     * @brief Main stream which includes video captured by cameras or audio captured by microphone
     */
    /** {zh}
     * @brief 主流。包括：通过默认摄像头/麦克风采集到的视频/音频;
     */
    kStreamIndexMain = 0,
    /** {en}
     * @brief Screen stream to be shared
     * Screen recording stream or sounds coming from the sound card
     */
    /** {zh}
     * @brief 屏幕流。
     *        屏幕共享时共享的视频流，或来自声卡的本地播放音频流。
     */
    kStreamIndexScreen = 1
}
/**
 * @type keytype
 * @brief 视频帧颜色编码格式
 */
export declare enum VideoPixelFormat {
    /**
     * @brief 未知的颜色编码格式
     */
    kVideoPixelFormatUnknown = 0,
    /**
     * @brief YUV I420 格式
     */
    kVideoPixelFormatI420 = 1,
    /**
     * @brief YUV NV12 格式
     */
    kVideoPixelFormatNV12 = 2,
    /**
     * @brief YUV NV21 格式
     */
    kVideoPixelFormatNV21 = 3,
    /**
     * @brief RGB 24bit格式，
     */
    kVideoPixelFormatRGB24 = 4,
    /**
     * @brief RGBA 编码格式
     */
    kVideoPixelFormatRGBA = 5,
    /**
     * @brief ARGB 编码格式
     */
    kVideoPixelFormatARGB = 6,
    /**
     * @brief BGRA 编码格式
     */
    kVideoPixelFormatBGRA = 7
}
/** {zh}
 * @type keytype
 * @brief 视频帧编码格式
 */
/** {en}
 * @type keytype
 * @brief Video frame encoding format
 */
export declare enum PixelFormat {
    /** {zh}
     * @brief YUV I420 格式
     */
    /** {en}
     * @brief YUV I420 format
     */
    kI420 = 1,
    /** {zh}
     * @brief RGBA 格式, 字节序为 R8 G8 B8 A8
     */
    /** {en}
     * @brief RGBA format
     */
    kRGBA = 5
}
/** {en}
 * @brief Events during pushing streams to CDN
 */
/** {zh}
 * @brief 转推直播事件
 */
export declare enum StreamMixingEvent {
    /** {en}
     * @brief Request to start pushing streams to CDN
     */
    /** {zh}
     * @brief 请求发起转推直播任务
     */
    kStreamMixingStart = 1,
    /** {en}
     * @brief ask to push streams to CDN started
     */
    /** {zh}
     * @brief 发起转推直播任务成功
     */
    kStreamMixingStartSuccess = 2,
    /** {en}
     * @brief Failed to start the task to push streams to CDN
     */
    /** {zh}
     * @brief 发起转推直播任务失败
     */
    kStreamMixingStartFailed = 3,
    /** {en}
     * @brief Request to update the configuration for the task to push streams to CDN
     */
    /** {zh}
     * @brief 请求更新转推直播任务配置
     */
    kStreamMixingUpdate = 4,
    /** {en}
     * @brief Successfully update the configuration for the task to push streams to CDN
     */
    /** {zh}
     * @brief 成功更新转推直播任务配置
     */
    kStreamMixingUpdateSuccess = 5,
    /** {en}
     * @brief Failed to update the configuration for the task to push streams to CDN
     */
    /** {zh}
     * @brief 更新转推直播任务配置失败
     */
    kStreamMixingUpdateFailed = 6,
    /** {en}
     * @brief Request to stop the task to push streams to CDN
     */
    /** {zh}
     * @brief 请求结束转推直播任务
     */
    kStreamMixingStop = 7,
    /** {en}
     * @brief The task to push streams to CDN stopped
     */
    /** {zh}
     * @brief 结束转推直播任务成功
     */
    kStreamMixingStopSuccess = 8,
    /** {en}
     * @brief Failed to stop the task to push streams to CDN
     */
    /** {zh}
     * @brief 结束转推直播任务失败
     */
    kStreamMixingStopFailed = 9,
    /** {en}
     * @brief Timeout for the request to update the configuration for the task to push streams to CDN.
     */
    /** {zh}
     * @brief 更新转推直播任务配置的请求超时
     */
    kStreamMixingChangeMixType = 10,
    /** {en}
     * @brief Got the first frame of the mixed audio stream by client.
     */
    /** {zh}
     * @brief 得到客户端合流音频首帧
     */
    kStreamMixingFirstAudioFrameByClientMix = 11,
    /** {en}
     * @brief Got the first frame of the mixed video stream by client.
     */
    /** {zh}
     * @brief 收到客户端合流视频首帧
     */
    kStreamMixingFirstVideoFrameByClientMix = 12,
    /** {en}
     * @brief Timeout for the request to update the configuration for the task to push streams to CDN
     */
    /** {zh}
     * @brief 更新转推直播任务配置超时
     */
    kStreamMixingUpdateTimeout = 13,
    /** {en}
     * @brief Timeout for the request to start the task to push streams to CDN
     */
    /** {zh}
     * @brief 发起转推直播任务配置超时
     */
    kStreamMixingStartTimeout = 14,
    /** {en}
     * @brief Error in the parameters of the request for the task to push streams to CDN
     */
    /** {zh}
     * @brief 合流布局参数错误
     */
    kStreamMixingRequestParamError = 15,
    /** {en}
     * @brief Mixing image.
     */
    /** {zh}
     * @brief 合流加图片
     */
    kStreamMixingMixImageEvent = 16
}
/** {en}
 * @brief Events during pushing streams to CDN
 */
/** {zh}
 * @brief 转推直播事件
 */
export declare enum SingleStreamPushEvent {
    /** {en}
     * @brief Starting pushing a single stream to CDN.
     */
    /** {zh}
     * @brief 开始推流。
     */
    kSingleStreamPushStart = 1,
    /** {en}
     * @brief Successfully pushed a single stream to CDN.
     */
    /** {zh}
     * @brief 推流成功。
     */
    kSingleStreamPushSuccess = 2,
    /** {en}
     * @brief Failed to push a single stream to CDN.
     */
    /** {zh}
     * @brief 推流失败。
     */
    kSingleStreamPushFailed = 3,
    /** {en}
     * @brief Stop pushing a single stream to CDN.
     */
    /** {zh}
     * @brief 停止推流。
     */
    kSingleStreamPushStop = 4,
    /** {en}
     * @brief Request timed out. Please check network status and retry.
     */
    /** {zh}
     * @brief 单流转推直播任务处理超时，请检查网络状态并重试。
     */
    kSingleStreamPushTimeout = 5,
    /** {en}
     * @brief Request failed due to invalid parameter.
     */
    /** {zh}
     * @brief 参数错误。
     */
    kSingleStreamPushParamError = 6
}
/** {en}
 * @brief Stream mixing type
 */
/** {zh}
 * @brief 合流类型
 */
export declare enum StreamMixingType {
    /** {en}
     * @brief Server-side stream mixing
     */
    /** {zh}
     * @brief 服务端合流
     */
    kStreamMixingTypeByServer = 0,
    /** {en}
     * @brief Intelligent stream mixing. The SDK will intelligently decide that a stream mixing task would be done on the client or the server.
     */
    /** {zh}
     * @brief 端云一体合流
     */
    kStreamMixingTypeByClient = 1
}
/** {en}
 * @brief Information about the remote stream
 */
/** {zh}
 * @brief 远端流信息
 */
export interface RemoteStreamKey {
    /** {en}
     * @brief The room ID of the media stream.
     *        If the media stream is the stream forwarded by `startForwardStreamToRooms`, you must set the roomID to the room ID of the target room.
     */
    /** {zh}
     * @brief 媒体流所在房间的房间 ID。
     *        如果此媒体流是通过 `startForwardStreamToRooms` 转发到你所在房间的媒体流时，你应将房间 ID 设置为你所在的房间 ID。
     */
    room_id: string;
    /** {en}
     * @brief The ID of the user who published the stream.
     */
    /** {zh}
     * @brief 用户 ID
     */
    user_id: string;
    /** {en}
     * @brief Stream type.
     */
    /** {zh}
     * @brief 流属性，主流或屏幕流。
     */
    stream_index: StreamIndex;
}
/** {en}
 * @brief Local recording parameter configuration
 */
/** {zh}
 * @brief 本地录制参数配置
 */
export interface RecordingConfig {
    /** {en}
     * @brief The absolute path to save the recording file. You need to specify a legal path with read and write permissions.
     */
    /** {zh}
     * @brief 录制文件保存的绝对路径。你需要指定一个有读写权限的合法路径。
     */
    dir_path: string;
    /** {en}
     * @brief Recording stored file format.
     * + aac : 0
     * + mp4 : 1
     */
    /** {zh}
     * @brief 录制存储文件格式
     * + aac : 0
     * + mp4 : 1
     */
    file_type: number;
}
export declare enum RecordingType {
    /**
     * @brief 只录制音频
     */
    kRecordAudioOnly = 0,
    /**
     * @brief 只录制视频
     */
    kRecordVideoOnly = 1,
    /**
     * @brief 同时录制音频和视频
     */
    kRecordVideoAndAudio = 2
}
/** {en}
 * @brief Verification information required to use automatic speech recognition services
 */
/** {zh}
 * @brief 使用自动语音识别服务所需校验信息
 */
export declare enum ASRAuthorizationType {
    /** {en}
     * @brief Token  authentication
     */
    /** {zh}
     * @brief Token 鉴权
     */
    kASRAuthorizationTypeToken = 0,
    /** {en}
     * @brief Signature  Authentication
     */
    /** {zh}
     * @brief Signature 鉴权
     */
    /** {en}
     * @brief Signature  Authentication
     */
    kASRAuthorizationTypeSignature = 1
}
/** {en}
 * @brief  Verification information required to use automatic speech recognition services
 */
/** {zh}
 * @brief 使用自动语音识别服务所需校验信息
 */
export interface RTCASRConfig {
    /** {en}
     * @brief Application ID
     */
    /** {zh}
     * @brief 应用 ID
     */
    app_id: string;
    /** {en}
     * @brief User ID
     */
    /** {zh}
     * @brief 用户 ID
     */
    user_id: string;
    /** {en}
     * @brief For authentication methods.
     * + `0`: Via Token
     * + `1`: Via Signature
     */
    /** {zh}
     * @brief 鉴权方式
     * + `0`: Token 鉴权
     * + `1`: Signature 鉴权
     */
    authorization_type: ASRAuthorizationType;
    /** {en}
     * @brief Access token
     */
    /** {zh}
     * @brief 访问令牌
     */
    access_token: string;
    /** {en}
     * @brief Private key. Signature  cannot be empty in authentication mode, and it is empty in token authentication mode.
     */
    /** {zh}
     * @brief 私钥。Signature 鉴权模式下不能为空，token 鉴权模式下为空。参看[关于鉴权](https://www.volcengine.com/docs/6561/107789)
     */
    secret_key: string;
    /** {en}
     * @brief For scenario information.
     */
    /** {zh}
     * @brief 场景信息，参看[业务集群](https://www.volcengine.com/docs/6561/80818#_3-2-2-%E5%8F%91%E9%80%81-full-client-request)
     */
    cluster: string;
}
/** {zh}
 * @brief 房间内远端流被移除的原因。
 */
export declare enum StreamRemoveReason {
    /** {zh}
     * @brief 远端用户停止发布流。
     */
    kStreamRemoveReasonUnpublish = 0,
    /** {zh}
     * @brief 远端用户发布流失败。
     */
    kStreamRemoveReasonPublishFailed = 1,
    /** {zh}
     * @brief 保活失败。
     */
    kStreamRemoveReasonKeepLiveFailed = 2,
    /** {zh}
     * @brief 远端用户断网。
     */
    kStreamRemoveReasonClientDisconnected = 3,
    /** {zh}
     * @brief 远端用户重新发布流。
     */
    kStreamRemoveReasonRepublish = 4,
    /** {zh}
     * @brief 其他原因。
     */
    kStreamRemoveReasonOther = 5
}
/** {en}
 * @brief Reason of the Fallback or reverting from a Fallback of the subscribed stream or the publishing stream
 */
/** {zh}
 * @brief 远端订阅流发生回退或恢复的原因
 */
export declare enum FallbackOrRecoverReason {
    /** {en}
     * @brief The default: Fallback due to an unknown reason that is neither infufficienclt bandwidth of the network nor poor-performance of the device
     */
    /** {zh}
     * @brief 其他原因，非带宽和性能原因引起的回退或恢复。默认值
     */
    kFallbackOrRecoverReasonUnknown = -1,
    /** {en}
     * @brief Fallback of the subscribed stream due to insufficient bandwidth of the network
     */
    /** {zh}
     * @brief 由带宽不足导致的订阅端音视频流回退。
     */
    kFallbackOrRecoverReasonSubscribeFallbackByBandwidth = 0,
    /** {en}
     * @brief Fallback of the subscribed stream for poor-performance of the device
     */
    /** {zh}
     * @brief 由性能不足导致的订阅端音视频流回退。
     */
    kFallbackOrRecoverReasonSubscribeFallbackByPerformance = 1,
    /** {en}
     * @brief Reverting from a Fallback of the subscribed stream due to the recovery of the network bandwidth
     */
    /** {zh}
     * @brief 由带宽恢复导致的订阅端音视频流恢复。
     */
    kFallbackOrRecoverReasonSubscribeRecoverByBandwidth = 2,
    /** {en}
     * @brief Reverting from a Fallback of the subscribed stream due to the amelioration of the device performance
     */
    /** {zh}
     * @brief 由性能恢复导致的订阅端音视频流恢复。
     */
    kFallbackOrRecoverReasonSubscribeRecoverByPerformance = 3,
    /** {en}
     * @brief Fallback of the publishing stream due to Insufficient bandwidth of the network
     */
    /** {zh}
     * @brief 由带宽不足导致的发布端音视频流回退。
     */
    kFallbackOrRecoverReasonPublishFallbackByBandwidth = 4,
    /** {en}
     * @brief Fallback of the publishing stream due to poor-performance of the device
     */
    /** {zh}
     * @brief 由性能不足导致的发布端音视频流回退。
     */
    kFallbackOrRecoverReasonPublishFallbackByPerformance = 5,
    /** {en}
     * @brief Reverting from a Fallback of the publishing stream due to the recovery of the network bandwidth
     */
    /** {zh}
     * @brief 由带宽恢复导致的发布端音视频流恢复。
     */
    kFallbackOrRecoverReasonPublishRecoverByBandwidth = 6,
    /** {en}
     * @brief Reverting from a Fallback of the publishing stream due to the amelioration of the device performance
     */
    /** {zh}
     * @brief 由性能恢复导致的发布端音视频流恢复。
     */
    kFallbackOrRecoverReasonPublishRecoverByPerformance = 7
}
/** {en}
 * @brief Information of stream switching due to a Fallback
 */
/** {zh}
 * @brief 流切换信息。本地用户订阅的远端流触发回退策略时的流切换信息。
 */
export interface RemoteStreamSwitch {
    /** {en}
     * @brief User ID of the publisher of the subscribed media stream
     */
    /** {zh}
     * @brief 订阅的音视频流的发布者的用户 ID。
     */
    uid: string;
    /** {en}
     * @brief Whether it is a screen-sharing stream
     */
    /** {zh}
     * @brief 是否是屏幕流。
     */
    is_screen: boolean;
    /** {en}
     * @brief The quality index of the subscribed stream before the stream switching
     */
    /** {zh}
     * @brief 流切换前本地用户订阅的视频流的分辨率对应的索引。
     */
    before_video_index: number;
    /** {en}
     * @brief The quality index of the subscribed stream after the stream switching
     */
    /** {zh}
     * @brief 流切换后本地用户订阅的视频流的分辨率对应的索引。
     */
    after_video_index: number;
    /** {en}
     * @brief Whether a video stream before the stream switching
     */
    /** {zh}
     * @brief 流切换前是否有视频流。
     */
    before_enable: boolean;
    /** {en}
     * @brief Whether a video stream after the stream switching
     */
    /** {zh}
     * @brief 流切换后是否有视频流。
     */
    after_enable: boolean;
    /** {en}
     * @brief Reason of the Fallback or reverting from the Fallback of the subscribed stream.
     */
    /** {zh}
     * @brief 触发流回退的原因
     */
    reason: FallbackOrRecoverReason;
}
/** {en}
 * @brief Information on video frame rotation angle
 */
/** {zh}
 * @brief 视频旋转信息，枚举类型，定义了以 90 度为间隔的四种旋转模式。
 */
export declare enum VideoRotation {
    /** {en}
     * @brief Video does not rotate
     */
    /** {zh}
     * @brief 顺时针旋转 0 度
     */
    kVideoRotation0 = 0,
    /** {en}
     * @brief Video rotates 90 degrees clockwise
     */
    /** {zh}
     * @brief 顺时针旋转 90 度
     */
    kVideoRotation90 = 90,
    /** {en}
     * @brief Video rotates 180 degrees clockwise
     */
    /** {zh}
     * @brief 顺时针旋转 180 度
     */
    kVideoRotation180 = 180,
    /** {en}
     * @brief Video rotates 270 degrees clockwise
     */
    /** {zh}
     * @brief 顺时针旋转 270 度
     */
    kVideoRotation270 = 270
}
/** {en}
 * @brief Video frame information
 */
/** {zh}
 * @brief 视频帧信息
 */
export interface VideoFrameInfo {
    /** {en}
     * @brief Width (pixels)
     */
    /** {zh}
     * @brief 视频帧的宽度（像素）
     */
    width: number;
    /** {en}
     * @brief High (pixels)
     */
    /** {zh}
     * @brief 视频帧的高度（像素）
     */
    height: number;
    /** {en}
     * @brief Video frame clockwise rotation angle.
     */
    /** {zh}
     * @brief 视频帧顺时针旋转角度。
     */
    rotation: VideoRotation;
}
/** {en}
 * @brief Audio properties
 */
/** {zh}
 * @brief 音频属性信息
 */
export interface AudioPropertiesInfo {
    /** {en}
     * @brief linear volume. The value is in linear relation to the original volume. The higher the value, the higher the volume. The range is [0,255].
     *        - [0, 25]: Silence
     *        - [26, 75]: Low volume
     *        - [76, 204]: Medium volume
     *        - [205, 255]: High volume
     */
    /** {zh}
     * @brief 线性音量，与原始音量呈线性关系，数值越大，音量越大。取值范围是：[0,255]。
     *        - [0, 25]: 无声
     *        - [26, 75]: 低音量
     *        - [76, 204]: 中音量
     *        - [205, 255]: 高音量
     */
    linear_volume: number;
    /** {en}
     * @brief non-linear volume in dB. The value is in proportion to the log value of the original volume. You can use the value to recognize the Active Speaker in the room. The range is [-127, 0].
     *        - [-127, -60]: Silence
     *        - [-59, -40]: Low volume
     *        - [-39, -20]: Medium volume
     *        - [-19, 0]: High volume
     */
    /** {zh}
     * @brief 非线性音量。由原始音量的对数值转化而来，因此在中低音量时更灵敏，可以用作 Active Speaker（房间内最活跃用户）的识别。取值范围是：[-127，0]，单位 dB。
     *        - [-127, -60]: 无声
     *        - [-59, -40]: 低音量
     *        - [-39, -20]: 中音量
     *        - [-19, 0]: 高音量
     */
    nonlinear_volume: number;
    /** {en}
     * @brief Voice Activity Detection (VAD) result
     * + 1: Voice activity detected.
     * + 0: No voice activity detected.
     * + -1: VAD not activated.
     */
    /** {zh}
     * @brief 人声检测（VAD）结果
     *        - 1: 检测到人声。
     *        - 0: 未检测到人声。
     *        - -1: 未开启 VAD。
     */
    vad: number;
    /** {en}
     * @brief Spectrum array. The default length is 257.
     */
    /** {zh}
     * @brief 频谱数组。默认长度为 257。
     */
    spectrum: number[];
}
/** {en}
 * @brief Local audio properties
 */
/** {zh}
 * @brief 本地音频属性信息
 */
export interface LocalAudioPropertiesInfo {
    /** {en}
     * @brief Stream Index
     */
    /** {zh}
     * @brief 流属性，主流或屏幕流。
     */
    stream_index: StreamIndex;
    /** {en}
     * @brief Audio properties information
     */
    /** {zh}
     * @brief 音频属性信息，
     */
    audio_properties_info: AudioPropertiesInfo;
}
/** {en}
 * @brief Remote audio properties
 */
/** {zh}
 * @brief 远端音频属性信息
 */
export interface RemoteAudioPropertiesInfo {
    /** {en}
     * @brief Stream Index
     */
    /** {zh}
     * @brief 流属性，主流或屏幕流。
     */
    stream_key: RemoteStreamKey;
    /** {en}
     * @brief Audio properties information
     */
    /** {zh}
     * @brief 音频属性信息
     */
    audio_properties_info: AudioPropertiesInfo;
}
/** {en}
 * @brief Virtual background Object
 */
/** {zh}
 * @brief 虚拟背景对象。
 */
export interface VirtualBackgroundSource {
    /** {en}
     * @brief Virtual background type.
     */
    /** {zh}
     * @brief 虚拟背景类型
     */
    source_type?: VirtualBackgroundSourceType;
    /** {en}
     * @brief The absolute path of the specified image.
     * + You can upload a .JPG, .PNG, or .JPEG file.
     * + The image with a resolution higher than 1080p(Full HD) will be rescaled proportionally to fit in the video.
     * + If the image's aspect ratio matches the video's, the image will be rescaled proportionally to fit in the video.
     * + If the image’s aspect ratio doesn't match the video's, the shortest side (either height or width) of the image will be stretched proportionally to match the video. Then the image will be cropped to fill in the video.
     * + The transparent area in the image will be filled with white color.
     */
    /** {zh}
     * @brief 自定义背景图片的绝对路径。
     *         支持的格式为 jpg、jpeg、png。
     *        图片分辨率超过 1080P 时，图片会被等比缩放至和视频一致。
     *        图片和视频宽高比一致时，图片会被直接缩放至和视频一致。
     *        图片和视频长宽比不一致时，为保证图片内容不变形，图片按短边缩放至与视频帧一致，使图片填满视频帧，对多出的高或宽进行剪裁。
     *        自定义图片带有局部透明效果时，透明部分由黑色代替。
     */
    source_path: string;
    /** {zh}
     * @brief 纯色背景使用的颜色。
     */
    source_color?: number;
}
/** {zh}
 * @brief 虚拟背景类型。
 */
export declare enum VirtualBackgroundSourceType {
    /** {zh}
     * @brief 使用纯色背景替换视频原有背景。
     */
    kVirtualBackgroundSourceColor = 0,
    /** {zh}
     * @brief 使用自定义图片替换视频原有背景。
     */
    kVirtualBackgroundSourceImage = 1
}
/** {en}
 * @brief Local audio stream status.
 */
/** {zh}
 * @brief 本地音频流状态。
 */
export declare enum LocalAudioStreamState {
    /** {en}
     * @brief The default initial state of the local audio.
     *         Callback to this state when the microphone stops working, corresponding to the error code kLocalAudioStreamErrorOk
     */
    /** {zh}
     * @brief 本地音频默认初始状态。
     *        麦克风停止工作时回调该状态，对应错误码 kLocalAudioStreamErrorOk
     */
    kLocalAudioStreamStateStopped = 0,
    /** {en}
     * @brief The local audio recording device started successfully.
     *         Callback to the state when the first frame of audio is collected, corresponding to the error code kLocalAudioStreamErrorOk
     */
    /** {zh}
     * @brief 本地音频录制设备启动成功。
     *        采集到音频首帧时回调该状态，对应错误码 kLocalAudioStreamErrorOk
     */
    kLocalAudioStreamStateRecording = 1,
    /** {en}
     * @brief The first frame of the local audio was successfully encoded.
     *         Callback to the state when the audio first frame encoding is successful, corresponding to the error code kLocalAudioStreamErrorOk
     */
    /** {zh}
     * @brief 本地音频首帧编码成功。
     *        音频首帧编码成功时回调该状态，对应错误码 kLocalAudioStreamErrorOk
     */
    kLocalAudioStreamStateEncoding = 2,
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
    kLocalAudioStreamStateFailed = 3
}
/** {en}
 * @detail 85534
 * @brief Error code when the local audio state changes
 */
/** {zh}
 * @detail 85534
 * @brief 本地音频流状态改变时的错误码。
 */
export declare enum LocalAudioStreamError {
    /** {en}
     * @brief Local audio status is normal.
     */
    /** {zh}
     * @brief 本地音频状态正常
     */
    kLocalAudioStreamErrorOk = 0,
    /** {en}
     * @brief Local audio error cause unknown
     */
    /** {zh}
     * @brief 本地音频出错原因未知
     */
    kLocalAudioStreamErrorFailure = 1,
    /** {en}
     * @brief No permission to start local audio recording device
     */
    /** {zh}
     * @brief 没有权限启动本地音频录制设备
     */
    kLocalAudioStreamErrorDeviceNoPermission = 2,
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
    kLocalAudioStreamErrorDeviceBusy = 3,
    /** {en}
     * @brief Local audio recording failed, it is recommended that you check whether the recording device is working properly
     */
    /** {zh}
     * @brief 本地音频录制失败，建议你检查录制设备是否正常工作
     */
    kLocalAudioStreamErrorRecordFailure = 4,
    /** {en}
     * @brief Local audio encoding failed
     */
    /** {zh}
     * @brief 本地音频编码失败
     */
    kLocalAudioStreamErrorEncodeFailure = 5,
    /** {en}
     * @brief No audio recording equipment available
     */
    /** {zh}
     * @brief 没有可用的音频录制设备
     */
    kLocalAudioStreamErrorNoRecordingDevice = 6
}
/** {en}
 * @brief Remote audio stream state.
 */
/** {zh}
 * @brief 远端音频流状态。
 */
export declare enum RemoteAudioState {
    /** {en}
     * @brief The remote audio stream is not received.
     */
    /** {zh}
     * @brief 不接收远端音频流。
     */
    kRemoteAudioStateStopped = 0,
    /** {en}
     * @brief Start receiving the remote audio stream header.
    /** {zh}
     * @brief 开始接收远端音频流首包。
     */
    kRemoteAudioStateStarting = 1,
    /** {en}
     * @brief The remote audio stream is decoding and playing normally.
    /** {zh}
     * @brief 远端音频流正在解码，正常播放。
     */
    kRemoteAudioStateDecoding = 2,
    /** {en}
     * @brief Remote audio streaming card.
     */
    /** {zh}
     * @brief 远端音频流卡顿。
     */
    kRemoteAudioStateFrozen = 3,
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
    kRemoteAudioStateFailed = 4
}
/** {en}
 * @brief Receives the cause of the remote audio stream state change.
 */
/** {zh}
 * @brief 接收远端音频流状态改变的原因。
 */
export declare enum RemoteAudioStateChangeReason {
    /** {en}
     * @brief Internal reasons
     */
    /** {zh}
     * @brief 内部原因
     */
    kRemoteAudioStateChangeReasonInternal = 0,
    /** {en}
     * @brief Network blocking
     */
    /** {zh}
     * @brief 网络阻塞
     */
    kRemoteAudioStateChangeReasonNetworkCongestion = 1,
    /** {en}
     * @brief Network back to normal
     */
    /** {zh}
     * @brief 网络恢复正常
     */
    kRemoteAudioStateChangeReasonNetworkRecovery = 2,
    /** {en}
     * @brief Local user stops receiving remote audio stream
     */
    /** {zh}
     * @brief 本地用户停止接收远端音频流
     */
    kRemoteAudioStateChangeReasonLocalMuted = 3,
    /** {en}
     * @brief Local users resume receiving remote audio streams
     */
    /** {zh}
     * @brief 本地用户恢复接收远端音频流
     */
    kRemoteAudioStateChangeReasonLocalUnmuted = 4,
    /** {en}
     * @brief Remote user stops sending audio stream
     */
    /** {zh}
     * @brief 远端用户停止发送音频流
     */
    kRemoteAudioStateChangeReasonRemoteMuted = 5,
    /** {en}
     * @brief Remote user resumes sending audio stream
     */
    /** {zh}
     * @brief 远端用户恢复发送音频流
     */
    kRemoteAudioStateChangeReasonRemoteUnmuted = 6,
    /** {en}
     * @brief Remote user leaves room
     */
    /** {zh}
     * @brief 远端用户离开房间
     */
    kRemoteAudioStateChangeReasonRemoteOffline = 7
}
/** {en}
 * @brief Local video stream status
 */
/** {zh}
 * @brief 本地视频流状态
 */
export declare enum LocalVideoStreamState {
    /** {en}
     * @brief Local video capture stop state
     */
    /** {zh}
     * @brief 本地视频采集停止状态
     */
    kLocalVideoStreamStateStopped = 0,
    /** {en}
     * @brief Local video capture device activated
     */
    /** {zh}
     * @brief 本地视频采集设备启动成功
     */
    kLocalVideoStreamStateRecording = 1,
    /** {en}
     * @brief After local video capture, the first frame is encoded successfully
     */
    /** {zh}
     * @brief 本地视频采集后，首帧编码成功
     */
    kLocalVideoStreamStateEncoding = 2,
    /** {en}
     * @brief Local video capture device failed to start
     */
    /** {zh}
     * @brief 本地视频采集设备启动失败
     */
    kLocalVideoStreamStateFailed = 3
}
/** {en}
 * @detail 85534
 * @brief Error Codes for the local video state changed
 */
/** {zh}
 * @detail 85534
 * @brief 本地视频状态改变时的错误码
 */
export declare enum LocalVideoStreamError {
    /** {en}
     * @brief Normal
     */
    /** {zh}
     * @brief 状态正常
     */
    kLocalVideoStreamErrorOk = 0,
    /** {en}
     * @brief Local video stream publishing failed
     */
    /** {zh}
     * @brief 本地视频流发布失败
     */
    kLocalVideoStreamErrorFailure = 1,
    /** {en}
     * @brief No access to the local video capture device
     */
    /** {zh}
     * @brief 没有权限启动本地视频采集设备
     */
    kLocalVideoStreamErrorDeviceNoPermission = 2,
    /** {en}
     * @brief Local video capture equipment is occupied
     */
    /** {zh}
     * @brief 本地视频采集设备被占用
     */
    kLocalVideoStreamErrorDeviceBusy = 3,
    /** {en}
     * @brief Local video capture device does not exist
     */
    /** {zh}
     * @brief 本地视频采集设备不存在
     */
    kLocalVideoStreamErrorDeviceNotFound = 4,
    /** {en}
     * @brief Local video capture failed, it is recommended to check whether the acquisition device is working properly
     */
    /** {zh}
     * @brief 本地视频采集失败，建议检查采集设备是否正常工作
     */
    kLocalVideoStreamErrorCaptureFailure = 5,
    /** {en}
     * @brief Local video encoding failed
     */
    /** {zh}
     * @brief 本地视频编码失败
     */
    kLocalVideoStreamErrorEncodeFailure = 6,
    /** {en}
     * @brief The local video capture device is disconnected. It is occupied by other programs during the call.
     */
    /** {zh}
     * @brief 通话过程中本地视频采集设备被其他程序抢占，导致设备连接中断
     */
    kLocalVideoStreamErrorDeviceDisconnected = 7
}
/** {en}
 * @brief Remote video stream status.
 */
/** {zh}
 * @brief 远端视频流状态。
 */
export declare enum RemoteVideoState {
    /** {en}
     * @brief The remote video stream defaults to the initial state, and the video has not yet started playing.
     */
    /** {zh}
     * @brief 远端视频流默认初始状态，视频尚未开始播放。
     */
    kRemoteVideoStateStopped = 0,
    /** {en}
     * @brief Local user has received remote video stream header packet.
     */
    /** {zh}
     * @brief 本地用户已接收远端视频流首包。
     */
    kRemoteVideoStateStarting = 1,
    /** {en}
     * @brief The remote video stream is decoding and playing normally.
     */
    /** {zh}
     * @brief 远端视频流正在解码，正常播放。
     */
    kRemoteVideoStateDecoding = 2,
    /** {en}
     * @brief Remote video streaming card, there may be network and other reasons.
     */
    /** {zh}
     * @brief 远端视频流卡顿，可能有网络等原因。
     */
    kRemoteVideoStateFrozen = 3,
    /** {en}
     * @brief The remote video stream failed to play.
     */
    /** {zh}
     * @brief 远端视频流播放失败。
     */
    kRemoteVideoStateFailed = 4
}
/** {en}
 * @brief Cause of remote video stream state change
 */
/** {zh}
 * @brief 远端视频流状态改变的原因
 */
export declare enum RemoteVideoStateChangeReason {
    /** {en}
     * @brief Internal reasons
     */
    /** {zh}
     * @brief 内部原因
     */
    kRemoteVideoStateChangeReasonInternal = 0,
    /** {en}
     * @brief Network blocking
     */
    /** {zh}
     * @brief 网络阻塞
     */
    kRemoteVideoStateChangeReasonNetworkCongestion = 1,
    /** {en}
     * @brief Network back to normal
     */
    /** {zh}
     * @brief 网络恢复正常
     */
    kRemoteVideoStateChangeReasonNetworkRecovery = 2,
    /** {en}
     * @brief Local user stops receiving remote video stream or local user disables video module
     */
    /** {zh}
     * @brief 本地用户停止接收远端视频流或本地用户禁用视频模块
     */
    kRemoteVideoStateChangeReasonLocalMuted = 3,
    /** {en}
     * @brief Local user resumes receiving remote video streams or local user enables video modules
     */
    /** {zh}
     * @brief 本地用户恢复接收远端视频流或本地用户启用视频模块
     */
    kRemoteVideoStateChangeReasonLocalUnmuted = 4,
    /** {en}
     * @brief The remote user stops sending the video stream or the remote user disables the video module
     */
    /** {zh}
     * @brief 远端用户停止发送视频流或远端用户禁用视频模块
     */
    kRemoteVideoStateChangeReasonRemoteMuted = 5,
    /** {en}
     * @brief Remote user resumes sending video stream or remote user enables video module
     */
    /** {zh}
     * @brief 远端用户恢复发送视频流或远端用户启用视频模块
     */
    kRemoteVideoStateChangeReasonRemoteUnmuted = 6,
    /** {en}
     * @brief The remote user leaves the channel. State transition see `onUserUnPublishStream`.
     */
    /** {zh}
     * @brief 远端用户离开频道。
     *        状态转换参考 onStreamRemove(85533#onstreamremove)
     */
    kRemoteVideoStateChangeReasonRemoteOffline = 7
}
/** {en}
 * @brief Details of local recording
 */
/** {zh}
 * @brief 本地录制的详细信息
 */
export interface RecordingInfo {
    /** {en}
     * @brief The absolute path of the recorded file, including the file name and file suffix
     */
    /** {zh}
     * @brief 录制文件的绝对路径，包含文件名和文件后缀
     */
    file_path: string;
    /** {en}
     * @brief For the video encoding type of the recorded file.
     */
    /** {zh}
     * @brief 录制文件的视频编码类型
     */
    video_codec_type: VideoCodecType;
    /** {en}
     * @brief The width of the recorded video, in pixels. Please ignore this field for audio-only recording
     */
    /** {zh}
     * @brief 录制视频的宽，单位：像素。纯音频录制请忽略该字段
     */
    width: number;
    /** {en}
     * @brief The height of the recorded video, the unit: pixels. Please ignore this field for audio-only recording
     */
    /** {zh}
     * @brief 录制视频的高，单位：像素。纯音频录制请忽略该字段
     */
    height: number;
}
/** {en}
 * @brief Local recording progress
 */
/** {zh}
 * @brief 本地录制进度
 */
export interface RecordingProgress {
    /** {en}
     * @brief The cumulative recording time of the current file, in milliseconds
     */
    /** {zh}
     * @brief 当前文件的累计录制时长，单位：毫秒
     */
    duration: number;
    /** {en}
     * @brief The size of the currently recorded file in bytes
     */
    /** {zh}
     * @brief 当前录制文件的大小，单位：byte
     */
    file_size: number;
}
/** {en}
 * @brief User information
 */
/** {zh}
 * @region 房间管理
 * @brief 用户信息
 */
export interface RtcUser {
    /** {en}
     * @brief User ID
     */
    /** {zh}
     * @brief 用户 id
     */
    user_id: string;
    /** {en}
     * @brief Meta data
     */
    /** {zh}
     * @brief 元数据
     */
    meta_data: string;
}
/** {en}
 * @brief First frame sending state
 */
/** {zh}
 * @brief 首帧发送状态
 */
export declare enum FirstFrameSendState {
    /** {en}
     * @brief Sending.
     */
    /** {zh}
     * @brief 发送中
     */
    kFirstFrameSendStateSending = 0,
    /** {en}
     * @brief Sent.
     */
    /** {zh}
     * @brief 发送成功
     */
    kFirstFrameSendStateSent = 1,
    /** {en}
     * @brief Failed.
     */
    /** {zh}
     * @brief 发送失败
     */
    kFirstFrameSendStateEnd = 2
}
/** {en}
 * @brief First frame playback state
 */
/** {zh}
 * @brief 首帧播放状态
 */
export declare enum FirstFramePlayState {
    /** {en}
     * @brief Playing
     */
    /** {zh}
     * @brief 播放中
     */
    kFirstFramePlayStatePlaying = 0,
    /** {en}
     * @brief Play started.
     */
    /** {zh}
     * @brief 播放成功
     */
    kFirstFramePlayStatePlayed = 1,
    /** {en}
     * @brief Failed.
     */
    /** {zh}
     * @brief 播放失败
     */
    kFirstFramePlayStateEnd = 2
}
/** {zh}
 * @brief 屏幕共享参数
 */
export interface ScreenParameters {
    frame_rate: number;
    kbitrate: number;
    min_kbitrate: number;
}
/** {en}
 * @brief Mixing type
 */
/** {zh}
 * @brief 混音播放类型
 */
export declare enum AudioMixingType {
    /** {en}
     * @brief Play at the local device only
     */
    /** {zh}
     * @brief 仅本地播放
     */
    kAudioMixingTypePlayout = 0,
    /** {en}
     * @brief Send to the remote devices only
     */
    /** {zh}
     * @brief 仅远端播放
     */
    kAudioMixingTypePublish = 1,
    /** {en}
     * @brief Play and send to remote
     */
    /** {zh}
     * @brief 本地和远端同时播放
     */
    kAudioMixingTypePlayoutAndPublish = 2
}
/** {en}
 * @brief Stream fallback options of publisher
 */
/** {zh}
 * @brief 发布端音视频流回退选项
 */
export declare enum PublishFallbackOption {
    /** {en}
     * @brief Default setting. No fallback is allowed under limited network conditions.
     */
    /** {zh}
     * @brief 上行网络不佳或设备性能不足时，不对音视频流作回退处理。默认设置。
     */
    kPublishFallbackOptionDisabled = 0,
    /** {en}
     * @brief Under limited network conditions, the video streams that you published will degrade sequentially from the highest-quality stream to the lowest-quality stream until it can match current network conditions. See [Stream Fallback](https://docs.byteplus.com/byteplus-rtc/docs/70137) for details.
     */
    /** {zh}
     * @brief 上行网络不佳或设备性能不足时，发布的视频流会从大流到小流依次降级，直到与当前网络性能匹配从大流开始做降级处理，具体降级规则参看[性能回退](https://www.volcengine.com/docs/6348/70137)文档。
     */
    kPublishFallbackOptionSimulcast = 1
}
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
export declare enum RoomProfileType {
    /** {en}
     * @brief General mode by default
     */
    /** {zh}
     * @brief 普通音视频通话模式。
     *        你应在 1V1 音视频通话时，使用此设置。
     *        此设置下，弱网抗性较好。
     */
    kRoomProfileTypeCommunication = 0,
    /** {zh}
     * @deprecated since 342.1, use kRoomProfileTypeInteractivePodcast instead
     * @hidden
     * @brief 直播模式。
     *        当你对音视频通话的音质和画质要求较高时，应使用此设置。
     *        此设置下，当用户使用蓝牙耳机收听时，蓝牙耳机使用媒体模式。
     */
    kRoomProfileTypeLiveBroadcasting = 1,
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
    kRoomProfileTypeGame = 2,
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
    kRoomProfileTypeCloudGame = 3,
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
    kRoomProfileTypeLowLatency = 4,
    /** {en}
     * @brief For 1 vs 1 video and audio calls
     */
    /** {zh}
     * @brief 适用于 1 vs 1 音视频通话
     */
    kRoomProfileTypeChat = 5,
    /** {en}
     * @brief For video and audio chat rooms of 3 or more people
     */
    /** {zh}
     * @brief 适用于 3 人及以上纯语音通话
     *        音视频通话为媒体模式，上麦时切换为通话模式
     */
    kRoomProfileTypeChatRoom = 6,
    /** {en}
     * @brief For scenarios such as "Watch together." and "Listen together." Multiple clients are capable of playing the same videos and audios synchronically.
     *        In these scenarios, RTC does not involve the transportation of the sharing media but only synchronizes video/music playback across multiple clients via signaling.
     */
    /** {zh}
     * @brief 实现多端同步播放音视频，适用于 “一起看” 或 “一起听” 场景。
     *        该场景中，使用 RTC 信令同步播放进度，共享的音频内容不通过 RTC 进行传输。
     */
    kRoomProfileTypeLwTogether = 7,
    /** {en}
     * @brief For the game apps demanding high-resolution audio. In this mode, RTC plays audio using the media mode only.
     */
    /** {zh}
     * @brief 适用于对音质要求较高的游戏场景，优化音频 3A 策略，只通过媒体模式播放音频
     */
    kRoomProfileTypeGameHD = 8,
    /** {en}
     * @brief For the events of co-hosting in the live-streaming
     *        During a livestreaming using a CDN network, the host can invite another host to join the co-hosting event using RTC.
     */
    /** {zh}
     * @brief 适用于直播中主播之间连麦的业务场景。
     *        直播时通过 CDN，发起连麦 PK 时使用 RTC。
     */
    kRoomProfileTypeCoHost = 9,
    /** {en}
     * @brief For interactive podcasts that the host can have video and audio interactions with the audience. The voice mode is set to communication mode to avoid volume spiking and dipping acutely.
     */
    /** {zh}
     * @brief 适用于单主播和观众进行音视频互动的直播。通话模式，上下麦不会有模式切换，避免音量突变现象
     */
    kRoomProfileTypeInteractivePodcast = 10,
    /** {en}
     * @brief For the online karaoke with high-quality audio and low latency
     *        In these scenarios, RTC transports the accompaniment and mixed audio, such as solo and non-realtime chorus.
     */
    /** {zh}
     * @brief 线上 KTV 场景，音乐音质，低延迟
     *        使用 RTC 传输伴奏音乐，混音后的歌声，适合独唱或单通合唱
     */
    kRoomProfileTypeKTV = 11,
    /** {en}
     * @brief For the online-chorusing scenarios requiring high-quality audio and low latency. Contact our technical specialists before you apply it to your App.
     */
    /** {zh}
     * @brief 适合在线实时合唱场景，高音质，超低延迟。使用本配置前请联系技术支持进行协助完成其他配置。
     */
    kRoomProfileTypeChorus = 12,
    /** {en}
     * @hidden
     * @brief For VR chat with support for 192 KHz audio sample rate and feature of 360 Reality AudioAudio
     */
    /** {zh}
     * @hidden
     * @brief 适用于 VR 场景。支持最高 192 KHz 音频采样率，可开启球形立体声。345之后支持
     */
    kRoomProfileTypeVRChat = 13,
    /** {en}
     * @brief For scenarios of streaming live videos to only one client on the LAN. It can be applied to devices on the Internet or LAN.
     */
    /** {zh}
     * @brief 适用于 1 vs 1 游戏串流，支持公网或局域网。
     */
    kRoomProfileTypeGameStreaming = 14,
    /** {en}
     * @brief For scenarios of streaming live videos to multiple clients within the LAN with the support of 60fps @8K video stream with the bitrate of 100 Mbps
     * A private media server is expected to be ready on the LAN.
     */
    /** {zh}
     * @brief 适用于局域网的 1 对多视频直播，最高支持 8K， 60 帧/秒， 100 Mbps 码率
     *        需要在局域网配置私有化部署媒体服务器。
     */
    kRoomProfileTypeLanLiveStreaming = 15,
    /** {en}
     * @brief For meeting Apps installed on personal devices
     */
    /** {zh}
     * @brief 适用于云端会议中的个人设备
     */
    kRoomProfileTypeMeeting = 16,
    /** {en}
     * @brief For meeting Apps installed on terminals of meeting rooms, such as Rooms.
     */
    /** {zh}
     * @brief 适用于云端会议中的会议室终端设备，例如 Rooms，投屏盒子等。
     */
    kRoomProfileTypeMeetingRoom = 17,
    /** {en}
     * @brief For the online classrooms and lectures that over 10 participants in the room are allowed to join the video chat.
     */
    /** {zh}
     * @brief 适用于课堂互动，房间内所有成员都可以进行音视频互动
     *        当你的场景中需要同时互动的成员超过 10 人时使用此模式
     */
    kRoomProfileTypeClassroom = 18
}
/** {zh}
 * @brief 订阅回退选项
 */
export declare enum SubscribeFallbackOption {
    /** {zh}
     * @brief 下行网络较弱时，关闭订阅音视频流时的性能回退功能，默认值
     */
    kSubscribeFallbackOptionDisable = 0,
    /** {zh}
     * @brief 下行网络较弱时，只接收视频小流
     */
    kSubscribeFallbackOptionVideoStreamLow = 1,
    /** {zh}
     * @brief 下行网络较弱时，先尝试只接收视频小流；如果网络环境无法显示视频，则再回退到只接收远端订阅的音频流
     */
    kSubscribeFallbackOptionAudioOnly = 2
}
/** {en}
 * @brief Configuration for the room. Room is a abstract concept for an RTC call. Users can interactive with each other in the same room.
 */
/** {zh}
 * @brief 房间参数配置。房间是 RTC 通话的抽象概念。在同一个房间中的用户可以进行音视频通话。
 */
export interface RTCRoomConfig {
    /** {en}
     * @brief Room profile. The setting cannot be changed after joining the room.
     */
    /** {zh}
     * @brief 房间模式，默认为普通音视频通话模式，进房后不可更改。
     */
    room_profile_type?: RoomProfileType;
    /** {en}
     * @brief Whether to publish media streams automatically. The default is automatic publishing.
     *       Only one of the rooms the user joined can be set to auto-publish. If no settings are made in each room, the stream is automatically published in the first room joined by default.
     *        If you call [setUserVisibility](85532#setuservisibility) to set your own visibility to false, you will not publish media streams regardless of the value of `is_auto_publish`.
     */
    /** {zh}
     * @brief 是否自动发布音视频流，默认为自动发布。
     *        创建和加入多房间时，只能将其中一个房间设置为自动发布。若每个房间均不做设置，则默认在第一个加入的房间内自动发布流。
     *        若调用 [setUserVisibility](85532#setuservisibility) 将自身可见性设为 false，无论是默认的自动发布流还是手动设置的自动发布流都不会进行发布，你需要将自身可见性设为 true 后方可发布。
     */
    is_auto_publish?: boolean;
    /** {en}
     * @brief Whether to automatically subscribe to the audio stream. The default is automatic subscription. This setting affects both the main stream and the screen-sharing stream.
     */
    /** {zh}
     * @brief 是否自动订阅音频流，默认为自动订阅。包含主流和屏幕流。
     *        进房后，你可以调用 [subscribeStream](85532#subscribestream) 修改订阅设置。
     */
    is_auto_subscribe_audio?: boolean;
    /** {en}
     * @brief Whether to automatically subscribe to the main video stream. The default is automatic subscription. This setting affects both the main stream and the screen-sharing stream.
     */
    /** {zh}
     * @brief 是否自动订阅主视频流，默认为自动订阅。包含主流和屏幕流。
     *        进房后，你可以调用 [subscribeStream](85532#subscribestream) 修改订阅设置。
     */
    is_auto_subscribe_video?: boolean;
    /** {en}
     * @brief Expected configuration of remote video stream
     */
    /** {zh}
     * @brief 远端视频流参数
     */
    remote_video_config?: RemoteVideoConfig;
}
/** {zh}
 * @brief 视频订阅配置信息
 */
export interface SubscribeVideoConfig {
    /** {zh}
     * @brief 订阅的视频流分辨率下标。
     *        当远端用户通过调用 [setVideoEncoderConfig](85532#setvideoencoderconfig) 方法启动发布多路不同分辨率的视频流时，本地用户需通过此参数指定希望订阅的流。
     *        默认值为 0，即订阅第一路流。
     *        如果不想更改之前的设置，可以输入 -1。
     */
    video_index: number;
    /** {zh}
     * @brief 远端用户优先级
     * + `0`: 默认，用户优先级为低
     * + `100`: 用户优先级为正常
     * + `200`: 用户优先级为高
     */
    priority: number;
}
/** {zh}
 * @brief 是否开启镜像模式
 */
export declare enum MirrorMode {
    /** {zh}
     * @brief 不开启
     */
    kMirrorModeOff = 0,
    /** {zh}
     * @brief 开启
     */
    kMirrorModeOn = 1
}
/** {en}
 * @brief Mirror type
 */
/** {zh}
 * @brief 镜像类型
 */
export declare enum MirrorType {
    /** {en}
     * @brief The preview and the published video stream are not mirrored.
     */
    /** {zh}
     * @brief 本地预览和编码传输时均无镜像效果
     */
    kMirrorTypeNone = 0,
    /** {en}
     * @brief The preview is mirrored. The published video stream is not mirrored.
     */
    /** {zh}
     * @brief 本地预览时有镜像效果，编码传输时无镜像效果
     */
    kMirrorTypeRender = 1,
    /** {en}
     * @brief The preview and the published video stream are mirrored.
     */
    /** {zh}
     * @brief 本地预览和编码传输时均有镜像效果
     */
    kMirrorTypeRenderAndEncoder = 3
}
/** {en}
 * @brief Video/audio call test configurations
 */
/** {zh}
 * 音视频回路测试参数
 */
export interface EchoTestConfig {
    /** {en}
     * @brief Volume prompt interval in ms, the default value is 100.
     * + `<= 0`: Turn off prompt
     * + `(0,100]` Invalid interval value, and will be automatically reset to 100ms.
     * + `> 100`: the actual value of interval
     */
    /** {zh}
     * @brief 音量信息提示间隔，单位：ms，默认为 100ms
     * +`<= 0`: 关闭信息提示
     * +`(0,100]`: 开启信息提示，不合法的 interval 值，SDK 自动设置为 100ms
     * +`> 100`: 开启信息提示，并将信息提示间隔设置为此值
     */
    audioPropertiesReportInterval: number;
    /** {en}
     * @brief User ID for testing
     */
    /** {zh}
     * @brief 进行音视频通话回路测试的用户 ID
     */
    uid: string;
    /** {en}
     * @brief ID of the room that the tested user will join.
     */
    /** {zh}
     * @brief 测试用户加入的房间 ID。
     */
    roomId: string;
    /** {en}
     * @brief Token used for authenticating users when they enter the room.
     */
    /** {zh}
     * @brief 对用户进房时进行鉴权验证的动态密钥，用于保证音视频通话回路测试的安全性。
     */
    token: string;
}
/** {en}
 * @brief Pause/resume receiving the remote media stream type.
 */
/** {zh}
 * @brief 暂停/恢复接收远端的媒体流类型。
 */
export declare enum PauseResumeControlMediaType {
    /** {en}
     * @brief Audio only
     */
    /** {zh}
     * @brief 只控制音频，不影响视频
     */
    kRTCPauseResumeControlMediaTypeAudio = 0,
    /** {en}
     * @brief Video only
     */
    /** {zh}
     * @brief 只控制视频，不影响音频
     */
    kRTCPauseResumeControlMediaTypeVideo = 1,
    /** {en}
     * @brief Both video and audio
     */
    /** {zh}
     * @brief 同时控制音频和视频
     */
    kRTCPauseResumeControlMediaTypeVideoAndAudio = 2
}
/** {en}
 * @brief Mixing configuration
 */
/** {zh}
 * @brief 混音配置
 */
export interface AudioMixingConfig {
    /** {en}
     * @brief For mixing playback types.
     */
    /** {zh}
     * @brief 混音播放类型
     */
    type: AudioMixingType;
    /** {zh}
     * @brief 混音播放次数，
     * + play_count <= 0: 无限循环
     * + play_count == 1: 播放一次（默认）
     * + play_count > 1: 播放 play_count 次
     */
    play_count: number;
    /** {en}
     * @brief The position of the audio file playback progress bar during audio mixing, the parameter should be an integer, in milliseconds.
     */
    /** {zh}
     * @brief 混音时音频文件播放进度条位置，参数为整数，单位为毫秒
     */
    position: number;
    /** {en}
     * @brief Set the time interval (ms) for the audio file playing progress callback. The `onAudioMixingPlayingProgress` callback then will be triggered according to the set value, no callback by default.
     * + The value of interval is a multiple of 10 greater than 0. When the value set is not divisible by 10, the default is rounded up by 10. For example, if the value is set to 52ms, it will be automatically adjusted to 60ms, then the SDK will trigger `onAudioMixingPlayingProgress` callback at the set interval.
     * + If the value is less than or equals to 0, the callback will not be triggered.
     */
    /** {zh}
     * @brief 设置音频文件播放进度回调的时间间隔，单位毫秒，并按照设置的值触发 onAudioMixingPlayingProgress 回调，默认不回调。
     * 该值应为大于 0 的 10 的倍数，当传入的值不能被 10 整除时，则默认向上取整 10，如设为 52ms 时会默认调整为 60ms。
      传入的值小于等于 0 时，不会触发进度回调。
     */
    callback_on_progress_interval?: number;
    /** {en}
     * @brief Attach the process information of local audio file mixing to the captured audio data. Enable the function to enhance the synchronicity of the remote audio mixing.
     * @notes
     * + The function is effective when mixing a single audio file.
     * + Use `true` for enabling the function and `false` for disable the function. The default is `false`.
     */
    /** {zh}
     * @brief 在采集音频数据时，附带本地混音文件播放进度的时间戳。启用此功能会提升远端人声和音频文件混音播放时的同步效果。
     * @notes
     * + 仅在单个音频文件混音时使用有效。
     * + `true` 时开启此功能，`false` 时关闭此功能，默认为关闭。
     */
    sync_progress_to_record_frame?: boolean;
}
/** {en}
 * @brief Whether to collect mouse information when collecting screen video stream internally
 */
/** {zh}
 * @brief 内部采集屏幕视频流时，是否采集鼠标信息
 */
export declare enum MouseCursorCaptureState {
    /** {en}
     * @brief Collect mouse information
     */
    /** {zh}
     * @brief 采集鼠标信息
     */
    kMouseCursorCaptureStateOn = 0,
    /** {en}
     * @brief Do not collect mouse information
     */
    /** {zh}
     * @brief 不采集鼠标信息
     */
    kMouseCursorCaptureStateOff = 1
}
/** {en}
 * @brief Screen internal capture parameters
 */
/** {zh}
 * @brief 屏幕共享时，内部采集参数配置
 */
export interface ScreenCaptureParameters {
    /** {en}
     * @brief Collection area.
     */
    /** {zh}
     * @brief 采集区域
     */
    region_rect: Rectangle;
    /** {en}
     * @brief To collect mouse status.
     */
    /** {zh}
     * @brief 是否采集鼠标状态
     */
    capture_mouse_cursor?: MouseCursorCaptureState;
    /** {en}
     * @brief Screen filtering settings. Provide ID of the windows to be excluded.
     */
    /** {zh}
     * @brief 屏幕过滤设置，填写不需要采集的窗口 ID
     */
    filter_config: number[];
    /** {en}
     * @brief Configuration of highlighted borders
     */
    /** {zh}
     * @brief 采集区域的边框高亮设置
     */
    highlight_config: HighlightConfig;
}
/** {en}
 * @brief User info
 */
/** {zh}
 * @brief 用户信息
 */
export declare type UserInfo = {
    /** {en}
     * @brief User ID. The string matches the regular expression: `[a-zA-Z0-9_@\-\.]{1,128}`.  You must set or manage the uid yourself and ensure that each uid within the same room is unique.
     */
    /** {zh}
     * @brief 用户 ID。该字符串符合正则表达式：`[a-zA-Z0-9_@\-\.]{1,128}`。  你需要自行设置或管理 uid，并保证同一房间内每个 uid 的唯一性。
  
     */
    uid: string;
    /** {en}
     * @brief Additional information of the user. The maximum length is 200 bytes. The remote user will receive the info in [onUserJoined](85533#onuserjoined).
     */
    /** {zh}
     * @brief 用户的额外信息，最大长度为 200 字节。会在 [onUserJoined](85533#onuserjoined) 中回调给远端用户。
     */
    extra_info?: string;
};
/** {en}
 * @brief Information on remote video frame
 */
/** {zh}
 * @brief 远端视频帧信息
 */
export interface RemoteVideoConfig {
    /** {en}
     * @brief Expected maximum frame rate of the subscribed stream in px. The default value is 0, which represents full-frame-rate, values greater than 0 are valid.
     *        If the frame rate of the stream published is lower than the value you set, or if your subscribed stream falls back under limited network conditions, the frame rate you set will drop accordingly.
     *        Only valid if the stream is coded with SVC technique.
     */
    /** {zh}
     * @brief 期望订阅的最高帧率，单位：fps，默认值为 0 即满帧订阅，设为大于 0 的值时开始生效。
     *        当发布端帧率低于设定帧率，或订阅端开启性能回退后下行弱网，则帧率会相应下降。
     *        仅码流支持 SVC 分级编码特性时方可生效。
     */
    framerate?: number;
    /** {en}
     * @brief Width of the video frame in px
     */
    /** {zh}
     * @brief 视频宽度，单位：px
     */
    resolution_width?: number;
    /** {en}
     * @brief Height of the video frame in px
     */
    /** {zh}
     * @brief 视频高度，单位：px
     */
    resolution_height?: number;
}
/** {en}
 * @brief Media stream type
 */
/** {zh}
 * @brief 媒体流类型
 */
export declare enum MediaStreamType {
    /** {en}
     * @brief Audio only
     */
    /** {zh}
     * @brief 只控制音频
     */
    kMediaStreamTypeAudio = 1,
    /** {en}
     * @brief Video only
     */
    /** {zh}
     * @brief 只控制视频
     */
    kMediaStreamTypeVideo = 2,
    /** {en}
     * @brief Both audio and video
     */
    /** {zh}
     * @brief 同时控制音频和视频
     */
    kMediaStreamTypeBoth = 3
}
/** {en}
 * @brief Basic beauty effect.
 */
/** {zh}
 * @brief 基础美颜模式
 */
export declare enum EffectBeautyMode {
    /** {en}
     * @brief Brightness.
     */
    /** {zh}
     * @brief 美白
     */
    kEffectBeautyWhite = 0,
    /** {en}
     * @brief Smoothness.
     */
    /** {zh}
     * @brief 磨皮
     */
    kEffectBeautySmooth = 1,
    /** {en}
     * @brief Sharpness.
     */
    /** {zh}
     * @brief 锐化
     */
    kEffectBeautySharpen = 2
}
/** {en}
 * @brief Mix playback channel type
 */
/** {zh}
 * @brief 混音播放声道类型
 */
export declare enum AudioMixingDualMonoMode {
    /** {en}
     * @brief Consistent with audio files
     */
    /** {zh}
     * @brief 和音频文件一致
     */
    kAudioMixingDualMonoModeAuto = 0,
    /** {en}
     * @brief Only the left channel audio in the audio file can be heard
     */
    /** {zh}
     * @brief 只能听到音频文件中左声道的音频
     */
    kAudioMixingDualMonoModeL = 1,
    /** {en}
     * @brief Only the right channel audio in the audio file can be heard
     */
    /** {zh}
     * @brief 只能听到音频文件中右声道的音频
     */
    kAudioMixingDualMonoModeR = 2,
    /** {en}
     * @brief Can hear the left and right audio channels in the audio file at the same time
     */
    /** {zh}
     * @brief 能同时听到音频文件中左右声道的音频
     */
    kAudioMixingDualMonoModeMix = 3
}
/** {en}
 * @brief RTM message
 */
/** {zh}
 * @brief 发送消息的可靠有序性
 */
export declare enum MessageConfig {
    /** {en}
     * @brief Low latency reliable and orderly message
     */
    /** {zh}
     * @brief 低延时可靠有序消息
     */
    kMessageConfigReliableOrdered = 0,
    /** {en}
     * @brief Ultra-low latency ordered message
     */
    /** {zh}
     * @brief 超低延时有序消息
     */
    kMessageConfigUnreliableOrdered = 1,
    /** {en}
     * @brief Ultra-low latency unordered message
     */
    /** {zh}
     * @brief 超低延时无序消息
     */
    kMessageConfigUnreliableUnordered = 2
}
/** {en}
 * @brief A/V synchronization states
 */
/** {zh}
 * @brief 音视频同步状态
 */
export declare enum AVSyncState {
    /** {en}
     * @brief A/V synchronization begins.
     */
    /** {zh}
     * @brief 音视频开始同步
     */
    kAVSyncStateAVStreamSyncBegin = 0,
    /** {en}
     * @brief The publisher stops publishing audio stream during the synchronization, which does not affect the sync relationship.
     */
    /** {zh}
     * @brief 音视频同步过程中音频移除，但不影响当前的同步关系
     */
    kAVSyncStateAudioStreamRemove = 1,
    /** {en}
     * @brief The publisher stops publishing audio stream during the synchronization, which does not affect the sync relationship.
     */
    /** {zh}
     * @brief 音视频同步过程中视频移除，但不影响当前的同步关系
     */
    kAVSyncStateVdieoStreamRemove = 2,
    /** {en}
     * @hidden
     * @brief Subscriber settings synchronization
     */
    /** {zh}
     * @hidden
     * @brief 订阅端设置同步
     */
    kAVSyncStateSetAVSyncStreamId = 3
}
/** {en}
 * @brief The state of the relaying for each room
 */
/** {zh}
 * @brief 跨房间转发媒体流过程中的不同目标房间的状态和错误信息
 */
export declare enum ForwardStreamState {
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
    kForwardStreamStateIdle = 0,
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
    kForwardStreamStateSuccess = 1,
    /** {en}
     * @brief Relay fails. Refer to [ForwardStreamError](85534#forwardstreamerror) for more information for more information.
     *        Once the relaying fails, state of the room turns to this state after calling `startForwardStreamToRooms` or `updateForwardStreamToRooms`.
     */
    /** {zh}
     * @brief 转发失败，失败详情参考 [ForwardStreamError](85534#forwardstreamerror)
     *        调用 `startForwardStreamToRooms` 或 `updateForwardStreamToRooms` 后，如遇转发失败，返回此状态。
     */
    kForwardStreamStateFailure = 2
}
/** {en}
 * @detail 85534
 * @brief Error codes during the relaying
 */
/** {zh}
 * @detail 85534
 * @brief 媒体流跨房间转发过程中抛出的错误码
 */
export declare enum ForwardStreamError {
    /** {en}
     * @brief Normal
     */
    /** {zh}
     * @brief 正常
     */
    kForwardStreamErrorOK = 0,
    /** {en}
     * @brief Invalid argument
     */
    /** {zh}
     * @brief 参数异常
     */
    kForwardStreamErrorInvalidArgument = 1201,
    /** {en}
     * @brief Invalid token
     */
    /** {zh}
     * @brief token 错误
     */
    kForwardStreamErrorInvalidToken = 1202,
    /** {en}
     * @brief Error returning from server
     */
    /** {zh}
     * @brief 服务端异常
     */
    kForwardStreamErrorResponse = 1203,
    /** {en}
     * @brief Relaying aborts for the reason of that a User with the same user ID as that of the publisher joins.
     */
    /** {zh}
     * @brief 目标房间有相同 user id 的用户加入，转发中断
     */
    kForwardStreamErrorRemoteKicked = 1204,
    /** {en}
     * @brief Server denies.
     */
    /** {zh}
     * @brief 服务端不支持转发功能
     */
    kForwardStreamErrorNotSupport = 1205
}
/** {en}
 * @brief State and error for each room during relaying
 */
/** {zh}
 * @brief 跨房间转发媒体流过程中的不同目标房间的状态和错误信息
 */
export interface ForwardStreamStateInfo {
    /** {en}
     * @brief ID of the room where the media stream aims to relay to
     *        An Empty string is for all rooms.
     */
    /** {zh}
     * @brief 跨房间转发媒体流过程中目标房间 ID
     *        空字符串代表所有目标房间
     */
    room_id: string;
    /** {en}
     * @brief State of the room during relaying.
     */
    /** {zh}
     * @brief 跨房间转发媒体流过程中该目标房间的状态、
     */
    state: ForwardStreamState;
    /** {en}
     * @brief Error code from the room during relaying.
     */
    /** {zh}
     * @brief 跨房间转发媒体流过程中该目标房间抛出的错误码
     */
    error: ForwardStreamError;
}
/** {en}
 * @brief Information of the rooms where you want to relay the media stream to
 */
/** {zh}
 * @brief 媒体流跨房间转发的目标房间的相关信息
 */
export interface ForwardStreamInfo {
    /** {en}
     * @brief RoomId and UserId are required to generate the Token to forward media streams to the room.
     *        During developing and testing, you can use temporary tokens generated on the console. At the production stage, Tokens are generated by the token generating application deployed on your server.
     *        Forwarding will fail if the token is invalid.
     */
    /** {zh}
     * @brief 使用转发目标房间 RoomID 和 UserID 生成 Token。
     *        测试时可使用控制台生成临时 Token，正式上线需要使用密钥 SDK 在你的服务端生成并下发 Token。
     *        如果 Token 无效，转发失败。
     */
    token: string;
    /** {en}
     * @brief ID of the room where the media stream aims to relay to
     */
    /** {zh}
     * @brief 跨房间转发媒体流过程中目标房间 ID
     */
    room_id: string;
}
/** {en}
 * @brief Information of the rooms where you want to relay the media stream to
 */
/** {zh}
 * @brief 媒体流跨房间转发的目标房间的相关信息
 */
export interface ForwardStreamConfiguration {
    /** {en}
     * @brief Information of the rooms where you want to relay the media stream to
     */
    /** {zh}
     * @brief 目标房间信息，数组中的每个元素包含一个房间的信息。
     */
    forward_stream_dests: ForwardStreamInfo[];
}
/** {en}
 * @brief Events during the relaying
 */
/** {zh}
 * @brief 媒体流跨房间转发事件
 */
export declare enum ForwardStreamEvent {
    /** {en}
     * @brief Relaying pauses for the reason of network disconnecting.
     */
    /** {zh}
     * @brief 本端与服务器网络连接断开，暂停转发。
     */
    kForwardStreamEventDisconnected = 0,
    /** {en}
     * @brief Relaying recovers from the disconnecting.
     */
    /** {zh}
     * @brief 本端与服务器网络连接恢复，转发服务连接成功。
     */
    kForwardStreamEventConnected = 1,
    /** {en}
     * @brief Relaying aborts for the reason of that a User with the same user ID as that of the publisher joins.
     */
    /** {zh}
     * @brief 转发中断。转发过程中，如果相同 user_id 的用户进入目标房间，转发中断。
     */
    kForwardStreamEventInterrupt = 2,
    /** {en}
     * @brief Target room list updates after you call `updateForwardStreamToRooms`.
     */
    /** {zh}
     * @brief 目标房间已更新，由 `updateForwardStreamToRooms` 触发。
     */
    kForwardStreamEventDstRoomUpdated = 3,
    /** {en}
     * @brief Wrong API-calling order. For example, call `updateForwardStreamToRooms` before calling `startForwardStreamToRooms`.
     */
    /** {zh}
     * @brief API 调用时序错误。例如，在调用 `startForwardStreamToRooms` 之前调用 `updateForwardStreamToRooms` 。
     */
    kForwardStreamEventUnExpectAPICall = 4
}
/** {en}
 * @brief Event from each room during relaying
 */
/** {zh}
 * @brief 跨房间转发媒体流过程中的不同目标房间发生的事件
 */
export interface ForwardStreamEventInfo {
    /** {en}
     * @brief ID of the room where the media stream aims to relay to
     *        An Empty string is for all rooms.
     */
    /** {zh}
     * @brief 跨房间转发媒体流过程中的发生该事件的目标房间 ID
     *        空字符串代表所有目标房间
     */
    room_id: string;
    /** {en}
     * @brief Event from the room during relaying.
     */
    /** {zh}
     * @brief 跨房间转发媒体流过程中该目标房间发生的事件
     */
    event: ForwardStreamEvent;
}
/** {en}
 * @brief Tx/Rx network quality
 */
/** {zh}
 * @brief 上行/下行网络质量
 */
export interface NetworkQualityStats {
    /** {en}
     * @brief User ID
     */
    /** {zh}
     * @brief 用户 id
     */
    uid: string;
    /** {en}
     * @brief Packet loss ratio of the local client, ranging [0.0,1.0]
     *        For a local user, it is the sent-packet loss ratio.
     *        For a remote user, it is the loss ratio of all the packets received.
     */
    /** {zh}
     * @brief 本端的上行/下行的丢包率，范围 [0.0,1.0]
     *        当 `uid` 为本地用户时，代表发布流的上行丢包率。
     *        当 `uid` 为远端用户时，代表接收所有订阅流的下行丢包率。
     */
    fraction_lost: number;
    /** {en}
     * @brief Round-trip time (RTT) from client to server. Effective for the local user. Unit: ms
     */
    /** {zh}
     * @brief 当 `uid` 为本地用户时有效，客户端到服务端的往返延时（RTT），单位：ms
     */
    rtt: number;
    /** {en}
     * @brief Rx network quality grade.
     */
    /** {zh}
     * @brief 下行网络质量分。范围 [0,5]，分数越高网络质量越差。
     */
    rx_quality: NetworkQuality;
    /** {en}
     * @brief Average transmission rate of the media RTP packages in 2s. unit: bps
     *        For a local user, it is the packet-transmitting speed.
     *        For a more user, it is the speed of receiving all the subsribed media.
     */
    /** {zh}
     * @brief 本端的音视频 RTP 包 2 秒内的平均传输速率，单位：bps
     *        当 `uid` 为本地用户时，代表发送速率。
     *        当 `uid` 为远端用户时，代表所有订阅流的接收速率。
     */
    total_bandwidth: number;
    /** {en}
     * @brief Rx network quality grade.
     */
    /** {zh}
     * @brief 上行网络质量分。范围 [0,5]，分数越高网络质量越差。
     */
    tx_quality: NetworkQuality;
}
/** {en}
 * @brief The range where local user can hear audio with attenuation effect.
 */
/** {zh}
 * @brief 本地用户能收听到、且具有衰减效果的音频接收范围
 */
export declare type ReceiveRange = {
    /** {en}
     * @brief The minimum distance at which the local user can hear the attenuated audio from remote users.
     *        The value must be ≥ 0, but ≤ max.
     *        No attenuation effect for audio from distances less than this value you set.
     */
    /** {zh}
     * @brief 能够收听语音的最大距离值，该值须 > 0 且 ≥ min。
     *        当收听者和声源距离处于 [min, max) 之间时，收听到的音量根据距离呈衰减效果。
     *        超出该值范围的音频将无法收听到。
     */
    max: number;
    /** {en}
     * @brief The maximum distance at which the local user can hear audio from remote users.
     *        The value must be ≥ min, and > 0.
     *        Audio from distances larger than the value you set cannot be heard.
     */
    /** {zh}
     * @brief 能够接收语音、并且具有衰减效果的最小距离值，该值须 ≥ 0，但 ≤ max。
     *        小于该值的范围内没有范围语音效果，即收听到的音频音量相同。
     */
    min: number;
};
/** {en}
 * @brief Coordinate value of the local user's position in the rectangular coordinate system in the RTC room.
 */
/** {zh}
 * @brief 本地用户在房间内的位置坐标，需自行建立空间直角坐标系
 */
export declare type Position = {
    /** {en}
     * @brief X-coordinate
     */
    /** {zh}
     * @brief x 坐标
     */
    x: number;
    /** {en}
     * @brief Y-coordinate
     */
    /** {zh}
     * @brief y 坐标
     */
    y: number;
    /** {en}
     * @brief Z-coordinate
     */
    /** {zh}
     * @brief z 坐标
     */
    z: number;
};
/** {en}
 * @brief Volume Roll-off modes that a sound has in an audio source
 */
/** {zh}
 * @brief 空间音频音量随距离衰减模式
 */
export declare enum AttenuationType {
    /** {en}
     * @brief Disable Volume Attenuation
     */
    /** {zh}
     * @brief 不随距离衰减
     */
    kAttenuationTypeNone = 0,
    /** {en}
     * @brief Linear roll-off mode which lowers the volume of the sound over the distance
     */
    /** {zh}
     * @brief 线性衰减，音量随距离增大而线性减小
     */
    kAttenuationTypeLinear = 1,
    /** {en}
     * @brief Exponential roll-off mode which exponentially decreases the volume of the sound with the distance raising
     */
    /** {zh}
     * @brief 指数型衰减，音量随距离增大进行指数衰减
     */
    kAttenuationTypeExponential = 2
}
/** {en}
 * @brief Orientation
 */
/** {zh}
 * @brief 方向朝向信息
 */
export interface Orientation {
    /** {en}
     * @brief The angle the vector makes with the x-axis
     */
    /** {zh}
     * @brief x 方向向量
     */
    x: number;
    /** {en}
     * @brief The angle the vector makes with the y-axis
     */
    /** {zh}
     * @brief y 方向向量
     */
    y: number;
    /** {en}
     * @brief The angle the vector makes with the z-axis
     */
    /** {zh}
     * @brief z 方向向量
     */
    z: number;
}
/** {en}
 * @brief Three-dimensional orientation information, each pair of vectors need to be perpendicular.
 */
/** {zh}
 * @brief 三维朝向信息，三个向量需要两两垂直。
 */
export interface HumanOrientation {
    /** {en}
     * @brief Forward orientation, the default value is {1,0,0}, i.e., the forward orientation is in the positive direction of x-axis.
     */
    /** {zh}
     * @brief 正前方朝向，默认值为 {1,0,0}，即正前方朝向 x 轴正方向
     */
    forward: Orientation;
    /** {en}
     * @brief Rightward orientation, the default value is {0,1,0}, i.e., the rightward orientation is in the positive direction of y-axis.
     */
    /** {zh}
     * @brief 正右方朝向，默认值为 {0,1,0}，即右手朝向 y 轴正方向
     */
    right: Orientation;
    /** {en}
     * @brief Upward orientation, the default value is {0,0,1}, i.e., the upward orientation is in the positive direction of z-axis.
     */
    /** {zh}
     * @brief 正上方朝向，默认值为 {0,0,1}，即头顶朝向 z 轴正方向
     */
    up: Orientation;
}
/** {en}
 * @brief Encoder preference
 */
/** {zh}
 * @brief 编码策略偏好
 */
export declare enum VideoEncodePreference {
    /** {en}
     * @brief No preference
     */
    /** {zh}
     * @brief 无偏好
     */
    kVideoEncodePreferenceDisabled = 0,
    /** {en}
     * @brief Frame rate first
     */
    /** {zh}
     * @brief 帧率优先
     */
    kVideoEncodePreferenceFramerate = 1,
    /** {en}
     * @brief Quality first
     */
    /** {zh}
     * @brief 质量优先
     */
    kVideoEncodePreferenceQuality = 2,
    /** {en}
     * @brief Balancing quality and frame rate
     */
    /** {zh}
     * @brief 平衡质量与帧率
     */
    kVideoEncodePreferenceBalance = 3
}
/** {en}
 * @brief Video capture preference
 */
/** {zh}
 * @brief 视频采集配置
 */
export declare enum CapturePreference {
    /** {en}
     * @brief (Default) Video capture preference: auto
     *        SDK determines the best video capture parameters referring to the camera output parameters and the encoder configuration.
     */
    /** {zh}
     * @brief （默认）自动设置采集参数。
     *        SDK在开启采集时根据服务端下发的采集配置结合编码参数设置最佳采集参数。
     */
    KAuto = 0,
    /** {en}
     * @brief Video capture preference: manual
     *        Set the resolution and the frame rate manually.
     */
    /** {zh}
     * @brief 手动设置采集参数，包括采集分辨率、帧率。
     */
    KManual = 1,
    /** {en}
     * @brief Video capture preference: encoder configuration
     *        The capture parameters are the same with the parameters set in [setVideoEncoderConfig](85532#setvideoencoderconfig).
     */
    /** {zh}
     * @brief 采集参数与编码参数一致，即在 [setVideoEncoderConfig](85532#setvideoencoderconfig) 中设置的参数。
     */
    KAutoPerformance = 2
}
/** {en}
 * @brief Video capture configuration parameters.
 */
/** {zh}
 * @brief 视频采集配置
 */
export declare type VideoCaptureConfig = {
    /** {en}
     * @brief Video capture preference
     */
    /** {zh}
     * @brief 视频采集模式
     */
    capturePreference?: CapturePreference;
    /** {en}
     * @brief The width of video capture resolution in px.
     */
    /** {zh}
     * @brief 视频采集分辨率的宽度，单位：px。
     */
    width?: number;
    /** {en}
     * @brief The height of video capture resolution in px.
     */
    /** {zh}
     * @brief 视频采集分辨率的高度，单位：px。
     */
    height?: number;
    /** {en}
     * @brief Video capture frame rate in fps.
     */
    /** {zh}
     * @brief 视频采集帧率，单位：fps。
     */
    frameRate?: number;
};
/** {en}
 * @brief Watermark configurations
 */
/** {zh}
 * @brief 水印参数
 */
export interface RTCWatermarkConfig {
    /** {en}
     * @brief Whether the watermark is visible in preview. Its default value is `true`.
     */
    /** {zh}
     * @brief 水印是否在视频预览中可见，默认可见。
     */
    visibleInPreview?: boolean;
    /** {en}
     * @brief Watermark's coordinates and size in landscape mode.
     */
    /** {zh}
     * @brief 横屏时的水印位置和大小
     */
    positionInLandscapeMode: ByteWatermark;
    /** {en}
     * @brief Watermark's coordinates and size in portrait mode.
     */
    /** {zh}
     * @brief 视频编码的方向模式为竖屏时的水印位置和大小
     */
    positionInPortraitMode: ByteWatermark;
}
/** {en}
 * @brief Watermark's scaled coordinates and size, relative to the video stream.
 */
/** {zh}
 * @brief 水印图片相对视频流的位置和大小。
 */
export interface ByteWatermark {
    /** {en}
     * @brief The watermark's horizontal offset from the upper left corner of the video stream to the video stream's width in range of [0,1).
     */
    /** {zh}
     * @brief 水印图片相对视频流左上角的横向偏移与视频流宽度的比值，取值范围为 [0,1)。
     */
    x: number;
    /** {en}
     * @brief The watermark's vertical offset from the upper left corner of the video stream to the video stream's width in range of [0,1).
     */
    /** {zh}
     * @brief 水印图片相对视频流左上角的纵向偏移与视频流高度的比值，取值范围为 [0,1)。
     */
    y: number;
    /** {en}
     * @brief The watermark's vertical offset from the upper left corner of the video stream to the video stream's height in range of [0,1).
     */
    /** {zh}
     * @brief 水印图片宽度与视频流宽度的比值，取值范围 [0,1)。
     */
    width: number;
    /** {en}
     * @brief The watermark's width to the video stream's width in range of [0,1).
     */
    /** {zh}
     * @brief 水印图片高度与视频流高度的比值，取值范围为 [0,1)。
     */
    height: number;
}
/** {en}
 * @brief  Performance fallback related data
 */
/** {zh}
 * @brief 性能回退相关数据
 */
export interface SourceWantedData {
    /** {en}
     * @brief When the release rollback is not turned on, this value represents the recommended video input width. When the rollback mode is the large and small stream mode, it represents the maximum width of the current push stream
     *        If the send performance rollback is not turned on, this value represents the recommended Video input width;
     *        If the send performance rollback is turned on, this value represents the maximum width of the current push stream.
     */
    /** {zh}
     * @brief 未开启发布回退时，此值表示推荐的视频输入宽度，当回退模式为大小流模式时，表示当前推流的最大宽度
     *        如果未开启发送性能回退，此值表示推荐的视频输入宽度；
     *        如果开启了发送性能回退，此值表示当前推流的最大宽度。
     */
    width: number;
    /** {en}
     * @brief If send performance fallback is not turned on, this value represents the recommended video input height;
     *        If send performance fallback is turned on, this value represents the maximum height of the current push stream.
     */
    /** {zh}
     * @brief 如果未开启发送性能回退，此值表示推荐的视频输入高度；
     *        如果开启了发送性能回退，此值表示当前推流的最大高度。
     */
    heigth: number;
    /** {en}
     * @brief If send performance fallback is not turned on, this value represents the recommended video input frame rate in fps;
     *         If send performance fallback is turned on, this value represents the maximum frame rate of the current push stream in fps.
     */
    /** {zh}
     * @brief 如果未开启发送性能回退，此值表示推荐的视频输入帧率，单位 fps；
     *        如果开启了发送性能回退，此值表示当前推流的最大帧率，单位 fps。
     */
    frame_rate: number;
}
/** {en}
 * @brief Call test result
 */
/** {zh}
 * @brief 音视频回路测试结果
 */
export declare enum EchoTestResult {
    /** {en}
     * @brief The playback of captured audio/video is received, test succeeds.
     */
    /** {zh}
     * @brief 接收到采集的音视频的回放，通话回路检测成功
     */
    kTestSuccess = 0,
    /** {en}
     * @brief Test is not completed after 60 seconds and has been stopped automatically.
     */
    /** {zh}
     * @brief 测试超过 60s 仍未完成，已自动停止
     */
    kTestTimeout = 1,
    /** {en}
     * @brief Less than 5s between the end of the last test and the start of the next test.
     */
    /** {zh}
     * @brief 上一次测试结束和下一次测试开始之间的时间间隔少于 5s
     */
    kTestIntervalShort = 2,
    /** {en}
     * @brief Audio capture error
     */
    /** {zh}
     * @brief 音频采集异常
     */
    kAudioDeviceError = 3,
    /** {en}
     * @brief Video capture error
     */
    /** {zh}
     * @brief 视频采集异常
     */
    kVideoDeviceError = 4,
    /** {en}
     * @brief Audio reception error
     */
    /** {zh}
     * @brief 音频接收异常
     */
    kAudioReceiveError = 5,
    /** {en}
     * @brief Video reception error
     */
    /** {zh}
     * @brief 视频接收异常
     */
    kVideoReceiveError = 6,
    /** {en}
     * @brief Unrecoverable internal error
     */
    /** {zh}
     * @brief 内部错误，不可恢复
     */
    kInternalError = 7
}
/** {en}
 * @brief The volume callback modes.
 */
/** {zh}
 * @brief 音量回调模式。
 */
export declare enum AudioReportMode {
    /** {en}
     * @brief Always-on(Default).
     */
    /** {zh}
     * @brief 默认始终开启音量回调。
     */
    kAudioReportModeNormal = 0,
    /** {en}
     * @brief After visibly joining a room and unpublish your streams, disable the volume callback.
     */
    /** {zh}
     * @brief 可见用户进房并停止推流后，关闭音量回调。
     */
    kAudioReportModeDisconnect = 1,
    /** {en}
     * @brief After visibly joining a room and unpublish your streams, enable the volume callback. The volume is reset to 0.
     */
    /** {zh}
     * @brief 可见用户进房并停止推流后，开启音量回调，回调值重置为0。
     */
    kAudioReportModeReset = 2
}
/** {en}
 * @brief Configuration of whether including locally mixed audio info in the audio properties report.
 */
/** {zh}
 * @brief 音频信息提示中是否包含本地混音音频数据。
 */
export declare enum AudioPropertiesMode {
    /** {en}
     * @brief Only locally captured microphone audio info and locally captured screen audio info are included in the audio properties report.
     */
    /** {zh}
     * @brief 音频信息提示中，仅包含本地麦克风采集的音频数据和本地屏幕音频采集数据。
     */
    kAudioPropertiesModeMicrophone = 0,
    /** {en}
     * @brief Locally mixing audio info is included in the audio properties report, in addition to locally captured microphone audio info and locally captured screen audio info.
     */
    /** {zh}
     * @brief 音频信息提示中，除本地麦克风采集的音频数据和本地屏幕音频采集数据外，还包含本地混音的音频数据。
     */
    kAudioPropertiesModeAudioMixing = 1
}
/** {en}
 * @brief Configuration for audio property prompt.
 */
/** {zh}
 * @brief 音频属性信息提示的相关配置。
 */
export interface AudioPropertiesConfig {
    /** {en}
     * @brief Prompt interval in ms
     * + `<= 0`: Turn off prompt
     * + `(0,100]`: Invalid interval value, and will be automatically reset to 100ms.
     * + `> 100`: the actual value of interval
     */
    /** {zh}
     * @brief 信息提示间隔，单位：ms
     *       + `<= 0`: 关闭信息提示
     *       + `(0,100]`: 开启信息提示，不合法的 interval 值，SDK 自动设置为 100ms
     *       + `> 100`: 开启信息提示，并将信息提示间隔设置为此值
     */
    interval: number;
    /** {en}
     * @brief Whether to enable audio spectrum detection.
     */
    /** {zh}
     * @brief 是否开启音频频谱检测。
     */
    enable_spectrum?: boolean;
    /** {en}
     * @brief Whether to enable Voice Activity Detection.
     */
    /** {zh}
     * @brief 是否开启人声检测 (VAD)。
     */
    enable_vad?: boolean;
    /** {en}
     * @brief The volume callback modes.
     */
    /** {zh}
     * @brief 音量回调配置模式。
     */
    local_main_report_mode?: AudioReportMode;
    /** {en}
     * @brief Configuration of whether including locally mixed audio info in [`onLocalAudioPropertiesReport`](85533#onlocalaudiopropertiesreport).
     *        Locally captured microphone audio info and locally captured screen audio info are included by default.
     */
    /** {zh}
     * @brief 设置 [`onLocalAudioPropertiesReport`](85533#onlocalaudiopropertiesreport) 回调中是否包含本地混音音频数据。
     *        默认仅包含本地麦克风采集的音频数据和本地屏幕音频采集数据。
     */
    audio_report_mode?: AudioPropertiesMode;
    /** {en}
     * @brief The smoothing coefficient for audio attribute information prompt. The range is `(0.0, 1.0]`.
     *        The default value is `1.0`, which means the smoothing effect is off by default. Smaller the value, smoother the audio volume prompt. If you want to enable the smooth effect, the recommended value is `0.3`.
     */
    /** {zh}
     * @brief 适用于音频属性信息提示的平滑系数。取值范围是 `(0.0, 1.0]`。
     *        默认值为 `1.0`，不开启平滑效果；值越小，提示音量平滑效果越明显。如果要开启平滑效果，可以设置为 `0.3`。
     */
    smooth?: number;
}
/** {en}
 * @brief Audio track type of the KTV player.
 */
/** {zh}
 * @brief 原唱伴唱类型。
 */
export declare enum AudioTrackType {
    /** {en}
     * @brief Play the original music with vocals.
     */
    /** {zh}
     * @brief 播放原唱。
     */
    kOriginal = 1,
    /** {en}
     * @brief Play the instrumental music without vocals.
     */
    /** {zh}
     * @brief 播放伴唱。
     */
    kAccompy = 2
}
/** {en}
 * @brief Audio play type.
 */
/** {zh}
 * @brief 音乐播放类型。
 */
export declare enum AudioPlayType {
    /** {en}
     * @brief Only play on the local side.
     */
    /** {zh}
     * @brief 仅本地播放。
     */
    kLocal = 0,
    /** {en}
     * @brief Only play on the remote side.
     */
    /** {zh}
     * @brief 仅远端播放。
     */
    kRemote = 1,
    /** {en}
     * @brief Play on the local and remote side.
     */
    /** {zh}
     * @brief 本地、远端同时播放。
     */
    kLocalAndRemote = 2
}
/** {en}
 * @brief The lyrics file's format.
 */
/** {zh}
 * @brief 歌词文件类型。
 */
export declare enum DownloadLyricType {
    /** {en}
     * @brief KRC lyrics file.
     */
    /** {zh}
     * @brief KRC 歌词文件。
     */
    kKRC = 0,
    /** {en}
     * @brief LRC lyrics file.
     */
    /** {zh}
     * @brief LRC 歌词文件。
     */
    kLRC = 1
}
/** {en}
 * @hidden
 * @brief KTV error code.
 */
/** {zh}
 * @detail 85534
 * @brief KTV 错误码。
 */
export declare enum KTVErrorCode {
    /** {en}
     * @brief Success.
     */
    /** {zh}
     * @brief 成功。
     */
    kKTVErrorCodeOK = 0,
    /** {en}
     * @brief Invalid AppID.
     */
    /** {zh}
     * @brief AppID 异常。
     */
    kKTVErrorCodeAppidInValid = -3000,
    /** {en}
     * @brief Invalid parameter.
     */
    /** {zh}
     * @brief 非法参数，传入的参数不正确。
     */
    kKTVErrorCodeParasInValid = -3001,
    /** {en}
     * @brief Failed to get music resources.
     */
    /** {zh}
     * @brief 获取歌曲资源失败。
     */
    kKTVErrorCodeGetMusicFailed = -3002,
    /** {en}
     * @brief Failed to get lyrics.
     */
    /** {zh}
     * @brief 获取歌词失败。
     */
    kKTVErrorCodeGetLyricFailed = -3003,
    /** {en}
     * @brief The music is removed.
     */
    /** {zh}
     * @brief 歌曲下架。
     */
    kKTVErrorCodeMusicTakedown = -3004,
    /** {en}
     * @brief Failed to download the music file.
     */
    /** {zh}
     * @brief 歌曲文件下载失败。
     */
    kKTVErrorCodeMusicDownload = -3005,
    /** {en}
     * @brief Failed to download the MIDI file.
     */
    /** {zh}
     * @brief MIDI 文件下载失败。
     */
    kKTVErrorCodeMidiDownloadFailed = -3006,
    /** {en}
     * @brief The system is busy.
     */
    /** {zh}
     * @brief 系统繁忙。
     */
    kKTVErrorCodeSystemBusy = -3007,
    /** {en}
     * @brief Network anomaly.
     */
    /** {zh}
     * @brief 网络异常。
     */
    kKTVErrorCodeNetwork = -3008,
    /** {en}
     * @brief The KTV feature is not added to the room.
     */
    /** {zh}
     * @brief KTV 功能未加入房间。
     */
    kKTVErrorCodeNotJoinRoom = -3009,
    /** {en}
     * @brief Failed to parse data.
     */
    /** {zh}
     * @brief 解析数据失败。
     */
    kKTVErrorCodeParseData = -3010,
    /** {en}
     * @brief Failed to download.
     */
    /** {zh}
     * @brief 下载失败。
     */
    kKTVErrorCodeDownload = -3011,
    /** {en}
     * @brief Already downloading.
     */
    /** {zh}
     * @brief 已在下载中。
     */
    kKTVErrorCodeDownloading = -3012,
    /** {en}
     * @brief Internal error. Contact the technical support representatives for help.
     */
    /** {zh}
     * @brief 内部错误，联系技术支持人员。
     */
    kKTVErrorCodeInternalDomain = -3013,
    /**
     * @brief 下载失败，磁盘空间不足。清除缓存后重试。
     */
    kKTVErrorCodeInsufficientDiskSpace = -3014,
    /**
     * @brief 下载失败，音乐文件解密失败，联系技术支持人员。
     */
    kKTVErrorCodeMusicDecryptionFailed = -3015,
    /**
     * @brief 下载失败，音乐文件重命名失败，请重试。
     */
    kKTVErrorCodeFileRenameFailed = -3016,
    /**
     * @brief 下载失败，下载超时，请重试。
     */
    kKTVErrorCodeDownloadTimeOut = -3017,
    /**
     * @brief 清除缓存失败，可能原因是文件被占用或者系统异常，请重试。
     */
    kKTVErrorCodeClearCacheFailed = -3018,
    /**
     * @brief 取消下载。
     */
    kKTVErrorCodeDownloadCanceled = -3019
}
/** {en}
 * @brief The lyrics type.
 */
/** {zh}
 * @brief 歌词格式类型。
 */
export declare enum LyricStatus {
    /** {en}
     * @brief No lyrics.
     */
    /** {zh}
     * @brief 无歌词。
     */
    kNone = 0,
    /** {en}
     * @brief KRC lyrics.
     */
    /** {zh}
     * @brief KRC 歌词。
     */
    kKRC = 1,
    /** {en}
     * @brief LRC lyrics.
     */
    /** {zh}
     * @brief LRC 歌词。
     */
    kLRC = 2,
    /** {en}
     * @brief KRC and LRC lyrics.
     */
    /** {zh}
     * @brief KRC 歌词和 LRC 歌词均有。
     */
    kKRCAndLRC = 3
}
/** {en}
 * @brief Music information.
 */
/** {zh}
 * @brief 歌曲数据。
 */
export interface MusicInfo {
    /** {en}
     * @brief Music ID.
     */
    /** {zh}
     * @brief 音乐 ID。
     */
    music_id: string;
    /** {en}
     * @brief Music name.
     */
    /** {zh}
     * @brief 音乐名称。
     */
    music_name: string;
    /** {en}
     * @brief Singer.
     */
    /** {zh}
     * @brief 歌手。
     */
    singer: string;
    /** {en}
     * @brief Vendor ID.
     */
    /** {zh}
     * @brief 版权商 ID。
     */
    vendor_id: string;
    /** {en}
     * @brief Vendor name.
     */
    /** {zh}
     * @brief 版权商名称。
     */
    vendor_name: string;
    /** {en}
     * @brief Latest update timestamp in milliseconds.
     */
    /** {zh}
     * @brief 最新更新时间戳，单位为毫秒。
     */
    update_timestamp: number;
    /** {en}
     * @brief The URL of the music cover.
     */
    /** {zh}
     * @brief 封面地址。
     */
    poster_url: string;
    /** {en}
     * @brief The lyrics type.
     */
    /** {zh}
     * @brief 歌词格式类型。
     */
    lyric_status: LyricStatus;
    /** {en}
     * @brief The length of the song in milliseconds.
     */
    /** {zh}
     * @brief 歌曲长度，单位为毫秒。
     */
    duration: number;
    /** {en}
     * @brief Whether the song supports scoring.
     */
    /** {zh}
     * @brief 歌曲是否支持打分。
     */
    enable_score: boolean;
    /** {en}
     * @brief The starting time of the climax part in milliseconds.
     */
    /** {zh}
     * @brief 歌曲高潮片段开始时间，单位为毫秒。
     */
    climax_start_time: number;
    /** {en}
     * @brief The ending time of the climax part in milliseconds.
     */
    /** {zh}
     * @brief 歌曲高潮片段停止时间，单位为毫秒。
     */
    climax_stop_time: number;
}
/** {en}
 * @brief Hot music type.
 */
/** {zh}
 * @brief 热榜类别。
 */
export declare enum MusicHotType {
    /** {en}
     * @brief Hot music in the content center.
     */
    /** {zh}
     * @brief 火山内容中心热歌榜。
     */
    kMusicHotTypeContentCenter = 1,
    /** {en}
     * @brief Hot music of the project.
     */
    /** {zh}
     * @brief 项目热歌榜。
     */
    kMusicHotTypeProject = 2
}
/** {en}
 * @brief Hot music information.
 */
/** {zh}
 * @brief 热榜歌曲数据。
 */
export interface HotMusicInfo {
    /** {en}
     * @brief Hot music type.  Multiple hot music types can be combined by the bitwise-or operator.
     */
    /** {zh}
     * @brief 热榜类别。多个热榜类别可以按位或组合。
     */
    hot_type: MusicHotType;
    /** {en}
     * @brief Hot list name.
     */
    /** {zh}
     * @brief 热榜名称。
     */
    hot_name: string;
    /** {en}
     * @brief Music information.
     */
    /** {zh}
     * @brief 歌曲数据。
     */
    musics: MusicInfo[];
}
/** {en}
 * @brief Download file type.
 */
/** {zh}
 * @brief 下载文件类型。
 */
export declare enum DownloadFileType {
    /** {en}
     * @brief Audio file.
     */
    /** {zh}
     * @brief 音频文件。
     */
    kDownloadFileTypeMusic = 1,
    /** {en}
     * @brief KRC lyrics file.
     */
    /** {zh}
     * @brief KRC 歌词文件。
     */
    kDownloadFileTypeKRC = 2,
    /** {en}
     * @brief LRC lyrics file.
     */
    /** {zh}
     * @brief LRC 歌词文件。
     */
    kDownloadFileTypeLRC = 3,
    /** {en}
     * @brief MIDI file.
     */
    /** {zh}
     * @brief MIDI 文件。
     */
    kDownloadFileTypeMIDI = 4
}
/** {en}
 * @brief Download music information.
 */
/** {zh}
 * @brief 歌曲下载信息。
 */
export interface DownloadResult {
    /** {en}
     * @brief Download file path.
     */
    /** {zh}
     * @brief 文件存放路径。
     */
    local_file_path: string;
    /** {en}
     * @brief Music ID.
     */
    /** {zh}
     * @brief 音乐 ID。
     */
    music_id: string;
    /** {en}
     * @brief Download file type.
     */
    /** {zh}
     * @brief 下载文件类型。
     */
    type: DownloadFileType;
}
/** {en}
 * @brief Music playing status.
 */
/** {zh}
 * @brief 音乐播放状态。
 */
export declare enum PlayState {
    /** {en}
     * @brief Playing.
     */
    /** {zh}
     * @brief 播放中。
     */
    kPlaying = 1,
    /** {en}
     * @brief Paused.
     */
    /** {zh}
     * @brief 暂停中。
     */
    kPaused = 2,
    /** {en}
     * @brief Stopped.
     */
    /** {zh}
     * @brief 已停止。
     */
    kStoped = 3,
    /** {en}
     * @brief Failed to play.
     */
    /** {zh}
     * @brief 播放失败。
     */
    kFailed = 4,
    /** {en}
     * @brief Finished.
     */
    /** {zh}
     * @brief 播放结束。
     */
    kFinished = 5
}
/** {en}
 * @brief KTV player error code.
 */
/** {zh}
 * @brief KTV 播放器错误码。
 */
export declare enum KTVPlayerErrorCode {
    /** {en}
     * @brief Success.
     */
    /** {zh}
     * @brief 成功。
     */
    kKTVPlayerErrorCodeOK = 0,
    /** {en}
     * @brief Failed to play the music. Download first.
     */
    /** {zh}
     * @brief 播放错误，请下载后播放。
     */
    kKTVPlayerErrorCodeFileNotExist = -3020,
    /** {en}
     * @brief Failed to play the music. Check the file's format.
     */
    /** {zh}
     * @brief 播放错误，请确认文件播放格式。
     */
    kKTVPlayerErrorCodeFileError = -3021,
    /** {en}
     * @brief Failed to play the music. Join a room first.
     */
    /** {zh}
     * @brief 播放错误，未进入房间。
     */
    kKTVPlayerErrorCodeNotJoinRoom = -3022,
    /** {en}
     * @brief Invalid parameter.
     */
    /** {zh}
     * @brief 参数错误。
     */
    kKTVPlayerErrorCodeParam = -3023,
    /** {en}
     * @brief Failed to play the music. Invalid path or failed to open the file.
     */
    /** {zh}
     * @brief 播放失败，找不到文件或文件打开失败。
     */
    kKTVPlayerErrorCodeStartError = -3024,
    /** {en}
     * @brief Invalid mixing ID.
     */
    /** {zh}
     * @brief 混音 ID 异常。
     */
    kKTVPlayerErrorCodeMixIdError = -3025,
    /** {en}
     * @brief Invalid position.
     */
    /** {zh}
     * @brief 设置播放位置出错。
     */
    kKTVPlayerErrorCodePositionError = -3026,
    /** {en}
     * @brief Invalid volume.
     */
    /** {zh}
     * @brief 音量参数不合法，可设置的取值范围为 [0,400]。
     */
    kKTVPlayerErrorCodeAudioVolumeError = -3027,
    /** {en}
     * @brief Do not support the mix type.
     */
    /** {zh}
     * @brief 不支持此混音类型。
     */
    kKTVPlayerErrorCodeTypeError = -3028,
    /** {en}
     * @brief Invalid pitch.
     */
    /** {zh}
     * @brief 音调文件不合法。
     */
    kKTVPlayerErrorCodePitchError = -3029,
    /** {en}
     * @brief Invalid audio track.
     */
    /** {zh}
     * @brief 音轨不合法。
     */
    kKTVPlayerErrorCodeAudioTrackError = -3030,
    /** {en}
     * @brief Mixing in process.
     */
    /** {zh}
     * @brief 混音启动中。
     */
    kKTVPlayerErrorCodeStartingError = -3031
}
export declare enum AnsMode {
    /**
     * @brief 禁用音频降噪。
     */
    kAnsModeDisable = 0,
    /**
     * @brief 适用于微弱降噪。
     */
    kAnsModeLow = 1,
    /**
     * @brief 适用于抑制中度平稳噪音，如空调声、风扇声。
     */
    kAnsModeMedium = 2,
    /**
     * @brief 适用于抑制嘈杂非平稳噪音，如键盘声、敲击声、碰撞声、动物叫声。
     */
    kAnsModeHigh = 3,
    /**
     * @brief 启用音频降噪能力。具体的降噪算法由 RTC 决定。
     */
    kAnsModeAutomatic = 4
}
/** {en}
 * @brief Super-resolution mode.
 */
/** {zh}
 * @brief 超分模式。
 */
export declare enum VideoSuperResolutionMode {
    /** {en}
     * @brief Turn off super-resolution mode.
     */
    /** {zh}
     * @brief 关闭超分。
     */
    kVideoSuperResolutionModeOff = 0,
    /** {en}
     * @brief Turn on super-resolution mode.
     */
    /** {zh}
     * @brief 开启超分。
     */
    kVideoSuperResolutionModeOn = 1
}
/** {en}
 * @brief The reason for the change in super resolution mode.
 */
/** {zh}
 * @brief 超分状态改变原因。
 */
export declare enum VideoSuperResolutionModeChangedReason {
    /** {en}
     * @brief Successfully turned off the super resolution mode by calling [setRemoteVideoSuperResolution](85532#setremotevideosuperresolution).
     */
    /** {zh}
     * @brief 调用 [setRemoteVideoSuperResolution](85532#setremotevideosuperresolution) 成功关闭超分。
     */
    kVideoSuperResolutionModeChangedReasonAPIOff = 0,
    /** {en}
     * @brief Successfully turned on the super resolution mode by calling [setRemoteVideoSuperResolution](85532#setremotevideosuperresolution).
     */
    /** {zh}
     * @brief 调用 [setRemoteVideoSuperResolution](85532#setremotevideosuperresolution) 成功开启超分。
     */
    kVideoSuperResolutionModeChangedReasonAPIOn = 1,
    /** {en}
     * @brief Failed to turn on super-resolution mode. The original resolution of the remote video stream should not exceed 640 × 360 pixels.
     */
    /** {zh}
     * @brief 开启超分失败，远端视频流的原始视频分辨率超过 640 × 360 px。
     */
    kVideoSuperResolutionModeChangedReasonResolutionExceed = 2,
    /** {en}
     * @brief Failed to turn on super-resolution mode. You can only turn on super-resolution mode for one stream.
     */
    /** {zh}
     * @brief 开启超分失败，已对一路远端流开启超分。
     */
    kVideoSuperResolutionModeChangedReasonOverUse = 3,
    /** {en}
     * @brief Incompatible device for super resolution.
     */
    /** {zh}
     * @brief 设备不支持使用超分辨率。
     */
    kVideoSuperResolutionModeChangedReasonDeviceNotSupport = 4,
    /** {en}
     * @brief The super-resolution mode is turned off because of lacking device capabilities.
     */
    /** {zh}
     * @brief 当前设备性能存在风险，已动态关闭超分。
     */
    kVideoSuperResolutionModeChangedReasonDynamicClose = 5,
    /** {en}
     * @brief The super-resolution mode is turned off for other reasons.
     */
    /** {zh}
     * @brief 超分因其他原因关闭。
     */
    kVideoSuperResolutionModeChangedReasonOtherSettingDisabled = 6,
    /** {en}
     * @brief The super-resolution mode is turned on for other reasons.
     */
    /** {zh}
     * @brief 超分因其他原因开启。
     */
    kVideoSuperResolutionModeChangedReasonOtherSettingEnabled = 7,
    /** {en}
     * @brief The super-resolution mode is not compiled in the SDK.
     */
    /** {zh}
     * @brief SDK 没有编译超分组件。
     */
    kVideoSuperResolutionModeChangedReasonNoComponent = 8,
    /** {zh}
     * @brief 远端流不存在。房间 ID 或用户 ID 无效，或对方没有发布流。
     */
    /** {en}
     * @brief The remote stream does not exist. Reasons include invalid room ID, user ID, or the stream is not published.
     */
    kVideoSuperResolutionModeChangedReasonStreamNotExist = 9
}
/** {en}
 * @brief The encoding modes for shared-screen streams. The default mode is the high-resolution mode. If you exclude specific windows by setting [filter_config](#screencaptureparameters-filter_config), the frame rate of the shared-screen stream will be slower than 30fps。
 */
/** {zh}
 * @brief 屏幕流编码模式。默认采用清晰模式。若在采集时设置 [filter_config](#screencaptureparameters-filter_config) 排除指定窗口，共享视频时帧率无法达到 30fps。
 */
export declare enum ScreenVideoEncodePreference {
    /** {en}
     * @brief The automatic mode. The encoding mode is dynamically determined by RTC based on the content.
     */
    /** {zh}
     * @brief 智能模式。根据屏幕内容智能决策选择流畅模式或清晰模式。
     */
    kScreenVideoEncodePreferenceAuto = 0,
    /** {en}
     * @brief The high frame rate mode. Ensure the highest framerate possible under challenging network conditions. This mode is designed to share audiovisual content, including games and videos.
     */
    /** {zh}
     * @brief 流畅模式，优先保障帧率。适用于共享游戏、视频等动态画面。
     */
    kScreenVideoEncodePreferenceFramerate = 1,
    /** {en}
     * @brief The high-resolution mode. Ensure the highest resolution possible under challenging network conditions. This mode is designed to share micro-detailed content, including slides, documents, images, illustrations, or graphics.
     */
    /** {zh}
     * @brief 清晰模式，优先保障分辨率。适用于共享PPT、文档、图片等静态画面。
     */
    kScreenVideoEncodePreferenceQuality = 2
}
/** {en}
 * @brief The encoding configuration for shared-screen streams. See [Setting Video Encoder Configuration](https://docs.byteplus.com/byteplus-rtc/docs/70122).
 */
/** {zh}
 * @brief 屏幕编码配置。参考 [设置视频发布参数](https://www.volcengine.com/docs/6348/70122)。
 */
export interface ScreenVideoEncoderConfig {
    /** {en}
     * @brief Width(in px).
     */
    /** {zh}
     * @brief 视频宽度，单位：像素。
     */
    width: number;
    /** {en}
     * @brief Height(in px).
     */
    /** {zh}
     * @brief 视频高度，单位：像素。
     */
    height: number;
    /** {en}
     * @brief The frame rate(in fps).
     */
    /** {zh}
     * @brief 视频帧率，单位：fps。
     */
    frameRate: number;
    /** {en}
     * @brief The maximum bitrate(in kbps). Optional for internal capture while mandatory for custom capture.
     *        If you set this value to -1, RTC will automatically recommend the bitrate based on the input resolution and frame rate.
     *        If you set this value to 0, streams will not be encoded and published.
     *        On Version 3.44 or later, the default value for internal capture is -1. On versions earlier than 3.44, you must set the maximum bit rate because there is no default value.
     */
    /** {zh}
     * @brief 最大编码码率，使用 SDK 内部采集时可选设置，自定义采集时必须设置，单位：kbps。
     *        设为 -1 即适配码率模式，系统将根据输入的分辨率和帧率自动计算适用的码率。
     *        设为 0 则不对视频流进行编码发送。
     *        3.44 及以上版本，内部采集时默认值为 -1，3.44 以前版本无默认值，需手动设置。
     */
    maxBitrate?: number;
    /** {en}
     * @brief The minimum bitrate(in kbps).Optional for internal capture while mandatory for custom capture.
     *        The minimum bitrate must be set lower than the maximum bitrate. Otherwise, streams will not be encoded and published.
     */
    /** {zh}
     * @brief 最小编码码率，使用 SDK 内部采集时可选设置，自定义采集时必须设置，单位：kbps。
     *        最小编码码率必须小于或等于最大编码，否则不对视频流进行编码发送。
     */
    minBitrate?: number;
    /** {en}
     * @brief The encoding modes for shared-screen streams.
     */
    /** {zh}
     * @brief 屏幕流编码模式。
     */
    encoderPreference?: ScreenVideoEncodePreference;
}
/** {en}
 * @brief Face Detection Result
 */
/** {zh}
 * @brief 人脸检测结果
 */
export interface FaceDetectResult {
    /** {en}
     * @brief Face Detection Result
     * + 0: Success
     * + !0: Failure. See [Error Code Table](https://docs.byteplus.com/en/effects/docs/error-code-table).
     */
    /** {zh}
     * @brief 人脸检测结果
     * + 0：检测成功
     * + !0：检测失败。详见[错误码表](https://www.volcengine.com/docs/6705/102042)。
     */
    detect_result: number;
    /** {en}
     * @brief Number of the detected face
     */
    /** {zh}
     * @brief 检测到的人脸的数量
     */
    face_count: number;
    /** {en}
     * @brief The face recognition rectangles. The length of the array is the same as the number of detected faces.
     */
    /** {zh}
     * @brief 识别到人脸的矩形框。数组的长度和检测到的人脸数量一致。
     */
    rect: Rectangle[];
    /** {en}
     * @brief Width of the original image (px)
     */
    /** {zh}
     * @brief 原始图片宽度(px)
     */
    image_width: number;
    /** {en}
     * @brief Height of the original image (px)
     */
    /** {zh}
     * @brief 原始图片高度(px)
     */
    image_height: number;
    /** {en}
     * @brief The time stamp of the video frame using face detection.
     */
    /** {zh}
     * @brief 进行人脸识别的视频帧的时间戳。
     */
    frame_timestamp_us: number;
}
/** {en}
 * @brief SEI sending mode.
 */
/** {zh}
 * @brief SEI 发送模式。
 */
export declare enum SEICountPerFrame {
    /** {en}
     * @brief Single-SEI mode. When you send multiple SEI messages in 1 frame, they will be sent frame by frame in a queue.
     */
    /** {zh}
     * @brief 单发模式。即在 1 帧间隔内多次发送 SEI 数据时，多个 SEI 按队列逐帧发送。
     */
    kSingleSEIPerFrame = 0,
    /** {en}
     * @brief Multi-SEI mode. When you send multiple SEI messages in 1 frame, they will be sent together in the next frame.
     */
    /** {zh}
     * @brief 多发模式。即在 1 帧间隔内多次发送 SEI 数据时，多个 SEI 随下个视频帧同时发送。
     */
    kMultiSEIPerFrame = 1
}
/** {en}
 * @brief  Stream type for media stream information synchronization
 */
/** {zh}
 * @brief 媒体流信息同步的流类型
 */
export declare enum SyncInfoStreamType {
    /** {en}
     * @brief Audio stream
     */
    /** {zh}
     * @brief 音频流
     */
    kSyncInfoStreamTypeAudio = 0
}
/** {en}
 * @brief Cloud Proxy Information
 */
/** {zh}
 * @brief 云代理信息
 */
export interface CloudProxyInfo {
    /** {en}
     * @brief Cloud proxy IP
     */
    /** {zh}
     * @brief 云代理服务器 IP
     */
    cloud_proxy_ip: string;
    /** {en}
     * @brief Cloud Proxy Port
     */
    /** {zh}
     * @brief 云代理服务器端口
     */
    cloud_proxy_port: number;
}
/** {en}
 * @brief SEI data source type.
 */
/** {zh}
 * @brief SEI 信息来源。
 */
export declare enum DataMessageSourceType {
    /**
     * @brief 通过客户端或服务端的插入的自定义消息。
     */
    kDataMessageSourceTypeDefault = 0,
    /**
     * @brief 系统数据，包含音量指示信息。
     */
    kDataMessageSourceTypeSystem = 1
}
/** {en}
 * @brief  Configuration related to media stream information synchronization
 */
/** {zh}
 * @brief 媒体流信息同步的相关配置
 */
export interface StreamSycnInfoConfig {
    /** {en}
     * @brief Stream properties, mainstream or screen streams.
     */
    /** {zh}
     * @brief 流属性，主流或屏幕流。
     */
    stream_index: StreamIndex;
    /** {en}
     * @brief The number of duplicates sent by the message, the value range is  [0,25], it is recommended to set it to [3,5].
     */
    /** {zh}
     * @brief 消息发送的重复次数，取值范围是 [0,25]，建议设置为 [3,5]。
     */
    repeat_count: number;
    /** {en}
     * @brief Stream types for media stream information synchronization.
     */
    /** {zh}
     * @brief 媒体流信息同步的流类型，
     */
    stream_type: SyncInfoStreamType;
}
/** {en}
 * @brief Karaoke scoring mode.
 */
/** {zh}
 * @brief K 歌打分维度。
 */
export declare enum MulDimSingScoringMode {
    /** {en}
     * @brief The score is provided based on the pitch.
     */
    /** {zh}
     * @brief 按照音高进行评分。
     */
    kMulDimSingScoringModeNote = 0
}
/** {en}
 * @brief Karaoke scoring configuration.
 */
/** {zh}
 * @brief K 歌评分配置。
 */
export interface SingScoringConfig {
    /** {en}
     * @brief Sampling rate. Only 44,100 Hz and 48,000 Hz are supported.
     */
    /** {zh}
     * @brief 音频采样率。仅支持 44100 Hz、48000 Hz。
     */
    sample_rate: AudioSampleRate;
    /** {en}
     * @brief Scoring mode
     */
    /** {zh}
     * @brief 打分维度
     */
    mode: MulDimSingScoringMode;
    /** {en}
     * @brief The file path of the lyrics. The scoring feature only supports KRC lyrics file.
     */
    /** {zh}
     * @brief 歌词文件路径。打分功能仅支持 KRC 歌词文件。
     */
    lyrics_filepath: string;
    /** {en}
     * @brief The path of the midi file.
     */
    /** {zh}
     * @brief 歌曲 midi 文件路径。
     */
    midi_filepath: string;
}
/** {en}
 * @brief Standard pitch data
 */
/** {zh}
 * @brief 标准音高数据
 */
export interface StandardPitchInfo {
    /** {en}
     * @brief Starting time, unit: ms.
     */
    /** {zh}
     * @brief 开始时间，单位 ms。
     */
    start_time: number;
    /** {en}
     * @brief Duration, unit: ms.
     */
    /** {zh}
     * @brief 持续时间，单位 ms。
     */
    duration: number;
    /** {en}
     * @brief pitch.
     */
    /** {zh}
     * @brief 音高。
     */
    pitch: number;
}
/** {en}
 * @brief Type of audio device
 */
/** {zh}
 * @brief 音频设备类型
 */
export declare enum RTCAudioDeviceType {
    /** {en}
     * @brief Unknown device
     */
    /** {zh}
     * @brief 未知设备类型
     */
    kRTCAudioDeviceTypeUnknown = -1,
    /** {en}
     * @brief Speaker or headphone
     */
    /** {zh}
     * @brief 音频渲染设备
     */
    kRTCAudioDeviceTypeRenderDevice = 0,
    /** {en}
     * @brief Microphone
     */
    /** {zh}
     * @brief 音频采集设备
     */
    kRTCAudioDeviceTypeCaptureDevice = 1,
    /** {en}
     * @brief Screen capturing audio device
     */
    /** {zh}
     * @brief 屏幕流音频设备
     */
    kRTCAudioDeviceTypeScreenCaptureDevice = 2
}
/** {en}
 * @brief Real-time scoring data.
 */
/** {zh}
 * @brief 实时评分信息。
 */
export interface SingScoringRealtimeInfo {
    /** {en}
     * @brief Current playback position.
     */
    /** {zh}
     * @brief 当前播放进度。
     */
    current_position: number;
    /** {en}
     * @brief The user's pitch.
     */
    /** {zh}
     * @brief 演唱者的音高。
     */
    user_pitch: number;
    /** {en}
     * @brief Standard pitch.
     */
    /** {zh}
     * @brief 标准音高。
     */
    standard_pitch: number;
    /** {en}
     * @brief Lyric index.
     */
    /** {zh}
     * @brief 歌词分句索引。
     */
    sentence_index: number;
    /** {en}
     * @brief The score for the previous lyric.
     */
    /** {zh}
     * @brief 上一句歌词的评分。
     */
    sentence_score: number;
    /** {en}
     * @brief The total score for the user's current performance.
     */
    /** {zh}
     * @brief 当前演唱的累计分数。
     */
    total_score: number;
    /** {en}
     * @brief The average score for the user's current performance.
     */
    /** {zh}
     * @brief 当前演唱的平均分数。
     */
    average_score: number;
}
/** {en}
 * @brief Audio Equalization effect.
 */
/** {zh}
 * @brief 音频均衡效果。
 */
export declare enum VoiceEqualizationBandFrequency {
    /** {en}
     * @brief The frequency band with a center frequency of 31Hz.
     */
    /** {zh}
     * @brief 中心频率为 31Hz 的频带。
     */
    kVoiceEqualizationBandFrequency31 = 0,
    /** {en}
     * @brief The frequency band with a center frequency of 62Hz.
     */
    /** {zh}
     * @brief 中心频率为 62Hz 的频带。
     */
    kVoiceEqualizationBandFrequency62 = 1,
    /** {en}
     * @brief The frequency band with a center frequency of 125Hz.
     */
    /** {zh}
     * @brief 中心频率为 125Hz 的频带。
     */
    kVoiceEqualizationBandFrequency125 = 2,
    /** {en}
     * @brief The frequency band with a center frequency of 250Hz.
     */
    /** {zh}
     * @brief 中心频率为 250Hz 的频带。
     */
    kVoiceEqualizationBandFrequency250 = 3,
    /** {en}
     * @brief The frequency band with a center frequency of 500Hz.
     */
    /** {zh}
     * @brief 中心频率为 500Hz 的频带。
     */
    kVoiceEqualizationBandFrequency500 = 4,
    /** {en}
     * @brief The frequency band with a center frequency of 1kHz.
     */
    /** {zh}
     * @brief 中心频率为 1kHz 的频带。
     */
    kVoiceEqualizationBandFrequency1k = 5,
    /** {en}
     * @brief The frequency band with a center frequency of 2kHz.
     */
    /** {zh}
     * @brief 中心频率为 2kHz 的频带。
     */
    kVoiceEqualizationBandFrequency2k = 6,
    /** {en}
     * @brief The frequency band with a center frequency of 4kHz.
     */
    /** {zh}
     * @brief 中心频率为 4kHz 的频带。
     */
    kVoiceEqualizationBandFrequency4k = 7,
    /** {en}
     * @brief The frequency band with a center frequency of 8kHz.
     */
    /** {zh}
     * @brief 中心频率为 8kHz 的频带。
     */
    kVoiceEqualizationBandFrequency8k = 8,
    /** {en}
     * @brief The frequency band with a center frequency of 16kHz.
     */
    /** {zh}
     * @brief 中心频率为 16kHz 的频带。
     */
    kVoiceEqualizationBandFrequency16k = 9
}
/** {en}
 * @brief Voice enqualization config
 */
/** {zh}
 * @brief 语音均衡效果。
 */
export interface VoiceEqualizationConfig {
    /** {en}
     * @brief Frequency band.
     */
    /** {zh}
     * @brief 频带。
     */
    frequency: VoiceEqualizationBandFrequency;
    /** {en}
     * @brief Gain of the frequency band in dB. The range is `[-15, 15]`.
     */
    /** {zh}
     * @brief 频带增益（dB）。取值范围是 `[-15, 15]`。
     */
    gain: number;
}
/** {en}
 * @brief Voice reverb effect.
 */
/** {zh}
 * @brief 音频混响效果。
 */
export interface VoiceReverbConfig {
    /** {en}
     * @brief The room size for reverb simulation. The range is `[0.0, 100.0]`. The default value is `50.0f`. The larger the room, the stronger the reverberation.
     */
    /** {zh}
     * @brief 混响模拟的房间大小，取值范围 `[0.0, 100.0]`。默认值为 `50.0f`。房间越大，混响越强。
     */
    room_size: number;
    /** {en}
     * @brief The decay time of the reverb effect. The range is `[0.0, 100.0]`. The default value is `50.0f`.
     */
    /** {zh}
     * @brief 混响的拖尾长度，取值范围 `[0.0, 100.0]`。默认值为 `50.0f`。
     */
    decay_time: number;
    /** {en}
     * @brief The damping index of the reverb effect. The range is `[0.0, 100.0]`. The default value is `50.0f`.
     */
    /** {zh}
     * @brief 混响的衰减阻尼大小，取值范围 `[0.0, 100.0]`。默认值为 `50.0f`。
     */
    damping: number;
    /** {en}
     * @brief The Intensity of the wet signal in dB. The range is `[-20.0, 10.0]`. The default value is `0.0f`.
     */
    /** {zh}
     * @brief 早期反射信号强度。取值范围 `[-20.0, 10.0]`，单位为 dB。默认值为 `0.0f`。
     */
    wet_gain: number;
    /** {en}
     * @brief The Intensity of the dry signal in dB. The range is `[-20.0, 10.0]`. The default value is `0.0f`.
     */
    /** {zh}
     * @brief 原始信号强度。取值范围 `[-20.0, 10.0]`，单位为 dB。默认值为 `0.0f`。
     */
    dry_gain: number;
    /** {en}
     * @brief The delay of the wet signal in ms. The range is `[0.0, 200.0]`. The default value is `0.0f`.
     */
    /** {zh}
     * @brief 早期反射信号的延迟。取值范围 `[0.0, 200.0]`，单位为 ms。默认值为 `0.0f`。
     */
    pre_delay: number;
}
/** {en}
 * @brief Audio file recording source type.
 */
/** {zh}
 * @brief 音频文件录制内容来源。
 */
export declare enum AudioFrameSource {
    /** {en}
     * @brief The audio captured by the local microphone.
     */
    /** {zh}
     * @brief 本地麦克风采集的音频数据。
     */
    kAudioFrameSourceMic = 0,
    /** {en}
     * @brief The audio got by mixing all remote user's audio.
     */
    /** {zh}
     * @brief 远端所有用户混音后的数据
     */
    kAudioFrameSourcePlayback = 1,
    /** {en}
     * @brief The audio got by mixing the local captured audio and all remote user's audio.
     */
    /** {zh}
     * @brief 本地麦克风和所有远端用户音频流的混音后的数据
     */
    kAudioFrameSourceMixed = 2
}
/** {en}
 * @brief Audio quality.
 */
/** {zh}
 * @brief 音频质量。
 */
export declare enum AudioQuality {
    /** {en}
     * @brief low quality
     */
    /** {zh}
     * @brief 低音质
     */
    kAudioQualityLow = 0,
    /** {en}
     * @brief medium quality
     */
    /** {zh}
     * @brief 中音质
     */
    kAudioQualityMedium = 1,
    /** {en}
     * @brief high quality
     */
    /** {zh}
     * @brief 高音质
     */
    kAudioQualityHigh = 2,
    /** {en}
     * @brief ultra high quality
     */
    /** {zh}
     * @brief 超高音质
     */
    kAudioQualityUltraHigh = 3
}
/** {en}
 * @brief Audio recording config
 */
/** {zh}
 * @brief 录音配置
 */
export interface AudioRecordingConfig {
    /** {en}
     * @brief Absolute path of the recorded file, file name included. The App must have the write and read permission of the path.
     * @notes The files format is restricted to .aac and .wav.
     */
    /** {zh}
     * @brief 录制文件路径。一个有读写权限的绝对路径，包含文件名和文件后缀。
     * @notes 录制文件的格式仅支持 .aac 和 .wav。
     */
    absolute_file_name: string;
    /** {en}
     * @brief The source of the recording.
     */
    /** {zh}
     * @brief 录音内容来源
     */
    frame_source: AudioFrameSource;
    /** {en}
     * @brief Audio sample rate
     */
    /** {zh}
     * @brief 录音采样率
     */
    sample_rate: AudioSampleRate;
    /** {en}
     * @brief Number of audio channels.
     * @notes If number of audio channels of recording is different than that of audio capture, the behavior is:
     * + If the number of capture is 1, and the number of recording is 2, the recorded audio is two-channel data after copying mono-channel data.
     * + If the number of capture is 2, and the number of recording is 1, the recorded audio is recorded by mixing the audio of the two channels.
     */
    /** {zh}
     * @brief 录音音频声道。
     * @notes 如果录制时设置的的音频声道数与采集时的音频声道数不同：
     * + 如果采集的声道数为 1，录制的声道数为 2，那么，录制的音频为经过单声道数据拷贝后的双声道数据，而不是立体声。
     * + 如果采集的声道数为 2，录制的声道数为 1，那么，录制的音频为经过双声道数据混合后的单声道数据。
     */
    channel: AudioChannel;
    /** {en}
     * @brief Recording quality. Only valid for .aac file.
     * @notes When the sample rate is 32kHz, the file (10min) size for different qualities are:
     * + low: 1.2MB;
     * + medium: 2MB;
     * + high: 3.75MB;
     * + ultra high: 7.5MB.
     */
    /** {zh}
     * @brief 录音音质。仅在录制文件格式为 .aac 时可以设置。
     * @notes 采样率为 32kHz 时，不同音质录制文件（时长为 10min）的大小分别是：
     * + 低音质：1.2MB；
     * + 中音质：2MB；
     * + 高音质：3.75MB；
     * + 超高音质：7.5MB。
     */
    quality: AudioQuality;
}
/** {en}
 * @brief Audio recording config
 */
/** {zh}
 * @brief 录音配置
 */
export declare enum AudioRecordingState {
    /** {en}
     * @brief Recording exception
     */
    /** {zh}
     * @brief 录制异常
     */
    kAudioRecordingStateError = 0,
    /** {en}
     * @brief Recording in progress
     */
    /** {zh}
     * @brief 录制进行中
     */
    kAudioRecordingStateProcessing = 1,
    /** {en}
     * @brief The recording task ends, and the file is saved.
     */
    /** {zh}
     * @brief 已结束录制，并且录制文件保存成功。
     */
    kAudioRecordingStateSuccess = 2
}
/** {zh}
 * @detail 85534
 * @brief 音频文件录制的错误码
 */
/** {en}
 * @detail 85534
 * @brief Error code for audio recording.
 */
export declare enum AudioRecordingErrorCode {
    /** {en}
     * @brief OK
     */
    /** {zh}
     * @brief 录制正常
     */
    kAudioRecordingErrorCodeOk = 0,
    /** {en}
     * @brief No file write permissions.
     */
    /** {zh}
     * @brief 没有文件写权限
     */
    kAudioRecordingErrorCodeNoPermission = -1,
    /** {en}
     * @brief Not in the room.
     */
    /** {zh}
     * @brief 没有进入房间
     */
    kAudioRecordingErrorNotInRoom = -2,
    /** {en}
     * @brief Started.
     */
    /** {zh}
     * @brief 录制已经开始
     */
    kAudioRecordingAlreadyStarted = -3,
    /** {en}
     * @brief Not started.
     */
    /** {zh}
     * @brief 录制还未开始
     */
    kAudioRecordingNotStarted = -4,
    /** {en}
     * @brief Failure. Invalid file format.
     */
    /** {zh}
     * @brief 录制失败。文件格式不支持。
     */
    kAudioRecordingErrorCodeNotSupport = -5,
    /** {en}
     * @brief Other error.
     */
    /** {zh}
     * @brief 其他异常
     */
    kAudioRecordingErrorCodeOther = -6
}
/** {en}
 * @brief Room information for audio & video quality feedback
 */
/** {zh}
 * @brief 音视频质量反馈的房间信息
 */
export interface ProblemFeedbackRoomInfo {
    /** {en}
     * @brief Room ID.
     */
    /** {zh}
     * @brief 房间 ID。
     */
    room_id: string;
    /** {en}
     * @brief The ID of the  local user.
     */
    /** {zh}
     * @brief 本地用户 ID。
     */
    user_id: string;
}
/** {en}
 * @brief Information for audio & video quality feedback
 */
/** {zh}
 * @brief 音视频质量反馈的信息
 */
export interface ProblemFeedbackInfo {
    /** {en}
     * @brief Specific description of problems other than the preset problem.
     */
    /** {zh}
     * @brief 预设问题以外的其他问题的具体描述。
     */
    problem_desc: string;
    /** {en}
     * @brief Room information for audio & video quality feedback.
     */
    /** {zh}
     * @brief 音视频质量反馈的房间信息。
     */
    room_info: ProblemFeedbackRoomInfo[];
}
/** {en}
 * @brief Types of local proxies.
 */
/** {zh}
 * @brief 本地代理的类型。
 */
export declare enum LocalProxyType {
    /** {en}
     * @brief Socks5 proxy. If you chose Socks5 as the local proxy, you need to make sure all requirements listed in the Socks5 document are satisfied.
     */
    /** {zh}
     * @brief Socks5 代理。选用此代理服务器，需满足 Socks5 协议标准文档的要求。
     */
    kLocalProxyTypeSocks5 = 1,
    /** {en}
     * @brief Http tunnel proxy.
     */
    /** {zh}
     * @brief Http 隧道代理。
     */
    kLocalProxyTypeHttpTunnel = 2
}
/** {en}
 * @brief Detailed information of local proxy configurations.
 */
/** {zh}
 * @brief 本地代理配置详细信息。
 */
export interface LocalProxyConfiguration {
    /** {en}
     * @brief Types of local proxies.
     */
    /** {zh}
     * @brief 本地代理类型
     */
    local_proxy_type: LocalProxyType;
    /** {en}
     * @brief Local proxy IP.
     */
    /** {zh}
     * @brief 本地代理服务器 IP。
     */
    local_proxy_ip: string;
    /** {en}
     * @brief Local proxy port.
     */
    /** {zh}
     * @brief 本地代理服务器端口。
     */
    local_proxy_port: number;
    /** {en}
     * @brief The username of the local proxy.
     */
    /** {zh}
     * @brief 本地代理用户名。
     */
    local_proxy_username: string;
    /** {en}
     * @brief The password of the local proxy.
     */
    /** {zh}
     * @brief 本地代理密码。
     */
    local_proxy_password: string;
}
/** {en}
 * @brief The states of local proxy connection.
 */
/** {zh}
 * @brief 本地代理连接状态。
 */
export declare enum LocalProxyState {
    /** {en}
     * @brief TCP proxy server is connected.
     */
    /** {zh}
     * @brief TCP 代理服务器连接成功。
     */
    kLocalProxyStateInited = 0,
    /** {en}
     * @brief The local proxy is connected.
     */
    /** {zh}
     * @brief 本地代理连接成功。
     */
    kLocalProxyStateConnected = 1,
    /** {en}
     * @brief Errors occurred when connecting to the local proxy.
     */
    /** {zh}
     * @brief 本地代理连接出现错误。
     */
    kLocalProxyStateError = 2
}
/** {en}
 * @detail 85534
 * @brief The errors of local proxy connection.
 */
/** {zh}
 * @detail 85534
 * @brief 本地代理错误信息。
 */
export declare enum LocalProxyError {
    /** {en}
     * @brief There are no errors in local proxies.
     */
    /** {zh}
     * @brief 代理无错误
     */
    kLocalProxyErrorOK = 0,
    /** {en}
     * @brief The connection to Socks5 proxy failed because the proxy server replies wrong version numbers which don't accord with the Socks5 document. Please check the proxy server.
     */
    /** {zh}
     * @brief 代理服务器回复的版本号错误，导致 socks5 连接失败。
     */
    kLocalProxyErrorSocks5VersionError = 1,
    /** {en}
     * @brief The connection to Socks5 proxy failed because the format of the proxy's replies doesn't accord with the Socks5 document. Please check the proxy server.
     */
    /** {zh}
     * @brief 代理服务器回复的格式错误，导致 socks5 连接失败。
     */
    kLocalProxyErrorSocks5FormatError = 2,
    /** {en}
     * @brief The connection to Socks5 proxy failed because the proxy replies wrong information which doesn't accord with the Socks5 document. Please check the proxy server.
     */
    /** {zh}
     * @brief 代理服务器回复的字段值错误，导致 socks5 连接失败。
     */
    kLocalProxyErrorSocks5InvalidValue = 3,
    /** {en}
     * @brief The connection to Socks5 proxy failed because the username and password of the local proxy are not provided. Please call `setLocalProxy` and enter your username and password.
     */
    /** {zh}
     * @brief 未提供本地代理的用户名及密码，导致 socks5 连接失败。
     */
    kLocalProxyErrorSocks5UserPassNotGiven = 4,
    /** {en}
     * @brief The connection to Socks5 proxy failed because TCP is closed. Please check the proxy server and your network connection status.
     */
    /** {zh}
     * @brief TCP 关闭，导致 socks5 连接失败。
     */
    kLocalProxyErrorSocks5TcpClosed = 5,
    /** {en}
     * @brief Errors in Http tunnel proxy. Please check Http tunnel proxy and your network connection status.
     */
    /** {zh}
     * @brief http隧道代理错误。
     */
    kLocalProxyErrorHttpTunnelFailed = 6
}
/** {en}
 * @brief Result of the detection inited before joining a room
 */
/** {zh}
 * @brief 通话前回声检测结果
 */
export declare enum HardwareEchoDetectionResult {
    /** {en}
     * @brief Detection is stopped by the call of `stopHardwareEchoDetection` before the SDK reports the detection result.
     */
    /** {zh}
     * @brief 主动调用 `stopHardwareEchoDetection` 结束流程时，未有回声检测结果。
     */
    kHardwareEchoDetectionCanceled = 0,
    /** {en}
     * @brief Unknown state
     *        Contact us if you retry several times but keep failing.
     */
    /** {zh}
     * @brief 未检测出结果。建议重试，如果仍然失败请联系技术支持协助排查。
     */
    kHardwareEchoDetectionUnknown = 1,
    /** {en}
     * @brief Excellent
     *        No echo issue is detected.
     */
    /** {zh}
     * @brief 无回声
     */
    kHardwareEchoDetectionNormal = 2,
    /** {en}
     * @brief Echo
     *        Echo issue is detected. Recommend the user join the call with a headset through the interface.
     */
    /** {zh}
     * @brief 有回声。可通过 UI 建议用户使用耳机设备入会。
     */
    kHardwareEchoDetectionPoor = 3
}
/** {en}
 * @brief User priority in the audio selection
 */
/** {zh}
 * @brief 音频选路优先级设置
 */
export declare enum AudioSelectionPriority {
    /** {en}
     * @brief Normal whether the stream can be subscribed is determined by the result of audio selection.
     */
    /** {zh}
     * @brief 正常，参加音频选路
     */
    kAudioSelectionPriorityNormal = 0,
    /** {en}
     * @brief Hight priority with which the stream can skip the audio selection and always be subscribable.
     */
    /** {zh}
     * @brief 高优先级，跳过音频选路
     */
    kAudioSelectionPriorityHigh = 1
}
/** {en}
 * @brief Extra information setting result.
 */
/** {zh}
 * @brief 设置房间附加消息结果。
 */
export declare enum SetRoomExtraInfoResult {
    /** {en}
     * @brief Success.
     */
    /** {zh}
     * @brief 设置房间附加信息成功
     */
    kSetRoomExtraInfoSuccess = 0,
    /** {en}
     * @brief Failure. You are not in the room.
     */
    /** {zh}
     * @brief 设置失败，尚未加入房间
     */
    kSetRoomExtraInfoErrorNotJoinRoom = -1,
    /** {en}
     * @brief Failure. The key pointer is null.
     */
    /** {zh}
     * @brief 设置失败，key 指针为空
     */
    kSetRoomExtraInfoErrorKeyIsNull = -2,
    /** {en}
     * @brief Failure. The value pointer is null.
     */
    /** {zh}
     * @brief 设置失败，value 指针为空
     */
    kSetRoomExtraInfoErrorValueIsNull = -3,
    /** {en}
     * @brief Failure. Unknown error.
     */
    /** {zh}
     * @brief 设置失败，未知错误
     */
    kSetRoomExtraInfoResultUnknow = -99,
    /** {en}
     * @brief Failure. The key length is 0.
     */
    /** {zh}
     * @brief 设置失败，key 长度为 0
     */
    kSetRoomExtraInfoErrorKeyIsEmpty = -400,
    /** {en}
     * @brief Failure. Excessively frequent setting. 10 times per second is preferable.
     */
    /** {zh}
     * @brief 调用 `setRoomExtraInfo` 过于频繁，建议不超过 10 次/秒。
     */
    kSetRoomExtraInfoErrorTooOften = -406,
    /** {en}
     * @brief Failure. Invisible users are not allowed to call `setRoomExtraInfo`.
     */
    /** {zh}
     * @brief 设置失败，用户已调用 `setUserVisibility` 将自身设为隐身状态。
     */
    kSetRoomExtraInfoErrorSilentUser = -412,
    /** {en}
     * @brief Failure. Key length exceeds 10 bytes.
     */
    /** {zh}
     * @brief 设置失败，Key 长度超过 10 字节
     */
    kSetRoomExtraInfoErrorKeyTooLong = -413,
    /** {en}
     * @brief Failure. Value length exceeds 128 bytes.
     */
    /** {zh}
     * @brief 设置失败，value 长度超过 128 字节
     */
    kSetRoomExtraInfoErrorValueTooLong = -414,
    /** {en}
     * @brief Failure. Server error.
     */
    /** {zh}
     * @brief 设置失败，服务器错误
     */
    kSetRoomExtraInfoErrorServer = -500
}
/** {en}
 * @hidden
 * @brief The states of the subtitling task.
 */
/** {zh}
 * @brief 字幕任务状态。
 */
export declare enum SubtitleState {
    /** {en}
     * @brief Subtitles are on.
     */
    /** {zh}
     * @brief 开启字幕。
     */
    kSubtitleStateStarted = 0,
    /** {en}
     * @brief Subtitles are off.
     */
    /** {zh}
     * @brief 关闭字幕。
     */
    kSubtitleStateStoped = 1,
    /** {en}
     * @brief Errors occurred concerning the subtitling task.
     */
    /** {zh}
     * @brief 字幕任务出现错误。
     */
    kSubtitleStateError = 2
}
/** {en}
 * @hidden
 * @brief Subtitle modes.
 */
/** {zh}
 * @brief 字幕模式。
 */
export declare enum SubtitleMode {
    /** {en}
     * @brief The recognition mode. In this mode, the speech of a users in the room will be recognized and converted into captions.
     */
    /** {zh}
     * @brief 识别模式。在此模式下，房间内用户语音会被转为文字。
     */
    kSubtitleModeRecognition = 0,
    /** {en}
     * @brief The translation mode. In this mode, the speech of a users in the room will be converted into captions and then translated.
     */
    /** {zh}
     * @brief 翻译模式。在此模式下，房间内用户语音会先被转为文字，再被翻译为目标语言。
     */
    kSubtitleModeTranslation = 1
}
/** {en}
 * @hidden
 * @brief Error codes of the subtitling task.
 */
/** {zh}
 * @detail 85534
 * @brief 字幕任务错误码。
 */
export declare enum SubtitleErrorCode {
    /** {en}
     * @brief The client side failed to identity error codes sent by cloud media processing. Please contact the technical support.
     */
    /** {zh}
     * @brief 客户端无法识别云端媒体处理发送的错误码。请联系技术支持。
     */
    kSubtitleErrorCodeUnknow = -1,
    /** {en}
     * @brief Subtitles are turned on.
     */
    /** {zh}
     * @brief 字幕已开启。
     */
    kSubtitleErrorCodeSuccess = 0,
    /** {en}
     * @brief Errors occurred concerning cloud media processing. Please contact the technical support.
     */
    /** {zh}
     * @brief 云端媒体处理内部出现错误，请联系技术支持。
     */
    kSubtitleErrorCodePostProcessError = 1,
    /** {en}
     * @brief Failed to connect to the third-party service. Please contact the technical support.
     */
    /** {zh}
     * @brief 第三方服务连接失败，请联系技术支持。
     */
    kSubtitleErrorCodeASRConnectionError = 2,
    /** {en}
     * @brief Errors occurred concerning the third-party service. Please contact the technical support.
     */
    /** {zh}
     * @brief 第三方服务内部出现错误，请联系技术支持。
     */
    kSubtitleErrorCodeASRServiceError = 3,
    /** {en}
     * @brief Failed to call `startSubtitle`. Please join the room first.
     */
    /** {zh}
     * @brief 未进房导致调用`startSubtitle`失败。请加入房间后再调用此方法。
     */
    kSubtitleErrorCodeBeforeJoinRoom = 4,
    /** {en}
     * @brief Subtitles are already on. There is no need to call `startSubtitle` again.
     */
    /** {zh}
     * @brief 重复调用 `startSubtitle`。
     */
    kSubtitleErrorCodeAlreadyOn = 5,
    /** {en}
     * @brief The target language you chose is not Unsupported.
     */
    /** {zh}
     * @brief 用户选择的目标语言目前暂不支持。
     */
    kSubtitleErrorCodeUnsupportedLanguage = 6,
    /** {en}
     * @brief Cloud media processing is timeout. Please contact the technical support.
     */
    /** {zh}
     * @brief 云端媒体处理超时未响应，请联系技术支持。
     */
    kSubtitleErrorCodePostProcessTimeout = 7
}
/** {en}
 * @hidden
 * @brief Subtitle configurations.
 */
/** {zh}
 * @brief 字幕配置信息。
 */
export interface SubtitleConfig {
    /** {en}
     * @brief Subtitle mode.
     */
    /** {zh}
     * @brief 字幕模式。
     */
    mode: SubtitleMode;
    /** {en}
     * @brief Target language.
     */
    /** {zh}
     * @brief 目标翻译语言。可点击 [语言支持](https://www.volcengine.com/docs/4640/35107#%E7%9B%AE%E6%A0%87%E8%AF%AD%E8%A8%80-2) 查看翻译服务最新支持的语种信息。
     */
    target_language: string;
}
/** {en}
 * @hidden
 * @brief Related information about subtitles.
 */
/** {zh}
 * @brief 字幕具体内容。
 */
export interface SubtitleMessage {
    /** {en}
     * @brief The speaker's ID.
     */
    /** {zh}
     * @brief 说话者的用户ID。
     */
    user_id: string;
    /** {en}
     * @brief Transcribed or translated texts of the speaker's speech, encoded in UTF-8 format.
     */
    /** {zh}
     * @brief 语音识别或翻译后的文本, 采用 UTF-8 编码。
     */
    text: string;
    /** {en}
     * @brief Incremental sequence numbers assigned to transcribed or translated texts of the speaker's speech. Complete and incomplete sentences are numbered individually.
     */
    /** {zh}
     * @brief 语音识别或翻译后形成的文本的序列号，同一发言人的完整发言和不完整发言会按递增顺序单独分别编号。
     */
    sequence: number;
    /** {en}
     * @brief Whether transcribed texts are complete sentences. True means yes and False means no.
     */
    /** {zh}
     * @brief 语音识别出的文本是否为一段完整的一句话。 True 代表是, False 代表不是。
     */
    definite: boolean;
}
/** {en}
 * @brief Information on the user's position in the rectangular coordinate system for the spatial audio.
 */
/** {zh}
 * @brief 用户在空间音频坐标系里的位置信息。
 */
export interface PositionInfo {
    /** {en}
     * @brief 3D coordinate values of the user's position in the rectangular coordinate system for the spatial audio. You need to build your own rectangular coordinate system.
     */
    /** {zh}
     * @brief 用户在空间音频坐标系里的位置，需自行建立空间直角坐标系。
     */
    position: Position;
    /** {en}
     * @brief Information on the three-dimensional orientation of the user in the rectangular coordinate system for the spatial audio. Any two of the 3D coordinate vectors of the user's position need to be perpendicular to each other.
     */
    /** {zh}
     * @brief 用户在空间音频坐标系里的三维朝向信息。三个向量需要两两垂直。
     */
    orientation: HumanOrientation;
}
/** {en}
 * @brief Digital Zoom type
 */
/** {zh}
 * @brief 数码变焦参数类型
 */
export declare enum ZoomConfigType {
    /** {en}
     * @brief To set the offset for zooming in and zooming out.
     */
    /** {zh}
     * @brief 设置缩放系数
     */
    kZoomFocusOffset = 0,
    /** {en}
     * @brief To set the offset for panning and tiling.
     */
    /** {zh}
     * @brief 设置移动步长
     */
    kZoomMoveOffset = 1
}
/** {en}
 * @brief Action of the digital zoom control
 */
/** {zh}
 * @brief 数码变焦操作类型
 */
export declare enum ZoomDirectionType {
    /** {en}
     * @brief Move to the left.
     */
    /** {zh}
     * @brief 相机向左移动
     */
    kCameraMoveLeft = 0,
    /** {en}
     * @brief Move to the right.
     */
    /** {zh}
     * @brief 相机向右移动
     */
    kCameraMoveRight = 1,
    /** {en}
     * @brief Move upwards.
     */
    /** {zh}
     * @brief 相机向上移动
     */
    kCameraMoveUp = 2,
    /** {en}
     * @brief Move downwards.
     */
    /** {zh}
     * @brief 相机向下移动
     */
    kCameraMoveDown = 3,
    /** {en}
     * @brief Zoom out.
     */
    /** {zh}
     * @brief 相机缩小焦距
     */
    kCameraZoomOut = 4,
    /** {en}
     * @brief Zoom in.
     */
    /** {zh}
     * @brief 相机放大焦距
     */
    kCameraZoomIn = 5,
    /** {en}
     * @brief Reset digital zoom.
     */
    /** {zh}
     * @brief 恢复到原始画面
     */
    kCameraReset = 6
}
/** {zh}
 * @brief 视频降噪模式状态改变原因。
 */
export declare enum VideoDenoiseModeChangedReason {
    /** {zh}
     * @brief 未知原因导致视频降噪状态改变。
     */
    kVideoDenoiseModeChangedReasonNull = -1,
    /** {zh}
     * @brief 通过调用 [setVideoDenoiser](85532#rtcvideo-setvideodeniser) 成功关闭视频降噪。
     */
    kVideoDenoiseModeChangedReasonApiOff = 0,
    /** {zh}
     * @brief 通过调用 [setVideoDenoiser](85532#rtcvideo-setvideodeniser) 成功开启视频降噪。
     */
    kVideoDenoiseModeChangedReasonApiOn = 1,
    /** {zh}
     * @brief 后台未配置视频降噪，视频降噪开启失败，请联系技术人员解决。
     */
    kVideoDenoiseModeChangedReasonConfigDisabled = 2,
    /** {zh}
     * @brief 后台配置开启了视频降噪。
     */
    kVideoDenoiseModeChangedReasonConfigEnabled = 3,
    /** {zh}
     * @brief 由于内部发生了异常，视频降噪关闭。
     */
    kVideoDenoiseModeChangedReasonInternalException = 4,
    /** {zh}
     * @brief 当前设备性能过载，已动态关闭视频降噪。
     */
    kVideoDenoiseModeChangedReasonDynamicClose = 5,
    /** {zh}
     * @brief 当前设备性能裕量充足，已动态开启视频降噪。
     */
    kVideoDenoiseModeChangedReasonDynamicOpen = 6,
    /** {zh}
     * @brief 分辨率导致视频降噪状态发生改变。分辨率过高会导致性能消耗过大，从而导致视频降噪关闭。若希望继续使用视频降噪，可选择降低分辨率。
     */
    kVideoDenoiseModeChangedReasonResolution = 7
}
/** {zh}
 * @brief 合流类型(新)
 */
export declare enum MixedStreamType {
    /** {en}
     * @brief Server-side stream mixing
     */
    /** {zh}
     * @brief 服务端合流
     */
    kMixedStreamTypeByServer = 0,
    /** {en}
     * @brief Intelligent stream mixing. The SDK will intelligently decide that a stream mixing task would be done on the client or the server.
     */
    /** {zh}
     * @brief 端云一体合流。SDK 智能决策在客户端或服务端完成合流。
     */
    kMixedStreamTypeByClient = 1
}
/** {en}
 * @brief Advanced Audio Coding (AAC) profile.
 */
/** {zh}
 * @brief AAC 编码规格(新)。
 */
export declare enum MixedStreamAudioProfile {
    /** {en}
     * @brief (Default) AAC Low-Complexity profile (AAC-LC).
     */
    /** {zh}
     * @brief AAC-LC 规格，默认值。
     */
    kMixedStreamAudioProfileLC = 0,
    /** {en}
     * @brief HE-AAC v1 profile (AAC LC with SBR).
     */
    /** {zh}
     * @brief HE-AAC v1 规格。
     */
    kMixedStreamAudioProfileHEv1 = 1,
    /** {en}
     * @brief HE-AAC v2 profile (AAC LC with SBR and Parametric Stereo).
     */
    /** {zh}
     * @brief HE-AAC v2 规格。
     */
    kMixedStreamAudioProfileHEv2 = 2
}
/** {en}
 * @brief The audio codec.
 */
/** {zh}
 * @brief 音频编码格式(新)。
 */
export declare enum MixedStreamAudioCodecType {
    /** {en}
     * @brief AAC format.
     */
    /** {zh}
     * @brief AAC 格式。
     */
    kMixedStreamAudioCodecTypeAAC = 0
}
/** {en}
 * @brief The video codec.
 */
/** {zh}
 * @brief 视频编码格式(新)。
 */
export declare enum MixedStreamVideoCodecType {
    /** {en}
     * @brief (Default) H.264 format.
     */
    /** {zh}
     * @brief H.264 格式，默认值。
     */
    kMixedStreamVideoCodecTypeH264 = 0,
    /** {en}
     * @brief ByteVC1 format.
     */
    /** {zh}
     * @brief ByteVC1 格式。
     */
    kMixedStreamVideoCodecTypeByteVC1 = 1
}
/** {en}
 * @brief The render mode.
 */
/** {zh}
 * @brief 图片或视频流的缩放模式(新)。
 */
export declare enum MixedStreamRenderMode {
    /** {en}
     * @brief (Default) Fill and Crop.
     *        The video frame is scaled with fixed aspect ratio, until it completely fills the canvas. The region of the video exceeding the canvas will be cropped.
     */
    /** {zh}
     * @brief 视窗填满优先，默认值。
     *        视频尺寸等比缩放，直至视窗被填满。当视频尺寸与显示窗口尺寸不一致时，多出的视频将被截掉。
     */
    kMixedStreamRenderModeHidden = 1,
    /** {en}
     * @brief Fit.
     *        The video frame is scaled with fixed aspect ratio, until it fits just within the canvas. Other part of the canvas is filled with the background color.
     */
    /** {zh}
     * @brief 视频帧内容全部显示优先。
     *        视频尺寸等比缩放，优先保证视频内容全部显示。当视频尺寸与显示窗口尺寸不一致时，会把窗口未被填满的区域填充成背景颜色。
     */
    kMixedStreamRenderModeFit = 2,
    /** {en}
     * @brief Fill the canvas.
     *        The video frame is scaled to fill the canvas. During the process, the aspect ratio may change.
     */
    /** {zh}
     * @brief 视频帧自适应画布。
     *        视频尺寸非等比例缩放，把窗口充满。在此过程中，视频帧的长宽比例可能会发生变化。
     */
    kMixedStreamRenderModeAdaptive = 3
}
/** {en}
 * @brief Types of streams to be mixed
 */
/** {zh}
 * @brief 合流输出内容类型(新)。
 */
export declare enum MixedStreamMediaType {
    /** {en}
     * @brief Audio and video
     */
    /** {zh}
     * @brief 输出的混流包含音频和视频
     */
    kMixedStreamMediaTypeAudioAndVideo = 0,
    /** {en}
     * @brief Audio only
     */
    /** {zh}
     * @brief 输出的混流只包含音频
     */
    kMixedStreamMediaTypeAudioOnly = 1,
    /** {en}
     * @brief Video only
     */
    /** {zh}
     * @brief 输出的混流只包含视频
     */
    kMixedStreamMediaTypeVideoOnly = 2
}
/** {en}
 * @brief Stream mixing region type
 */
/** {zh}
 * @brief 合流布局区域类型(新)。
 */
export declare enum MixedStreamLayoutRegionType {
    /** {en}
     * @brief The region type is a video stream.
     */
    /** {zh}
     * @brief 合流布局区域类型为视频。
     */
    kMixedStreamLayoutRegionTypeVideoStream = 0,
    /** {en}
     * @brief The region type is an image.
     */
    /** {zh}
     * @brief 合流布局区域类型为图片。
     */
    kMixedStreamLayoutRegionTypeImage = 1
}
/** {en}
 * @brief The video format for client stream mixing callback. If the format you set is not adaptable to the system, the format will be set as the default value.
 */
/** {zh}
 * @brief 客户端合流回调视频格式(新)。设置为系统不支持的格式时，自动回调系统默认格式。
 */
export declare enum MixedStreamClientMixVideoFormat {
    /** {en}
     * @brief YUV I420 format. The default format for Android and Windows. Supported system: Android, Windows.
     */
    /** {zh}
     * @brief YUV I420。Android、Windows 默认回调格式。支持系统：Android、Windows。
     */
    kMixedStreamClientMixVideoFormatI420 = 0,
    /** {en}
     * @brief OpenGL GL_TEXTURE_2D format. Supported system: Android.
     */
    /** {zh}
     * @brief OpenGL GL_TEXTURE_2D 格式纹理。支持系统：安卓。
     */
    kMixedStreamClientMixVideoFormatTexture2D = 1,
    /** {en}
     * @brief CVPixelBuffer BGRA format. The default format for iOS. support system: iOS.
     */
    /** {zh}
     * @brief CVPixelBuffer BGRA。iOS 默认回调格式。支持系统: iOS。
     */
    kMixedStreamClientMixVideoFormatCVPixelBufferBGRA = 2,
    /** {zh}
     * @brief YUV NV12。macOS 默认回调格式。支持系统: macOS。
     */
    /** {en}
     * @brief YUV NV12 format. The default format for macOS. Supported system: macOS.
     */
    kMixedStreamClientMixVideoFormatNV12 = 3
}
/** {en}
 * @brief Stream type
 */
/** {zh}
 * @brief region中流的类型属性
 */
export declare enum MixedStreamVideoType {
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
    kMixedStreamVideoTypeMain = 0,
    /** {en}
     * @brief Screen-sharing stream.
     */
    /** {zh}
     * @brief 屏幕流。
     */
    kMixedStreamVideoTypeScreen = 1
}
/** {en}
 *  @brief Audio transcoding configurations. With invalid or empty input, the configurations will be set as the default values.
 */
/** {zh}
 *  @brief 音频合流配置参数(新)。值不合法或未设置时，自动使用默认值。
 */
export interface MixedStreamAudioConfig {
    /** {en}
     * @brief The sample rate (Hz). Supported sample rates: 32,00 Hz, 44,100 Hz, 48,000 Hz. Defaults to 48,000 Hz.
     */
    /** {zh}
     * @brief 音频采样率，单位 Hz。可取 32000 Hz、44100 Hz、48000 Hz，默认值为 48000 Hz。
     */
    sample_rate: 32000 | 44100 | 48000;
    /** {en}
     * @brief The number of channels. Supported channels: 1 (single channel), 2 (dual channel).  Defaults to 2.
     */
    /** {zh}
     * @brief 音频声道数。可取 1（单声道）、2（双声道），默认值为 2。
     */
    channels: 1 | 2;
    /** {en}
     * @brief The bitrate (Kbps) in range of [32, 192]. Defaults to 64 Kbps.
     */
    /** {zh}
     * @brief 音频码率，单位 Kbps。可取范围 [32, 192]，默认值为 64 Kbps。
     */
    bitrate: number;
    /** {en}
     * @brief AAC profile. Defaults to `0`.
     */
    /** {zh}
     * @brief AAC 编码规格。默认值为 `0`。
     */
    audio_profile: MixedStreamAudioProfile;
    /** {en}
     * @brief AAC profile. Defaults to `0`.
     */
    /** {zh}
     * @brief 音频编码格式。默认值为 `0`。
     */
    audio_codec: MixedStreamAudioCodecType;
}
/** {en}
 * @brief Video mix stream configurations. With invalid or empty input, the configurations will be set as the default values.
 */
/** {zh}
 * @brief 视频合流配置参数(新)。值不合法或未设置时，自动使用默认值。
 */
export interface MixedStreamVideoConfig {
    /** {en}
     * @brief The width (pixels) to be set. The range is [2, 1920], and must be an even number. The default value is 360 pixels.
     *        If an odd number is set, the width will be adjusted to the next larger even number.
     */
    /** {zh}
     * @brief 合流视频宽度。单位为 px，范围为 [2, 1920]，必须是偶数。默认值为 360 px。
     *        设置值为非偶数时，自动向上取偶数。
     */
    width: number;
    /** {en}
     * @brief The height (pixels) to be set. The range is [2, 1920], and must be an even number. The default value is 640 pixels.
     *        If an odd number is set, the height will be adjusted to the next larger even number.
     */
    /** {zh}
     * @brief 合流视频高度。单位为 px，范围为 [2, 1920]，必须是偶数。默认值为 640 px。
     *        设置值为非偶数时，自动向上取偶数。
     */
    height: number;
    /** {en}
     * @brief The frame rate (FPS) in range of [1, 60]. The default value is 15 FPS.
     */
    /** {zh}
     * @brief 合流视频帧率。单位为 FPS，取值范围为 [1,60]，默认值为 15 FPS。
     */
    fps: number;
    /** {en}
     * @brief The time interval between I-frames (second) in range of [1, 5]. The default value is 2 seconds.
     *        This parameter cannot be updated while pushing stream to the CDN.
     */
    /** {zh}
     * @brief 视频 I 帧时间间隔。单位为秒，取值范围为 [1, 5]，默认值为 2 秒。
     *        本参数不支持过程中更新。
     */
    gop: number;
    /** {en}
     * @brief The bitrate (Kbps) in range of [1, 10000]. The default value is self-adaptive.
     */
    /** {zh}
     * @brief 合流视频码率。单位为 Kbps，取值范围为 [1,10000]，默认值为自适应模式。
     */
    bitrate: number;
    /** {en}
     * @brief The video codec. The default value is `0`.
     *        This parameter cannot be updated while pushing stream to the CDN.
     */
    /** {zh}
     * @brief 视频编码格式。默认值为 `0`。
     *        本参数不支持过程中更新。
     */
    video_codec: MixedStreamVideoCodecType;
    /** {en}
     * @brief Whether to push streams with B frame, only support by server mix:
     * + True: Yes
     * + False: No
     */
    /** {zh}
     * @brief 是否在合流中开启 B 帧，仅服务端合流支持：
     * + true: 是
     * + false: 否
     */
    enable_Bframe: boolean;
}
/** {en}
 * @brief Client mixing parameters.
 */
/** {zh}
 * @brief 客户端合流参数(新)。
 */
export interface MixedStreamClientMixConfig {
    /** {en}
     * @brief Whether to use audio mixing. Default is true.
     */
    /** {zh}
     * @brief 客户端合流是否使用混音，默认为 true。
     */
    use_audio_mixer: boolean;
    /** {en}
     * @brief The video format to be set.
     */
    /** {zh}
     * @brief 客户端合流回调视频格式。
     */
    video_format: MixedStreamClientMixVideoFormat;
}
/** {en}
 * @brief  Image parameters for stream mixing
 */
/** {zh}
 * @brief 图片合流相关参数(新)。
 */
export interface MixedStreamLayoutRegionImageWaterMarkConfig {
    /** {en}
     * @brief Width of the original image in px.
     */
    /** {zh}
     * @brief 原始图片的宽度，单位为 px。
     */
    image_width: number;
    /** {en}
     * @brief Height of the original image in px.
     */
    /** {zh}
     * @brief 原始图片的高度，单位为 px。
     */
    image_height: number;
}
/** {en}
 * @brief Spatial audio config when pushing to CDN.
 */
/** {zh}
 * @brief 推流 CDN 的空间音频参数(新)。
 */
export interface MixedStreamSpatialAudioConfig {
    /** {en}
     * @brief Whether to enable the spatial audio effect when pushing to CDN.
     * @notes when you enable the feature, set the `spatial_position` of each [MixedStreamLayoutRegionConfig](85535#onsetroomextrainforesult) for spatial audio effect.
     */
    /** {zh}
     * @brief 是否开启推流 CDN 时的空间音频效果。
     * @notes 当你启用此效果时，你需要设定推流中各个 [MixedStreamLayoutRegionConfig](85535#onsetroomextrainforesult) 的 `spatial_position` 值，实现空间音频效果。
     */
    enable_spatial_render: boolean;
    /** {en}
     * @brief The spatial position of the audience.
     *        The audience is the users who receive the audio stream from CDN.
     */
    /** {zh}
     * @brief 听众的空间位置。
     *        听众指收听来自 CDN 的音频流的用户。
     */
    audience_spatial_position: Position;
    /** {en}
     * @brief The orientation of the audience.
     *        The audience is the users who receive the audio stream from CDN.
     */
    /** {zh}
     * @brief 听众的空间朝向。
     *        听众指收听来自 CDN 的音频流的用户。
     */
    audience_spatial_orientation: HumanOrientation;
}
/** {en}
 * @brief Layout information for one of the video streams to be mixed.
 *        After starting to push streams to CDN and mixing multiple video streams, you can set the layout information for each of them.
 */
/** {zh}
 * @brief 单个图片或视频流在合流中的布局信息(新)。
 *        开启合流功能后，在多路图片或视频流合流时，你可以设置其中一路流在合流中的预设布局信息。
 */
export interface MixedStreamLayoutRegionConfig {
    /** {en}
     * @brief The user ID of the user who publishes the video stream. Required.
     */
    /** {zh}
     * @brief 合流用户的 ID。必填。
     */
    region_id: string;
    /** {en}
     * @brief The room ID of the media stream. Required.
     *        If the media stream is the stream forwarded by [startForwardStreamToRooms](85532#rtcroom-startforwardstreamtorooms), you must set the roomID to the room ID of the target room.
     */
    /** {zh}
     * @brief 图片或视频流所在房间的房间 ID。必填。
     *        如果此图片或视频流是通过 [startForwardStreamToRooms](85532#rtcroom-startforwardstreamtorooms) 转发到你所在房间的媒体流时，你应将房间 ID 设置为你所在的房间 ID。
     */
    room_id: string;
    /** {en}
     * @brief The normalized horizontal coordinate value of the top left end vertex of the user's view, ranging within [0.0, 1.0). The default value is 0.0.
     */
    /** {zh}
     * @brief 视频流对应区域左上角的横坐标相对整体画面的归一化比例，取值的范围为 [0.0, 1.0)。默认值为 0.0。
     */
    location_x: number;
    /** {en}
     * @brief The normalized vertical coordinate value of the top left end vertex of the user's view, ranging within [0.0, 1.0). The default value is 0.0.
     */
    /** {zh}
     * @brief 视频流对应区域左上角的纵坐标相对整体画面的归一化比例，取值的范围为 [0.0, 1.0)。默认值为 0.0。
     */
    location_y: number;
    /** {en}
     * @brief The normalized width of the user's view, ranging within [0.0, 1.0]. The default value is 1.0.
     */
    /** {zh}
     * @brief 视频流对应区域宽度相对整体画面的归一化比例，取值的范围为 [0.0, 1.0]。默认值为 1.0。
     */
    width_proportion: number;
    /** {en}
     * @brief The normalized height of the user's view, ranging within [0.0, 1.0]. The default value is 1.0.
     */
    /** {zh}
     * @brief 视频流对应区域高度相对整体画面的归一化比例，取值的范围为 [0.0, 1.0]。默认值为 1.0。
     */
    height_proportion: number;
    /** {en}
     * @brief The opacity in range of (0.0, 1.0]. The lower value, the more transparent. The default value is 1.0.
     */
    /** {zh}
     * @brief 透明度，可选范围为 (0.0, 1.0]，0.0 为全透明。默认值为 1.0。
     */
    alpha: number;
    /** {en}
     * @brief The proportion of the radius to the width of the canvas. `0.0` by default.
     * @notes After you set the value, `width_px`, `height_px`, and `corner_radius_px` are calculated based on `width`, `height`, `corner_radius`, and the width of the canvas. If `corner_radius_px < min(width_px/2, height_px/2)` is met, the value of `corner_radius` is set valid; if not, `corner_radius_px` is set to `min(width_px/2, height_px/2)`, and `corner_radius` is set to the proportion of `corner_radius_px` to the width of the canvas.
     */
    /** {zh}
     * @brief 圆角半径相对画布宽度的比例。默认值为 `0.0`。
     * @notes 做范围判定时，首先根据画布的宽高，将 `width`，`height`，和 `corner_radius` 分别转换为像素值：`width_px`，`height_px`，和 `corner_radius_px`。然后判定是否满足 `corner_radius_px < min(width_px/2, height_px/2)`：若满足，则设置成功；若不满足，则将 `corner_radius_px` 设定为 `min(width_px/2, height_px/2)`，然后将 `corner_radius` 设定为 `corner_radius_px` 相对画布宽度的比例值。
     */
    corner_radius: number;
    /** {en}
     * @brief The layer on which the video is rendered. The range is [0, 100]. 0 for the bottom layer, and 100 for the top layer. The default value is 0.
     */
    /** {zh}
     * @brief 用户视频布局在画布中的层级。取值范围为 [0 - 100]，0 为底层，值越大越上层。默认值为 0。
     */
    z_order: number;
    /** {en}
     * @brief Whether the source user of the stream is a local user:
     * + True: Yes
     * + False: No
     */
    /** {zh}
     * @brief 是否为本地用户：
     * + true: 是
     * + false: 否
     */
    is_local_user: boolean;
    /** {en}
     * @brief Whether the stream comes from screen sharing:
     */
    /** {zh}
     * @brief 是否为屏幕流：
     */
    stream_type: MixedStreamVideoType;
    /** {en}
     * @brief The stream mixing content type. The default value is `kMediaTypeAudioAndVideo`.
     */
    /** {zh}
     * @brief 合流内容控制。默认值为 `kMediaTypeAudioAndVideo`。
     */
    media_type: MixedStreamMediaType;
    /** {en}
     * @brief The render mode. The default value is 1.
     */
    /** {zh}
     * @brief 图片或视频流的缩放模式。默认值为 1。
     */
    render_mode: MixedStreamRenderMode;
    /** {en}
     * @brief  Stream mixing region type.
     */
    /** {zh}
     * @brief 合流布局区域类型。
     */
    region_content_type: MixedStreamLayoutRegionType;
    /** {en}
     * @brief The RGBA data of the mixing image. Put in null when mixing video streams.
     */
    /** {zh}
     * @brief 图片合流布局区域类型对应的数据。类型为图片时传入图片 RGBA 数据，当类型为视频流时传空。
     */
    image_water_mark: Uint8Array;
    /** {en}
     * @brief  Image parameters for stream mixing. Put in null when mixing video streams.
     */
    /** {zh}
     * @brief 合流布局区域数据的对应参数。当类型为视频流时传空，类型为图片时传入对应图片的参数。
     */
    image_water_mark_param: MixedStreamLayoutRegionImageWaterMarkConfig;
    /** {en}
     * @brief spatial position.
     */
    /** {zh}
     * @brief 空间位置。
     */
    spatial_position: Position;
    /** {en}
     * @brief Whether to apply spatial audio.
     */
    /** {zh}
     * @brief 是否开启空间音频
     */
    apply_spatial_audio: boolean;
}
/** {en}
 * @detail 85534
 * @brief Errors occurring during pushing streams to CDN
 */
/** {zh}
 * @detail 85534
 * @brief 转推直播错误码
 */
export declare enum StreamMixingErrorCode {
    /** {en}
     * @brief Successfully pushed streams to target CDN.
     */
    /** {zh}
     * @brief 推流成功。
     */
    kStreamMixingErrorOK = 0,
    /** {en}
     * @brief Undefined error
     */
    /** {zh}
     * @brief 未定义的合流错误
     */
    kStreamMixingErrorBase = 1090,
    /** {en}
     * @brief Invalid parameters detected by Client SDK.
     */
    /** {zh}
     * @brief 客户端 SDK 检测到无效推流参数。
     */
    kStreamMixingErrorInvalidParam = 1091,
    /** {en}
     * @brief Program runs with an error, the state machine is in abnormal condition.
     */
    /** {zh}
     * @brief 状态错误，需要在状态机正常状态下发起操作
     */
    kStreamMixingErrorInvalidState = 1092,
    /** {en}
     * @brief Invalid operation
     */
    /** {zh}
     * @brief 无效操作
     */
    kStreamMixingErrorInvalidOperator = 1093,
    /** {en}
     * @brief Request timed out. Please check network status and retry.
     */
    /** {zh}
     * @brief 转推直播任务处理超时，请检查网络状态并重试
     */
    kStreamMixingErrorTimeout = 1094,
    /** {en}
     * @brief Invalid parameters detected by the server
     */
    /** {zh}
     * @brief 服务端检测到错误的推流参数
     */
    kStreamMixingErrorInvalidParamByServer = 1095,
    /** {en}
     * @brief Subscription to the stream has expired.
     */
    /** {zh}
     * @brief 对流的订阅超时
     */
    kStreamMixingErrorSubTimeoutByServer = 1096,
    /** {en}
     * @brief Internal server error.
     */
    /** {zh}
     * @brief 合流服务端内部错误。
     */
    kStreamMixingErrorInvalidStateByServer = 1097,
    /** {en}
     * @brief The server failed to push streams to CDN.
     */
    /** {zh}
     * @brief 合流服务端推 CDN 失败。
     */
    kStreamMixingErrorAuthenticationByCDN = 1098,
    /** {en}
     * @brief Signaling connection timeout error. Please check network status and retry.
     */
    /** {zh}
     * @brief 服务端接收信令超时，请检查网络状态并重试。
     */
    kStreamMixingErrorTimeoutBySignaling = 1099,
    /** {en}
     * @brief Failed to mix image.
     */
    /** {zh}
     * @brief 图片合流失败。
     */
    kStreamMixingErrorMixImageFail = 1100,
    /** {en}
     * @brief Unknown error from server.
     */
    /** {zh}
     * @brief 服务端未知错误。
     */
    kStreamMixingErrorUnKnownByServer = 1101,
    /** {en}
     * @hidden internal use only
     * @brief The cache is not synchronized.
     */
    /** {zh}
     * @hidden internal use only
     * @valid since 3.50
     * @brief 缓存未同步。
     */
    kStreamMixingErrorStreamSyncWorse = 1102,
    /** {en}
     * @hidden for internal use only
     * @brief The ‘regions’ field in transcoding message is changed.
     */
    /** {zh}
     * @hidden 只供内部使用
     * @brief 合流消息中的用户布局信息发生了变化。
     */
    kStreamMixingErrorUpdateRegionChanged = 1103,
    /** {en}
     * @hidden for internal use only
     */
    /** {zh}
     * @hidden for internal use only
     */
    kStreamMixingErrorMax = 1199
}
/** {en}
 * @brief  Whether to turn on the earphone monitoring function
 */
/** {zh}
 * @brief 是否开启耳返功能
 */
export declare enum EarMonitorMode {
    /** {en}
     * @brief Not open
     */
    /** {zh}
     * @brief 不开启
     */
    kEarMonitorModeOff = 0,
    /** {en}
     * @brief Open
     */
    /** {zh}
     * @brief 开启
     */
    kEarMonitorModeOn = 1
}
export declare enum ReturnStatus {
    /**
     * @brief 成功。
     */
    kReturnStatusSuccess = 0,
    /**
     * @brief 失败。
     */
    kReturnStatusFailure = -1,
    /**
     * @brief 参数错误。
     */
    kReturnStatusParameterErr = -2,
    /**
     * @brief 接口状态错误。
     */
    kReturnStatusWrongState = -3,
    /**
     * @brief 失败，用户已在房间内。
     */
    kReturnStatusHasInRoom = -4,
    /**
     * @brief 失败，用户已登录。
     */
    kReturnStatusHasInLogin = -5,
    /**
     * @brief 失败，用户已经在进行通话回路测试中。
     */
    kReturnStatusHasInEchoTest = -6,
    /**
     * @brief 失败，音视频均未采集。
     */
    kReturnStatusNeitherVideoNorAudio = -7,
    /**
     * @brief 失败，该 roomId 已被使用。
     */
    kReturnStatusRoomIdInUse = -8,
    /**
     * @brief 失败，屏幕流不支持。
     */
    kReturnStatusScreenNotSupport = -9,
    /**
     * @brief 失败，不支持该操作。
     */
    kReturnStatusNotSupport = -10,
    /**
     * @brief 失败，资源已占用。
     */
    kReturnStatusResourceOverflow = -11,
    /**
     * @brief 失败，不支持视频接口调用。
     */
    kReturnStatusVideoNotSupport = -12,
    /**
     * @brief 失败，没有音频帧。
     */
    kReturnStatusAudioNoFrame = -101,
    /**
     * @brief 失败，未实现。
     */
    kReturnStatusAudioNotImplemented = -102,
    /**
     * @brief 失败，采集设备无麦克风权限，尝试初始化设备失败。
     */
    kReturnStatusAudioNoPermission = -103,
    /**
     * @brief 失败，设备不存在。当前没有设备或设备被移除时返回该值。
     */
    kReturnStatusAudioDeviceNotExists = -104,
    /**
     * @brief 失败，设备音频格式不支持。
     */
    kReturnStatusAudioDeviceFormatNotSupport = -105,
    /**
     * @brief 失败，系统无可用设备。
     */
    kReturnStatusAudioDeviceNoDevice = -106,
    /**
     * @brief 失败，当前设备不可用，需更换设备。
     */
    kReturnStatusAudioDeviceCannotUse = -107,
    /**
     * @brief 系统错误，设备初始化失败。
     */
    kReturnStatusAudioDeviceInitFailed = -108,
    /**
     * @brief 系统错误，设备开启失败。
     */
    kReturnStatusAudioDeviceStartFailed = -109,
    /**
     * @brief 失败，无效对象。
     */
    kReturnStatusNativeInvalid = -201
}
export declare enum UserVisibilityChangeError {
    /**
     * @brief 成功。
     */
    kUserVisibilityChangeErrorOk = 0,
    /**
     * @brief 未知错误。
     */
    kUserVisibilityChangeErrorUnknown = 1,
    /**
     * @brief 房间内可见用户达到上限。
     */
    kUserVisibilityChangeErrorTooManyVisibleUser = 2
}
/** {en}
 * @brief Local log parameters.
 */
/** {zh}
 * @brief 本地日志输出等级。
 */
export declare enum LocalLogLevel {
    /** {en}
     * @brief Info level.
     */
    /** {zh}
     * @brief 信息级别。
     */
    kInfo = 0,
    /** {en}
     * @brief (Default) Warning level.
     */
    /** {zh}
     * @brief （默认值）警告级别。
     */
    kWarning = 1,
    /** {en}
     * @brief Error level.
     */
    /** {zh}
     * @brief 错误级别。
     */
    kError = 2,
    /** {en}
     * @brief Turn off logging.
     */
    /** {zh}
     * @brief 关闭日志。
     */
    kNone = 3
}
/** {en}
 * @type keytype
 * @brief Local log parameters.
 */
/** {zh}
 * @type keytype
 * @brief 本地日志参数。
 */
export interface LogConfig {
    /** {en}
     * @brief Local log directory.
     */
    /** {zh}
     * @brief 日志存储路径。
     */
    log_path: string;
    /** {en}
     * @brief The logging level. The default is warning level.
     */
    /** {zh}
     * @brief 日志等级，默认为警告级别。
     */
    log_level: LocalLogLevel;
    /** {en}
     * @brief The maximum cache space available for logs in MB. the range is 1 to 100 MB, and the default value is 10 MB.
     */
    /** {zh}
     * @brief 日志可使用的最大缓存空间，单位为 MB。取值范围为 1～100 MB，默认值为 10 MB。
     */
    log_file_size: number;
}
export declare enum PlayerState {
    /**
     * @brief 播放未启动
     */
    kPlayerStateIdle = 0,
    /**
     * @brief 已加载
     */
    kPlayerStatePreloaded = 1,
    /**
     * @brief 播放文件已打开
     */
    kPlayerStateOpened = 2,
    /**
     * @brief 正在播放
     */
    kPlayerStatePlaying = 3,
    /**
     * @brief 播放已暂停
     */
    kPlayerStatePaused = 4,
    /**
     * @brief 播放已停止
     */
    kPlayerStateStopped = 5,
    /**
     * @brief 播放失败
     */
    kPlayerStateFailed = 6
}
export declare enum PlayerError {
    /**
     * @brief 正常
     */
    kPlayerErrorOK = 0,
    /**
     * @brief 不支持此类型
     */
    kPlayerErrorFormatNotSupport = 1,
    /**
     * @brief 无效的播放路径
     */
    kPlayerErrorInvalidPath = 2,
    /**
     * @brief 无效的状态
     */
    kPlayerErrorInvalidState = 3,
    /**
     * @brief 设置播放位置出错
     */
    kPlayerErrorInvalidPosition = 4,
    /**
     * @brief 音量参数不合法，仅支持设置的音量值为[0, 400]
     */
    kPlayerErrorInvalidVolume = 5,
    /**
     * @brief 音调参数设置不合法
     */
    kPlayerErrorInvalidPitch = 6,
    /**
     * @brief 音轨参数设置不合法
     */
    kPlayerErrorInvalidAudioTrackIndex = 7,
    /**
     * @brief 播放速度参数设置不合法
     */
    kPlayerErrorInvalidPlaybackSpeed = 8,
    /**
     * @brief 音效 ID 异常
     */
    kPlayerErrorInvalidEffectId = 9
}
/** {en}
 * @brief Mixing configuration
 */
/** {zh}
 * @brief 混音配置
 */
export interface AudioEffectPlayerConfig {
    /** {en}
     * @brief Mixing playback types.
     */
    /** {zh}
     * @brief 混音播放类型
     */
    type: AudioMixingType;
    /** {en}
     * @brief Mix playback times
     *        + Play_count < = 0: Infinite loop
     *        + Play_count == 1: Play once (default)
     *        + Play_count > 1: Play play_count times
     */
    /** {zh}
     * @brief 混音播放次数
     *       + play_count <= 0: 无限循环
     *       + play_count == 1: 播放一次（默认）
     *       + play_count > 1: 播放 play_count 次
     */
    play_count: number;
    /** {en}
     * @brief The starting position in ms. 0 by default.
     */
    /** {zh}
     * @brief 混音起始位置。默认值为 0，单位为毫秒。
     */
    pitch: number;
    /** {en}
     * @brief The starting position in ms. 0 by default.
     */
    /** {zh}
     * @brief 混音起始位置。默认值为 0，单位为毫秒。
     */
    start_pos: number;
}
/** {en}
 * @brief Mixing configuration
 */
/** {zh}
 * @brief 混音配置
 */
export interface MediaPlayerConfig {
    /** {en}
     * @brief Mix playback times
     *        + Play_count < = 0: Infinite loop
     *        + Play_count == 1: Play once (default)
     *        + Play_count > 1: Play play_count times
     */
    /** {zh}
     * @brief 混音播放次数
     *       + play_count <= 0: 无限循环
     *       + play_count == 1: 播放一次（默认）
     *       + play_count > 1: 播放 play_count 次
     */
    play_count: number;
    /** {en}
     * @brief The starting position in ms. 0 by default.
     */
    /** {zh}
     * @brief 混音起始位置。默认值为 0，单位为毫秒。
     */
    start_pos: number;
    /** {en}
    * @brief Set the interval of the periodic callback [onMediaPlayerPlayingProgress](85533#rtcmediaplayercallback-onmediaplayerplayingprogress) during audio mixing in ms.
    *       + interval > 0: The callback is enabled. The actual interval is `10*(mod(10)+1)`.
    *       + interval <= 0: The callback is disabled.
    */
    /** {zh}
     * @brief 设置音频文件混音时，收到 [onMediaPlayerPlayingProgress](85533#rtcmediaplayercallback-onmediaplayerplayingprogress) 的间隔。单位毫秒。
     *       + interval > 0 时，触发回调。实际间隔是 `10*(mod(10)+1)`。
     *       + interval <= 0 时，不会触发回调。
     */
    callback_on_progress_interval: string;
    /** {en}
     * @brief Attach the process information of local audio file mixing to the captured audio data. Enable the function to enhance the synchronicity of the remote audio mixing.
     * @notes + The function is effective when mixing a single audio file.
     *        + Use `true` for enabling the function and `false` for disable the function. The default is `false`.
     */
    /** {zh}
     * @brief 在采集音频数据时，附带本地混音文件播放进度的时间戳。启用此功能会提升远端人声和音频文件混音播放时的同步效果。
     * @notes + 仅在单个音频文件混音时使用有效。
     *        + `true` 时开启此功能，`false` 时关闭此功能，默认为关闭。
     */
    sync_progress_to_record_frame: boolean;
    /** {en}
    * @brief Play the audio automatically. If not, call [startAudioMixing](85532#rtcvideo-startaudiomixing) to play the audio.
    */
    /** {zh}
    * @brief 是否自动播放。如果不自动播放，调用 [startAudioMixing](85532#rtcvideo-startaudiomixing) 播放音乐文件。
    */
    auto_play: boolean;
    /** {en}
     * @brief For mixing playback types.
     */
    /** {zh}
     * @brief 混音播放类型
     */
    type: AudioMixingType;
}
/** {en}
 * @hidden
 * @type keytype
 * @brief The filter type of the music list.
 */
/** {zh}
 * @type keytype
 * @brief 歌曲过滤方式。
 */
export declare enum MusicFilterType {
    /** {en}
     * @brief No filter.
     */
    /** {zh}
     * @brief 不过滤。
     */
    kMusicFilterTypeNone = 0,
    /** {en}
     * @brief Remove music that does not have lyrics.
     */
    /** {zh}
     * @brief 过滤没有歌词的歌曲。
     */
    kMusicFilterTypeWithoutLyric = 1,
    /** {en}
     * @brief Remove music that does not support scoring.
     */
    /** {zh}
     * @brief 过滤不支持打分的歌曲。
     */
    kMusicFilterTypeUnsupportedScore = 2,
    /** {en}
     * @brief Remove music that does not support accompany mode.
     */
    /** {zh}
     * @brief 过滤不支持伴唱切换的歌曲。
     */
    kMusicFilterTypeUnsupportedAccopmay = 4,
    /** {en}
     * @brief Remove music that does not have a climax part.
     */
    /** {zh}
     * @brief 过滤没有高潮片段的歌曲。
     */
    kMusicFilterTypeUnsupportedClimx = 8
}
/** {en}
 * @brief Audio format
 */
/** {zh}
 * @brief 音频格式
 */
export interface AudioFormat {
    /** {en}
     * @brief Audio sample rate.
     */
    /** {zh}
     * @brief 音频采样率
     */
    sample_rate: AudioSampleRate;
    /** {en}
     * @brief Audio channels.
     */
    /** {zh}
     * @brief 音频声道
     */
    channel: AudioChannel;
    /** {en}
     * @brief Samples per audio frame returned by callback. `0` by default. The default samples per callback is the minimum value.
     *        The minimum value is `sampleRate * channel * 0.01s`, the value when the callback interval is 0.01s.
     *        The maximum value is `2048`. If the value is invalid, the samples per callback uses the default value.
     */
    /** {zh}
     * @brief 单次回调的音频帧中包含的采样点数。默认值为 `0`，此时，采样点数取最小值。
     *        最小值为回调间隔是 0.01s 时的值，即 `sampleRate * channel * 0.01s`。
     *        最大值是 `2048`。超出取值范围时，采样点数取默认值。
     */
    samples_per_call: number;
}
/** {en}
 * @brief Audio data callback method
 */
/** {zh}
 * @brief 音频回调方法
 */
export declare enum AudioFrameCallbackMethod {
    /** {en}
     * @brief The callback of the audio data recorded by local microphone.
     */
    /** {zh}
     * @brief 本地麦克风录制的音频数据回调
     */
    kAudioFrameCallbackRecord = 0,
    /** {en}
     * @brief The callback of the mixed audio data of all remote users subscribed by the local user.
     */
    /** {zh}
     * @brief 订阅的远端所有用户混音后的音频数据回调
     */
    kAudioFrameCallbackPlayback = 1,
    /** {en}
     * @brief The callback of the mixed audio data including the data recorded by local microphone and that of all remote users subscribed by the local user.
     */
    /** {zh}
     * @brief 本地麦克风录制和订阅的远端所有用户混音后的音频数据回调
     */
    kAudioFrameCallbackMixed = 2,
    /** {en}
     * @brief The callback of the audio data before mixing of each remote user subscribed by the local user.
     */
    /** {zh}
     * @brief 订阅的远端每个用户混音前的音频数据回调
     */
    kAudioFrameCallbackRemoteUser = 3,
    /** {en}
     * @brief The callback of screen audio data captured locally.
     */
    /** {zh}
     * @brief 本地屏幕录制的音频数据回调
     */
    kAudioFrameCallbackRecordScreen = 4
}
/** {zh}
 * @brief 远端音频流精准对齐模式
 */
/** {en}
 * @brief The alignment mode of remote audio streams
 */
export declare enum AudioAlignmentMode {
    /** {en}
     * @brief Disabled
     */
    /** {zh}
     * @brief 不对齐
     */
    kAudioAlighmentModeOff = 0,
    /** {en}
     * @brief All subscribed audio streams are aligned based on the process of the background music.
     */
    /** {zh}
     * @brief 远端音频流都对齐伴奏进度同步播放
     */
    kAudioAlighmentModeAudioMixing = 1
}
/** {en}
 * @brief Media device warning
 */
/** {zh}
 * @brief 媒体设备警告
 */
export declare enum MediaDeviceWarning {
    /** {en}
     * @brief No warning
     */
    /** {zh}
     * @brief 无警告
     */
    kMediaDeviceWarningOK = 0,
    /** {en}
     * @brief Illegal device operation. Calls the API for internal device when using the external device.
     */
    /** {zh}
     * @brief 非法设备操作。在使用外部设备时，调用了 SDK 内部设备 API。
     */
    kMediaDeviceWarningOperationDenied = 1,
    /** {zh}
     * @brief 采集静音。
     */
    /** {en}
     * @brief No audio is captured.
     */
    kMediaDeviceWarningCaptureSilence = 2,
    /** {zh}
     * @hidden
     * @brief Android 特有的静音，系统层面的静音上报
     */
    /** {en}
     * @hidden
     * @brief Silence warning by Android system.
     */
    kMediaDeviceWarningAndroidSysSilence = 3,
    /** {zh}
     * @hidden
     * @brief Android 特有的静音消失
     */
    /** {en}
     * @hidden
     * @brief Silence disappearing warning by Android system.
     */
    kMediaDeviceWarningAndroidSysSilenceDisappear = 4,
    /** {zh}
     * @hidden
     * @brief 音量过大，超过设备采集范围。建议降低麦克风音量或者降低声源音量。
     */
    /** {en}
     * @hidden
     * @brief The volume is too loud and exceeds the acquisition range of the device. Lower the microphone volume or
     * lower the volume of the audio source.
     */
    kMediaDeviceWarningDetectClipping = 10,
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
    kMediaDeviceWarningDetectLeakEcho = 11,
    /** {zh}
     * @hidden
     * @brief 低信噪比
     */
    /** {en}
     * @hidden
     * @brief Low SNR.
     */
    kMediaDeviceWarningDetectLowSNR = 12,
    /** {zh}
     * @hidden
     * @brief 采集插零现象
     */
    /** {en}
     * @hidden
     * @brief Silence inserted during capture.
     */
    kMediaDeviceWarningDetectInsertSilence = 13,
    /** {zh}
     * @hidden
     * @brief 设备采集静音（算法层）
     */
    /** {en}
     * @hidden
     * @brief Silence during capture.
     */
    kMediaDeviceWarningCaptureDetectSilence = 14,
    /** {zh}
     * @hidden
     * @brief 设备采集静音消失
     */
    /** {en}
     * @hidden
     * @brief Silence disappears during capture.
     */
    kMediaDeviceWarningCaptureDetectSilenceDisappear = 15,
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
    kMediaDeviceWarningCaptureDetectHowling = 16,
    /**
     * @hidden
     * @brief sudden impluse noise detected
     */
    kMediaDeviceWarningSuddenImpluseDetected = 17,
    /**
     * @hidden
     * @brief sudden impluse noise detected
     */
    kMediaDeviceWarningSquareWavSoundDetected = 18,
    /** {zh}
     * @hidden
     * @brief setAudioRoute结果回调, 该scenario下不支持设置
     */
    /** {en}
     * @hidden
     * @brief result of api setAudioRoute callback, not support called to setAudioRoute in this scenario
     */
    kMediaDeviceWarningSetAudioRouteInvalidScenario = 20,
    /** {zh}
     * @hidden
     * @brief setAudioRoute结果回调, routing device 不存在 (Android)
     */
    /** {en}
     * @hidden
     * @brief result of api setAudioRoute callback, routing device not exists (Andorid)
     */
    kMediaDeviceWarningSetAudioRouteNotExists = 21,
    /**
     * @hidden
     * @brief setAudioRoute结果回调, 系统高优先级路由占用 (IOS)
     */
    kMediaDeviceWarningSetAudioRouteFailedByPriority = 22,
    /**
     * @hidden
     * @brief 当前非通话模式 kAudioScenarioTypeCommunication，不支持设置音频路由
     */
    kMediaDeviceWarningSetAudioRouteNotVoipMode = 23,
    /**
     * @hidden
     * @brief setAudioRoute结果回调, 设备没有启动
     */
    kMediaDeviceWarningSetAudioRouteDeviceNotStart = 24,
    /**
     * @hidden
     * @brief setBluetoothMode结果回调, 当前场景不会立即生效
     */
    kMediaDeviceWarningSetBluetoothModeScenarioUnsupport = 25,
    /**
     * @hidden
     * @brief setBluetoothMode 结果回调, 当前不支持设置蓝牙模式
     */
    kMediaDeviceWarningSetBluetoothModeUnsupport = 26,
    /**
     * @hidden
     * @brief 使用无声的采集设备
     */
    kMediaDeviceWarningRecordingUseSilentDevice = 27,
    /** {zh}
     * @hidden
     * @brief 使用无声的采集设备
     */
    /** {en}
     * @hidden
     * @brief use silent record device
     */
    kMediaDeviceWarningPlayoutUseSilentDevice = 28
}
/** {en}
 * @brief State of the black frame video stream
 */
/** {zh}
 * @brief 黑帧视频流状态
 */
export declare enum SEIStreamEventType {
    /** {zh}
     * @brief 远端用户发布黑帧视频流。
     *        纯语音通话场景下，远端用户调用 [sendSEIMessage](85532#rtcvideo-sendseimessage) 发送 SEI 数据时，SDK 会自动发布一路黑帧视频流，并触发该回调。
     */
    /** {en}
     * @brief A black frame video stream is published from the remote user.
     *        In a voice call, when the remote user calls [sendSEIMessage](85532#rtcvideo-sendseimessage) to send SEI data, SDK will automatically publish a black frame video stream, and trigger this callback.
     */
    kSEIStreamEventTypeStreamAdd = 0,
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
    kSEIStreamEventTypeStreamRemove = 1
}
