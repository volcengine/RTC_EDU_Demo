import { YUVRender } from "../utils/yuv_render";
import { RtcRoomStats, UserOfflineReasonType, AVSyncState, LocalStreamStats, RemoteStreamStats, MediaStreamType, StreamRemoveReason, SubscribeState, SubscribeConfig, ForwardStreamStateInfo, ForwardStreamEventInfo, NetworkQualityStats, VideoFrameInfo, IVideoFrame, WarningCode, ErrorCode, ConnectionState, AudioMixingState, AudioMixingError, NetworkType, PerformanceAlarmMode, PerformanceAlarmReason, SysStats, StreamIndex, RemoteStreamKey, RemoteStreamSwitch, RemoteAudioState, RemoteAudioStateChangeReason, LocalAudioStreamState, LocalAudioStreamError, LocalVideoStreamState, LocalVideoStreamError, RemoteVideoState, RemoteVideoStateChangeReason, RtcUser, FirstFrameSendState, FirstFramePlayState, MessageSendResultCode, StreamMixingEvent, SingleStreamPushEvent, StreamMixingType, RecordingInfo, RecordingProgress, IAudioFrame, LocalAudioPropertiesInfo, RemoteAudioPropertiesInfo, SourceWantedData, EchoTestResult, UserInfo, KTVErrorCode, HotMusicInfo, DownloadResult, MusicInfo, PlayState, KTVPlayerErrorCode, PublicStreamErrorCode, VideoSuperResolutionMode, VideoSuperResolutionModeChangedReason, SyncInfoStreamType, IDataFrame, FaceDetectResult, RTCAudioDeviceType, SingScoringRealtimeInfo, AudioRecordingState, AudioRecordingErrorCode, DataMessageSourceType, HardwareEchoDetectionResult, LocalProxyType, SetRoomExtraInfoResult, SubtitleState, SubtitleErrorCode, SubtitleMessage, LocalProxyState, LocalProxyError, StreamMixingErrorCode, MixedStreamType, UserVisibilityChangeError, PlayerState, PlayerError, MediaDeviceWarning, SEIStreamEventType } from "./index";
/** {en}
 * @brief User information
 */
/** {zh}
 * @brief 用户信息
 */
export interface UserRenderInfo {
    /** {en}
     * @brief User ID. The string matches the regular expression: `[a-zA-Z0-9_@\-]{1,128}`.
     */
    /** {zh}
     * @brief 用户 ID。该字符串符合正则表达式：`[a-zA-Z0-9_@\-]{1,128}`。
     */
    userId: string;
    /** {en}
     * @brief Video render
     */
    /** {zh}
     * @brief 视频渲染
     */
    videoRender?: YUVRender | null;
    /** {en}
     * @brief Screen render
     */
    /** {zh}
     * @brief 屏幕渲染
     */
    screenRender?: YUVRender | null;
    /** {en}
     * @brief Render options
     */
    /** {zh}
     * @brief 渲染选项
     */
    renderOptions?: any;
}
export interface RoomData {
    localUser: UserRenderInfo;
    remoteUsers: Map<string, UserRenderInfo>;
}
export declare type SharedRoomInfo = Map<string, RoomData>;
/**
 * @hidden
 */
export declare type EventType = {
    Type: string;
    Object: {
        [key: string]: any;
    };
};
/** {en}
 * @brief Plugin Information
 */
/** {zh}
 * @brief 插件信息
 */
export interface RTCPluginInfo {
    /** {en}
     * @brief Plugin ID, the unique identifier of the plugin
     */
    /** {zh}
     * @brief 插件 ID，插件唯一标识
     */
    id: string;
    /** {en}
     * @brief Plugin library path
     */
    /** {zh}
     * @brief 插件库路径
     */
    path: string;
}
/** {en}
 * @brief Plugin definition
 */
/** {zh}
 * @brief 插件定义
 */
export interface RTCPlugin {
    /** {en}
     * @brief Plugin ID, the unique identifier of the plugin
     */
    /** {zh}
     * @brief 插件 ID，插件唯一标识
     */
    id: string;
    /** {en}
     * @brief Enable plugin
     * @param enabled Whether to enabled the plugin
     * @return + `0`: Success
     * + `-1`: Failure.
     */
    /** {zh}
     * @brief 启用插件
     * @param enabled 是否启用插件
     * @return + `0`: 成功
     * + `-1`: 失败
     */
    setEnabled: (enabled: boolean) => number;
    /** {en}
     * @brief Setting parameters
     * @param json_string json string
     * @return + `0`: Success
     * + `-1`: Failure.
     */
    /** {zh}
     * @brief 设置参数
     * @param json_string json 字符串
     * @return + `0`: 成功
     * + `-1`: 失败
     */
    setParameter: (json_string: string) => number;
}
/** {en}
 * @list 85530
 * @detail 85533
 */
/** {zh}
 * @list 85530
 * @detail 85533
 */
export interface RTCROOMCALLBACK {
    /** {en}
     * @brief Callback on room state changes. You will receive this callback when you join the room, leave the room, or receive room relating warnings and errors.
     * @param room_id Room ID
     * @param uid User ID
     * @param state Room state code.
     *              + 0: Success.
     *              + !0: Failure.
     * @param extra_info Extra information.
     *                 `join_type` indicates the type of room the user joins. `0` means the user joins the room for the first time, and `1` means the user rehoins the room.
     *                 `elapsed` indicates the time interval from calling [joinRoom](#joinroom) to successfully joining room, in ms.
     */
    /** {zh}
     * @brief 房间状态改变回调，加入房间、离开房间、发生房间相关的警告或错误时会收到此回调。
     * @param room_id 房间 ID。
     * @param uid 用户 ID。
     * @param state 房间状态码。
     *              + 0: 成功。
     *              + !0: 失败，参看 [ErrorCode](85534#errorcode) 及 [WarningCode](85534#warningcode)。
     * @param extra_info 额外信息。
     *                  `joinType`表示加入房间的类型，`0`为首次进房，`1`为重连进房。
     *                  `elapsed`表示加入房间耗时，即本地用户从调用 [joinRoom](85532#joinroom) 到加入房间成功所经历的时间间隔，单位为 ms。
     */
    onRoomStateChanged(room_id: string, uid: string, state: number, extra_info: string): void;
    /** {en}
     * @brief Callback on stream state changes. You will receive this callback when you receive stream relating warnings and errors.
     * @param room_id Room ID
     * @param uid User ID
     * @param state Room state code.
     *              + 0: Success.
     *              + !0: Failure.
     * @param extra_info Extra information. Currently unavailable.
     */
    /** {zh}
     * @region 多房间
     * @brief 流状态改变回调，发生流相关的警告或错误时会收到此回调。
     * @param room_id 房间 ID。
     * @param uid 用户 ID。
     * @param state 流状态码，参看 [ErrorCode](85534#errorcode) 及 [WarningCode](85534#warningcode)。
     * @param extra_info 附加信息，目前为空。
     */
    onStreamStateChanged(room_id: string, uid: string, state: number, extra_info: string): void;
    /** {en}
     * @brief After leaving the room successfully, receives the callback.
     * @param stats Statistics for this call.
     * @notes + When the user calls the [leaveRoom](85532#leaveroom), the SDK will stop all publishing subscription streams and release all call-related media resources. After that, the user receives this callback.
     * + If calling [leaveRoom](85532#leaveroom) and then [destroy](85532#destroy) immediately after, the user will not receive this callback.
     * + If the app needs to use the media resources of the device for purposes other than RTC, you should init the resources after receiving this callback. Receiving this callback ensures that the resources are not occupied by RTC SDK.
     */
    /** {zh}
     * @region 房间
     * @brief 离开房间成功回调。
     * @param stats 本次通话的统计数据。
     * @notes + 用户调用 [leaveRoom](85532#leaveroom) 方法后，SDK 会停止所有的发布订阅流，并在释放所有通话相关的音视频资源后，通过此回调通知用户离开房间成功。
     * + 用户调用 [leaveRoom](85532#leaveroom) 方法离开房间后，如果立即调用 [destroy](85532#destroy) 方法销毁 RTC 引擎，则将无法收到此回调事件。
     * + 离开房间后，如果 App 需要使用系统音视频设备，则建议在收到此回调后再初始化音视频设备，否则可能由于 SDK 占用音视频设备导致初始化失败。
     */
    onLeaveRoom(stats: RtcRoomStats): void;
    /** {en}
     * @brief You will receive this callback in following cases:
     * + The remote user calls `setUserVisibility` turns visible and joins your room.
     * + The remote visible user is disconnected and then reconnected to your room.
     * + The invisible remote user in your room calls `setUserVisibility` and turns visible.
     * + You join the room when there are visible users in the room.
     * @param user_info User ID
     * @param elapsed The visible user calls [joinRoom](85532#joinroom) to join the room The time in ms that other users in the room receive the event experience.
     */
    /** {zh}
     * @region 房间
     * @brief 可见用户加入房间，或房内隐身用户切换为可见的回调。
     *        1.远端可见用户调用 `setUserVisibility` 方法将自身设为可见后加入房间时，房间内其他用户将收到该事件。
     *        2.远端可见用户断网后重新连入房间时，房间内其他用户将收到该事件。
     *        3.房间内隐身远端用户调用 `setUserVisibility` 方法切换至可见时，房间内其他用户将收到该事件。
     *        4.新进房用户也会收到进房前已在房内的可见角色用户的进房回调通知。
     * @param user_info 用户信息。
     * @param elapsed 可见角色用户调用 [joinRoom](85532#joinroom) 加入房间到房间内其他用户收到该事件经历的时间，单位为 ms。
     */
    onUserJoined(user_info: UserInfo, elapsed: number): void;
    /** {en}
     * @brief This callback is triggered when a remote user is disconnected or turns invisible.
     * @param uid ID of the user who leaves the room, or switches to invisible.
     * @param reason Reason to leave the room
     */
    /** {zh}
     * @brief 远端用户离开房间，或切至不可见时，本地用户会收到此事件
     * @param uid 离开房间，或切至不可见的的远端用户 ID。
     * @param reason 用户离开房间的原因
     */
    onUserLeave(uid: string, reason: UserOfflineReasonType): void;
    /** {en}
     * @brief You will be informed 30 sec before the expiration via this callback.
     * @notes Call [updateToken](85532#updatetoken) to renew the Token. If the Token expired, the user would be removed from the room and not be able to continue the call.
     */
    /** {zh}
     * @brief Token 过期前 30 秒将触发该回调。
     * @notes 调用 [updateToken](85532#updatetoken) 更新 Token。否则 Token 过期后，用户将被移出房间无法继续进行音视频通话。
     */
    onTokenWillExpire(): void;
    /** {en}
     * @brief Stream publisher will receive this callback when the A/V synchronization state changes after `setMultiDeviceAVSync` is called.
     * @param state A/V synchronization state
     */
    /** {zh}
     * @brief 发布端调用 `setMultiDeviceAVSync` 后音视频同步状态发生改变时，会收到此回调。
     * @param state 音视频同步状态
     */
    onAVSyncStateChange(state: AVSyncState): void;
    /** {en}
     * @brief In-room call statistics callback.
     *        After the user enters the room and starts the call, he receives this callback every 2s.
     * @param stats Current RtcEngine statistics.
     */
    /** {zh}
     * @region 房间
     * @brief 房间通话统计信息回调。
     *        用户进房开始通话后，每 2s 收到一次本回调。
     * @param stats 房间内的汇总统计数据。
     */
    onRoomStats(stats: RtcRoomStats): void;
    /** {en}
     * @brief After the published stream is successful, you receive this callback every 2s to understand the network quality information of the published stream during this cycle.
     * @param stats Current RtcEngine statistics.
     */
    /** {zh}
     * @brief 反映通话中本地设备发送音/视频流的统计信息以及网络状况的回调。
     *        本地用户发布音视频流成功后，每隔 2s 收到此回调。
     * @param stats 音视频流以及网络状况统计信息。
     */
    onLocalStreamStats(stats: LocalStreamStats): void;
    /** {en}
     * @brief Receive this callback every 2s to learn the network quality information of the stream published by the subscribed remote user during this cycle.
     * @param stats Current RtcEngine statistics.
     */
    /** {zh}
     * @region 房间
     * @brief 反映通话中本地设备接收订阅的远端音/视频流的统计信息以及网络状况的回调。每隔 2s 收到此回调。
     * @param stats 音视频流以及网络状况统计信息。
     */
    onRemoteStreamStats(stats: RemoteStreamStats): void;
    /** {en}
     * @brief Callback on new media streams captured by camera/microphone in the room.
     * @param uid The ID of the remote user who published the stream.
     * @param type Media stream type.
     * @notes You will receive this callback after a remote user successfully published media streams captured by camera/microphone in the room with [publishStream](85532#publishstream). Then you can choose whether to call [subscribeStream](85532#subscribestream) to subscribe to the streams or not.
     */
    /** {zh}
     * @region 房间管理
     * @brief 房间内新增远端麦克风采集的音频流的回调。
     * @param uid 远端流发布用户的用户 ID。
     * @param type 远端媒体流的类型。
     * @notes 当房间内的远端用户调用 [publishStream](85532#publishstream) 成功发布由麦克风采集的音频流时，本地用户会收到该回调，此时本地用户可以自行选择是否调用 [subscribeStream](85532#subscribestream) 订阅此流。
     */
    onUserPublishStream(uid: string, type: MediaStreamType): void;
    /** {en}
     * @brief Callback on removal of remote media stream captured by camera/microphone.
     * @param uid The ID of the remote user who removed the stream.
     * @param type Media stream type
     * @param reason The reason for the removal
     * @notes After receiving this callback, you can choose whether to call [unsubscribeStream](85532#unsubscribestream) to unsubscribe from the streams or not.
     */
    /** {zh}
     * @region 房间管理
     * @brief 房间内远端麦克风采集的音频流移除的回调。
     * @param uid 移除的远端流发布用户的用户 ID。
     * @param type 远端媒体流的类型。
     * @param reason 远端流移除的原因
     * @notes 收到该回调通知后，你可以自行选择是否调用 [unsubscribeStream](85532#unsubscribestream) 取消订阅此流。
     */
    onUserUnpublishStream(uid: string, type: MediaStreamType, reason: StreamRemoveReason): void;
    /** {en}
     * @brief Callback on new screen sharing media streams from remote users in the room.
     * @param uid The ID of the remote user who published the stream.
     * @param type Media stream type
     * @notes You will receive this callback after a remote user successfully published screen sharing streams in the room with [publishScreen](#publishscreen). Then you can choose whether to call [subscribeScreen](85532#subscribescreen) to subscribe to the streams or not.
     */
    /** {zh}
     * @brief 房间内新增远端屏幕共享音视频流的回调。
     * @param uid 远端流发布用户的用户 ID。
     * @param type 远端媒体流的类型
     * @notes 当房间内的远端用户调用 [publishScreen](85532#publishscreen) 成功发布来自屏幕共享的音视频流时，本地用户会收到该回调，此时本地用户可以自行选择是否调用 [subscribeScreen](85532#subscribescreen) 订阅此流。
     */
    onUserPublishScreen(uid: string, type: MediaStreamType): void;
    /** {en}
     * @brief Callback on removal of screen sharing media streams from remote users in the room.
     * @param uid The ID of the remote user who removed the stream.
     * @param type Media stream type
     * @param reason The reason for the removal
     * @notes After receiving this callback, you can choose whether to call [unsubscribeScreen](85532#unsubscribescreen) to unsubscribe from the streams or not.
     */
    /** {zh}
     * @region 房间管理
     * @brief 房间内远端屏幕共享音视频流移除的回调。
     * @param uid 移除的远端流发布用户的用户 ID。
     * @param type 移除的远端流类型
     * @param reason 远端流移除的原因
     * @notes 收到该回调通知后，你可以自行选择是否调用 [unsubscribeScreen](85532#unsubscribescreen) 取消订阅此流。
     */
    onUserUnpublishScreen(uid: string, type: MediaStreamType, reason: StreamRemoveReason): void;
    /** {en}
     * @brief Callback on subscription status of media streams
     * @param state_code Subscription status of media streams
     * @param user_id The ID of the user who published the stream.
     * @param info Configurations of stream subscription
     * @notes Local users will receive this callback:
     * + After calling [subscribeStream](85532#subscribestream) or [unsubscribeStream](85532#unsubscribestream) to change the subscription status of remote media streams captured by camera/microphone.
     * + After calling [subscribeScreen](85532#subscribescreen) or [unsubscribeScreen](85532#unsubscribescreen) to change the subscription status of remote screen sharing streams.
     */
    /** {zh}
     * @region 房间管理
     * @brief 关于订阅媒体流状态改变的回调
     * @param state_code 订阅媒体流状态
     * @param user_id 流发布用户的用户 ID
     * @param info 流的属性
     * @notes 本地用户收到该回调的时机包括：
     * + 调用 [subscribeStream](85532#subscribestream) 或 [unsubscribeStream](85532#unsubscribestream) 订阅/取消订阅指定远端摄像头音视频流后；
     * + 调用 [subscribeScreen](85532#subscribescreen) 或 [unsubscribeScreen](85532#unsubscribescreen) 订阅/取消订阅指定远端屏幕共享流后。
     */
    onStreamSubscribed(state_code: SubscribeState, user_id: string, info: SubscribeConfig): void;
    /** {en}
     * @brief All the users in the room will get informed via this callback when a user is banned or the ban of the user has been lifted by calling BanUserStream/UnbanUserStream on the server side.
     * @param uid User ID of the video stream that was disabled/unbanned
     * @param banned Video stream sending status
     *         + True: Video stream sending was disabled
     *         + False: Video stream sending was unbanned
     * @notes + When the specified user in the room is disabled/unbanned Video stream sending, all users in the room will receive the callback.
     * + If the banned user leaves or disconnects and then rejoins the room, the user is still banned from publishing audio stream, and all users in the room will be informed via the callback.
     * + After the specified user is banned, other users in the room will check out and enter the room again, and will receive the callback again.
     * + If the conference mode is enabled in the console, only the user whose stream is banned will receive this callback.
     */
    /** {zh}
     * @region 视频管理
     * @brief 通过调用服务端 BanUserStream/UnbanUserStream 方法禁用/解禁指定房间内指定用户视频流的发送时，触发此回调。
     * @param uid 被禁用/解禁的视频流用户 ID
     * @param banned 视频流发送状态
     * + true: 视频流发送被禁用
     * + false: 视频流发送被解禁
     * @notes + 房间内指定用户被禁止/解禁视频流发送时，房间内所有用户都会收到该回调。
     * + 若被封禁用户退房后再进房，则依然是封禁状态，且房间内所有人会再次收到该回调。
     * + 若被封禁用户断网后重连进房，则依然是封禁状态，且只有本人会再次收到该回调。
     * + 指定用户被封禁后，房间内其他用户退房后再进房，会再次收到该回调。
     * + 通话人数超过 5 人时，只有被封禁/解禁用户会收到该回调。
     */
    onVideoStreamBanned(uid: string, banned: boolean): void;
    /** {en}
     * @brief All the users in the room will get informed via this callback when a user is banned or the ban of the user has been lifted by calling BanUserStream/UnbanUserStream on the server side.
     * @param uid Disabled/unbanned audio stream user ID
     * @param banned Audio stream sending status
     * + True: audio stream sending is disabled
     * + False: audio stream sending is unbanned
     * @notes + Specified users in the room are prohibited/all users in the room when audio stream sending is unbanned Will receive the callback.
     * + If the banned user checks out and then enters the room, it will still be banned status, and everyone in the room will receive the callback again.
     * + If the banned user is disconnected and reconnected to the room, it will still be banned status, and only the person will receive the callback again.
     * + After the specified user is banned, other users in the room will check out and enter the room again, and will receive the callback again.
     * + The same room is created again after dissolution, and the state in the room is empty.
     * + If the conference mode is enabled in the console, only the user whose stream is banned will receive this callback.
     */
    /** {zh}
     * @region 音频事件回调
     * @brief 通过调用服务端 BanUserStream/UnbanUserStream 方法禁用/解禁指定房间内指定用户音频流的发送时，触发此回调。
     * @param uid 被禁用/解禁的音频流用户 ID
     * @param banned 音频流发送状态
     * + true: 音频流发送被禁用
     * + false: 音频流发送被解禁
     * @notes + 房间内指定用户被禁止/解禁音频流发送时，房间内所有用户都会收到该回调。
     * + 若被封禁用户退房后再进房，则依然是封禁状态，且房间内所有人会再次收到该回调。
     * + 若被封禁用户断网后重连进房，则依然是封禁状态，且只有本人会再次收到该回调。
     * + 指定用户被封禁后，房间内其他用户退房后再进房，会再次收到该回调。
     * + 通话人数超过 5 人时，只有被封禁/解禁用户会收到该回调。
     */
    onAudioStreamBanned(uid: string, banned: boolean): void;
    /** {en}
     * @brief Receives a callback for broadcast messages in the room.
     * @param uid Message sender ID
     * @param message Received message content
     * @notes Other users in the same room will receive this callback when they call [`sendRoomMessage`](85532#sendroommessage) to send a broadcast message.
     */
    /** {zh}
     * @brief 接收到房间内广播消息的回调。
     * @param uid 消息发送者 ID
     * @param message 收到的消息内容
     * @notes 房间内其他用户调用 [`sendRoomMessage`](85532#sendroommessage) 发送广播消息时，收到此回调。
     */
    onRoomMessageReceived(uid: string, message: string): void;
    /** {en}
     * @brief Receives a callback to a binary broadcast message in the room.
     * @param uid Message sender ID
     * @param message Binary message content received
     * @notes Other users in the same room call [`sendRoomBinaryMessage`](85532#sendroombinarymessage) Receive this callback when sending a binary broadcast message.
     */
    /** {zh}
     * @region 多房间
     * @brief 接收到房间内广播二进制消息的回调。
     * @param uid 消息发送者 ID
     * @param message 收到的二进制消息内容
     * @notes 房间内其他用户调用 [`sendRoomBinaryMessage`](85532#sendroombinarymessage) 发送广播二进制消息时，收到此回调。
     */
    onRoomBinaryMessageReceived(uid: string, message: string): void;
    /** {en}
     * @brief Receive this callback when you receive a text message (P2P) from another user in the room.
     * @param uid Message sender ID.
     * @param message The content of the received text message.
     * @notes You must call the [sendUserMessage](85532#sendusermessage) method before you can receive the callback.
     */
    /** {zh}
     * @region 多房间
     * @brief 收到来自房间中其他用户通过 `sendUserMessage` 发来的点对点文本消息时，会收到此回调。
     * @param uid 消息发送者的用户 ID 。
     * @param message 收到的文本消息内容。
     */
    onUserMessageReceived(uid: string, message: string): void;
    /** {en}
     * @brief A single user receives a callback (P2P) of binary messages from other uid-owned users in the same room.
     * @param uid Message sender ID.
     * @param message The content of the received binary message.
     * @notes When other users in the same room call [sendUserBinaryMessage](85532#senduserbinarymessage) to send binary messages to local users, local users will receive the callback.
     */
    /** {zh}
     * @region 多房间
     * @brief 收到来自房间中其他用户通过 `sendUserBinaryMessage` 发来的点对点二进制消息时，会收到此回调。
     * @param uid 消息发送者的用户 ID 。
     * @param message 收到的二进制消息内容。
     */
    onUserBinaryMessageReceived(uid: string, message: string): void;
    /** {en}
     * @brief After sending a text or binary message (P2P) to a single user in the room, the message sender receives a callback with the result of the message.
     * @param msgid The ID of this message.
     * @param error Text or binary message sending results.
     * @notes You must first call the [sendUserMessage](85532#sendusermessage) or [sendUserBinaryMessage](85532#senduserbinarymessage) interface to receive this callback.
     */
    /** {zh}
     * @region 多房间
     * @brief 向房间内单个用户发送点对点文本或点对点二进制消息后，消息发送方会收到该消息发送结果回调。
     * @param msgid 本条消息的 ID。
     * @param error 文本或二进制消息发送结果
     * + `200`: 消息发送成功
     * + `100`: 失败，发送方未加入房间
     * + `102`: 失败，没有可用的数据传输通道连接
     * + `103`: 失败，消息超过最大长度，当前为 64 KB
     * + `1000`: 失败，未知错误
     * @notes 调用 [sendUserMessage](85532#sendusermessage) 或 [sendUserBinaryMessage](85532#senduserbinarymessage) 接口，才能收到此回调。
     */
    onUserMessageSendResult(msgid: number, error: number): void;
    /** {en}
     * @brief You receives this callback for the nofication of the result of calling `sendRoomMessage` or `sendRoomBinaryMessage`.
     * @param msgid ID of this message
     * @param error Message sending result
     */
    /** {zh}
     * @region 多房间
     * @brief 调用 `sendRoomMessage` 或 `sendRoomBinaryMessage` 向房间内群发文本或二进制消息后，消息发送方会收到该消息发送结果回调。
     * @param msgid 本条消息的 ID。
     * @param error 消息发送结果
     * + `200`: 消息发送成功
     * + `100`: 失败，发送方未加入房间
     * + `102`: 失败，没有可用的数据传输通道连接
     * + `103`: 失败，消息超过最大长度，当前为 64 KB
     * + `1000`: 失败，未知错误
     */
    onRoomMessageSendResult(msgid: number, error: number): void;
    /** {en}
     * @brief Callback returning the state and errors during relaying the audio stream to each of the rooms
     * @param infos Array of the state and errors of each designated room.
     * @param info_count Count
     */
    /** {zh}
     * @region 多房间
     * @brief 跨房间媒体流转发状态和错误回调
     * @param infos 跨房间媒体流转发目标房间信息数组
     * @param info_count 数量
     */
    onForwardStreamStateChanged(infos: ForwardStreamStateInfo[], info_count: number): void;
    /** {en}
     * @brief Callback returning the events during relaying the audio stream to each room
     * @param infos Array of the event of each designated room.
     * @param info_count Count
     */
    /** {zh}
     * @region 多房间
     * @brief 跨房间媒体流转发事件回调
     * @param infos 跨房间媒体流转发目标房间事件数组
     * @param info_count 数量
     */
    onForwardStreamEvent(infos: ForwardStreamEventInfo[], info_count: number): void;
    /** {en}
     * @brief Report the network quality of the users every 2s after the local user joins the room.
     * @param localQuality Local network quality
     * @param remoteQualities Network quality of the subscribed users.
     */
    /** {zh}
     * @brief 加入房间后， 以 2 秒 1 次的频率，报告用户的网络质量信息
     * @param localQuality 本地网络质量。
     * @param remoteQualities 已订阅用户的网络质量。
     * @notes 更多通话中的监测接口，详见[通话中质量监测](106866)
     */
    onNetworkQuality(localQuality: NetworkQualityStats, remoteQualities: NetworkQualityStats[]): void;
    /** {zh}
     * @brief Token 发布权限过期前 30 秒将触发该回调。
     * @notes 收到该回调后，你需调用 [updateToken](85532#updatetoken) 更新 Token 发布权限。若收到该回调后未及时更新 Token，Token 发布权限过期后：
     * + 此时尝试发布流会收到 [onStreamStateChanged](#onstreamstatechanged) 回调，提示错误码为 `-1002` 没有发布权限；
     * + 已在发布中的流会停止发布，发布端会收到 [onStreamStateChanged](#onstreamstatechanged) 回调，提示错误码为 `-1002` 没有发布权限，同时远端用户会收到 [onUserUnPublishStream](#onuserunpublishstream) 回调，提示原因为 `6` 发流端发布权限过期。
     */
    /** {en}
     * @brief Callback triggered 30s before the publishing privilege of the Token expires.
     * @notes After receiving this callback, you must call [updateToken](85532#updatetoken) to update the publishing privilege Token.After a user's publishing privilege expires:
     * + When attempting to publish a stream, the user will receive [onStreamStateChanged](#onstreamstatechanged) with the error code "-1002" indicating no permission to publish streams.
     * + The published streams of the user will be removed, and he/she will receive [onStreamStateChanged](#onstreamstatechanged) with the error code "-1002" indicating no permission to publish streams. Remote users in the room will receive [onUserUnPublishStream](#onuserunpublishstream) with the reason "6" indicating that the publishing privilege of the remote user has expired.
     */
    onPublishPrivilegeTokenWillExpire(): void;
    /** {zh}
     * @brief Token 订阅权限过期前 30 秒将触发该回调。
     * @notes 收到该回调后，你需调用 [updateToken](85532#updatetoken) 更新 Token 订阅权限有效期。若收到该回调后未及时更新 Token，Token 订阅权限过期后，尝试新订阅流会失败，已订阅的流会取消订阅，并且会收到 [onStreamStateChanged](#onstreamstatechanged) 回调，提示错误码为 `-1003` 没有订阅权限。
     */
    /** {en}
     * @brief Callback triggered 30s before the subscribing privilege of the Token expires.
     * @notes After receiving this callback, you must call [updateToken](85532#updatetoken) to update the subscribing privilege Token. After a user's subscribing privilege expires, the user will fail to subscribe to new streams, or the subscribed streams will be removed, and he/she will receive [onStreamStateChanged](#onstreamstatechanged) with error code "-1003" indicating no permission to subscribe to streams.
     */
    onSubscribePrivilegeTokenWillExpire(): void;
    /** {en}
     * @brief Callback on the result of calling [setRoomExtraInfo](85532#rtcroom-setroomextrainfo) to set extra information about the room.
     * @param task_id The task ID of the API call.
     * @param error_code Setting results and reasons.
     */
    /** {zh}
     * @brief 调用 [setRoomExtraInfo](85532#rtcroom-setroomextrainfo) 设置房间附加信息结果的回调。
     * @param task_id 调用 setRoomExtraInfo 的任务编号。
     * @param error_code error_code 设置房间附加信息的结果。
     */
    onSetRoomExtraInfoResult(task_id: number, error_code: SetRoomExtraInfoResult): void;
    /** {en}
     * @brief Callback used to receive the extra information set by the other users in the same room with [setRoomExtraInfo](85532#rtcroom-setroomextrainfo).
     * @param key Key of the extra information.
     * @param value Content of the extra information.
     * @param last_update_user_id The ID of the last user who updated this information.
     * @param last_update_time_ms The Unix time in ms when this information was last updated.
     */
    /** {zh}
     * @brief 接收同一房间内，其他用户调用 [setRoomExtraInfo](85532#rtcroom-setroomextrainfo) 设置的房间附加信息的回调。
     * @param key 房间附加信息的键值
     * @param value 房间附加信息的内容
     * @param last_update_user_id 最后更新本条信息的用户 ID。
     * @param last_update_time_ms 最后更新本条信息的 Unix 时间，单位：毫秒。
     * @notes 新进房的用户会收到进房前房间内已有的全部附加信息通知。
     */
    onRoomExtraInfoUpdate(key: string, value: string, last_update_user_id: string, last_update_time_ms: number): void;
    /** {en}
     * @hidden currently not available
     * @brief  Callback on subtitle states.
     *         After you call [startSubtitle](85532#startsubtitle) and [stopSubtitle](85532#stopsubtitle), you will receive this callback which informs you of the states and error codes of the subtitling task, as well as detailed information on the third party services' errors.
     * @param state The states of subtitles.
     * @param error_code  Error codes of the subtitling task.
     * @param error_message Detailed information on the third party services' errors.
     */
    /** {zh}
     * @brief  字幕状态发生改变回调。
     *         当用户调用 [startSubtitle](85532#startsubtitle) 和 [stopSubtitle](85532#stopsubtitle) 使字幕状态发生改变或字幕任务出现错误时，触发该回调。
     * @param state 字幕状态。
     * @param error_code  字幕任务错误码。
     * @param error_message  与第三方服务有关的错误信息。
     */
    onSubtitleStateChanged(state: SubtitleState, error_code: SubtitleErrorCode, error_message: string): void;
    /** {en}
     * @hidden currently not available
     * @brief  Callback on subtitle messages.
     *         After calling [startSubtitle](85532#startsubtitle) successfully, you will receive this callback which informs you of the related information on subtitles.
     * @param subtitles  Subtitle messages.
     */
    /** {zh}
     * @brief  字幕相关内容回调。
     *         当用户成功调用 [startSubtitle](85532#startsubtitle) 后会收到此回调，通知字幕的相关信息。
     * @param subtitles 字幕消息内容。
     */
    onSubtitleMessageReceived(subtitles: SubtitleMessage[]): void;
    /** {en}
     * @brief Callback for user to set user visibility by calling [setUserVisibility](85532#rtcroom-setuservisibility).
     * @param current_user_visibility Visibility of the current user.
     *        + true: Visible. The user can publish media streams. The other users in the room get informed of the behaviors of the user, such as joining room, starting video capture, and leaving room.
     *        + false: Invisible. The user cannot publish media streams. The other users in the room do not get informed of the behaviors of the user, such as joining room, starting video capture, or leaving room.
     * @param error_code Error code for setting user visibility.
     */
    /** {zh}
     * @brief 用户调用 [setUserVisibility](85532#rtcroom-setuservisibility) 设置用户可见性的回调。
     * @param current_user_visibility 当前用户的可见性。
     *        + true: 可见，用户可以在房间内发布音视频流，房间中的其他用户将收到用户的行为通知，例如进房、开启视频采集和退房。
     *        + false: 不可见，用户不可以在房间内发布音视频流，房间中的其他用户不会收到用户的行为通知，例如进房、开启视频采集和退房。
     * @param error_code 设置用户可见性错误码
     */
    onUserVisibilityChanged: (current_user_visibility: boolean, error_code: UserVisibilityChangeError) => void;
}
/** {en}
 * @list 85530
 * @detail 85533
 */
/** {zh}
 * @list 85530
 * @detail 85533
 */
export interface RTCVIDEOCALLBACK {
    /** {en}
     * @hidden
     * @brief Callback of successfully decoding of the first audio frame of the public stream
     * @param public_stream_id ID of the public stream
     * @notes Refer to [`startPlayPublicStream`](85532#startplaypublicstream) for details about subsribing to a public stream.
     */
    /** {zh}
     * @brief 公共流的音频首帧解码成功
     * @param public_stream_id 公共流 ID
     * @notes 关于订阅公共流，详见 [`startPlayPublicStream`](85532#startplaypublicstream)。
     */
    onFirstPublicStreamAudioFrame(public_stream_id: string): void;
    /** {en}
     * @hidden
     * @brief Callback of the result of publishing the public stream
     *        You will be informed of the result of publishing the public stream by this callback after calling `startPushPublicStream`.
     * @param room_id Room ID
     * @param public_stream_id ID of the public stream
     * @param error_code Code for the result of publishing the public stream
     * + `200`: Success
     * + `1191`: Invalid parameter(s)
     * + `1192`: Abnormal status, such as initiating the task failed
     * + `1193`: Unrecoverable server error
     * + `1195`: Server called the publish method and got a result of failure
     * + `1196`: Request timeout. And then, the SDK will retry every 10 sec. SDK will stop retrying after three attempts fail.
     * @notes Refer to [`startPlayPublicStream`](85532#startplaypublicstream) for details about subsribing to a public stream.
     */
    /** {zh}
     * @brief 公共流发布结果回调。
     *        调用 `startPushPublicStream` 接口发布公共流后，启动结果通过此回调方法通知用户。
     * @param room_id 房间 ID
     * @param public_stream_id 公共流 ID
     * @param error_code 公共流发布结果状态码。
     * + `200`: 发布成功
     * + `1191`: 推流参数存在异常
     * + `1192`: 当前状态异常，通常为无法发起任务
     * + `1193`: 服务端错误，不可恢复
     * + `1195`: 服务端调用发布接口返回失败
     * + `1196`: 超时无响应。推流请求发送后 10s 没有收到服务端的结果回调。客户端将每隔 10s 重试，3 次重试失败后停止。
     * @notes 关于订阅公共流，详见 [`startPlayPublicStream`](85532#startplaypublicstream)。
     */
    onPushPublicStreamResult(room_id: string, public_stream_id: string, error_code: PublicStreamErrorCode): void;
    /** {en}
     * @hidden
     * @brief Callback of successfully decoding of the first video frame of the public stream
     * @param public_stream_id ID of the public stream
     * @param video_frame_info Information of the video stream.
     * @notes Refer to [`startPlayPublicStream`](85532#startplaypublicstream) for details about subscribing to a public stream.
     */
    /** {zh}
     * @brief 公共流的首帧视频解码成功
     * @param public_stream_id 公共流 ID
     * @param info 视频帧信息。
     * @notes 关于订阅公共流，详见 [`startPlayPublicStream`](85532#startplaypublicstream)。
     */
    onFirstPublicStreamVideoFrameDecoded(public_stream_id: string, info: VideoFrameInfo): void;
    /** {en}
     * @hidden
     * @brief Callback of the SEI carried by the public video stream
     * @param public_stream_id ID of the public stream
     * @param message SEI(supplemental enhancement information) carried by the public video stream
     * @notes You will receive SEI by this callback if the public stream published by calling [`startPlayPublicStream`](85532#startplaypublicstream) carrying SEI. You will receive SEI from all the video frames if the SEI do not have conflicts.
     *       However, if SEI from video frames have conflicts, you will receive only one of them.
     */
    /** {zh}
     * @brief 回调公共流中包含的 SEI 信息
     * @param public_stream_id 公共流 ID
     * @param message SEI 信息
     * @notes 通过 [`startPlayPublicStream`](85532#startplaypublicstream) 开始播放公共流后，可以通过本回调获取公共流中包含的 SEI 信息。当公共流中的多路视频流均包含有 SEI 信息时：
     *       SEI 不互相冲突时，将通过多次回调分别发送；
     *       SEI 在同一帧有冲突时，则只有一条流中的 SEI 信息被透传并融合到公共流中。
     */
    onPublicStreamSEIMessageReceived(public_stream_id: string, message: string, source_type: DataMessageSourceType): void;
    /** {en}
     * @hidden
     * @brief Callback of the result of subscribing to the public stream
     *        You will be informed of the result of subscribing to the public stream by this callback after calling [`startPlayPublicStream`](85532#rtcvideo-startplaypublicstream) .
     * @param public_stream_id ID of the public stream
     * @param error_code Code for the result of playing the public stream.
     */
    /** {zh}
     * @brief 订阅公共流的结果回调
     *        通过 [`startPlayPublicStream`](85532#rtcvideo-startplaypublicstream)  订阅公共流后，可以通过本回调获取订阅结果。
     * @param public_stream_id 公共流的 ID
     * @param error_code 公共流订阅结果状态码。
     */
    onPlayPublicStreamResult(public_stream_id: string, error_code: PublicStreamErrorCode): void;
    /** {en}
     * @brief Get the successfully captured local screen video frames for custom processing or rendering.
     * @param frame Video data
     */
    /** {zh}
     * @region 视频管理
     * @brief 获取采集成功的本地屏幕视频帧，用于自定义处理或渲染。
     * @param frame 视频数据
     */
    onLocalScreenFrame(frame: IVideoFrame): void;
    /** {en}
     * @brief Get the successfully captured local camera stream for custom processing or rendering.
     * @param frame
     */
    /** {zh}
     * @region 视频管理
     * @brief 获取采集成功的本地摄像头流视频帧，用于自定义处理或渲染。
     * @param frame 视频数据
     */
    onLocalVideoFrame(frame: IVideoFrame): void;
    /** {en}
     * @brief Get the successfully captured remote screen video frames for custom processing or rendering.
     * @param frame Video data
     */
    /** {zh}
     * @brief 视频管理获取采集成功的远端屏幕视频帧，用于自定义处理或渲染。
     * @param frame 视频数据
     */
    onRemoteScreenFrame(frame: IVideoFrame): void;
    /** {en}
     * @brief Get the successfully captured remote camera stream for custom processing or rendering.
     * @param frame Video data
     * @notes PixelFormat of the video data from different platforms could be different.
     */
    /** {zh}
     * @region 视频管理
     * @brief 获取采集成功的远端摄像头流视频帧，用于自定义处理或渲染。
     * @param frame 视频数据
     * @notes 不同的平台上（macOS, Windows, Linux）上获取的视频帧的 pixelFormat 可能不同。
     */
    onRemoteVideoFrame(frame: IVideoFrame): void;
    /** {en}
     * @brief You can get the video data of the public stream and pass it to the external renderer.
     * @param frame Video data
     */
    /** {zh}
     * @brief 公共流视频数据回调，绑定公共流到自定义渲染器后，通过该回调获取公共流视频数据。
     * @param frame 视频数据
     */
    onPublicStreamVideoFrame(frame: IVideoFrame): void;
    /** {en}
     * @brief This callback informs you of a warning message.
     * @param warn Warning code
     */
    /** {zh}
     * @region 警告码
     * @brief 当内部发生警告事件时触发该回调
     * @param warn 警告标识码
     */
    onWarning(warn: WarningCode): void;
    /** {en}
     * @brief This callback informs you of an error message.
     * @param err Error code
     */
    /** {zh}
     * @region 错误码
     * @brief 当内部发生不可逆转错误时触发该回调
     * @param err 错误标识码
     */
    onError(err: ErrorCode): void;
    /** {en}
     * @brief This callback informs you at the end of playing a local audio file.
     * @notes Call [startAudioMixing](85532#startaudiomixing) to start a local audio file.
     */
    /** {zh}
     * @brief 本地音乐文件播放已结束回调。
     * @notes 当调用 [startAudioMixing](85532#startaudiomixing) 启动的混音文件播放结束后，会触发该回调。
     */
    onAudioMixingFinished(): void;
    /** {en}
     * @brief This callbck infroms you when the state of playing a local audio file changes.
     * @param id ID of the mixing task
     * @param state State of playing a local audio file
     * @param error Error code
     * @notes The callback will be triggered in the following timings.
     * + When the [startAudioMixing](85532#startaudiomixing) method is successfully called, a callback with a state value of kAudioMixingStatePlaying will be triggered; otherwise the state will be triggered A callback with a value of kAudioMixingStateFailed.
     * + When [startAudioMixing](85532#startaudiomixing) is called repeatedly with the same ID, the latter overrides the previous, and this callback notifies the previous mix has stopped with kAudioMixingStateStopped.
     * + When calling the [pauseAudioMixing](85532#pauseaudiomixing) method to pause playback successfully, a callback with a state value of kAudioMixingStatePaused will be triggered; otherwise, a callback with a state value of kAudioMixingStateFailed will be triggered.
     * + When the [resumeAudioMixing](85532#resumeaudiomixing) method is called to resume playing successfully, a callback with a state value of kAudioMixingStatePlaying will be triggered; otherwise, a callback with a state value of kAudioMixingStateFailed will be triggered.
     * + When calling the [stopAudioMixing](85532#stopaudiomixing) method to pause playback successfully, a callback with a state value of kAudioMixingStateStopped will be triggered; otherwise, a callback with a state value of kAudioMixingStateFailed will be triggered.
     * + The end of playback triggers a callback with the state value kAudioMixingStateFinished.
     */
    /** {zh}
     * @region 混音
     * @brief  音频混音文件播放状态改变时回调
     * @param id 混音 ID
     * @param state 混音状态
     * @param error 错误码
     * @notes + 当调用 [startAudioMixing](85532#startaudiomixing) 方法成功后，会触发 state 值为 kAudioMixingStatePlaying 回调；否则触发 state 值为 kAudioMixingStateFailed 的回调。
     * + 当使用相同的 ID 重复调用 [startAudioMixing](85532#startaudiomixing) 后，后一次会覆盖前一次，且本回调会以 kAudioMixingStateStopped 通知前一次混音已停止。
     * + 当调用 [pauseAudioMixing](85532#pauseaudiomixing) 方法暂停播放成功后，会触发 state 值为 kAudioMixingStatePaused 回调；否则触发 state 值为 kAudioMixingStateFailed 的回调。
     * + 当调用 [resumeAudioMixing](85532#resumeaudiomixing) 方法恢复播放成功后，会触发 state 值为 kAudioMixingStatePlaying 回调；否则触发 state 值为 kAudioMixingStateFailed 的回调。
     * + 当调用 [stopAudioMixing](85532#stopaudiomixing) 方法暂停止播放成功后，会触发 state 值为 kAudioMixingStateStopped 回调；否则触发 state 值为 kAudioMixingStateFailed 的回调。
     * + 播放结束会触发 state 值为 kAudioMixingStateFinished 回调。
     */
    onAudioMixingStateChanged(id: number, state: AudioMixingState, error: AudioMixingError): void;
    /** {en}
     * @brief Callback for playback progress of mixed audio files
     * @param mix_id ID of the mixing task
     * @param progress The current playback progress (ms) of the mixed audio file
     * @notes After calling [setAudioMixingProgressInterval](#setaudiomixingprogressinterval) to set the time interval to a value greater than 0, or calling [startAudioMixing](85532#startaudiomixing) to set the time interval in AudioMixingConfig to a value greater than 0, the SDK will trigger the callback according to the set time interval.
     */
    /** {zh}
     * @region 混音
     * @brief 混音音频文件播放进度回调
     * @param mix_id 混音 ID
     * @param progress 当前混音音频文件播放进度，单位毫秒
     * @notes 调用 [setAudioMixingProgressInterval](85532#setaudiomixingprogressinterval) 将时间间隔设为大于 0 的值后，或调用 [startAudioMixing](85532#startaudiomixing) 将 AudioMixingConfig 中的时间间隔设为大于 0 的值后，SDK 会按照设置的时间间隔回调该事件。
     */
    onAudioMixingPlayingProgress(mix_id: number, progress: number): void;
    /** {en}
     * @brief SDK  connection state change callback with signaling server. Triggered when the connection state changes.
     * @param state The current connection status between the SDK and the signaling server.
     */
    /** {zh}
     * @brief SDK 与信令服务器连接状态改变回调。连接状态改变时触发。
     * @param state 当前 SDK 与信令服务器的连接状态
     */
    onConnectionStateChanged(state: ConnectionState): void;
    /** {en}
     * @brief SDK Current network connection type change callback. Callbacks the event when the current network connection type of the SDK changes.
     * @param type The current network connection type
     * @notes Refer to [Getting Connection Status](https://docs.byteplus.com/byteplus-rtc/docs/95376) for more details.
     */
    /** {zh}
     * @region 引擎管理
     * @brief SDK 当前网络连接类型改变回调。当 SDK 的当前网络连接类型发生改变时回调该事件。
     * @param type SDK 当前的网络连接类型
     * @notes 更多信息参见 [连接状态提示](https://www.volcengine.com/docs/6348/95376)。
     */
    onNetworkTypeChanged(type: NetworkType): void;
    /** {en}
     * @brief publish performance fallback is not turned on locally. When insufficient device performance is detected, this callback is received. Locally turn on the release performance fallback. When the release performance fallback/recovery is caused due to device performance/network reasons, this callback is received.
     * @param mode Indicates whether the release fallback function is turned on locally.
     * +When the publisher does not turn on the release performance fallback, the mode value is kPerformanceAlarmModeNormal.
     *                   + When the publisher turns on the release performance fallback, the mode value is kPerformance AlarmModeSimulcast.
     * @param room_id + When the release performance fallback is not turned on, the room_id is empty
     * + When the release performance fallback is turned on, the room_id is the room ID affected by the alarm.
     * @param reason Reason for the alarm
     * @param data Performance rollback related data
     */
    /** {zh}
     * @region 音视频回退
     * @brief 本地未开启发布性能回退，检测到设备性能不足时，收到此回调。本地开启发布性能回退，因设备性能/网络原因，造成发布性能回退/恢复时，收到此回调。
     * @param mode 指示本地是否开启发布回退功能 <li> 当发布端未开启发布性能回退时，mode 值为 kPerformanceAlarmModeNormal。  </li><li>当发布端开启发布性能回退时，mode 值为 kPerformanceAlarmModeSimulcast。</li>
     * @param room_id  <li>未开启发布性能回退时，room_id 为空 </li><li>开启发布性能回退时，room_id 是告警影响的房间 ID。</li>
     * @param reason 告警原因
     * @param data 性能回退相关数据
     */
    onPerformanceAlarms(mode: PerformanceAlarmMode, room_id: string, reason: PerformanceAlarmReason, data: SourceWantedData): void;
    /** {en}
     * @brief  Periodically (2s) issue callbacks to report the current CPU and memory usage
     * @param stats Return the current system state information.
     */
    /** {zh}
     * @brief 周期性地发出回调，报告当前cpu与memory使用率
     * @param stats 返回包含当前系统状态信息的结构体
     */
    onSysStats(stats: SysStats): void;
    /** {en}
     * @brief The remote clients in the room will be informed of the state change via this callback after the visible user starts audio capture by calling `startAudioCapture`.
     * @param room_id Room ID
     * @param user_id The user who started the internal audio capture
     */
    /** {zh}
     * @region 音频事件回调
     * @brief 房间内的用户调用 `startAudioCapture` 开启音频采集时，房间内其他用户会收到此回调。
     * @param room_id 开启音频采集的远端用户所在的房间 ID
     * @param user_id 开启音频采集的远端用户 ID
     */
    onUserStartAudioCapture(room_id: string, user_id: string): void;
    /** {en}
     * @brief The remote clients in the room will be informed of the state change via this callback after the visible user stops audio capture by calling `stopAudioCapture`.
     * @param room_id Room ID
     * @param user_id The user who stopped the internal audio capture
     */
    /** {zh}
     * @brief 房间内的用户调用 `stopAudioCapture` 关闭音频采集时，房间内其他用户会收到此回调。
     * @param room_id 关闭音频采集的远端用户所在的房间 ID
     * @param user_id 关闭音频采集的远端用户 ID
     */
    onUserStopAudioCapture(room_id: string, user_id: string): void;
    /** {en}
     * @brief Receive the callback when the first audio frame is locally collected
     * @param index Audio stream type: audio from microphone or sound card.
     */
    /** {zh}
     * @region 音频事件回调
     * @brief 本地采集到第一帧音频帧时，收到该回调
     * @param index 音频流属性
     */
    onFirstLocalAudioFrame(index: StreamIndex): void;
    /** {en}
     * @brief This callback informs you when the first frame of every remote audio is received.
     * @param key Remote audio stream information
     */
    /** {zh}
     * @brief 收到房间内每一路音频流的第一帧时，收到该回调。
     * @param key 远端音频流信息
     */
    onFirstRemoteAudioFrame(key: RemoteStreamKey): void;
    /** {en}
     * @brief Once the Fallback option is set, Fallback or reverting from a Fallback of a media stream will trigger this callback.
     * @param event Information of stream switching.
     * @notes Call setSubscribeFallbackOption or configure Fallback options on the server side to register this callback.
     */
    /** {zh}
     * @region 音视频回退
     * @brief 因发布/订阅性能回退或退出回退状态，订阅的音视频流，发生流的切换时，收到该回调。
     * @param event 流切换信息
     * @notes 你必须先通过 API 或控制台设置音视频流订阅回退功能时，你才能收到此回调。
     */
    onSimulcastSubscribeFallback(event: RemoteStreamSwitch): void;
    /** {en}
     * @brief RTC SDK receives this callback when the first video frame or screen video frame capture is completed locally.
     * @param index Stream type: video from a camera or the screen recorder
     * @param info Video information
     */
    /** {zh}
     * @region 视频管理
     * @brief 第一帧本地采集的视频/屏幕共享画面在本地视图渲染完成时，收到此回调。
     * @param index 流属性
     * @param info 视频信息
     */
    onFirstLocalVideoFrameCaptured(index: StreamIndex, info: VideoFrameInfo): void;
    /** {en}
     * @brief Receive this callback when the local video size or rotation configuration changes.
     * @param index Stream type: video from a camera or the screen recorder
     * @param info Video frame information
     */
    /** {zh}
     * @brief 本地视频大小或旋转配置发生改变时，收到此回调。
     * @param index 流属性
     * @param info 视频帧信息
     */
    onLocalVideoSizeChanged(index: StreamIndex, info: VideoFrameInfo): void;
    /** {en}
     * @brief Users in the room who subscribe to this video stream receive this callback when the remote video size or rotation configuration changes.
     * @param key Remote stream information
     * @param stream Video frame information
     */
    /** {zh}
     * @brief 远端视频大小或旋转配置发生改变时，房间内订阅此视频流的用户会收到此回调。
     * @param key 远端流信息
     * @param stream 视频帧信息
     */
    onRemoteVideoSizeChanged(key: RemoteStreamKey, stream: VideoFrameInfo): void;
    /** {en}
     * @brief  Receive this callback after the first frame of remote video stream is locally rendered by SDK.
     * @param key Remote stream information
     * @param info Video frame information
     */
    /** {zh}
     * @brief 第一帧远端视频流在视图上渲染成功后，收到此回调。
     * @param key 远端流信息
     * @param info 视频帧信息
     */
    onFirstRemoteVideoFrameRendered(key: RemoteStreamKey, info: VideoFrameInfo): void;
    /** {en}
     * @brief Receive this callback after the first frame of remote video stream is received and decoded by SDK.
     * @param key Remote stream information
     * @param info Video frame information
     */
    /** {zh}
     * @region 视频管理
     * @author zhushufan.ref
     * @brief SDK 接收并解码远端视频流首帧后，收到此回调。
     * @param key 远端流信息。
     * @param info 视频帧信息。
     */
    onFirstRemoteVideoFrameDecoded(key: RemoteStreamKey, info: VideoFrameInfo): void;
    /** {en}
     * @brief The remote clients in the room will be informed of the state change via this callback after the visible user starts video capture by calling `startVideoCapture`.
     * @param room_id Room ID
     * @param user_id User who started the video capture.
     */
    /** {zh}
     * @region 视频事件回调
     * @brief 房间内的用户调用 `startVideoCapture` 开启视频采集时，房间内其他用户会收到此回调。
     * @param room_id 开启视频采集的远端用户所在的房间 ID
     * @param user_id 开启视频采集的远端用户 ID
     */
    onUserStartVideoCapture(room_id: string, user_id: string): void;
    /** {en}
     * @brief The remote clients in the room will be informed of the state change via  this callback after the visible user stops video capture by calling `stopVideoCapture`.
     * @param room_id Room ID
     * @param user_id User who stopped the video capture.
     */
    /** {zh}
     * @region 视频事件回调
     * @brief 房间内的用户调用 `stopVideoCapture` 关闭视频采集时，房间内其他用户会收到此回调。
     * @param room_id 关闭视频采集的远端用户所在的房间 ID
     * @param user_id 关闭视频采集的远端用户 ID
     */
    onUserStopVideoCapture(room_id: string, user_id: string): void;
    /** {en}
     * @deprecated since 3.50. Use `onAudioDeviceStateChanged` instead.
     * @brief When the state of the local audio changes, the callback notifies the current local audio state.
     * @param state State of the local audio device
     * @param error Error code when the local audio state changes
     */
    /** {zh}
     * @deprecated since 3.50. Use `onAudioDeviceStateChanged` instead.
     * @brief 本地音频的状态发生改变时，该回调通知当前的本地音频状态。
     * @param state 本地音频设备的状态
     * @param error 本地音频状态改变时的错误码
     */
    onLocalAudioStateChanged(state: LocalAudioStreamState, error: LocalAudioStreamError): void;
    /** {en}
     * @hidden not available
     * @brief When the state of the audio stream from the remote user subscribes to changes, this callback will be received to understand the current state of the remote audio stream.
     * @param key Remote stream information
     * @param state Remote audio stream state
     * @param reason Reason for remote audio stream state change
     */
    /** {zh}
     * @hidden not available
     * @region 音频事件回调
     * @brief 用户订阅来自远端的音频流状态发生改变时，会收到此回调，了解当前的远端音频流状态。
     * @param key 远端流信息
     * @param state 远端音频流状态
     * @param reason 远端音频流状态改变的原因
     */
    onRemoteAudioStateChanged(key: RemoteStreamKey, state: RemoteAudioState, reason: RemoteAudioStateChangeReason): void;
    /** {en}
     * @brief After calling `enableAudioPropertiesReport`, you will periodically receive this callback for the active speaker information.
     * @param room_id Room ID
     * @param uid The user ID of the active speaker
     */
    /** {zh}
     * @region 音频信息回调
     * @brief 调用 `enableAudioPropertiesReport` 后，根据设置的 config.interval，你会周期性地收到此回调，获取房间内的最活跃用户信息。
     * @param room_id 房间 ID
     * @param uid 最活跃用户（ActiveSpeaker）的用户 ID
     */
    onActiveSpeaker(room_id: string, uid: string): void;
    /** {en}
     * @deprecated since 3.50. Use `onVideoDeviceStateChanged` instead.
     * @brief Receive this event when the state of the local video stream changes.
     * @param index Stream type: video from a camera or the screen recorder
     * @param state Local video stream status
     * @param error Error code when local video status changes
     */
    /** {zh}
     * @deprecated since 3.50. Use `onVideoDeviceStateChanged` instead.
     * @brief 本地视频流的状态发生改变时，收到该事件。
     * @param index 音/视频属性
     * @param state 本地视频流状态
     * @param error 本地视频状态改变时的错误码
     */
    onLocalVideoStateChanged(index: StreamIndex, state: LocalVideoStreamState, error: LocalVideoStreamError): void;
    /** {en}
     * @hidden not available
     * @brief When the state of a remote video stream changes, users in the room who subscribe to this stream receive the event.
     * @param key Information about the remote video stream, room, user ID, stream attributes, etc.
     * @param state Remote video stream state
     * @param reason Reason for the remote video stream state change.
     */
    /** {zh}
     * @hidden not available
     * @region 视频管理
     * @brief 远端视频流的状态发生改变时，房间内订阅此流的用户会收到该事件。
     * @param key 远端视频流的信息，房间、用户 ID、流属性等。
     * @param state 远端视频流状态
     * @param reason 远端视频流状态改变的原因
     */
    onRemoteVideoStateChanged(key: RemoteStreamKey, state: RemoteVideoState, reason: RemoteVideoStateChangeReason): void;
    /** {en}
     * @brief Audio first frame sending status change callback
     * @param room_id Room ID
     * @param user Local user information
     * @param state First frame sending state
     */
    /** {zh}
     * @region 房间管理
     * @brief 音频首帧发送状态改变回调
     * @param room_id 房间 ID
     * @param user 本地用户信息
     * @param state 首帧发送状态
     */
    onAudioFrameSendStateChanged(room_id: string, user: RtcUser, state: FirstFrameSendState): void;
    /** {en}
     * @brief Video first frame sending status change callback
     * @param room_id Room ID
     * @param user Local user information
     * @param state First frame sending state
     */
    /** {zh}
     * @region 房间管理
     * @brief 视频首帧发送状态改变回调
     * @param room_id 房间 ID
     * @param user 本地用户信息
     * @param state 首帧发送状态
     */
    onVideoFrameSendStateChanged(room_id: string, user: RtcUser, state: FirstFrameSendState): void;
    /** {en}
     * @brief Screen sharing streaming video first frame sending status change callback
     * @param room_id Room ID
     * @param user Local user information
     * @param state First frame sending state
     */
    /** {zh}
     * @region 房间管理
     * @brief 屏幕共享流视频首帧发送状态改变回调
     * @param room_id 房间 ID
     * @param user 本地用户信息
     * @param state 首帧发送状态
     */
    onScreenVideoFrameSendStateChanged(room_id: string, user: RtcUser, state: FirstFrameSendState): void;
    /** {en}
     * @brief Screen sharing streaming video first frame sending status change callback
     * @param room_id Room ID
     * @param user Local user information
     * @param state First frame playback state
     */
    /** {zh}
     * @region 房间管理
     * @brief 音频首帧播放状态改变回调
     * @param room_id 房间 ID
     * @param user 远端用户信息
     * @param state 首帧播放状态
     */
    onAudioFramePlayStateChanged(room_id: string, user: RtcUser, state: FirstFramePlayState): void;
    /** {en}
     * @brief  Video first frame playback state change callback
     * @param room_id Room ID
     * @param user Local user information
     * @param state First frame playback state
     */
    /** {zh}
     * @region 房间管理
     * @brief 视频首帧播放状态改变回调
     * @param room_id 房间 ID
     * @param user 远端用户信息
     * @param state 首帧播放状态
     */
    onVideoFramePlayStateChanged(room_id: string, user: RtcUser, state: FirstFramePlayState): void;
    /** {en}
     * @brief Screen sharing streaming video first frame playback state change callback
     * @param room_id Room ID
     * @param user Local user information
     * @param state First frame playback state
     */
    /** {zh}
     * @region 房间管理
     * @brief 屏幕共享流视频首帧播放状态改变回调
     * @param room_id 房间id
     * @param user 远端用户信息
     * @param state 首帧播放状态
     */
    onScreenVideoFramePlayStateChanged(room_id: string, user: RtcUser, state: FirstFramePlayState): void;
    /** {en}
     * @brief After sending a text or binary message (P2P) to a single user in the room, the message sender receives a callback with the result of the message.
     * @param msgid ID of this message.
     * @param error Text or binary message sending results.
     */
    /** {zh}
     * @region 流消息
     * @brief 当调用 sendMessageToUser 函数发送消息后，回调此条消息的发送结果（反馈）。
     * @param msgid 本条消息的 ID
     * @param error 消息发送结果
     */
    onUserMessageSendResult(msgid: number, error: MessageSendResultCode): void;
    /** {en}
     * @brief Receive this callback when you receive a binary message from an out-of-room user calling `sendUserBinaryMessage`.
     * @param uid User ID of the message sender
     * @param message Content of the message
     */
    /** {zh}
     * @region 实时消息通信
     * @brief 单个用户接收到同一房间内其他 uid 所属用户发来二进制消息的回调（P2P）。
     * @param uid 消息发送者 ID 。
     * @param message 收到的二进制消息内容。
     * @notes 同一房间内其他用户调用 [sendUserBinaryMessage](85532#senduserbinarymessage) 发送二进制消息给本地用户时，本地用户会收到该回调。
     */
    onUserBinaryMessageReceived(uid: string, message: string): void;
    /** {en}
     * @brief Callback on subscription status of media streams
     * @param state_code Subscription status of media streams
     * @param user_id The ID of the user who published the stream.
     * @param info Configurations of stream subscription
     */
    /** {zh}
     * @region 房间管理
     * @brief 当订阅一个流成功的时候回调该事件
     * @param state_code 订阅流的结果
     * @param user_id 用户的标识
     * @param info 流的属性
     * @notes 当更新流的内容时比如增加或者减少音视频流成功更新时也会回调该事件
     */
    onStreamSubscribed(state_code: SubscribeState, user_id: string, info: SubscribeConfig): void;
    /** {en}
     * @brief Receive this callback when you receive a video frame with a SEI message sent via sendSEIMessage
     * @param stream_key Contains the user name, room name and media stream of the SEI sender.
     * @param message The content of the SEI message received
     */
    /** {zh}
     * @region 视频管理
     * @brief 收到通过 `sendSEIMessage` 发送的带有 SEI 消息的视频帧时，收到此回调
     * @param stream_key 包含 SEI 发送者的用户名，所在的房间名和媒体流
     * @param message 收到的 SEI 消息内容
     */
    onSEIMessageReceived(stream_key: RemoteStreamKey, message: string): void;
    /** {en}
     * @deprecated
     * @hidden
     * @brief Used for reporting events during pushing streams to CDN
     * @param event Type Stream mixing status
     * @param task_id Task ID
     * @param error Errors occuring during the pushing process.
     * + `0`: Successfully pushed streams to target CDN.
     * + `1090`: Undefined error
     * + `1091`: Invalid parameters detected by Client SDK
     * + `1092`: Program runs with an error, the state machine is in abnormal condition.
     * + `1093`: Invalid operation
     * + `1094`: Request timed out. Please check network status and retry.
     * + `1095`: Invalid parameters detected by the server
     * + `1096`: Subscription to the stream has expired.
     * + `1097`: Internal server error.
     * + `1098`: The server failed to push streams to CDN.
     * + `1099`: Signaling connection timeout error. Please check network status and retry.
     * + `1100`: Failed to mix image.
     * + `1101`: Unknown error from server.
     * @param mix_type Stream mixing and pushing type
     */
    /** {zh}
     * @deprecated
     * @hidden
     * @brief 通知转推直播关键事件
     * @param event 事件类型
     * @param task_id 任务 ID
     * @param error 错误类型
     * + `0`: 推流成功。
     * + `1090`: 未定义的合流错误。
     * + `1091`: 客户端 SDK 检测到无效推流参数。
     * + `1092`: 状态错误，需要在状态机正常状态下发起操作。
     * + `1093`: 无效操作。
     * + `1094`: 转推直播任务处理超时，请检查网络状态并重试。
     * + `1095`: 服务端检测到错误的推流参数。
     * + `1096`: 对流的订阅超时。
     * + `1097`: 合流服务端内部错误。
     * + `1098`: 合流服务端推 CDN 失败。
     * + `1099`: 服务端接收信令超时，请检查网络状态并重试。
     * + `1100`: 图片合流失败。
     * + `1101`: 服务端未知错误。
     * @param mix_type 合流类型
     */
    onStreamMixingEvent(event: StreamMixingEvent, task_id: string, error: number, mix_type: StreamMixingType): void;
    /** {en}
     * @brief Used for reporting events during pushing a single stream to CDN.
     * @param event Stream mixing and pushing status
     * @param task_id Task ID
     * @param error Errors occuring during the pushing process.
     * + `0`: Successfully pushed streams to target CDN.
     * + `1090`: Undefined error
     * + `1091`: Invalid parameters detected by Client SDK
     * + `1092`: Program runs with an error, the state machine is in abnormal condition.
     * + `1093`: Invalid operation
     * + `1094`: Request timed out. Please check network status and retry.
     * + `1095`: Invalid parameters detected by the server
     * + `1096`: Subscription to the stream has expired.
     * + `1097`: Internal server error.
     * + `1098`: The server failed to push streams to CDN.
     * + `1099`: Signaling connection timeout error. Please check network status and retry.
     * + `1100`: Failed to mix image.
     * + `1101`: Unknown error from server.
     */
    /** {zh}
     * @brief 单流转推直播状态回调
     * @param event 事件类型
     * @param task_id 任务 ID
     * @param error 错误类型
     * + `0`: 推流成功。
     * + `1090`: 未定义的合流错误。
     * + `1091`: 客户端 SDK 检测到无效推流参数。
     * + `1092`: 状态错误，需要在状态机正常状态下发起操作。
     * + `1093`: 无效操作。
     * + `1094`: 转推直播任务处理超时，请检查网络状态并重试。
     * + `1095`: 服务端检测到错误的推流参数。
     * + `1096`: 对流的订阅超时。
     * + `1097`: 合流服务端内部错误。
     * + `1098`: 合流服务端推 CDN 失败。
     * + `1099`: 服务端接收信令超时，请检查网络状态并重试。
     * + `1100`: 图片合流失败。
     * + `1101`: 服务端未知错误。
     */
    onStreamPushEvent(event: SingleStreamPushEvent, task_id: string, error: number): void;
    /** {en}
     * @brief Callback of the local recording status.
     * @param type Stream properties of the recorded stream.
     * @param state Recording state
     * @param error_code Recording error code
     * @param info For more information about the recorded file.
     * @notes The callback is triggered by [`startFileRecording`](85532#startfilerecording) or [`stopFileRecording`](85532#stopfilerecording).
     */
    /** {zh}
     * @region 本地录制
     * @brief 获取本地录制状态回调。
     * @param type 录制流的流属性
     * @param state 录制状态
     * @param error_code 录制错误码
     * @param info 录制文件的详细信息
     * @notes 该回调由 [`startFileRecording`](85532#startfilerecording) 或 [`stopFileRecording`](85532#stopfilerecording) 触发。
     */
    onRecordingStateUpdate(type: StreamIndex, state: number, error_code: number, info: RecordingInfo): void;
    /** {en}
     * @brief Local recording progress callback.
     * @param type Stream properties of the recorded stream
     * @param process Recording progress
     * @param info More information about the recorded file
     * @notes This callback is triggered by [`startFileRecording`](85532#startfilerecording). When the recording state is normal, the system will prompt the recording progress through this callback every second.
     */
    /** {zh}
     * @region 本地录制
     * @brief 本地录制进度回调。
     * @param type 录制流的流属性
     * @param process 录制进度
     * @param info 录制文件的详细信息
     * @notes 该回调由 [`startFileRecording`](85532#startfilerecording) 触发，录制状态正常时，系统每秒钟都会通过该回调提示录制进度。
     */
    onRecordingProgressUpdate(type: StreamIndex, process: RecordingProgress, info: RecordingInfo): void;
    /** {en}
     * @brief login result callback
     * @param uid Login user ID
     * @param error_code Login result
     * @param elapsed The time taken from the call to [login](85532#login) to the receipt of the result. Measured by ms.
     */
    /** {zh}
     * @region 实时消息通信
     * @brief 调用 `login` 后，会收到此回调。
     * @param uid 登录用户 ID
     * @param error_code 登录结果
     * @param elapsed 从调用 [login](85532#login) 接口开始到返回结果所用时长，单位为 ms。
     */
    onLoginResult(uid: string, error_code: number, elapsed: number): void;
    /** {en}
     * @brief logout result callback
     * @notes After calling [logout](85532#logout), you will receive this callback.
     */
    /** {zh}
     * @region 实时消息通信
     * @brief 登出结果回调
     * @notes 调用 [logout](85532#logout) 后，会收到此回调。
     */
    onLogout(): void;
    /** {en}
     * @brief Set the return result of the application server parameter
     * @param error
     * + 200, set successfully
     * + != 200: Failure.
     * @notes Receive this callback after calling [setServerParams](85532#setserverparams).
     */
    /** {zh}
     * @region 实时消息通信
     * @brief 设置业务服务器参数的返回结果
     * @param error  设置结果  <li>返回 200，设置成功 </li><li>返回其他，设置失败</li>
     * @notes 调用 [setServerParams](85532#setserverparams) 后，会收到此回调。
     */
    onServerParamsSetResult(error: number): void;
    /** {en}
     * @brief Callback to tell the login state of a user.
     * @param peer_user_id User ID
     * @param status Login status of the user
     * @notes Call [getPeeronlineStatus](85532#getpeeronlinestatus) before you can get this callback.
     */
    /** {zh}
     * @region 实时消息通信
     * @brief 查询对端或本端用户登录状态的返回结果
     * @param peer_user_id 需要查询的用户 ID
     * @param status 查询的用户登录状态
     * @notes 必须先调用 [getPeeronlineStatus](85532#getpeeronlinestatus)，才能收到此回调。
     */
    onGetPeerOnlineStatus(peer_user_id: string, status: number): void;
    /** {en}
     * @brief Receive this callback when you receive a text message from an out-of-room user calling sendUserMessageOutsideRoom.
     * @param uid User ID of the message sender
     * @param message Received text message content
     */
    /** {zh}
     * @region 实时消息通信
     * @brief 收到房间外用户调用 `sendUserMessageOutsideRoom` 发来的文本消息时，会收到此回调
     * @param uid 消息发送者 ID
     * @param message 收到的文本消息内容
     */
    onUserMessageReceivedOutsideRoom(uid: string, message: string): void;
    /** {en}
     * @brief Receive this callback when you receive a binary message from an out-of-room user calling `sendUserBinaryMessageOutsideRoom`.
     * @param uid User ID of the message sender
     * @param message Binary message content received
     */
    /** {zh}
     * @region 实时消息通信
     * @brief 收到房间外用户调用 `sendUserBinaryMessageOutsideRoom` 发来的二进制消息时，会收到此回调
     * @param uid 消息发送者 ID
     * @param message 收到的二进制消息内容
     */
    onUserBinaryMessageReceivedOutsideRoom(uid: string, message: string): void;
    /** {en}
     * @brief A callback that sends a message to a specified user outside the room
     * @param msgid The ID of this message. All P2P and P2Server messages share a single ID sequence.
     * @param error Message sending result
     * @notes Receive this callback when a message is sent by calling [sendUserMessageOutsideRoom](85532#sendusermessageoutsideroom) or [sendUserBinaryMessageOutsideRoom](#senduserbinarymessageoutsideroom).
     */
    /** {zh}
     * @region 实时消息通信
     * @brief 给房间外指定的用户发送消息的回调
     * @param msgid 本条消息的 ID。所有的 P2P 和 P2Server 消息共用一个 ID 序列。
     * @param error 消息发送结果
     * @notes 当调用 [sendUserMessageOutsideRoom](85532#sendusermessageoutsideroom) 或 [sendUserBinaryMessageOutsideRoom](85532#senduserbinarymessageoutsideroom) 发送消息后，会收到此回调。
     */
    onUserMessageSendResultOutsideRoom(msgid: number, error: number): void;
    /** {en}
     * @brief Callback to send a message to the application server
     * @param msgid The ID of this message
     *        All P2P and P2Server messages share a single ID sequence.
     * @param error Message Sending Results.
     * @param message The message returned in ACK when the application server receives HTTP request.
     * @notes msg this callback when you call [sendServerMessage](85532#sendservermessage) or [sendServerBinaryMessage](85532#sendserverbinarymessage) to send a message to your application server.
     */
    /** {zh}
     * @region 实时消息通信
     * @brief 给业务服务器发送消息的回调
     * @param msgid 本条消息的 ID。所有的 P2P 和 P2Server 消息共用一个 ID 序列。
     * @param error 消息发送结果
     * @param msg 应用服务器收到 HTTP 请求后，在 ACK 中返回的信息。
     * @notes 当调用 [sendServerMessage](85532#sendservermessage) 或 [sendServerBinaryMessage](85532#sendserverbinarymessage) 接口发送消息后，会收到此回调。
     */
    onServerMessageSendResult(msgid: number, error: number, msg: string): void;
    /** {en}
     * @brief Returns audio data recorded by microphone
     * @param audio_frame Audio data
     */
    /** {zh}
     * @region 音频数据回调
     * @brief 返回麦克风录制的音频数据
     * @param audio_frame 麦克风录制的音频数据
     */
    onRecordAudioFrame(audio_frame: IAudioFrame): void;
    /** {en}
     * @brief Returns the mixed audio data of all subscribed remote users
     * @param audio_frame Audio data
     */
    /** {zh}
     * @region 音频数据回调
     * @brief 返回远端所有用户混音后的音频数据
     * @param audio_frame 远端所有用户混音后的音频数据
     */
    onPlaybackAudioFrame(audio_frame: IAudioFrame): void;
    /** {en}
     * @brief Returns mixed audio data including both data recorded by the local microphone and data from all subscribed remote users
     * @param audio_frame Audio data
     */
    /** {zh}
     * @region 音频数据回调
     * @brief 返回本地麦克风录制和远端所有用户混音后的音频数据
     * @param audio_frame 本地麦克风录制和远端所有用户混音后的音频数据
     */
    onMixedAudioFrame(audio_frame: IAudioFrame): void;
    /** {en}
     * @brief Speech recognition service started successfully.
     */
    /** {zh}
     * @brief 语音识别服务开启成功回调
     */
    onASRSuccess(): void;
    /** {en}
     * @brief The voice-to-text callback is successful, and the callback returns the full amount of messages after recognition.
     * @param message Text message obtained after the completion of the recognition
     * @notes If the network connection is interrupted during the recognition process, the callback information after the reconnection contains only the text message recognized after the reconnection, and no longer contains the last connection. The message identified after.
     */
    /** {zh}
     * @brief 语音转文字成功回调，该回调返回识别后的全量消息。
     * @param message 识别完成后得到的文字消息
     * @notes 若识别过程中发生了网络连接中断，则重连后回调的信息中只包含重连后识别的文字消息，不再包含上一次连接后识别的消息。
     */
    onMessage(message: string): void;
    /** {en}
     * @brief This callback is triggered when an error event occurs within the speech recognition service.
     * @param error_code Error code
     * + < 0: parameter error or API call order error.
     * + `-1`: Disconnected. SDK will keep retrying.
     * + `-2`: Call startASR repeatdely. Call stopASR when you intend to start ASR service again.
     * + `-3`: Token of ASR service is required.
     * + `-4`: secret_key is required in the Signature mode.
     * + `-5`: User ID is required.
     * + `-6`: App ID is required.
     * + `-7`: cluster is required.
     * + `-8`: Connection building error. Please contact our technical specialist for the correct SDK version with ASR service.
     * @param error_message Detailed error message
     */
    /** {zh}
     * @brief 当语音识别服务内部发生错误事件时触发该回调。
     * @param error_code 错误码  <0: 参数错误或 API 调用顺序错误
     * + `-1`: 网络连接中断，服务不可用，内部会进行重连
     * + `-2`: 重复调用 startASR。开启语音识别服务后，你需要先调用 stopASR 停止语音识别服务，才能二次调用 startASR 再次开启服务。
     * + `-3`: 语音识别服务所需 token 为空
     * + `-4`: Signature 鉴权模式下 secret_key 为空
     * + `-5`: 用户 ID 为空
     * + `-6`: 应用 ID 为空
     * + `-7`: 语音识别服务 cluster 为空
     * + `-8`: 语音识别服务连接失败，该版本没有语音识别功能，请联系 RTC 技术支持。
     * @param error_message 错误原因说明
     */
    onASRError(error_code: number, error_message: string): void;
    /** {en}
     * @brief Pre-call network detection result.
     * @param type Identifies the network type as uplink/downlink.
     * @param quality Network quality
     * @param rtt Network RTT in ms
     * @param lost_rate Packet loss rate
     * @param bit_rate Network bandwidth in kbps
     * @param jitter Network jitter in ms
     * @notes After successfully calling [startNetworkDetection](#startnetworkdetection), you will receive this callback for the first time in 3s and every 2s thereafter.
     */
    /** {zh}
     * @region 网络探测
     * @brief 成功调用 `startNetworkDetection` 接口开始探测后，会在 3s 内首次收到该回调，之后每 2s 收到一次该回调。
     * @param type 探测网络类型为上行/下行
     * @param quality 探测网络的质量
     * + `0`: 网络质量未知。
     * + `1`: 网络质量极好。
     * + `2`: 主观感觉和 kNetworkQualityExcellent 差不多，但码率可能略低。
     * + `3`: 主观感受有瑕疵但不影响沟通。
     * + `4`: 勉强能沟通但不顺畅。
     * + `5`: 网络质量非常差，基本不能沟通。
     * @param rtt 探测网络的 RTT，单位：ms
     * @param lost_rate 探测网络的丢包率
     * @param bit_rate 探测网络的带宽，单位：kbps
     * @param jitter 探测网络的抖动,单位：ms
     */
    onNetworkDetectionResult(type: number, quality: number, rtt: number, lost_rate: number, bit_rate: number, jitter: number): void;
    /** {en}
     * @brief Pre-call network probing ends
     * @param reason Reason of stopping probing
     * @notes The following will stop detection and receive this primary callback:
     *        1. This callback is received once when the [`stopNetworkDetection`](85532#stopnetworkdetection) interface is called to stop probing;
     *        2. Stop detection when the first frame of remote/local audio is received;
     *        3. Stop detecting when the detection exceeds 3 minutes;
     *        4. When the probe link is disconnected for a certain period of time, the probe is stopped.
     */
    /** {zh}
     * @region 网络探测
     * @brief 通话前网络探测结束
     * @param reason 停止探测的原因类型
     * + `0`: 用户主动停止
     * + `1`: 探测超过三分钟
     * + `2`: 探测网络连接断开。当超过 12s 没有收到回复，SDK 将断开网络连接，并且不再尝试重连。
     * + `3`: 本地开始推拉流，停止探测
     * + `4`: 网络探测失败，内部异常
     * @notes 以下情况将停止探测并收到本一次本回调：
     * + 当调用 [`stopNetworkDetection`](85532#stopnetworkdetection) 接口停止探测后，会收到一次该回调；
     * + 当收到远端/本端音频首帧后，停止探测；
     * + 当探测超过3分钟后，停止探测；
     * + 当探测链路断开一定时间之后，停止探测。
     */
    onNetworkDetectionStopped(reason: number): void;
    /** {en}
     * @brief After calling `enableAudioPropertiesReport`, you will periodically receive this callback for the information about local audio.
     * @param audio_properties_infos Local audio which includes the microphone audio and the screen audio captured using RTC SDK internal mechanisms.
     * @param audio_properties_info_number length of the array which you can ignore.
     */
    /** {zh}
     * @region 音频管理
     * @brief 调用 `enableAudioPropertiesReport` 后，根据设置的 interval 值，你会周期性地收到此回调，了解本地音频的相关信息。
     * @param audio_properties_infos 本地音频信息。本地音频包括使用 RTC SDK 内部机制采集的麦克风音频和屏幕音频。
     * @param audio_properties_info_number 数组长度，无需关注
     */
    onLocalAudioPropertiesReport(audio_properties_infos: LocalAudioPropertiesInfo[], audio_properties_info_number: number): void;
    /** {en}
     * @brief Notification on the playing volume during the test for the local audio devices
     * @param audio_properties_infos Remote audio properties including audio from a microphone or the soudn card.
     * @param audio_properties_info_number length of the array which you can ignore
     * @param total_remote_volume playing volume during the test for the local audio devices in milliseconds. We recommend to set it to 200 ms.The range is [0,255].
     */
    /** {zh}
     * @region 音频管理
     * @author wangjunzheng
     * @brief 远端用户进房后，本地调用 `enableAudioPropertiesReport`，根据设置的 interval 值，本地会周期性地收到此回调，了解订阅的远端用户的音频信息。
     * @param audio_properties_infos 远端音频信息，其中包含音频流属性、房间 ID、用户 ID。远端用户的音频包括使用 RTC SDK 采集的麦克风音频和屏幕音频。
     * @param audio_properties_info_number 数组长度，无需关注
     * @param total_remote_volume 订阅的所有远端流的总音量。
     */
    onRemoteAudioPropertiesReport(audio_properties_infos: RemoteAudioPropertiesInfo[], audio_properties_info_number: number, total_remote_volume: number): void;
    /** {en}
     * @brief Callback about the call test result.
     * @param result + kTestSuccess	0:	Success
     * + kTestTimeout 1:	Abort after a 60 sec timeout
     * + kTestIntervalShort 2:	The next test must start 5 sec after the end the previous test.
     * + kAudioDeviceError	3:	Error in audio capture
     * + kVideoDeviceError	4:	Error in video capture
     * + kAudioReceiveError	5:	Error in receiving audio
     * + kVideoReceiveError	6:	Error in receiving video
     * + kInternalError	7:	Unrecoverable error
     * @notes The timing when this callback will be triggered is as follows:
     * + A device-related error occured during the test；
     * + After a successful test；
     * + After stopping the test, provided that the audio/video playback was not received during the test due to non-device reasons.
     */
    /** {zh}
     * @region 音频回路测试
     * @brief 通话前网络探测结束
     * @param result + kTestSuccess	0:	接收到采集的音视频的回放，通话回路检测成功
     * + kTestTimeout 1:	测试超过 60s 仍未完成，已自动停止
     * + kTestIntervalShort 2:	上一次测试结束和下一次测试开始之间的时间间隔少于 5s
     * + kAudioDeviceError	3:	音频采集异常
     * + kVideoDeviceError	4:	视频采集异常
     * + kAudioReceiveError	5:	音频接收异常
     * + kVideoReceiveError	6:	视频接收异常
     * + kInternalError	7:	内部错误，不可恢复
     * @notes 该回调触发的时机包括：
     * + 检测过程中采集设备发生错误时；
     * + 检测成功后；
     * + 非设备原因导致检测过程中未接收到音/视频回放，停止检测后。
     */
    onEchoTestResult(result: EchoTestResult): void;
    /** {en}
     * @brief Callback of video device state. Video devices include cameras and screen sharing video capture devices.
     * @param device_id Device ID
     * @param device_type Device type
     * + `-1`: Unknown
     * + `0`: Video rendering device
     * + `1`: Video capture device
     * + `2`: Screen recorder
     * @param device_state Device state
     * + `1`: On
     * + `2`: Off
     * + `3`: Runtime error, for example, when the media device is expected to be working but no data is received.
     * + `4`: Device paused. Including:
     *         + During screen capturing, the target application window is minimized in the taskbar.
     *         + Before or during screen capturing, the target application window is hidden.
     *         + During screen capturing, the target application window is being stretched.
     *         + During screen capturing, the target application window is being dragged.
     * + `5`: Resumed.
     * + `10`: Added.
     * + `11`: Removed.
     * + `12`: Closing the laptop interrupted the RTC call. RTC call will resume once the laptop is opened.
     * + `13`: RTC call resumed from the interruption caused by Closing the laptop.
     * + `14`: The device just became the default device.
     * + `15`: The device is no longer the default device.
     * + `16`: Notification of receiving the device list after time-out. Call enumerate-device api to update the device list when you get this notification.
     * @param device_error Device error
     * + `0`: Media equipment is normal.
     * + `1`: No permission to start media device
     * + `2`: Media devices are already in use
     * + `3`: Media device error
     * + `4`: The specified media device was not found.
     * + `5`: Media device, window or monitor removed.
     * + `6`: Device has no data callback.
     * + `7`: Device sample rate not supported.
     */
    /** {zh}
     * @region 视频管理
     * @brief 视频频设备状态回调。提示摄像头视频采集、屏幕视频采集等设备的状态。
     * @param device_id 设备 ID。采集屏幕共享流时，设备 ID 为固定字符串 screen_capture_video
     * @param device_type 设备类型
     * + `-1`: 未知设备类型
     * + `0`: 视频渲染设备类型
     * + `1`: 视频采集设备类型
     * + `2`: 屏幕流视频设备
     * @param device_state 设备状态
     * + `1`: 设备已开启
     * + `2`: 设备已停止
     * + `3`: 设备运行时错误。例如，当媒体设备的预期行为是正常采集，但没有收到采集数据时，将回调该状态。
     * + `4`: 设备已暂停。包括：
     *  + 采集过程中，目标应用窗体最小化到任务栏。
     *  + 开启采集或采集过程中，目标应用窗体被隐藏。
     *  + 采集过程中，目标应用窗体正在被拉伸。
     *  + 采集过程中，目标应用窗体正在被拖动。
     * + `5`: 设备已恢复
     * + `10`: 设备已插入
     * + `11`: 设备被移除
     * + `12`: 用户合盖打断了视频通话。如果系统未休眠或关机，将在开盖后自动恢复视频通话。
     * + `13`: 视频通话已从合盖打断中恢复
     * + `14`: 设备成为系统默认
     * + `15`: 设备不再是系统默认
     * + `16`:  获取设备列表超时后，收到设备列表通知。再次调用获取设备接口更新设备列表。
     * @param device_error 设备错误类型
     * + `0`: 媒体设备正常
     * + `1`: 没有权限启动媒体设备
     * + `2`: 媒体设备已经在使用中
     * + `3`: 媒体设备错误
     * + `4`: 未找到指定的媒体设备
     * + `5`: 媒体设备被移除，对象为采集屏幕流时，表明窗体被关闭或显示器被移除。
     * + `6`: 设备没有数据回调
     * + `7`: 设备采样率不支持
     */
    onVideoDeviceStateChanged(device_id: string, device_type: number, device_state: number, device_error: number): void;
    /** {en}
     * @brief Callback of video device state. Video devices include cameras and screen sharing video capture devices.
     * @param device_id Device ID
     * + `-1`: Unknown device
     * + `0`: Video rendering device
     * + `1`: Video capture device
     * + `2`: Screen recorder
     * @param device_type Device type
     * + `1`: On
     * + `2`: Off
     * + `3`: Runtime error. For example, when the media device is expected to be working but no data is received.
     * + `4`: Device paused. Including:
     * + During screen capturing, the target application window is minimized in the taskbar.
     * + Before or during screen capturing, the target application window is hidden.
     * + During screen capturing, the target application window is being stretched.
     * + During screen capturing, the target application window is being dragged. <
     * + `5`: Device resumed
     * + `10`: Added
     * + `11`: Removed
     * + `12`: Closing the laptop interrupted the RTC call. RTC call will resume once the laptop is opened.
     * + `13`: RTC call resumed from the interruption caused by Closing the laptop.
     * + `14`: The device just became the default device.
     * + `15`: The device is no longer the default device.
     * @param device_state Device state
     * + `0`: Media equipment is normal
     * + `1`: No permission to start media device
     * + `2`: Media devices are already in use
     * + `3`: Media device error
     * + `4`: The specified media device was not found.
     * + `5`: Media device, window or monitor removed.
     * + `6`: Device has no data callback.
     * + `7`: Device sample rate not supported.
     * @param device_error Device error
     */
    /** {zh}
     * @region 音频管理
     * @brief 音频设备状态回调。提示音频采集、音频播放等设备设备的状态。
     * @param device_id 设备 ID
     * @param device_type 设备类型
     * + `-1`: 未知设备类型
     * + `0`: 音频渲染设备类型
     * + `1`: 音频采集设备类型
     * + `2`: 屏幕流音频设备
     * @param device_state 设备状态
     * + `1`: 设备已开启
     * + `2`: 设备已停止
     * + `3`: 设备运行时错误。例如，当媒体设备的预期行为是正常采集，但没有收到采集数据时，将回调该状态。
     * + `4`: 设备已暂停。包括：
     *  + 采集过程中，目标应用窗体最小化到任务栏。
     *  + 开启采集或采集过程中，目标应用窗体被隐藏。
     *  + 采集过程中，目标应用窗体正在被拉伸。
     *  + 采集过程中，目标应用窗体正在被拖动。
     * + `5`: 设备已恢复
     * + `10`: 设备已插入
     * + `11`: 设备被移除
     * + `12`: 用户合盖打断了视频通话。如果系统未休眠或关机，将在开盖后自动恢复视频通话。
     * + `13`: 通话已从合盖打断中恢复
     * + `14`: 设备成为系统默认
     * + `15`: 设备不再是系统默认
     * @param device_error 设备错误类型
     * + `0`: 媒体设备正常
     * + `1`: 没有权限启动媒体设备
     * + `2`: 媒体设备已经在使用中
     * + `3`: 媒体设备错误
     * + `4`: 未找到指定的媒体设备
     * + `5`: 媒体设备被移除，对象为采集屏幕流时，表明窗体被关闭或显示器被移除。
     * + `6`: 设备没有数据回调
     * + `7`: 设备采样率不支持
     */
    onAudioDeviceStateChanged(device_id: string, device_type: number, device_state: number, device_error: number): void;
    /** {en}
     * @brief Notification on the playing volume during the test for the local audio devices
     * @param volume Playing volume during the test for the local audio devices in milliseconds. We recommend to set it to 200 ms. The range is [0,255].
     * @notes Start an audio-device test by calling [startAudioPlaybackDeviceTest](#startaudioplaybackdevicetest) will register this callback for regular notification on playing volume. You can set the time interval between each callback by passing a proper value when calling the API above.
     */
    /** {zh}
     * @region 音频管理
     * @brief 回调音频设备测试时的播放音量
     * @param volume  音频设备测试播放音量。单位：毫秒。推荐设置为 200 ms。范围：[0,255]
     * @notes 调用 [`startAudioPlaybackDeviceTest`](85532#startaudioplaybackdevicetest) 开始播放音频文件或录音时，将开启该回调。本回调为周期性回调，回调周期由上述接口的 `interval` 参数指定。
     */
    onAudioPlaybackDeviceTestVolume(volume: number): void;
    /** {en}
     * @brief Terminal monitoring log callback. The callback is triggered when a terminal monitoring event is generated.
     * @param log_type Event type. For now, "live_webrtc_monitor_log" is the only one available value.
     * @param log_content Terminal monitoring log content
     */
    /** {zh}
     * @brief 端监控日志回调。当产生一个端监控事件时触发该回调。
     * @param log_type 事件类型。目前类型固定为 "live_webrtc_monitor_log"。
     * @param log_content 端监控日志内容。
     */
    onLogReport: (log_type: string, log_content: string) => void;
    /** {en}
     * @hidden
     * @brief The music list callback.
     * @param error_code Error code. The value 0 indicates success. For the indications of other values.
     * @param total_musics_size The total size of the music list.
     * @param music_infos Array of the music information.
     */
    /** {zh}
     * @brief 歌曲列表回调。
     * @param error_code 错误码，成功时返回 0。
     * @param total_musics_size 数据条目总数。
     * @param music_infos 歌曲数据数组。
     */
    onMusicListResult: (music_infos: MusicInfo[], total_musics_size: number, error_code: KTVErrorCode) => void;
    /** {en}
     * @hidden
     * @brief The search music callback.
     * @param error_code Error code. The value 0 indicates success. For the indications of other values.
     * @param total_musics_size The total size of the music list.
     * @param music_infos Array of the music information.
     */
    /** {zh}
     * @brief 搜索歌曲结果回调。
     * @param error_code 错误码，成功时返回 0。
     * @param total_musics_size 数据条目总数。
     * @param music_infos 歌曲数据数组。
     */
    onSearchMusicResult: (music_infos: MusicInfo[], total_musics_size: number, error_code: KTVErrorCode) => void;
    /** {en}
     * @hidden
     * @brief The hot music callback.
     * @param error_code Error code. The value 0 indicates success. For the indications of other values.
     * @param hot_infos Array of the hot music information.
     */
    /** {zh}
     * @brief 热榜歌曲结果回调。
     * @param error_code 错误码，成功时返回 0。
     * @param hot_infos 热榜歌曲数据数组。
     */
    onHotMusicResult: (hot_infos: HotMusicInfo[], error_code: KTVErrorCode) => void;
    /** {en}
     * @hidden
     * @brief The music detail callback.
     * @param error_code Error code. The value 0 indicates success. For the indications of other values.
     * @param music_info Music information.
     */
    /** {zh}
     * @brief 歌曲详细信息回调。
     * @param error_code 错误码，成功时返回 0。
     * @param music_info 歌曲数据。
     */
    onMusicDetailResult: (music_info: MusicInfo, error_code: KTVErrorCode) => void;
    /** {en}
     * @hidden
     * @brief Download success callback.
     * @param download_id Download task ID.
     * @param download_info Download result.
     */
    /** {zh}
     * @brief 下载成功回调。
     * @param download_id 下载任务 ID。
     * @param download_info 下载信息。
     */
    onDownloadSuccess: (download_id: number, download_info: DownloadResult) => void;
    /** {en}
     * @hidden
     * @brief Download failure callback.
     * @param error_code Error code.
     * @param download_id Download task ID.
     */
    /** {zh}
     * @brief 下载失败回调。
     * @param error_code 错误码。
     * @param download_id 下载任务 ID。
     */
    onDownloadFailed: (download_id: number, error_code: KTVErrorCode) => void;
    /** {en}
     * @hidden
     * @brief Music file download progress callback.
     * @param download_id Download task ID.
     * @param download_percentage The percentage of download progress, in the range of [0,100].
     */
    /** {zh}
     * @brief 歌曲文件下载进度回调。
     * @param download_id 下载任务 ID。
     * @param download_percentage 下载进度百分比，取值范围 [0,100]。
     */
    onDownloadMusicProgress: (download_id: number, download_percentage: number) => void;
    /** {en}
     * @hidden
     * @brief Music playing progress callback.
     * @param music_id Music ID.
     * @param progress Music playing progress in milliseconds.
     */
    /** {zh}
     * @brief 音乐播放进度回调。
     * @param music_id 音乐 ID。
     * @param progress 音乐播放进度，单位为毫秒。
     */
    onPlayProgress: (music_id: string, progress: number) => void;
    /** {en}
     * @hidden
     * @brief Music playing progress callback.
     * @param music_id Music ID.
     * @param play_state Music playing status.
     * @param error_code Error code.
     * @notes You will receive this callback on following events.
     * + When you successfully start playing music by calling [playMusic](85532#playmusic), you will receive this callback with `PlayStatePlaying` playState. Otherwise the playState will be `PlayStateFailed`.
     * + If the music with the same music ID is playing when you call [playMusic](85532#playmusic) again, the music will restart from the starting position, and you will receive this callback with `PlayStatePlaying` playState to inform the latter music has started.
     * + When you successfully pause the music by calling pauseMusic(85532#pausemusic), you will receive this callback with `PlayStatePaused` playState. Otherwise the playState will be `PlayStateFailed`.
     * + When you successfully resume the music by calling resumeMusic(85532#resumeMusic), you will receive this callback with `PlayStatePlaying` playState. Otherwise the playState will be `PlayStateFailed`.
     * + When you successfully stop the music by calling [stopMusic](85532#stopmusic), you will receive this callback with `PlayStateStoped` playState. Otherwise the playState will be `PlayStateFailed`.
     * + When the music ends, you will receive this callback with `PlayStateFinished` playState.
     */
    /** {zh}
     * @brief 音乐播放状态改变回调。
     * @param music_id 音乐 ID。
     * @param play_state 音乐播放状态。
     * @param error_code 错误码。
     * @notes 此回调被触发的时机汇总如下：
     * + 调用 [playMusic](85532#playmusic) 成功后，会触发 playState 值为 PlayStatePlaying 的回调；否则会触发 playState 值为 PlayStateFailed 的回调。
     * + 使用相同的音乐 ID 重复调用 [playMusic](85532#playmusic) 后，后一次播放会覆盖前一次，且会触发 playState 值为 PlayStatePlaying 的回调，表示后一次音乐播放已开始。
     * + 调用 pauseMusic(85532#pausemusic) 方法暂停播放成功后，会触发 playState 值为 PlayStatePaused 的回调；否则触发 playState 值为 PlayStateFailed 的回调。
     * + 调用 resumeMusic(85532#resumeMusic) 方法恢复播放成功后，会触发 playState 值为 PlayStatePlaying 的回调；否则触发 playState 值为 PlayStateFailed 的回调。
     * + 调用 [stopMusic](85532#stopmusic) 方法停止播放成功后，会触发 playState 值为 PlayStateStoped 的回调；否则触发 playState 值为 PlayStateFailed 的回调。
     * + 音乐播放结束会触发 playState 值为 PlayStateFinished 的回调。
     */
    onPlayStateChanged: (music_id: string, play_state: PlayState, error_code: KTVPlayerErrorCode) => void;
    /** {en}
     * @brief When the super resolution mode of a remote video stream changes, users in the room who subscribe to this stream will receive this callback.
     * @param streamKey Remote stream information that includes the room ID, user ID, and stream type.
     * @param mode Super resolution mode.
     * @param reason Remote video stream super resolution mode change reason.
     */
    /** {zh}
     * @brief 远端视频流的超分状态发生改变时，房间内订阅此流的用户会收到该回调。
     * @param streamKey 远端流信息，包括房间 ID、用户 ID、流属性。
     * @param mode 超分模式。
     * @param reason 超分模式改变原因。
     */
    onRemoteVideoSuperResolutionModeChanged: (stream_key: RemoteStreamKey, mode: VideoSuperResolutionMode, reason: VideoSuperResolutionModeChangedReason) => void;
    /** {en}
     * @brief Receives the callback after calling `takeLocalSnapshot`.
     * @param  taskId The index for the snapshot, the same as the return value of [takeLocalSnapshot](85532#takelocalsnapshot).
     * @param  streamIndex Stream properties, mainstream or screen streams.
     * @param  image The snapshot image. If the snapshot task fails, the value is `null`.
     * @param  errorCode Error code:
     * + `0`: Success.
     * + `-1`: Failure. Fails to generate the image.
     * + `-2`: Failure. The stream is invalid.
     */
    /** {zh}
     * @brief 调用 `takeLocalSnapshot` 截取视频画面时，收到此回调。
     * @param  taskId 本地截图任务的编号。和 [takeLocalSnapshot](85532#takelocalsnapshot) 的返回值一致。
     * @param  streamIndex 流属性，主流或屏幕流。
     * @param  image 截图。你可以保存为文件，或对其进行二次处理。截图失败时，为空。
     * @param  errorCode 截图错误码：
     * + `0`: 成功
     * + `-1`: 截图错误。生成图片数据失败或 RGBA 编码失败
     * + `-2`: 截图错误。流无效。
     */
    onTakeLocalSnapshotResult: (taskId: number, streamIndex: number, image: string, errorCode: number) => void;
    /** {en}
     * @brief Receives the callback after calling `takeRemoteSnapshot`.
     * @param  taskId The index for the remote snapshot, the same as the return value of [takeRemoteSnapshot](85532#takeremotesnapshot).
     * @param  streamKey Remote stream
     * @param  image The snapshot image. If the snapshot task fails, the value is `null`.
     * @param  errorCode Error code:
     * + `0`: Success.
     * + `-1`: Failure. Fails to generate the image.
     * + `-2`: Failure. The stream is invalid.
     */
    /** {zh}
     * @brief 调用 `takeRemoteSnapshot` 截取视频画面时，收到此回调。
     * @param  taskId 远端截图任务的编号。和 [takeRemoteSnapshot](85532#takeremotesnapshot) 的返回值一致。
     * @param  streamKey 截图的视频流。
     * @param  image 截图。你可以保存为文件，或对其进行二次处理。截图失败时，为空。
     * @param  errorCode 截图错误码：
     * + `0`: 成功
     * + `-1`: 截图错误。生成图片数据失败或 RGBA 编码失败
     * + `-2`: 截图错误。流无效。
     */
    onTakeRemoteSnapshotResult: (taskId: number, streamKey: RemoteStreamKey, image: string, errorCode: number) => void;
    /** {en}
     * @brief Callback on create room failure.
     * @param room_id  Room ID.
     * @param error_code Create room error code.
     */
    /** {zh}
     * @brief 创建房间失败回调。
     * @param room_id 房间 ID。
     * @param error_code 创建房间错误码。
     */
    onCreateRoomStateChanged: (room_id: string, error_code: number) => void;
    /** {en}
     * @brief HTTP Receive the callback when the proxy connection state changes.
     * @param state The current HTTP proxy connection status.
     */
    /** {zh}
     * @brief HTTP 代理连接状态改变时，收到该回调。
     * @param state 当前 HTTP 代理连接状态
     */
    onHttpProxyState: (state: number) => void;
    /** {en}
     * @brief HTTPS Receive the callback when the proxy connection state changes.
     * @param   State the current HTTPS proxy connection status.
     */
    /** {zh}
     * @brief HTTPS 代理连接状态改变时，收到该回调。
     * @param  state 当前 HTTPS 代理连接状态
     */
    onHttpsProxyState: (state: number) => void;
    /** {en}
     * @brief SOCKS5 Receive the callback when the proxy state changes.
     * @param state SOCKS5 proxy connection status
     * @param cmd every step of the proxy connection operating command
     * @param proxy_address proxy address information
     * @param local_address the local address used by the current connection
     * @param remote_address the remote connection address
     */
    /** {zh}
     * @brief SOCKS5 代理状态改变时，收到该回调。
     * @param state SOCKS5 代理连接状态
     * @param cmd 代理连接的每一步操作命令
     * @param proxy_address 代理地址信息
     * @param local_address 当前连接使用的本地地址
     * @param remote_address 远端的连接地址
     */
    onSocks5ProxyState: (state: number, cmd: string, proxy_address: string, local_address: string, remote_address: string) => void;
    /** {en}
     * @brief Audio stream synchronization information callback. You can use this callback to receive audio stream synchronization information sent remotely after the remote user calls `sendStreamSyncInfo` to send an audio stream synchronization message.
     * @param stream_key Remote stream information.
     * @param stream_type Media stream type.
     * @param data Message content.
     */
    /** {zh}
     * @brief 音频流同步信息回调。可以通过此回调，在远端用户调用 `sendStreamSyncInfo` 发送音频流同步消息后，收到远端发送的音频流同步信息。
     * @param stream_key 远端流信息
     * @param stream_type 媒体流类型
     * @param data 消息内容。
     */
    onStreamSyncInfoReceived: (stream_key: RemoteStreamKey, stream_type: SyncInfoStreamType, data: string) => void;
    /** {en}
     * @brief Screen Audio first frame sending status change callback
     * @param  room_id ID of the room where the audio is published
     * @param  user Local user information.
     * @param  state First frame sending status.
     */
    /** {zh}
     * @brief 屏幕音频首帧发送状态改变回调
     * @param  room_id 音频发布用户所在的房间 ID
     * @param  user 本地用户信息
     * @param  state 首帧发送状态
     */
    onScreenAudioFrameSendStateChanged: (room_id: string, user: RtcUser, state: FirstFrameSendState) => void;
    /** {en}
     * @brief  Screen Audio first frame playback state change callback
     * @param  room_id ID of the room from which the stream is published
     * @param  user Remote user information.
     * @param  state First frame playback status.
     */
    /** {zh}
     * @brief 屏幕音频首帧播放状态改变回调
     * @param  room_id 首帧播放状态发生改变的流所在的房间 ID
     * @param  user 远端用户信息
     * @param  state 首帧播放状态
     */
    onScreenAudioFramePlayStateChanged: (room_id: string, user: RtcUser, state: FirstFramePlayState) => void;
    /** {en}
     * @brief Receives the callback when you call `startCloudProxy` to start cloud proxy, and the SDK connects the proxy server successfully.
     * @param interval The interval in ms between starting cloud proxy and connects the cloud proxy server successfully.
     */
    /** {zh}
     * @brief 调用 `startCloudProxy` 开启云代理，SDK 首次成功连接云代理服务器时，回调此事件。
     * @param interval 从开启云代理到连接成功经过的时间，单位为 ms
     */
    onCloudProxyConnected: (interval: number) => void;
    /** {en}
     * @brief After calling `getNetworkTimeInfo` for the first time, the SDK starts network time synchronization internally. This callback will be triggered when the synchronization is completed.
     */
    /** {zh}
     * @brief 首次调用 `getNetworkTimeInfo` 后，SDK 内部启动网络时间同步，同步完成时会触发此回调。
     */
    onNetworkTimeSynchronized: () => void;
    /** {en}
     * @brief License expiration time reminder
     * @param days Expiration time in days
     */
    /** {zh}
     * @brief license过期时间提醒
     * @param days 过期时间天数
     */
    onLicenseWillExpire: (days: number) => void;
    /** {en}
     * @brief Callback of the result of face detection with Effect SDK.
     *        After calling `enableFaceDetection` and using the Effect SDK integrated in the RTC SDK, you will receive this callback.
     * @param  result Face detection result.
     */
    /** {zh}
     * @brief 特效 SDK 进行人脸检测结果的回调。
     *        调用 `enableFaceDetection` 注册了回调，并使用 RTC SDK 中包含的特效 SDK 进行视频特效处理时，你会收到此回调。
     * @param  result 人脸检测结果
     */
    onFaceDetectResult: (result: FaceDetectResult) => this;
    /** {en}
     * @brief Callback to notify you the volume of the audio device has been changed or when the device has been muted or unmuted. No need to activate the notification beforehand.
     * @param device_type Includes microphones and speakers.
     * @param volume Volume ranging [0, 255]. When the volume turns to 0, muted turns to True. Note that on Windows, when the volume of a microphone turns to 0, muted remains unchanged.
     * @param muted Whether is muted. When a speaker is muted, muted turns True but volume remains unchanged.
     */
    /** {zh}
     * @brief 音频设备音量改变回调。当通过系统设置，改变音频设备音量或静音状态时，触发本回调。本回调无需手动开启。
     * @param device_type 设备类型，包括麦克风和扬声器。
     * @param volume 音量值，[0, 255]。当 volume 变为 0 时，muted 会变为 True。注意：在 Windows 端，当麦克风 volume 变为 0 时，muted 值不变。
     * @param muted 是否禁音状态。扬声器被设置为禁音时，muted 为 True，但 volume 保持不变。
     */
    onAudioDeviceVolumeChanged: (device_type: RTCAudioDeviceType, volume: number, muted: boolean) => void;
    /** {en}
     * @brief The callback for real-time scoring data.
     * @param info Real-time scoring data.
     * @notes This callback is triggered after [startSingScoring](85532#startsingscoring) is called.
     */
    /** {zh}
     * @brief 实时评分信息回调。
     * @param info 实时评分信息。
     * @notes 调用 [startSingScoring](85532#startsingscoring) 后，会收到该回调。
     */
    onCurrentScoringInfo: (info: SingScoringRealtimeInfo) => void;
    /** {en}
     *  @brief When calling [startAudioRecording](85532#startaudiorecording) or [stopAudioRecording](85532#stopaudiorecording) to change the recording status, receive the callback.
     *  @param state Recording state
     *  @param errorCode Error code
     */
    /** {zh}
     *  @brief 调用 [startAudioRecording](85532#startaudiorecording) 或 [stopAudioRecording](85532#stopaudiorecording) 改变音频文件录制状态时，收到此回调。
     *  @param state 录制状态
     *  @param errorCode 录制错误码
     */
    onAudioRecordingStateUpdate: (state: AudioRecordingState, error_code: AudioRecordingErrorCode) => void;
    /** {en}
     * @brief Failed to access the extension.
     *        RTC SDK provides some features with extensions. Without implementing the extension, you cannot use the corresponding feature.
     * @param extensionName The name of extension.
     * @param msg Error message.
     */
    /** {zh}
     * @brief 当访问插件失败时，收到此回调。
     *        RTC SDK 将一些功能封装成插件。当使用这些功能时，如果插件不存在，功能将无法使用。
     * @param extensionName 插件名字
     * @param msg 失败说明
     */
    onExtensionAccessError: (extensionName: string, msg: string) => void;
    /** {en}
     * @hidden currently not available
     * @brief Callback on receiving the data message carried by the public video stream.
     *        You will receive message by this callback if the public stream published by calling [startPlayPublicStream](85532#rtcvideo-startplaypublicstream) carrying message.
     * @param public_stream_id ID of the public stream
     * @param message The data messages carried by the public video stream.
     * + SEI inserted by calling the OpenAPI. You will receive SEI from all the video streams if the SEI messages do not have conflicts. However, if the SEI  messages from different video streams have conflicts, you will receive only one of them.
     * + Media volume indicator. You must enable the callback via the OpenAPI on the server.
     * @param source_type Message source.
     * @notes You also need to listen to [onPublicStreamSEIMessageReceived](85533#rtcvideocallback-onpublicstreamseimessagereceived) to receive SEI inserted via API in the client SDK.
     */
    /** {zh}
     * @brief 回调公共流中包含的数据信息。
     *        通过 [startPlayPublicStream](85532#rtcvideo-startplaypublicstream) 开始播放公共流后，可以通过本回调获取发送端发送的非SEI消息。
     * @param public_stream_id 公共流 ID
     * @param message 收到的数据消息内容，如下：
     * + 调用公共流 OpenAPI 发送的 SEI 消息。当公共流中的多路视频流均包含有 SEI 信息：SEI 不互相冲突时，将通过多次回调分别发送；SEI 在同一帧有冲突时，则只有一条流中的 SEI 信息被透传并融合到公共流中。
     * + 媒体流音量变化，需要通过公共流 OpenAPI 开启回调。
     * @param source_type 数据消息来源。
     * @notes 通过调用客户端 API 插入的 SEI 信息，应通过回调 [onPublicStreamSEIMessageReceived](85533#rtcvideocallback-onpublicstreamseimessagereceived) 获取。
     */
    onPublicStreamDataMessageReceived: (public_stream_id: string, message: Uint8Array, source_type: DataMessageSourceType) => void;
    /** {en}
     * @brief Callback that notifies you the result of the echo detection before a call
     * @param hardwareEchoDetectionResult The result of the echo detection
     * @notes + This callback notifies you the result of the echo detection by calling [startHardwareEchoDetection](85532#rtcvideo-starthardwareechodetection).
     * + We recommend to call [stopHardwareEchoDetection](85532#rtcvideo-stophardwareechodetection) to stop the detection.
     * + Listen to `kMediaDeviceWarningLeakEchoDetected` in the callback of [onAudioDeviceWarning](85533#rtcvideocallback-onaudiodevicewarning) for the echo issue during a call.
     */
    /** {zh}
     * @brief 通话前回声检测结果回调。
     * @param hardwareEchoDetectionResult 通话前回声检测结果
     * @notes * + 通话前调用 [startHardwareEchoDetection](85532#rtcvideo-starthardwareechodetection) 后，将触发本回调返回检测结果。
     * + 建议在收到检测结果后，调用 [stopHardwareEchoDetection](85532#rtcvideo-stophardwareechodetection) 停止检测，释放对音频设备的占用。
     * + 如果 SDK 在通话中检测到回声，将通过 [onAudioDeviceWarning](85533#rtcvideocallback-onaudiodevicewarning) 回调 `kMediaDeviceWarningLeakEchoDetected`。
     */
    onHardwareEchoDetectionResult: (hardware_echo_detection_result: HardwareEchoDetectionResult) => void;
    /** {en}
     * @brief Callback on local proxy connection. After calling [setLocalProxy](85532#rtcvideo-setlocalproxy) to set local proxies, you will receive this callback that informs you of the states of local proxy connection.
     * @param localProxyType The types of local proxies.
     * @param localProxyState The states of local proxy connection.
     * @param localProxyError The errors of local proxy connection.
     */
    /** {zh}
     * @brief 本地代理状态发生改变回调。调用 [setLocalProxy](85532#rtcvideo-setlocalproxy) 设置本地代理后，SDK 会触发此回调，返回代理连接的状态。
     * @param localProxyType 本地代理类型。
     * @param localProxyState 本地代理状态。
     * @param localProxyError 本地代理错误。
     */
    onLocalProxyStateChanged: (local_proxy_type: LocalProxyType, local_proxy_state: LocalProxyState, local_proxy_error: LocalProxyError) => void;
    /** {zh}
     * @brief 转推直播状态回调
     * @param event 转推直播任务状态
     * @param task_id 转推直播任务 ID
     * @param error 转推直播错误码
     * @param mix_type 转推直播类型
     */
    /** {en}
     * @brief Used for reporting events during pushing streams to CDN
     * @param event Type Stream mixing status
     * @param task_id Task ID
     * @param error Errors occuring during the pushing process.
     * @param mix_type Stream mixing and pushing type.
     */
    onMixingEvent: (event: StreamMixingEvent, task_id: string, error: StreamMixingErrorCode, mix_type: MixedStreamType) => void;
    /** {zh}
     * @brief 合流视频回调，运行在视频回调线程
     * @param video_frame 视频帧
     * @notes 收到该回调的周期与视频的帧间隔一致。
     */
    /** {en}
     * @brief Callback with the video data after stream mixing, running on the video callback thread
     * @param video_frame Video Frame
     * @notes The interval between callbacks is the same with that between video frames.
     */
    onMixingVideoFrame: (video_frame: IVideoFrame) => void;
    /** {en}
     * @brief Callback with the audio data after stream mixing, running on the audio callback thread
     * @param task_id Task ID.
     * @param audio_frame Audio Frame
     * @notes You will receive the callback every 10 milliseconds. Each callback carries data collected in the last 10
     * milliseconds.
     */
    /** {zh}
     * @brief 合流音频回调，运行在音频回调线程
     * @param task_id 转推直播任务 ID
     * @param audio_frame 音频帧
     * @notes 收到该回调的周期为每 10 毫秒一次，并且每次的音频数据量为 10 毫秒数据量。
     */
    onMixingAudioFrame: (task_id: string, audio_frame: IAudioFrame) => void;
    /** {en}
     * @brief This callback carries SEI data, running on the video callback thread
     * @param task_id Task ID
     * @param data_frame SEI data
     */
    /** {zh}
     * @brief 视频 SEI 帧回调，运行在视频回调线程
     * @param task_id 转推直播任务 ID
     * @param data_frame SEI 数据
     */
    onMixingDataFrame: (task_id: string, data_frame: IDataFrame) => void;
    /** {en}
     * @brief Clear Cache result callback.
     * @param error_code Error code.
     */
    /** {zh}
     * @brief 清理文件缓存结果回调。
     * @param error_code 错误码，非0为失败
     */
    onClearCacheResult: (error_code: KTVErrorCode) => void;
    /** {zh}
     * @brief 返回远端单个用户的音频数据
     * @param stream_info 远端流信息
     * @param audio_frame 音频数据
     * @notes 此回调在播放线程调用。不要在此回调中做任何耗时的事情，否则可能会影响整个音频播放链路。
     */
    /** {en}
     * @brief Returns the audio data of one remote user.
     * @param stream_info Remote stream information.
     * @param audio_frame Audio data.
     * @notes This callback works on the playback thread. Don't do anything time-consuming in this callback, or it may affect the entire audio playback chain.
     */
    onRemoteUserAudioFrame(stream_info: RemoteStreamKey, audio_frame: IAudioFrame): void;
    /** {en}
     * @brief Returns the audio data played locally
     * @param audio_frame Audio data.
     */
    /** {zh}
     * @brief 返回本地屏幕录制的音频数据
     * @param audio_frame 音频数据
     */
    onRecordScreenAudioFrame(audio_frame: IAudioFrame): void;
    /** {en}
    * @brief Audio device warning callback. The audio devices include audio capture devices and audio rendering devices.
    * @param device_id Device ID
    * @param device_type Device type.
    * @param device_warning Device error type.
    */
    /** {zh}
     * @brief 音频设备警告回调。音频设备包括音频采集设备和音频渲染设备。
     * @param device_id 设备 ID
     * @param device_type 设备类型
     * @param device_warning 告警信息
     */
    onAudioDeviceWarning(device_id: string, device_type: RTCAudioDeviceType, device_warning: MediaDeviceWarning): void;
    /** {en}
    * @brief Video device warning callback. The video devices include video capture devices.
    * @param device_id Device ID
    * @param device_type Device type.
    * @param device_warning Device error type.
    */
    /** {zh}
     * @brief 视频设备警告回调，包括视频采集设备等。
     * @param device_id 设备 ID
     * @param device_type 设备类型
     * @param device_warning 告警信息
     */
    onVideoDeviceWarning(device_id: string, device_type: RTCAudioDeviceType, device_warning: MediaDeviceWarning): void;
    /** {en}
     * @brief Callback about publishing status of the black frame video stream .
     *        In a voice call scenario, when the local user calls [sendSEIMessage](85532#rtcvideo-sendseimessage) to send SEI data with a black frame, the sending status of the stream is notified to the remote user through this callback.
     *        You can tell from this callback that the video frame carrying SEI data is a black frame and thus not render that video frame.
     * @param key Information about stream from the remote user
     * @param type State of the black frame video stream
     */
    /** {zh}
     * @brief 黑帧视频流发布状态回调。
     *        在语音通话场景下，本地用户调用 [sendSEIMessage](85532#rtcvideo-sendseimessage) 通过黑帧视频流发送 SEI 数据时，流的发送状态会通过该回调通知远端用户。
     *        你可以通过此回调判断携带 SEI 数据的视频帧为黑帧，从而不对该视频帧进行渲染。
     * @param key 远端流信息
     * @param type 黑帧视频流状态
     */
    onSEIStreamUpdate(key: RemoteStreamKey, type: SEIStreamEventType): void;
}
/** {en}
 * @list 85530
 * @detail 85533
 */
/** {zh}
 * @list 85530
 * @detail 85533
 */
export interface RTCAUDIOEFFECTPLAYERCALLBACK {
    /** {en}
    * @brief Callback for audio mixing status change.
    * @param effect_id The ID of veRTCAudioEffectPlayer. Set by [getAudioEffectPlayer](85532#rtcvideo-getaudioeffectplayer).
    * @param state
    * @param error
    */
    /** {zh}
    * @brief 播放状态改变时回调。
    * @param effect_id veRTCAudioEffectPlayer 的 ID。通过 [getAudioEffectPlayer](85532#rtcvideo-getaudioeffectplayer) 设置。
    * @param state 混音状态。
    * @param error 错误码。
    */
    onAudioEffectPlayerStateChanged(effect_id: number, state: PlayerState, error: PlayerError): void;
}
/** {en}
 * @list 85530
 * @detail 85533
 */
/** {zh}
 * @list 85530
 * @detail 85533
 */
export interface RTCMediaPlayerCALLBACK {
    /** {zh}
    * @brief 播放状态改变时回调。
    * @param player_id veRTCMediaPlayer 的 ID。通过 [getMediaPlayer](85532#rtcvideo-getmediaplayer) 设置。
    * @param state 混音状态。
    * @param error 错误码。
    */
    /** {en}
    * @brief Callback for audio mixing status change.
    * @param player_id The ID of veRTCMediaPlayer. Set by [getMediaPlayer](85532#rtcvideo-getmediaplayer).
    * @param state
    * @param error
    */
    onMediaPlayerStateChanged(player_id: number, state: PlayerState, error: PlayerError): void;
    /** {zh}
     * @brief 播放进度周期性回调。回调周期通过 [setAudioMixingProgressInterval] 设置。
     * @param player_id veRTCMediaPlayer 的 ID。通过 [getMediaPlayer](85532#rtcvideo-getmediaplayer) 设置。
     * @param progress 进度。单位 ms。
     */
    /** {en}
    * @brief Periodic callback for audio mixing progress. The period is set by [setAudioMixingProgressInterval].
    * @param player_id The ID of veRTCMediaPlayer. Set by [getMediaPlayer](85532#rtcvideo-getmediaplayer).
    * @param progress Mixing progress in ms.
    */
    onMediaPlayerPlayingProgress(player_id: number, progress: string): void;
}
