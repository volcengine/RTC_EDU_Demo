"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2022 Beijing Volcano Engine Technology Ltd.
 * SPDX-License-Identifier: MIT
 */
const events_1 = require("events");
const NativeSDK = require("../../build/Release/electron-sdk.node");
const types_1 = require("../types");
const data_1 = __importStar(require("../data"));
const utils_1 = require("../utils");
function checkRoomInstance(target, propertyName, projectDescriptor) {
    const method = projectDescriptor.value;
    projectDescriptor.value = function (...args) {
        let result = 0;
        try {
            if (!this.instance) {
                throw "room instance is null";
            }
            result = method.apply(this, args);
        }
        catch (err) {
            console.error(`occured in  ${propertyName}  results: ${result}, error: `, err);
            result = -1;
        }
        return result;
    };
    return projectDescriptor;
}
/** {en}
 * @list 85530
 * @detail 85532
 */
/** {zh}
 * @list 85530
 * @detail 85532
 */
class RTCRoom extends events_1.EventEmitter {
    constructor() {
        super();
        this.instance = null;
        this.roomId = "";
        this.localUser = { userId: "" };
        this.remoteUsers = new Map();
    }
    /** {en}
     * @brief Create a room instance.
     * @param room_id A non-empty string within 128 bytes. Each room created by calling this API requires a unique roomId. So that the room can be distinguished from each other.
     * The following character sets are supported:
     * + 26 uppercase letters: A ~ Z,
     * + 26 lowercase letters: a ~ z,
     * + 10 numbers: 0 ~ 9,
     * + Underscore "_", at sign "@", and minus sign "-".
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + This API only returns a room instance. You still need to call [joinRoom](#joinroom) to actually create/join the room.
     * + Each call of this API creates one RTCRoom instance. Call this API as many times as the number of rooms you need, and then call [joinRoom](#joinroom) of each RTCRoom instance to join multiple rooms at the same time.
     * + In multi-room mode, a user can subscribe to media streams in the joined rooms at the same time.
     * + If the room that you wish to join already exists, you still need to call this API first to create the RTCRoom instance, and then call [joinRoom](#joinroom).
     * + In multi-room mode, you need to use different roomId to create multiple rooms.
     * + To forward streams to the other rooms, call [startForwardStreamToRooms](#startforwardstreamtorooms) instead of enabling Multi-room mode.
     */
    /** {zh}
     * @brief 创建房间实例
     * @param room_id 标识通话房间的房间 ID，最大长度为 128 字节的非空字符串。支持的字符集范围为:
     * • 26个大写字母 A ~ Z
     * • 26个小写字母 a ~ z
     * • 10个数字 0 ~ 9
     * • 下划线 "_", at 符 "@", 减号 "-"
     * 多房间模式下，调用创建房间接口后，请勿调用同样的 roomID 创建房间，否则会导致创建房间失败。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 调用此方法仅返回一个房间实例，你仍需调用 [joinRoom](#joinroom) 才能真正地创建/加入房间。
     * + 多次调用此方法以创建多个 RTCRoom 实例。分别调用各 RTCRoom 实例中的 [joinRoom](#joinroom) 方法，同时加入多个房间。
     * + 多房间模式下，用户可以同时订阅各房间的音视频流。
     * + 如果需要加入的房间已存在，你仍需先调用本方法来获取 RTCRoom 实例，再调用 [joinRoom](#joinroom) 加入房间。
     * + 多房间模式下，创建多个房间实例需要使用不同的 roomId，否则会导致创建房间失败。
     * + 如果你需要在多个房间发布音视频流，无须创建多房间，直接调用 [startForwardStreamToRooms](#startforwardstreamtorooms) 开始跨房间转发媒体流。
     */
    createRTCRoom(room_id) {
        if (this.instance) {
            return 0;
        }
        const reg = /^[0-9a-zA-Z@_\-\.]{1,128}$/;
        if (!reg.test(room_id)) {
            console.error("roomId is not right, please change: roomId不合规");
            // return -1;
        }
        this.instance = new NativeSDK.veRTCRoom(room_id, this.cbRoom.bind(this));
        const isCreateSuc = this.instance.isRoomCreated();
        if (!isCreateSuc) {
            console.error("createRTCRoom Failed!");
            this.instance = null;
            return -1;
        }
        this.roomId = room_id;
        data_1.createdRooms.set(room_id, this);
        return 0;
    }
    //**************************************api
    /** {en}
     * @brief Get room ID
     * @returns Room ID
     */
    /** {zh}
     * @region 多房间
     * @brief 获取房间 ID
     * @return 房间 ID
     */
    getRoomId() {
        const roomId = this.instance.getRoomId();
        return roomId;
    }
    /** {en}
     * @brief Leave and destroy the room.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes Refer to [createRTCRoom](#creatertcroom) for more information on how to create a room.
     */
    /** {zh}
     * @brief 退出并销毁房间。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes 关于创建房间，参见 [createRTCRoom](#creatertcroom)。
     */
    destroy() {
        var _a, _b;
        if (!this.instance) {
            return 0;
        }
        const ret = this.instance.destroy();
        if (ret === 0) {
            this.instance = null;
            (_a = this.localUser.videoRender) === null || _a === void 0 ? void 0 : _a.destroy();
            (_b = this.localUser.screenRender) === null || _b === void 0 ? void 0 : _b.destroy();
            this.localUser.screenRender = null;
            this.localUser.videoRender = null;
            this.remoteUsers.forEach((userInfo, userId) => {
                this.removeRemoteUser(userId);
            });
            data_1.default.delete(this.roomId);
            return 0;
        }
        else {
            console.error("销毁房间失败,请重试");
            return -1;
        }
    }
    /** {en}
     * @brief Create/join a room: create a room when the room does not exist; when the room exists, users who have not joined the room can join the room.   Users in the same room can talk to each other.
     * @param token Dynamic key for authenticating the logged-in user.
     *         You need to bring Token to enter the room. When testing, you can use the console to generate temporary tokens. The official launch requires the use of the key SDK to generate and issue tokens at your server level. See [Use Token to complete authentication](70121) for token validity and generation method.
     * + Apps with different App IDs cannot communicate with each other.
     * + Make sure that the App ID used to generate the Token is the same as the App ID used to create the engine, otherwise it will cause the join room to fail. The reason for the failure will be communicated via the [onRoomStateChanged](85533#onroomstatechanged) callback.
     * @param user_info User information
     * @param config Room parameter configuration, set the room mode and whether to automatically publish or subscribe to the flow.
     * @returns + 0: Success
     * + -1: Room_id/user_info.uid contains invalid parameters.
     * + -2: Already in the room. After the interface call is successful, as long as the return value of 0 is received and [leaveRoom](#leaveroom) is not called successfully, this return value is triggered when the room entry interface is called again, regardless of whether the filled room ID and user ID are duplicated.
     * @notes
     * + In the same room with the same App ID, the user ID of each user must be unique. If two users have the same user ID, the user who entered the room later will kick the user who entered the room out of the room, and the user who entered the room will receive the [onStreamStateChanged](85533#onstreamstatechanged) callback notification. For the error type. See kErrorCodeDuplicateLogin in [ErrorCode](85534#errorcode).
     * + Local users will receive [onRoomStateChanged](85533#onroomstatechanged) callback notification after calling this method to join the room successfully. If the local user is also a visible user, the remote user will receive an [onUserJoined](85533#rtcroomcallback-onuserjoined) callback notification when joining the room. For visibility settings, see [setUserVisibility](#setuservisibility).
     * + After the user successfully joins the room, the SDK may lose connection to the server in case of poor local network conditionsAt this point, [onConnectionStateChanged](85533#onConnectionStateChanged) callback will be triggered and the SDK will automatically retry until it successfully reconnects to the server. After a successful reconnection, you will receive a local [onRoomStateChanged](85533#rtcroomcallback-onroomstatechanged) callback notification.
     */
    /** {zh}
     * @brief 加入房间。
     * @param token 动态密钥。用于对进房用户进行鉴权验证。
     *        进入房间需要携带 Token。测试时可使用控制台生成临时 Token，正式上线需要使用密钥 SDK 在你的服务端生成并下发 Token。Token 有效期及生成方式参看[使用 Token 完成鉴权](70121)。
     *        使用不同 AppID 的 App 是不能互通的。
     *        请务必保证生成 Token 使用的 AppID 和创建引擎时使用的 AppID 相同，否则会导致加入房间失败。具体失败原因会通过 [onRoomStateChanged](85533#onroomstatechanged) 回调告知。
     * @param user_info 用户信息
     * @param config 房间参数配置，设置房间模式以及是否自动发布或订阅流。
     * @return + 0：方法调用成功。
     * + -1：roomID / userInfo.uid 包含了无效的参数。
     * + -2：已经在房间内。接口调用成功后，只要收到返回值为 0 ，且未调用 [leaveRoom](#leaveroom) 成功，则再次调用进房接口时，无论填写的房间 ID 和用户 ID 是否重复，均触发此返回值。
     * + -3：room 为空。
     * @notes + 多房间场景下，调用 [createRTCRoom](#creatertcroom) 创建房间后，调用此方法加入房间，同房间内其他用户进行音视频通话。
     * + 同一个 App ID 的同一个房间内，每个用户的用户 ID 必须是唯一的。如果两个用户的用户 ID 相同，则后进房的用户会将先进房的用户踢出房间，并且先进房的用户会收到 [onError](85533#onerror) 回调通知，错误类型详见 [ErrorCode](85534#errorcode) 中的 kErrorCodeDuplicateLogin。
     * + 本地用户调用此方法加入房间成功后，会收到 [onRoomStateChanged](85533#onroomstatechanged) 回调通知。若本地用户同时为可见用户，加入房间时远端用户会收到 [onUserJoined](85533#rtcroomcallback-onuserjoined) 回调通知。关于可见性设置参看 [setUserVisibility](#setuservisibility)。
     * + 用户加入房间成功后，在本地网络状况不佳的情况下，SDK 可能会与服务器失去连接，并触发 [onConnectionStateChanged](85533#onConnectionStateChanged) 回调。此时 SDK 会自动重试，直到成功重连。重连成功后，本地会收到 [onRoomStateChanged](85533#rtcroomcallback-onroomstatechanged) 回调通知。
     */
    joinRoom(token, user_info, config) {
        if (utils_1.isNull(token) || !user_info || !user_info.uid) {
            return utils_1.errorFeedback("joinRoom");
        }
        utils_1.checkStringType(token, 'token');
        utils_1.checkStringType(user_info.uid, 'user_info.uid');
        utils_1.checkStringType(user_info.extra_info, 'user_info.extra_info', true);
        if (config) {
            utils_1.checkNumberType(config.room_profile_type, 'config.room_profile_type', true);
            utils_1.checkBooleanType(config.is_auto_publish, 'config.is_auto_publish', true);
            utils_1.checkBooleanType(config.is_auto_subscribe_audio, 'config.is_auto_subscribe_audio', true);
            utils_1.checkBooleanType(config.is_auto_subscribe_video, 'config.is_auto_subscribe_video', true);
        }
        if (config && config.remote_video_config) {
            utils_1.checkNumberType(config.remote_video_config.framerate, 'config.remote_video_config.framerate', true);
            utils_1.checkNumberType(config.remote_video_config.resolution_width, 'config.remote_video_config.resolution_width', true);
            utils_1.checkNumberType(config.remote_video_config.resolution_height, 'config.remote_video_config.resolution_height', true);
        }
        const reg = /^[0-9a-zA-Z@_\-\.]{1,128}$/;
        if (!reg.test(user_info.uid)) {
            console.error("userId is not right, please change: uesrId不合规");
            // return -1;
        }
        this.localUser.userId = user_info.uid;
        if (!this.remoteUsers) {
            this.remoteUsers = new Map();
        }
        if (!data_1.default.get(this.roomId)) {
            data_1.default.set(this.roomId, {
                localUser: this.localUser,
                remoteUsers: this.remoteUsers,
            });
        }
        const tempUserInfo = {
            uid: "",
            extra_info: "",
        };
        const tempConfig = {
            room_profile_type: types_1.RoomProfileType.kRoomProfileTypeCommunication,
            is_auto_publish: true,
            is_auto_subscribe_audio: true,
            is_auto_subscribe_video: true,
            remote_video_config: {
                framerate: 0,
                resolution_height: 0,
                resolution_width: 0,
            },
        };
        const utralUserInfo = {
            ...tempUserInfo,
            ...(user_info || {}),
        };
        const utralConfig = {
            ...tempConfig,
            ...(config || {}),
        };
        return this.instance.joinRoom(token, utralUserInfo, utralConfig);
    }
    /** {en}
     * @brief  Leave RTC room.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + The user calls this method to leave the RTC room, end the call process, and release all call-related resources.
     * + It is an asynchronous operation, and the call returns without actually exiting the room. When actually exiting the room, you will receive [onLeaveRoom](85533#onleaveroom).
     * + When visible users leave the room, others in the room will receive [onUserLeave](85533#onuserleave).
     * + If the engine is destroyed immediately after this method is called, you will not receive [onLeaveRoom](85533#onleaveroom).
     */
    /** {zh}
     * @brief 离开房间。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 用户调用此方法离开房间，结束通话过程，释放所有通话相关的资源。
     * + 调用 [joinRoom](#joinroom) 方法加入房间后，必须调用此方法结束通话，否则无法开始下一次通话。无论当前是否在房间内，都可以调用此方法。重复调用此方法没有负面影响。
     * + 此方法是异步操作，调用返回时并没有真正退出房间。真正退出房间后，本地会收到 [`onLeaveRoom`](85533#onleaveroom) 回调通知。+ 调用 [`setUserVisibility`](#setuservisibility) 将自身设为可见的用户离开房间后，房间内其他用户会收到 [`onUserLeave`](85533#onuserleave) 回调通知。
     * + 如果调用此方法后立即销毁引擎，SDK 将无法触发 [`onLeaveRoom`](85533#onleaveroom) 回调。
     */
    leaveRoom() {
        return this.instance.leaveRoom();
    }
    /** {en}
     * @brief Set the visibility of the user in the room. The local user is visible to others by default before calling this API.
     * @param enable Visibility of the user in the room:
     * + True: The user can publish media streams. And the other users in the room get informed of the behaviors of the user, such as Joining room, starting video capture, and Leaving room.
     * + False: The user cannot publish media streams. And the other users in the room do not get informed of the behaviors of the user, such as joining, starting video capture, or leaving.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes
     * + You can call this API whether the user is in a room or not.
     * + When you call this API, the other users in the room will be informed via the related callback:
     *            - Switch from `false` to `true`: [onUserJoined](85533#onuserjoined)
     *            - Switch from `true` to `false`: [onUserLeave](85533#onuserleave)
     * + The invisible user will receive the warning code, `kWarningCodePublishStreamForbiden`, when trying to publish media streams.
     */
    /** {zh}
     * @brief 设置用户可见性。未调用该接口前，本地用户默认对他人可见。
     * @param enable 设置用户是否对房间内其他用户可见：
     * + true: 可以在房间内发布音视频流，房间中的其他用户将收到用户的行为通知，例如进房、开启视频采集和退房。
     * + false: 不可以在房间内发布音视频流，房间中的其他用户不会收到用户的行为通知，例如进房、开启视频采集和退房。
     * @return + 0: 方法调用成功
     * + < 0: 方法调用失败
     * @notes + 在加入房间前后，用户均可调用此方法设置用户可见性。
     * + 在房间内，调用此方法成功切换用户可见性后，房间内其他用户会收到相应的回调通知：
     *            - 从不可见换至可见时，房间内其他用户会收到 [onUserJoined](85533#onuserjoined)；
     *            - 从可见切换至不可见时，房间内其他用户会收到 [onLeaveRoom](85533#onleaveroom) 。
     * + 若调用该方法将可见性设为 false，此时尝试发布流会收到 `WARNING_CODE_PUBLISH_STREAM_FORBIDEN` 警告。
     */
    setUserVisibility(enable) {
        if (utils_1.isNull(enable)) {
            return utils_1.errorFeedback("setUserVisibility");
        }
        return this.instance.setUserVisibility(enable);
    }
    /** {en}
     * @brief Synchronizes published audio and video.
     * @param audio_user_id The ID of audio publisher. You can stop the current A/V synchronization by setting this parameter to null.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + When the same user simultaneously uses separate devices to capture and publish audio and video, there is a possibility that the streams are out of sync due to the network disparity. In this case, you can call this API on the video publisher side and the SDK will automatically line the video stream up according to the timestamp of the audio stream, ensuring that the audio the receiver hears corresponds to the video the receiver watches.
     * + You can call this API anytime before or after entering the room.
     * + The source user IDs of the audio and video stream to be synchronized must be in the same RTC room.
     * + When the A/V synchronization state changes, you will receive [onAVSyncStateChange](85533#onavsyncstatechange).
     * + More than one pair of audio and video can be synchronized simultaneously in the same RTC room, but you should note that one single audio source cannot be synchronized with multiple video sources at the same time.
     * + If you want to change the audio source, call this API again with a new `audio_user_id`. If you want to change the video source, you need to stop the current synchronization first, then call this API on the new video publisher side.
     */
    /** {zh}
     * @region 多房间
     * @brief 设置发流端音画同步。
     * @param audio_user_id 音频发送端的用户 ID，将该参数设为空则可解除当前音视频的同步关系。
     * @return 方法调用结果：
     * + 0：成功
     * + !0：失败
     * @notes + 当同一用户同时使用两个通话设备分别采集发送音频和视频时，有可能会因两个设备所处的网络环境不一致而导致发布的流不同步，此时你可以在视频发送端调用该接口，SDK 会根据音频流的时间戳自动校准视频流，以保证接收端听到音频和看到视频在时间上的同步性。
     * + 该方法在进房前后均可调用。
     * + 进行音画同步的音频发布用户 ID 和视频发布用户 ID 须在同一个 RTC 房间内。
     * + 调用该接口后音画同步状态发生改变时，你会收到 [onAVSyncStateChange](85533#onavsyncstatechange) 回调。
     * + 同一 RTC 房间内允许存在多个音视频同步关系，但需注意单个音频源不支持与多个视频源同时同步。
     * + 如需更换同步音频源，再次调用该接口传入新的 `audioUserId` 即可；如需更换同步视频源，需先解除当前的同步关系，后在新视频源端开启同步。
     */
    setMultiDeviceAVSync(audio_user_id) {
        if (utils_1.isNull(audio_user_id)) {
            return utils_1.errorFeedback("setMultiDeviceAVSync");
        }
        return this.instance.setMultiDeviceAVSync(audio_user_id);
    }
    /** {en}
     * @brief Update Token. A Token contains the privilege of joining a room, publishing streams, and subscribing to streams. Each privilege has an expiration time. A callback will be triggered 30s before expiration, informing the user to update the Token. In this case, you need to get a new Token and update the Token with this API to ensure the normal call.
     * @param token  Valid token.
     *        If the Token is invalid, a callback will be triggered with the [ErrorCode](85534) `-1010` indicating that the updated Token is invalid.
     */
    /** {zh}
     * @brief 更新 Token。Token 中同时包含进房、发布和订阅权限，各权限有一定的有效期，并且到期前 30 秒会触发回调，提示用户更新 Token 相关权限。此时需要重新获取 Token，并调用此方法更新 Token，以保证通话的正常进行。
     * @param token 重新获取的有效 Token。
     *        如果传入的 Token 无效，回调错误码为 [ErrorCode](85534) 中的 `-1010` 提示传入的 Token 无效。
     */
    updateToken(token) {
        if (utils_1.isNull(token)) {
            return utils_1.errorFeedback("updateToken");
        }
        return this.instance.updateToken(token);
    }
    /** {en}
     * @brief Sets your expected configuration of the remote video stream that you want to subscribe to or have subscribed to.
     * @param user_id ID of the remote video stream publisher you expect to configure subscription parameters for.
     * @param remote_video_config The parameters you expect to configure for the remote video stream.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + This API only works after the publisher calls [enableSimulcastMode](#enablesimulcastmode) to enable publishing multiple video streams, in which case the subscriber will receive the stream from the publisher that is closest to the set configuration;  otherwise the subscriber will only receive one video stream with a resolution of 640px × 360px and a frame rate of 15fps.
     * + If you don't call this API after the publisher enables the function of publishing multiple streams, you will receive by default the video stream with the largest resolution set by the publisher.
     * + You should call this API in the room. If you want to call it before entering the room, you should set the `remote_video_config` in the `room_config` when calling [joinRoom](#joinroom).
     * + SDK will automatically select the stream to be published or subscribed based on the settings of both sides.
     */
    /** {zh}
     * @region 视频管理
     * @brief 设置期望订阅的远端视频流的参数。
     * @param user_id 期望配置订阅参数的远端视频流发布用户的 ID。
     * @param remote_video_config 期望配置的远端视频流参数。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 若使用 1.5.0 及以前版本的 SDK，调用该方法前请联系技术支持人员开启按需订阅功能。
     * + 该方法仅在发布端调用 [enableSimulcastMode](#enablesimulcastmode) 开启了发送多路视频流的情况下生效，此时订阅端将收到来自发布端与期望设置的参数最相近的一路流；否则订阅端只会收到一路参数为分辨率 640px × 360px、帧率 15fps 的视频流。
     * + 若发布端开启了推送多路流功能，但订阅端不对流参数进行设置，则默认接受发送端设置的分辨率最大的一路视频流。
     * + 该方法需在进房后调用，若想进房前设置，你需调用 [joinRoom](#joinroom)，并对 `roomConfig` 中的 `remoteVideoConfig` 进行设置。
     * + SDK 会根据发布端和所有订阅端的设置灵活调整视频流的参数，具体调整策略详见[推送多路流](https://www.volcengine.com/docs/6348/70139)文档。
     */
    setRemoteVideoConfig(user_id, remote_video_config) {
        if (!user_id || !remote_video_config) {
            return utils_1.errorFeedback("setRemoteVideoConfig");
        }
        utils_1.checkStringType(user_id, 'user_id');
        utils_1.checkNumberType(remote_video_config.framerate, 'remote_video_config.framerate', true);
        utils_1.checkNumberType(remote_video_config.resolution_width, 'remote_video_config.resolution_width', true);
        utils_1.checkNumberType(remote_video_config.resolution_height, 'remote_video_config.resolution_height', true);
        return this.instance.setRemoteVideoConfig(user_id, remote_video_config);
    }
    /** {en}
     * @brief Publishes media streams captured by camera/microphone in the current room.
     * @param type Media stream type, used for specifying whether to publish audio stream or video stream.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes
     * + You don't need to call this API if you set it to Auto-publish when calling [joinRoom](#joinroom).
     * + An invisible user cannot publish media streams. Call [setUserVisibility](#setuservisibility) to change your visibility in the room.
     * + Call [publishScreen](#publishscreen) to start screen sharing.
     * + Call [startForwardStreamToRooms](#startforwardstreamtorooms) to forward the published streams to the other rooms.
     * + After you call this API, the other users in the room will receive [onUserPublishStream](85533#onuserpublishstream). Those who successfully received your streams will receive [onFirstRemoteAudioFrame](85533#onfirstremoteaudioframe)/[onFirstRemoteVideoFrameDecoded](85533#onfirstremotevideoframedecoded) at the same time.
     * + Call [unpublishStream](#unpublishstream) to stop publishing streams.
     */
    /** {zh}
     * @region 房间管理
     * @brief 在当前所在房间内发布本地通过摄像头/麦克风采集的媒体流
     * @param type 媒体流类型，用于指定发布音频/视频
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 如果你已经在用户进房时通过调用 [joinRoom](#joinroom) 成功选择了自动发布，则无需再调用本接口。
     * + 调用 [setUserVisibility](#setuservisibility) 方法将自身设置为不可见后无法调用该方法，需将自身切换至可见后方可调用该方法发布摄像头音视频流。
     * + 如果你需要发布屏幕共享流，调用 [publishScreen](#publishscreen)。
     * + 如果你需要向多个房间发布流，调用 [startForwardStreamToRooms](#startforwardstreamtorooms)。
     * + 调用此方法后，房间中的所有远端用户会收到 [onUserPublishStream](85533#onuserpublishstream) 回调通知，其中成功收到了音频流的远端用户会收到 [onFirstRemoteAudioFrame](85533#onfirstremoteaudioframe) 回调，订阅了视频流的远端用户会收到 [onFirstRemoteVideoFrameDecoded](85533#onfirstremotevideoframedecoded) 回调。
     * + 调用 [unpublishStream](#unpublishstream) 取消发布。
     */
    publishStream(type) {
        if (utils_1.isNull(type)) {
            return utils_1.errorFeedback("publishStream");
        }
        return this.instance.publishStream(type);
    }
    /** {en}
     * @brief Stops publishing media streams captured by camera/microphone in the current room.
     * @param type Media stream type, used for specifying whether to stop publishing audio stream or video stream.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + After calling [publishStream](#publishstream), call this API to stop publishing streams.
     * + After calling this API, the other users in the room will receive [onUserUnpublishStream](85533#onuserunpublishstream).
     */
    /** {zh}
     * @region 房间管理
     * @brief 停止将本地摄像头/麦克风采集的媒体流发布到当前所在房间中
     * @param type 媒体流类型，用于指定停止发布音频/视频
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 调用 [publishStream](#publishstream) 手动发布摄像头音视频流后，你需调用此接口停止发布。
     * + 调用此方法停止发布音视频流后，房间中的其他用户将会收到 [onUserUnpublishStream](85533#onuserunpublishstream) 回调通知。
     */
    unpublishStream(type) {
        if (utils_1.isNull(type)) {
            return utils_1.errorFeedback("unpublishStream");
        }
        return this.instance.unpublishStream(type);
    }
    /** {en}
     * @brief Publishes local screen sharing streams in the current room.
     * @param type Media stream type, used for specifying whether to publish audio stream or video stream.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + You need to call this API even if you set it to Auto-publish when calling [joinRoom](#joinroom).
     * + An invisible user cannot publish media streams. Call [setUserVisibility](#setuservisibility) to change your visibility in the room.
     * + After you called this API, the other users in the room will receive [onUserPublishScreen](85533#onuserpublishscreen). Those who successfully received your streams will receive [onFirstRemoteAudioFrame](85533#onfirstremoteaudioframe)/[onFirstRemoteVideoFrameDecoded](85533#onfirstremotevideoframedecoded) at the same time.
     * + After calling this API, you'll receive [onScreenVideoFrameSendStateChanged](85533#onscreenvideoframesendstatechanged].
     * + Call [startForwardStreamToRooms](#startforwardstreamtorooms) to forward the published streams to the other rooms.
     * + Call [unpublishScreen](#unpublishscreen) to stop publishing screen sharing streams.
     * + You can only publish video stream on Linux.
     */
    /** {zh}
     * @region 屏幕共享
     * @brief 在当前所在房间内发布本地屏幕共享音视频流
     * @param type 媒体流类型，用于指定发布屏幕音频/视频
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 即使你已经在用户进房时通过调用 [joinRoom](#joinroom) 成功选择了自动发布，也需要调用本接口发布屏幕流。
     * + 调用 [setUserVisibility](#setuservisibility) 方法将自身设置为不可见后无法调用该方法，需将自身切换至可见后方可调用该方法发布屏幕流。
     * + 调用该方法后，房间中的所有远端用户会收到 [onUserPublishScreen](85533#onuserpublishscreen) 回调，其中成功收到音频流的远端用户会收到 [onFirstRemoteAudioFrame](85533#onfirstremoteaudioframe) 回调，订阅了视频流的远端用户会收到 [onFirstRemoteVideoFrameDecoded](85533#onfirstremotevideoframedecoded) 回调。
     * + 调用该方法后，本端用户会收到 [onScreenVideoFrameSendStateChanged](85533#onscreenvideoframesendstatechanged) 回调。
     * + 如果你需要向多个房间发布流，调用 [startForwardStreamToRooms](#startforwardstreamtorooms)。
     * + 调用 [unpublishScreen](#unpublishscreen) 取消发布。
     */
    publishScreen(type) {
        if (utils_1.isNull(type)) {
            return utils_1.errorFeedback("publishScreen");
        }
        return this.instance.publishScreen(type);
    }
    /** {en}
     * @brief Stops publishing local screen sharing streams in the current room.
     * @param type Media stream type, used for specifying whether to stop publishing audio stream or video stream.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + After calling [publishScreen](#publishscreen), call this API to stop publishing streams.
     * + After calling this API, the other users in the room will receive [onUserUnpublishScreen](85533#onuserunpublishscreen).
     */
    /** {zh}
     * @region 屏幕共享
     * @brief 停止将本地屏幕共享音视频流发布到当前所在房间中
     * @param type 媒体流类型，用于指定停止发布屏幕音频/视频
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 调用 [publishScreen](#publishscreen) 发布屏幕流后，你需调用此接口停止发布。
     * + 调用此方法停止发布屏幕音视频流后，房间中的其他用户将会收到 [onUserUnpublishScreen](85533#onuserunpublishscreen) 回调。
     */
    unpublishScreen(type) {
        if (utils_1.isNull(type)) {
            return utils_1.errorFeedback("unpublishScreen");
        }
        return this.instance.unpublishScreen(type);
    }
    /** {en}
     * @brief Subscribes to specific remote media streams captured by camera/microphone.  Or update the options of the subscribed user.
     * @param user_id User ID of the publisher of the subscribed media stream
     * @param type Media stream type to be subscribed to.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + Calling this API to update the subscribe configuration when the user has subscribed the remote user either by calling this API or by auto-subscribe.
     * + You must first get the remote stream information through [onUserPublishStream](85533#onuserpublishstream) before calling this API to subscribe to streams accordingly.
     * + After calling this API, you will be informed of the calling result with [onStreamSubscribed](85533#onstreamsubscribed).
     * + Once the local user subscribes to the stream of a remote user, the subscription to the remote user will sustain until the local user leaves the room or unsubscribe from it by calling [unsubscribeStream](#unsubscribestream).
     * + Any other exceptions will be included in [onStreamStateChanged](85533#onstreamstatechanged), see [ErrorCode](85534#errorcode) for the reasons.
     */
    /** {zh}
     * @region 房间管理
     * @brief 订阅房间内指定的通过摄像头/麦克风采集的媒体流，或更新对指定远端用户的订阅选项
     * @param user_id 指定订阅的远端发布音视频流的用户 ID。
     * @param type 媒体流类型，用于指定订阅音频/视频。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 当调用本接口时，当前用户已经订阅该远端用户，不论是通过手动订阅还是自动订阅，都将根据本次传入的参数，更新订阅配置。
     * + 你必须先通过 [onUserPublishStream](85533#onuserpublishstream) 回调获取当前房间里的远端摄像头音视频流信息，然后调用本方法按需订阅。
     * + 调用该方法后，你会收到 [onStreamSubscribed](85533#onstreamsubscribed) 通知方法调用结果。
     * + 成功订阅远端用户的媒体流后，订阅关系将持续到调用 [unsubscribeStream](#unsubscribestream) 取消订阅或本端用户退房。
     * + 关于其他调用异常，你会收到 [onStreamStateChanged](85533#onstreamstatechanged) 回调通知，具体异常原因参看 [ErrorCode](85534#errorcode)。
     */
    subscribeStream(user_id, type) {
        if (!user_id || utils_1.isNull(type)) {
            return utils_1.errorFeedback("subscribeStream");
        }
        return this.instance.subscribeStream(user_id, type);
    }
    /** {en}
     * @brief Unsubscribes from specific remote media streams captured by camera/microphone. You can call this API in both automatic subscription mode and manual subscription mode.
     * @param user_id The ID of the remote user who published the target audio/video stream.
     * @param type Media stream type, used for specifying whether to unsubscribe from the audio stream or the video stream.
     * @returns + `0`: Success
     * + `-1`: Failure.
     * @notes + After calling this API, you will be informed of the calling result with [onStreamSubscribed](85533#onstreamsubscribed).
     * + Any other exceptions will be included in [onStreamStateChanged](85533#onstreamstatechanged), see [ErrorCode](85534#errorcode) for the reasons.
     */
    /** {zh}
     * @region 房间管理
     * @brief 取消订阅房间内指定的通过摄像头/麦克风采集的媒体流。该方法对自动订阅和手动订阅模式均适用。
     * @param user_id 指定取消订阅的远端发布音视频流的用户 ID。
     * @param type 媒体流类型，用于指定取消订阅音频/视频。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 调用该方法后，你会收到 [onStreamSubscribed](85533#onstreamsubscribed) 通知流的退订结果。
     * + 关于其他调用异常，你会收到 [onStreamStateChanged](85533#onstreamstatechanged) 回调通知，具体失败原因参看 [ErrorCode](85534#errorcode)。
     */
    unsubscribeStream(user_id, type) {
        if (!user_id || utils_1.isNull(type)) {
            return utils_1.errorFeedback("unsubscribeStream");
        }
        return this.instance.unsubscribeStream(user_id, type);
    }
    /** {en}
     * @brief Subscribes to all remote media streams captured by camera/microphone. Or update the subscribe options of all subscribed user.
     * @param type Media stream type, used for specifying whether to subscribe to the audio stream or the video stream.
     * @returns + `0`: Success
     * + `-1`: Failure.
     * @notes + If the subscription options conflict with the previous ones, they are subject to the configurations in the last call.
     * + In the Conference Mode, if the number of media streams exceeds the limit, we recommend you call [subscribeStream](#subscribestream) to subscribe each target media stream other than calling this API.
     * + After calling this API, you will be informed of the calling result with [onStreamSubscribed](85533#onstreamsubscribed).
     * + Once the local user subscribes to the stream of a remote user, the subscription to the remote user will sustain until the local user leaves the room or unsubscribe from it by calling [unsubscribeStream](#unsubscribestream).
     * + Any other exceptions will be included in onStreamStateChanged(85533#onstreamstatechanged), see [ErrorCode](85534) for the reasons.
     */
    /** {zh}
     * @brief 订阅房间内所有通过摄像头/麦克风采集的媒体流，或更新订阅选项。
     * @param type 媒体流类型，用于指定订阅音频/视频。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 多次调用订阅接口时，将根据末次调用接口和传入的参数，更新订阅配置。
     * + 大会模式下，如果房间内的媒体流超过上限，建议通过调用 [subscribeStream](#subscribestream) 逐一指定需要订阅的媒体流。
     * + 调用该方法后，你会收到 [onStreamSubscribed](85533#onstreamsubscribed) 通知方法调用结果。
     * + 成功订阅远端用户的媒体流后，订阅关系将持续到调用 [unsubscribeStream](#unsubscribestream) 取消订阅或本端用户退房。
     * + 关于其他调用异常，你会收到 onStreamStateChanged(85533#onstreamstatechanged) 回调通知，具体异常原因参看 [ErrorCode](85534)。
     */
    subscribeAllStreams(type) {
        if (utils_1.isNull(type)) {
            return utils_1.errorFeedback("subscribeAllStreams");
        }
        return this.instance.subscribeAllStreams(type);
    }
    /** {en}
     * @brief Unsubscribes from all remote media streams captured by camera/microphone.
     * @param type Media stream type, used for specifying whether to unsubscribe from the audio stream or the video stream.
     * @returns + `0`: Success
     * + `-1`: Failure.
     * @notes + You can call this API to unsubscribe from streams that are subscribed to either automatically or manually.
     * + After calling this API, you will be informed of the calling result with [onStreamSubscribed](85533#onstreamsubscribed).
     * + Any other exceptions will be included in onStreamStateChanged(85533#onstreamstatechanged), see [ErrorCode](85534) for the reasons.
     */
    /** {zh}
     * @brief 取消订阅房间内所有的通过摄像头/麦克风采集的媒体流。
     * @param type 媒体流类型，用于指定取消订阅音频/视频。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 自动订阅和手动订阅的流都可以通过本方法取消订阅。
     * + 调用该方法后，你会收到 [onStreamSubscribed](85533#onstreamsubscribed) 通知方法调用结果。
     * + 关于其他调用异常，你会收到 onStreamStateChanged(85533#onstreamstatechanged) 回调通知，具体失败原因参看 [ErrorCode](85534)。
     */
    unsubscribeAllStreams(type) {
        if (utils_1.isNull(type)) {
            return utils_1.errorFeedback("unsubscribeAllStreams");
        }
        return this.instance.unsubscribeAllStreams(type);
    }
    /** {en}
     * @brief Subscribes to specific screen sharing media stream.   Or update the subscribe options of the subscribed user.
     * @param user_id The ID of the remote user who published the target screen audio/video stream.
     * @param type Media stream type, used for specifying whether to subscribe to the audio stream or the video stream.
     * @returns + `0`: Success
     * + `-1`: Failure.
     * @notes + Calling this API to update the subscribe configuration when the user has subscribed the remote user either by calling this API or by auto-subscribe.
     * + You must first get the remote stream information through [onUserPublishScreen](85533#onuserpublishscreen)} before calling this API to subscribe to streams accordingly.
     * + After calling this API, you will be informed of the calling result with [onStreamSubscribed](85533#onstreamsubscribed).
     * + Once the local user subscribes to the stream of a remote user, the subscription to the remote user will sustain until the local user leaves the room or unsubscribe from it by calling [unsubscribeScreen](#unsubscribescreen).
     * + Any other exceptions will be included in [onStreamStateChanged](85533#onstreamstatechanged), see [ErrorCode](85534#errorcode) for the reasons.
     */
    /** {zh}
     * @region 房间管理
     * @brief 订阅房间内指定的远端屏幕共享音视频流，或更新对指定远端用户的订阅选项
     * @param user_id 指定订阅的远端发布屏幕流的用户 ID。
     * @param type 媒体流类型，用于指定订阅音频/视频。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 当调用本接口时，当前用户已经订阅该远端用户，不论是通过手动订阅还是自动订阅，都将根据本次传入的参数，更新订阅配置。
     * + 你必须先通过 [onUserPublishScreen](85533#onuserpublishscreen) 回调获取当前房间里的远端屏幕流信息，然后调用本方法按需订阅。
     * + 调用该方法后，你会收到 [onStreamSubscribed](85533#onstreamsubscribed) 通知流的订阅结果。
     * + 成功订阅远端用户的媒体流后，订阅关系将持续到调用 [unsubscribeScreen](#unsubscribescreen) 取消订阅或本端用户退房。
     * + 关于其他调用异常，你会收到 [onStreamStateChanged](85533#onstreamstatechanged) 回调通知，具体异常原因参看 [ErrorCode](85534#errorcode)。
     */
    subscribeScreen(user_id, type) {
        if (!user_id || utils_1.isNull(type)) {
            return utils_1.errorFeedback("subscribeScreen");
        }
        return this.instance.subscribeScreen(user_id, type);
    }
    /** {en}
     * @brief Unsubscribes from specific screen sharing media stream.
     * @param user_id The ID of the remote user who published the target screen audio/video stream.
     * @param type Media stream type, used for specifying whether to unsubscribe from the audio stream or the video stream.
     * @returns + `0`: Success
     * + `-1`: Failure.
     * @notes + You can call this API in both automatic subscription mode and manual subscription mode.
     * + After calling this API, you will be informed of the calling result with [onStreamSubscribed](85533#onstreamsubscribed).
     * + Any other exceptions will be included in [onStreamStateChanged](85533#onstreamstatechanged), see [ErrorCode](85534#errorcode) for the reasons.
     */
    /** {zh}
     * @region 房间管理
     * @brief 取消订阅房间内指定的远端屏幕共享音视频流。
     * @param user_id 指定取消订阅的远端发布屏幕流的用户 ID。
     * @param type 媒体流类型，用于指定取消订阅音频/视频。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 该方法对自动订阅和手动订阅模式均适用。
     * + 调用该方法后，你会收到 [onStreamSubscribed](85533#onstreamsubscribed) 通知流的退订结果。
     * + 关于其他调用异常，你会收到 [onStreamStateChanged](85533#onstreamstatechanged) 回调通知，具体失败原因参看 [ErrorCode](85534#errorcode)。
     */
    unsubscribeScreen(user_id, type) {
        if (!user_id || utils_1.isNull(type)) {
            return utils_1.errorFeedback("unsubscribeScreen");
        }
        return this.instance.unsubscribeScreen(user_id, type);
    }
    /** {en}
     * @brief Pause receiving remote media streams.
     * @param media_type Media stream type subscribed to.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + Calling this API does not change the capture state and the transmission state of the remote clients.
     * + Calling this API does not cancel the subscription or change any subscription configuration.
     * + To resume, call [resumeAllSubscribedStream](#resumeallsubscribedstream).
     * + In a multi-room scenario, this API only pauses the reception of streams published in the current room.
     */
    /** {zh}
     * @region 多房间
     * @brief 暂停接收来自远端的媒体流。
     * @param media_type 媒体流类型，指定需要暂停接收音频还是视频流
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 该方法仅暂停远端流的接收，并不影响远端流的采集和发送；
     * + 该方法不改变用户的订阅状态以及订阅流的属性。
     * + 若想恢复接收远端流，需调用 [resumeAllSubscribedStream](#resumeallsubscribedstream)。
     * + 多房间场景下，仅暂停接收发布在当前所在房间的流。
     */
    pauseAllSubscribedStream(media_type) {
        if (utils_1.isNull(media_type)) {
            return utils_1.errorFeedback("pauseAllSubscribedStream");
        }
        return this.instance.pauseAllSubscribedStream(media_type);
    }
    /** {en}
     * @brief Media stream type subscribed to.
     * @param media_type Media stream type subscribed to.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + Calling this API does not change the capture state and the transmission state of the remote clients.
     * + Calling this API does not change any subscription configuration.
     */
    /** {zh}
     * @region 多房间
     * @brief 恢复接收来自远端的媒体流
     * @param media_type 媒体流类型，指定需要暂停接收音频还是视频流
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 该方法仅恢复远端流的接收，并不影响远端流的采集和发送；
     * + 该方法不改变用户的订阅状态以及订阅流的属性。
     */
    resumeAllSubscribedStream(media_type) {
        if (utils_1.isNull(media_type)) {
            return utils_1.errorFeedback("resumeAllSubscribedStream");
        }
        return this.instance.resumeAllSubscribedStream(media_type);
    }
    /** {en}
     * @brief Send a text message (P2P) to the specified user in the room
     * @param uid User ID of the message receiver
     * @param message Text message content sent. Message does not exceed 64 KB.
     * @param config Message type
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + Before sending an in-room text message, you must call [joinRoom](#joinroom) to join the room.
     * + After calling this function, you will receive an [onUserMessageSendResult](85533#onusermessagesendresult) callback to notify the message sender that the sending was successful or failed;
     * + If the text message is sent successfully, the user specified by uid will receive [onUserMessageReceived](85533#onusermessagereceived) callback.
     */
    /** {zh}
     * @region 多房间
     * @brief 给房间内指定的用户发送点对点文本消息
     * @param uid 消息接收用户的 ID
     * @param message 发送的文本消息内容
     *        消息不超过 64 KB。
     * @param config 消息发送的可靠/有序类型
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 在发送房间内文本消息前，必须先调用 [joinRoom](#joinroom) 加入房间。
     * + 调用后，会收到 [onUserMessageSendResult](85533#onusermessagesendresult) 回调，通知消息发送成功或失败；
     * + 若消息发送成功，则 userId 所指定的用户会收到 [onUserMessageReceived](85533#onusermessagereceived) 回调。
     */
    sendUserMessage(uid, message, config) {
        if (!uid || utils_1.isNull(message) || utils_1.isNull(config)) {
            return utils_1.errorFeedback("sendUserMessage");
        }
        return this.instance.sendUserMessage(uid, message, config);
    }
    /** {en}
     * @brief Sends a binary message (P2P) to the specified user in the room
     * @param uid User ID of the message receiver
     * @param length The length of the binary string.
     * @param message The content of the binary message. The message does not exceed 46KB.
     *         The number of the message sent this time is incremented from
     * @param config Message type
     * @returns + > 0: Success. Serial number of the message, starting form 1.
     * + < 0: Failure.
     * @notes   + Before sending in-room binary messages, you must call [joinRoom](#joinroom) to join the room.
     * + After calling this function, you will receive an [onUserMessageSendResult](85533#onusermessagesendresult) callback to notify the sender of the success or failure of the message;
     * + If the binary message is sent successfully, the user specified by uid will receive the [onUserBinaryMessageReceived](85533#onuserbinarymessagereceived) callback.
     */
    /** {zh}
     * @region 多房间
     * @brief 给房间内指定的用户发送点对点二进制消息。
     * @param uid 消息接收用户的 ID
     * @param length 二进制字符串的长度
     * @param message 发送的二进制消息内容
     *        消息不超过 46KB。
     * @param config 消息类型
     * @return + > `0`: 成功。这次发送消息的编号，从 1 开始递增。
     * + `-1`: 失败
     * @notes + 在发送房间内二进制消息前，必须先调用 [joinRoom](#joinroom) 加入房间。
     * + 调用后，会收到 [onUserMessageSendResult](85533#onusermessagesendresult) 回调，通知消息发送成功或失败；
     * + 若消息发送成功，则 userId 所指定的用户会收到 [onUserBinaryMessageReceived](85533#onuserbinarymessagereceived) 回调。
     */
    sendUserBinaryMessage(uid, length, message, config) {
        if (!uid || utils_1.isNull(length) || utils_1.isNull(message) || utils_1.isNull(config)) {
            return utils_1.errorFeedback("sendUserBinaryMessage");
        }
        return this.instance.sendUserBinaryMessage(uid, length, message, config);
    }
    /** {en}
     * @brief Send broadcast messages to all other users in the room.
     * @param message The broadcast message sent by the user
     *        Message does not exceed 64 KB.
     * @returns + 0: Success. Serial number of the message, starting form 1.
     * + < 0: Failure.
     * @notes
     * + Before sending in-room binary messages, you must call [joinRoom](#joinroom) to join the room.
     * + After calling this function, you get an [onRoomMessageSendResult](85533#onroommessagesendresult) callback.
     * + Other users in the same room receive an [onRoomMessageReceived](85533#onroommessagereceived) callback.
     */
    /** {zh}
     * @region 多房间
     * @brief 给房间内的所有其他用户群发文本消息。
     * @param message 发送的文本消息内容
     *        消息不超过 64 KB。
     * @return + `0`: 成功。这次发送消息的编号，从 1 开始递增。
     * + `-1`: 失败
     * @notes + 在房间内广播文本消息前，必须先调用 [joinRoom](#joinroom) 加入房间。
     * + 调用后，会收到 [onRoomMessageSendResult](85533#onroommessagesendresult) 回调；
     * + 同一房间内的其他用户会收到 [onRoomMessageReceived](85533#onroommessagereceived) 回调。
     */
    sendRoomMessage(message) {
        if (utils_1.isNull(message)) {
            return utils_1.errorFeedback("sendRoomMessage");
        }
        return this.instance.sendRoomMessage(message);
    }
    /** {en}
     * @brief Send broadcast messages to all other users in the room.
     * @param size The length of the binary message to be sent
     * @param message The binary broadcast message sent by the user
     *        The message does not exceed 46KB.
     * @returns + 0: Success. Serial number of the message, starting form 1.
     * + < 0: Failure.
     * @notes + Before sending in-room binary messages, you must call [joinRoom](#joinroom) to join the room.
     * + After calling this function, you get an [onRoomMessageSendResult](85533#onroommessagesendresult) callback.
     * + Other users in the same room receive an [onRoomBinaryMessageReceived](85533#onroombinarymessagereceived) callback.
     */
    /** {zh}
     * @region 多房间
     * @brief 给房间内的所有其他用户群发二进制消息。
     * @param size 发送的二进制消息长度
     * @param message 发送的二进制消息内容，消息不超过 46 KB。
     * @return + `0`: 成功。这次发送消息的编号，从 1 开始递增。
     * + `-1`: 失败
     * @notes + 在房间内广播二进制消息前，必须先调用 [joinRoom](#joinroom) 加入房间。
     * + 调用后，会收到 [onRoomMessageSendResult](85533#onroommessagesendresult) 回调；
     * + 同一房间内的其他用户会收到 [onRoomBinaryMessageReceived](85533#onroombinarymessagereceived) 回调。
     */
    sendRoomBinaryMessage(size, message) {
        if (utils_1.isNull(size) || utils_1.isNull(message)) {
            return utils_1.errorFeedback("sendRoomBinaryMessage");
        }
        return this.instance.sendRoomBinaryMessage(size, message);
    }
    /** {en}
     * @brief Start relaying media stream across rooms.
     * @param configuration Information of the rooms where you want to relay the media stream to.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + After calling [joinRoom](#joinroom), you can call this method to publish the media stream to multiple rooms that applies to scenarios such as anOnline talent contest and so on.
     * + Call this method will trigger [onForwardStreamStateChanged](85533#onforwardstreamstatechanged).
     * + After calling this method, listen the events from each room during the relaying by registering [onForwardStreamEvent](85533#onforwardstreamevent).
     * + Once the relaying begins, the other users in the room will receive callback of [onUserJoined](85533#onuserjoined) and [onUserPublishStream](85533#onuserpublishstream)/[onUserPublishScreen](85533#onuserpublishscreen).
     * + Call [updateForwardStreamToRooms](#updateforwardstreamtorooms) to add or remove the target room(s) after calling this method.
     * + Call [stopForwardStreamToRooms](#stopforwardstreamtorooms) to stop relaying to all rooms after calling this method.
     * + Call [pauseForwardStreamToAllRooms](#pauseforwardstreamtoallrooms) to pause relaying to all rooms after calling this method.
     */
    /** {zh}
     * @region 多房间
     * @brief 开始跨房间转发媒体流。
     * @param configuration 跨房间媒体流转发指定房间的信息。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 在调用 [joinRoom](#joinroom) 后，调用本接口，实现向多个房间转发媒体流，适用于跨房间连麦等场景。
     * + 调用本方法后，将在本端触发 [onForwardStreamStateChanged](85533#onforwardstreamstatechanged) 回调。
     * + 调用本方法后，你可以通过监听 [onForwardStreamEvent](85533#onforwardstreamevent) 回调来获取各个目标房间在转发媒体流过程中的相关事件。
     * + 开始转发后，目标房间中的用户将接收到本地用户进房 [onUserJoined](85533#onuserjoined) 和发流 [onUserPublishStream](85533#onuserpublishstream) / [onUserPublishScreen](85533#onuserpublishscreen) 的回调。
     * + 调用本方法后，可以调用 [updateForwardStreamToRooms](#updateforwardstreamtorooms) 更新目标房间信息，例如，增加或减少目标房间等。
     * + 调用本方法后，可以调用 [stopForwardStreamToRooms](#stopforwardstreamtorooms) 停止向所有房间转发媒体流。
     * + 调用本方法后，可以调用 [pauseForwardStreamToAllRooms](#pauseforwardstreamtoallrooms) 暂停向所有房间转发媒体流。
     */
    startForwardStreamToRooms(configuration) {
        if (utils_1.isNull(configuration) || utils_1.isNull(configuration.forward_stream_dests)) {
            return utils_1.errorFeedback("startForwardStreamToRooms");
        }
        const tempConfigurarion = {
            forward_stream_dests: [],
        };
        const finalConfig = {
            ...tempConfigurarion,
            ...(configuration || {}),
        };
        return this.instance.startForwardStreamToRooms(finalConfig);
    }
    /** {en}
     * @brief Update information of the rooms where you want to relay the media stream to.
     * @param configuration Information of the rooms where you want to relay the media stream to.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + Update information of the rooms where you want to relay the media stream to after calling [startForwardStreamToRooms](#startforwardstreamtorooms).
     * + Adding and removing rooms by calling this method will trigger [onForwardStreamStateChanged](85533#onforwardstreamstatechanged) on the local.
     * + Users in the room which is added by calling this method will receive [onUserJoined](85533#onuserjoined) and [onUserPublishStream](85533#onuserpublishstream)/[onUserPublishScreen](85533#onuserpublishscreen).
     * + Users in the room which is removed by calling this method will receive [onUserUnpublishStream](85533#onuserunpublishstream)/[onUserUnpublishScreen](85533#onuserunpublishscreen) and [onUserLeave](85533#onuserleave).
     */
    /** {zh}
     * @region 多房间
     * @brief 更新跨房间媒体流转发信息。
     * @param configuration 跨房间媒体流转发目标房间信息。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 通过 [startForwardStreamToRooms](#startforwardstreamtorooms) 发起媒体流转发后，可调用本方法增加或者减少目标房间，或更新房间密钥。
     * + 调用本方法增加或删减房间后，将在本端触发 [onForwardStreamStateChanged](85533#onforwardstreamstatechanged) 回调，包含发生了变动的目标房间中媒体流转发状态。
     * + 增加目标房间后，新增目标房间中的用户将接收到本地用户进房 [onUserJoined](85533#onuserjoined) 和发布 [onUserPublishStream](85533#onuserpublishstream)/ [onUserPublishScreen](85533#onuserpublishscreen) 的回调。
     * + 删减目标房间后，原目标房间中的用户将接收到本地用户停止发布 [onUserUnpublishStream](85533#onuserunpublishstream) / [onUserUnpublishScreen](85533#onuserunpublishscreen) 和退房 [onUserLeave](85533#onuserleave) 的回调。
     */
    updateForwardStreamToRooms(configuration) {
        if (utils_1.isNull(configuration) || utils_1.isNull(configuration.forward_stream_dests)) {
            return utils_1.errorFeedback("updateForwardStreamToRooms");
        }
        const tempConfigurarion = {
            forward_stream_dests: [],
        };
        return this.instance.updateForwardStreamToRooms({
            ...tempConfigurarion,
            ...(configuration || {}),
        });
    }
    /** {en}
     * @brief Stop relaying media streams to all rooms.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + Call to this method to stop relaying media stream to all rooms after calling [startForwardStreamToRooms](#startforwardstreamtorooms).
     * + Call this method will trigger [onForwardStreamStateChanged](85533#onforwardstreamstatechanged).
     * + The other users in the room will receive callback of [onUserJoined](85533#onuserjoined) and [onUserPublishStream](85533#onuserpublishstream)/[onUserPublishScreen](85533#onuserpublishscreen) when you stop relaying.
     * + To stop relaying media stream to specific rooms, call [updateForwardStreamToRooms](#updateforwardstreamtorooms) instead.
     * + To resume the relaying in a short time, call [pauseForwardStreamToAllRooms](#pauseforwardstreamtoallrooms) instead and then call resumeForwardStreamToAllRooms(#resumeforwardstreamtoallrooms) to recsume after that.
     */
    /** {zh}
     * @region 多房间
     * @brief 停止跨房间媒体流转发。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 通过 [startForwardStreamToRooms](#startforwardstreamtorooms) 发起媒体流转发后，可调用本方法停止向所有目标房间转发媒体流。
     * + 调用本方法后，将在本端触发 [onForwardStreamStateChanged](85533#onforwardstreamstatechanged) 回调。
     * + 调用本方法后，原目标房间中的用户将接收到本地用户停止发布 [onUserUnpublishStream](85533#onuserunpublishstream) / [onUserUnpublishScreen](85533#onuserunpublishscreen) 和退房 [onUserLeave](85533#onuserleave) 的回调。
     * + 如果需要停止向指定的房间转发媒体流，请调用 [updateForwardStreamToRooms](#updateforwardstreamtorooms) 更新房间信息。
     * + 如果需要暂停转发，请调用 [pauseForwardStreamToAllRooms](#pauseforwardstreamtoallrooms)，并在之后随时调用 resumeForwardStreamToAllRooms(#resumeforwardstreamtoallrooms) 快速恢复转发。
     */
    stopForwardStreamToRooms() {
        return this.instance.stopForwardStreamToRooms();
    }
    /** {en}
     * @brief Pause relaying media streams to all rooms.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + Call this method to pause relaying media stream to all rooms after calling [startForwardStreamToRooms](#startforwardstreamtorooms).
     * + After that, call resumeForwardStreamToAllRooms(#resumeforwardstreamtoallrooms) to resume.
     * + The other users in the room will receive callback of [onUserUnpublishStream](85533#onuserunpublishstream)/[onUserUnpublishScreen](85533#onuserunpublishscreen) and [onUserLeave](85533#onuserleave) when you pause relaying.
     */
    /** {zh}
     * @region 多房间
     * @brief 暂停跨房间媒体流转发。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 通过 [startForwardStreamToRooms](#startforwardstreamtorooms) 发起媒体流转发后，可调用本方法暂停向所有目标房间转发媒体流。
     * + 调用本方法暂停向所有目标房间转发后，你可以随时调用 resumeForwardStreamToAllRooms(#resumeforwardstreamtoallrooms) 快速恢复转发。
     * + 调用本方法后，目标房间中的用户将接收到本地用户停止发布 [onUserUnpublishStream](85533#onuserunpublishstream)/[onUserUnpublishScreen](85533#onuserunpublishscreen) 和退房 [onUserLeave](85533#onuserleave) 的回调。
     */
    pauseForwardStreamToAllRooms() {
        return this.instance.pauseForwardStreamToAllRooms();
    }
    /** {en}
     * @brief Resume relaying media streams to all rooms.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + Call this method to resume relaying to all rooms from the pause by calling [pauseForwardStreamToAllRooms](#pauseforwardstreamtoallrooms).
     * + The other users in the room will receive callback of [onUserJoined](85533#onuserjoined) and [onUserPublishStream](85533#onuserpublishstream)/[onUserPublishScreen](85533#onuserpublishscreen) when you resume relaying.
     */
    /** {zh}
     * @region 多房间
     * @brief 恢复跨房间媒体流转发。
     * @return + `0`: 成功
     * + `-1`: 失败
     *        调用 [pauseForwardStreamToAllRooms](#pauseforwardstreamtoallrooms) 暂停转发之后，调用本方法恢复向所有目标房间转发媒体流。
     * @notes 目标房间中的用户将接收到本地用户进房 [onUserJoined](85533#onuserjoined) 和发布 [onUserPublishStream](85533#onuserpublishstream)/[onUserPublishScreen](85533#onuserpublishscreen) 的回调。
     */
    resumeForwardStreamToAllRooms() {
        return this.instance.resumeForwardStreamToAllRooms();
    }
    /** {en}
     * @brief Enable/disable the range audio function.
     * @param enable Whether to enable audio range funcion：
     * + true: Enable
     * + false: Disable（Defaulting setting）
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + Range audio means that within a certain range in a same RTC room, the audio volume of the remote user received by the local user will be amplified/attenuated as the remote user moves closer/away. The audio coming from out of the range cannot be heard. See [updateReceiveRange](#updatereceiverange) to set audio receiving range.
     * + You can call this API anytime before or after entering a room. To ensure a smooth switch to the range audio mode after entering the room, you need to call [updateRangePosition](#updaterangeposition) before this API to set your own position coordinates, and then enable the range audio function.
     */
    /** {zh}
     * @brief 开启/关闭范围语音功能。
     * @param enable 是否开启范围语音功能：
     *         1. true 表示开启，
     *         2. false 表示关闭
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 范围语音是指，在同一 RTC 房间中设定的音频接收距离范围内，本地用户收听到的远端用户音频音量会随着远端用户的靠近/远离而放大/衰减；若远端用户在房间内的位置超出设定范围，则本地用户无法接收其音频。音频接收范围设置参看 [updateReceiveRange](#updatereceiverange)。
     * + 如果开启区域语音，非队友之间在收发世界模式下语音会根据用户之间的距离衰减，超过收听范围就听不到，如果关闭区域语音，非队友之间在收发世界模式下，语音不会随距离衰减
     * + 该方法进房前后都可调用，为保证进房后范围语音效果的平滑切换，你需在该方法前先调用 [updateRangePosition](#updaterangeposition) 设置自身位置坐标，然后开启该方法收听范围语音效果。
     */
    enableRangeAudio(enable) {
        if (utils_1.isNull(enable)) {
            return utils_1.errorFeedback("enableRangeAudio");
        }
        return this.instance.enableRangeAudio(enable);
    }
    /** {en}
     * @brief Updates the audio receiving range for the local user.
     * @param range Audio receiving range
     * @returns + `0`: Success
     * + `!0`: Failure.
     */
    /** {zh}
     * @region 范围语音
     * @brief 更新本地用户的音频收听范围。
     * @param range 音频收听范围
     * @return 方法调用结果：
     * + `0`：成功；
     * + `!0`: 失败。
     */
    updateReceiveRange(range) {
        if (utils_1.isNull(range) || utils_1.isNull(range.min) || utils_1.isNull(range.max)) {
            return utils_1.errorFeedback("updateReceiveRange");
        }
        return this.instance.updateReceiveRange(range);
    }
    /** {en}
     * @brief Updates the coordinate of the local user's position in the rectangular coordinate system in the current room.
     * @param pos X, Y, Z coordinates. It defaults to [0, 0, 0].
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes After calling this API, you should call [enableRangeAudio](#enablerangeaudio) to enable range audio function to actually enjoy the range audio effect.
     */
    /** {zh}
     * @region 范围语音
     * @brief 更新本地用户在房间内空间直角坐标系中的位置坐标。
     * @param pos 三维坐标的值，默认为 [0, 0, 0]
     * @return 方法调用结果：
     * + 0：成功；
     * + !0：失败。
     * @notes 调用该接口更新坐标后，你需调用 [enableRangeAudio](#enablerangeaudio) 开启范围语音功能以收听范围语音效果。
     */
    updateRangePosition(pos) {
        if (utils_1.isNull(pos) || utils_1.isNull(pos.x) || utils_1.isNull(pos.y) || utils_1.isNull(pos.z)) {
            return utils_1.errorFeedback("updateRangePosition");
        }
        return this.instance.updateRangePosition(pos);
    }
    /** {en}
     * @brief Set the volume roll-off mode that a 3D sound has in an audio source when using the Range Audio feature.
     * @param type Volume roll-off mode. It is linear roll-off mode by default.
     * @param coefficient Coefficient for the exponential roll-off mode. The default value is 1. It ranges [0.1,100]. We recommended to set it to `50`. The volume roll-off speed gets faster as this value increases.
     * @returns + 0: Success
     * + < 0: Failure because of calling this API before the user has joined a room or before enabling the Range Audio feature by calling [enableRangeAudio](#enablerangeaudio).
     * @notes Call [updateReceiveRange](#updatereceiverange) to set the range outside which the volume of the sound does not attenuate.
     */
    /** {zh}
     * @region 范围语音
     * @brief 设置范围语音的音量衰减模式。
     * @param type 音量衰减模式。默认为线性衰减。
     * @param coefficient 指数衰减模式下的音量衰减系数，默认值为 1。范围 [0.1,100]，推荐设置为 `50`。数值越大，音量的衰减速度越快。
     * @return 调用是否成功
     * + `0`:调用成功
     * + `-1`:调用失败。原因为在调用 [enableRangeAudio](#enablerangeaudio) 开启范围语音前或进房前调用本接口
     * @notes 音量衰减范围通过 [updateReceiveRange](#updatereceiverange) 进行设置。
     */
    setAttenuationModel(type, coefficient) {
        if (utils_1.isNull(type) || utils_1.isNull(coefficient)) {
            return utils_1.errorFeedback("setAttenuationModel");
        }
        return this.instance.setAttenuationModel(type, coefficient);
    }
    /** {en}
     * @brief Set the flags to mark the user groups, within which the users talk without attenuation.
     *        In the RTC room, if the flags of the users intersects with each other, the users talk without attenuation.
     *        For example, the user is a member of multiple teams, and teammates of the same team talks without attentuation. You can set the flag for each team, and includes the flags of the user's teams in the user's flags.
     * @param flags Array of flags.
     */
    /** {zh}
     * @brief 添加标签组，用于标记相互之间通话不衰减的用户组。
     *        在同一个 RTC 房间中，如果多个用户的标签组之间有交集，那么，他们之间互相通话时，通话不衰减。
     *        比如，用户身处多个队伍，队伍成员间通话不衰减。那么，可以为每个队伍绑定专属标签，每个用户的标签组包含用户所属各个队伍的标签。
     * @param flags 标签组
     */
    setNoAttenuationFlags(flags = []) {
        return this.instance.setNoAttenuationFlags(flags);
    }
    /** {en}
     * @brief Enable/disable spatial audio function.
     * @param enable Whether to enable spatial audio function:
     * + true：Enable
     * + false：Disable(Default setting)
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes You need to call [updateSpatialPosition](#updatespatialposition) as well to really enjoy the spatial audio effect.
     */
    /** {zh}
     * @brief 开启/关闭空间音频功能。
     * @param enable 是否开启空间音频功能：
     * + true：开启
     * + false：关闭（默认）
     * @returns 0：支持空间音频 -1:不支持
     * @notes 该方法仅开启空间音频功能，你须调用 [updateSpatialPosition](#updatespatialposition) 设置自身位置坐标后方可收听空间音频效果。空间音频相关 API 和调用时序详见[空间音频](https://www.volcengine.com/docs/6348/93903)。
     */
    enableSpatialAudio(enable) {
        if (utils_1.isNull(enable)) {
            return utils_1.errorFeedback("enableSpatialAudio");
        }
        return this.instance.enableSpatialAudio(enable);
    }
    /** {en}
     * @brief Updates the coordinate of the local user's position in the rectangular coordinate system in the current room.
     * @param pos 3D coordinate values, the default value is [0, 0, 0]
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes Before calling this API, you should call [enableSpatialAudio](#enablespatialaudio) first to enable spatial audio function.
     */
    /** {zh}
     * @brief 更新本地用户在房间内空间直角坐标系中的位置坐标。
     * @param pos 三维坐标的值，默认为 [0, 0, 0]。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes 调用该接口更新坐标前，你需调用 [enableSpatialAudio](#enablespatialaudio) 开启空间音频功能。 空间音频相关 API 和调用时序详见[空间音频](https://www.volcengine.com/docs/6348/93903)。
     */
    updateSpatialPosition(pos) {
        if (utils_1.isNull(pos) || utils_1.isNull(pos.x) || utils_1.isNull(pos.y) || utils_1.isNull(pos.z)) {
            return utils_1.errorFeedback("updateSpatialPosition");
        }
        return this.instance.updateSpatialPosition(pos);
    }
    /** {en}
     * @brief After the local user joins the room, call this API to update the orientation of the local user in the 3D coordinates for the spatial audio.
     * @param orientation Your head orientation.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes +  Before calling this API, you should call [enableSpatialAudio](#enablespatialaudio) first to enable spatial audio function, and then call [updateSpatialPosition](#updatespatialposition) to update the position of the local user.
     * +  Call [disableRemoteOrientation](#disableremoteorientation) to neglect the orientation of the remote users.
     */
    /** {zh}
     * @brief 更新本地用户在空间音频坐标系下的朝向。
     * @param orientation 自身朝向信息
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 空间音频相关 API 和调用时序详见[空间音频](https://www.volcengine.com/docs/6348/93903)。
     * + 调用 [disableRemoteOrientation](#disableremoteorientation) 可忽略远端用户朝向。
     */
    updateSelfOrientation(orientation) {
        /** {en}
         * @brief Three-dimensional orientation information, each pair of vectors need to be perpendicular.
         */
        /** {zh}
         * @brief 三维朝向信息，三个向量需要两两垂直。
         */
        const tempOrientation = {
            /** {en}
             * @brief Forward orientation, the default value is {1,0,0}, i.e., the forward orientation is in the positive direction of x-axis.
             */
            /** {zh}
             * @brief 正前方朝向，默认值为 {1,0,0}，即正前方朝向 x 轴正方向
             */
            forward: { x: 1, y: 0, z: 0 },
            /** {en}
             * @brief Rightward orientation, the default value is {0,1,0}, i.e., the rightward orientation is in the positive direction of y-axis.
             */
            /** {zh}
             * @brief 正右方朝向，默认值为 {0,1,0}，即右手朝向 y 轴正方向
             */
            right: { x: 0, y: 1, z: 0 },
            /** {en}
             * @brief Upward orientation, the default value is {0,0,1}, i.e., the upward orientation is in the positive direction of z-axis.
             */
            /** {zh}
             * @brief 正上方朝向，默认值为 {0,0,1}，即头顶朝向 z 轴正方向
             */
            up: { x: 0, y: 0, z: 1 },
        };
        return this.instance.updateSelfOrientation({
            ...tempOrientation,
            ...(orientation || {}),
        });
    }
    /** {en}
     * @brief Calling this API in each client to neglect the orientation of the remote speakers. From the local user's perspective, all the remote users will be facing him/her.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + Once the orientation is disabled by calling this API, calling [updateSelfOrientation](#updateselforientation) will notify none of the remote users. However, as a listener, the local user can experience the sound effect varies with the change of one's orientation.
     * + You can call this API before or after the local user joins the room.
     * + Once the orientation is disabled by calling this API, you cannot enable it again within the lifetime of the `SpatialAudio` instance.
     */
    /** {zh}
     * @region 音频管理
     * @brief 参与通话的各端调用本接口后，将忽略远端用户的朝向，认为所有远端用户都面向本地用户。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 如果此后调用 [updateSelfOrientation](#updateselforientation) 更新本地用户朝向，远端用户无法感知这些变化，但本地用户接收音频时可以感知自身朝向改变带来的音频效果变化。
     * + 进房前后都可以调用该接口。
     * + 调用本接口关闭朝向功能后，在当前的空间音频实例的生命周期内无法再次开启。
     */
    disableRemoteOrientation() {
        return this.instance.disableRemoteOrientation();
    }
    /** {en}
     * @brief Updates the local user's position as a listener in the RTC room.
     *        By calling this API, you can set the position of the local user as a listener different from the position as a sound source.
     * @param pos 3D coordinate values.
     *            If the API is not called, the position as a listener is the same as that set by calling [updateSpatialPosition](#updatespatialposition).
     * @returns + `0`: Success
     * + `!0`: Failure.
     * @notes + Before calling this API, you should call [enableSpatialAudio](#enablespatialaudio) first to enable the spatial audio function.
     * + Refer to [Spatial Audio](https://docs.byteplus.com/byteplus-rtc/docs/93903) for more information about the feature.
     */
    /** {zh}
     * @brief 更新在房间内收听音频时的位置。
     *        通过此接口，你可以设定本地发声位置和收听位置不同。
     * @param pos 空间直角坐标系下的坐标值。
     *            如果未调用此接口设定收听位置，那么默认值为通过 [updateSpatialPosition](#updatespatialposition) 设定的值。
     * @return + `0`: 成功
     * + `!0`: 失败
     * @notes + 调用此接口前，你需调用 [enableSpatialAudio](#enablespatialaudio) 开启空间音频功能。
     * + 空间音频相关 API 和调用时序详见[空间音频](https://www.volcengine.com/docs/6348/93903)。
     */
    updateListenerPosition(pos) {
        if (utils_1.isNull(pos) || utils_1.isNull(pos.x) || utils_1.isNull(pos.y) || utils_1.isNull(pos.z)) {
            return utils_1.errorFeedback("updateSpatialPosition");
        }
        return this.instance.updateListenerPosition(pos);
    }
    /** {en}
     * @brief Updates the local user's orientation as a listener in the RTC room.
     *        By calling this API, you can set the orientation of the local user as a listener different from the orientation as a sound source.
     * @param orientation If the API is not called, the orientation as a listener is the same as that set by calling [updateSelfOrientation](#updateselforientation).
     * @returns + `0`: Success
     * + `!0`: Failure.
     * @notes Before calling this API, you should call [enableSpatialAudio](#enablespatialaudio) first to enable spatial audio function, and then call [updateSpatialPosition](#updatespatialposition) to update the position of the local user.
     */
    /** {zh}
     * @brief 更新在房间内收听音频时的朝向。
     *        通过此接口，你可以设定本地用户的发声朝向和收听朝向不同。
     * @param orientation 自身朝向信息
     *                    如果未调用此接口设定收听朝向，那么默认值为通过 [updateSelfOrientation](#updateselforientation) 设定的值。
     * @return + `0`: 成功
     * + `!0`: 失败
     * @notes 空间音频相关 API 和调用时序详见[空间音频](https://www.volcengine.com/docs/6348/93903)。
     */
    updateListenerOrientation(orientation) {
        const defaultValue = {
            forward: { x: 1, y: 0, z: 0 },
            right: { x: 0, y: 1, z: 0 },
            up: { x: 0, y: 0, z: 1 },
        };
        return this.instance.updateListenerOrientation({
            ...defaultValue,
            ...(orientation || {}),
        });
    }
    /** {en}
     * @brief Adjusts the audio playback volume from all the remote users in a room.
     * @param volume Ratio(%) of playback volume to original volume, in the range [0, 400], with overflow protection.
     * To ensure the audio quality, we recommend setting the volume to `100`.
     * + 0: mute
     * + 100: original volume. Default value.
     * + 400: Up to 4 times the original volume (with overflow protection)
     * @notes Suppose a remote user A is always within the range of the target user whose playback volume will be adjusted,
     * + If you use both this method and [setRemoteAudioPlaybackVolume](#setremoteaudioplaybackvolume), the volume that the local user hears from user A is the volume set by the method called later.
     * + If you use both this method and [setPlaybackVolume](#setplaybackvolume), the volume that the local user hears from user A is the overlay of both settings.
     */
    /** {zh}
     * @brief 调节某个房间内所有远端用户的音频播放音量。
     * @param volume 音频播放音量和原始音量的比值，范围是 [0, 400]，单位为 %，自带溢出保护。
     * 为保证更好的通话质量，建议将 volume 值设为 [0,100]。
     * + 0: 静音
     * + 100: 原始音量，默认值
     * + 400: 最大可为原始音量的 4 倍(自带溢出保护)
     * @notes 假设某远端用户 A 始终在被调节的目标用户范围内，
     * + 当该方法与 [setRemoteAudioPlaybackVolume](#setremoteaudioplaybackvolume) 共同使用时，本地收听用户 A 的音量为后调用的方法设置的音量；
     * + 当该方法与 [setPlaybackVolume](#setplaybackvolume) 方法共同使用时，本地收听用户 A 的音量将为两次设置的音量效果的叠加。
     */
    setRemoteRoomAudioPlaybackVolume(volume) {
        if (utils_1.isNull(volume)) {
            return utils_1.errorFeedback("setRemoteRoomAudioPlaybackVolume");
        }
        return this.instance.setRemoteRoomAudioPlaybackVolume(volume);
    }
    /** {en}
     * @brief Set the priority of the local audio stream to be published.
     * @param audio_selection_priority The priority of the local audio stream which defaults to be subscribable only up to the result of the Audio Selection.
     * @notes + You must enable Audio Selection in the RTC console before using this API. You can call this API whether the user has joined a room. Refer to [Audio Selection](https://docs.byteplus.com/byteplus-rtc/docs/113547).
     * + The setting is independent in each room that the user joins.
     */
    /** {zh}
     * @brief 设置本端发布流在音频选路中的优先级。
     * @param audio_selection_priority 本端发布流在音频选路中的优先级，默认正常参与音频选路。
     * @notes + 在控制台上为本 appId 开启音频选路后，调用本接口才会生效。进房前后调用均可生效。更多信息参见[音频选路](https://www.volcengine.com/docs/6348/113547)。
     * + 如果本端用户同时加入不同房间，使用本接口进行的设置相互独立。
     */
    setAudioSelectionConfig(audio_selection_priority) {
        if (utils_1.isNull(audio_selection_priority)) {
            return utils_1.errorFeedback("setAudioSelectionConfig");
        }
        return this.instance.setAudioSelectionConfig(audio_selection_priority);
    }
    /** {en}
     * @brief Sets extra information about the room the local user joins.
     * @param key Key of the extra information, less than 10 bytes in length.
     *        A maximum of 5 keys can exist in the same room, beyond which the first key will be replaced.
     * @param value Content of the extra information, less than 128 bytes in length.
     * @return API call result:
     * + 0: Success with a taskId returned.
     * + <0: Failure.  You can find the reason via [onSetRoomExtraInfoResult](85533#rtcroomcallback-onsetroomextrainforesult) callback which informes you the result of the setting after calling this API.
     * @notes
     * + Call [joinRoom](85532#rtcroom-joinroom) first before you call this API to set extra information.
     * + After the extra information is successfully set, other users in the same room will receive the information through [onRoomExtraInfoUpdate](85533#rtcroomcallback-onroomextrainfoupdate) callback.
     * + Users who join the room later will be notified of all extra information in the room set prior to entering.
     */
    /** {zh}
     * @brief 设置/更新房间附加信息，可用于标识房间状态或属性，或灵活实现各种业务逻辑。
     * @param key 房间附加信息键值，长度小于 10 字节。
     *        同一房间内最多可存在 5 个 key，超出则会从第一个 key 起进行替换。
     * @param value 房间附加信息内容，长度小于 128 字节。
     * @return + 0: 方法调用成功，返回本次调用的任务编号；
     * + <0: 方法调用失败。你可以在 [onSetRoomExtraInfoResult](85533#rtcroomcallback-onsetroomextrainforesult) 回调中查看失败原因。调用该方法后，会收到一次上述回调。
     * @notes
     * + 在设置房间附加信息前，必须先调用 [joinRoom](85532#rtcroom-joinroom) 加入房间。
     * + 调用该方法成功设置附加信息后，同一房间内的其他用户会收到关于该信息的回调 [onRoomExtraInfoUpdate](85533#rtcroomcallback-onroomextrainfoupdate)。
     * + 新进房的用户会收到进房前房间内已有的全部附加信息通知。
     */
    setRoomExtraInfo(key, value) {
        if (utils_1.isNull(key) || utils_1.isNull(value)) {
            return utils_1.errorFeedback("setRoomExtraInfo");
        }
        return this.instance.setRoomExtraInfo(key, value);
    }
    /** {en}
     * @hidden currently not available
     * @brief Recognizes or translates the speech of all speakers in the room and converts the results into captions.
     *        After calling this method, you will receive related information about subtitles through the [onSubtitleMessageReceived](85533#onsubtitlemessagereceived) callback.
     *        After calling this method, you will receive the [onSubtitleStateChanged](85533#onsubtitlestatechanged) to inform you of whether subtitles are on.
     * @param subtitle_config Subtitle configurations.
     * @return +  `0`: Success.
     *         + `!0`: Failure.
     * @notes
     *        Call this method after joining the room.
     *        You can set your source language to Chinese by calling `joinRoom`  and importing a json formatted string `"source_language": "zh"` through the parameter of extraInfo, to English by importing `"source_language": "en"` , and to Japanese by importing `"source_language": "ja"` . If you don't set the source language, SDK will set the language of your system as the source language. If the language of your system is not Chinese, English or Japanese, SDK will set Chinese as the source language.
     */
    /** {zh}
     * @brief 识别或翻译房间内所有用户的语音，形成字幕。
     *        语音识别或翻译的结果会通过 [onSubtitleMessageReceived](85533#onsubtitlemessagereceived) 事件回调给你。
     *        调用该方法后，你会收到 [onSubtitleStateChanged](85533#onsubtitlestatechanged) 回调，通知字幕是否开启。
     * @param subtitle_config 字幕配置信息。
     * @return +  `0`: 调用成功。
     *         + `!0`: 调用失败。
     * @notes
     *         此方法需要在进房后调用。
     *         如果想要指定源语言，你需要在进房前调用 `joinRoom` 接口，通过 extraInfo 参数传入 `"source_language": "zh"` JSON 字符串，设置源语言为中文；传入 `"source_language": "en"`JSON 字符串，设置源语言为英文；传入 `"source_language": "ja"` JSON 字符串，设置源语言为日文。如果你未指定源语言，SDK 会将系统语种设定为源语言。如果你的系统语种不是中文、英文和日文，此时 SDK 会自动将中文设为源语言。
     *         调用此方法前，你还需要前往[控制台](https://console.volcengine.com/rtc/cloudRTC?tab=subtitle)，在功能配置页面开启字幕功能。
     */
    startSubtitle(subtitle_config) {
        if (utils_1.isNull(subtitle_config)) {
            return utils_1.errorFeedback("startSubtitle");
        }
        return this.instance.startSubtitle(subtitle_config);
    }
    /** {en}
     * @hidden currently not available
     * @brief Turns off subtitles.
     *        After calling this method, you will receive the [onSubtitleStateChanged](85533#onsubtitlestatechanged) to inform you of whether subtitles are off.
     * @return +  `0`: Success.
     *         + `!0`: Failure.
     */
    /** {zh}
     * @brief 关闭字幕。
     *        调用该方法后，用户会收到 [onSubtitleStateChanged](85533#onsubtitlestatechanged) 回调，通知字幕是否关闭。
     * @return +  `0`: 调用成功。
     *         + `!0`: 调用失败。
     */
    stopSubtitle() {
        return this.instance.stopSubtitle();
    }
    /** {en}
     * @brief Sets the coordinate and orientation of the local user as a listener in the rectangular coordinate system the local user built to achieve expected spatial audio effects.
     * @param position_info  Information on the local user's position.
     * @return + `0`: Success.
     *         + `<0`: Failure.
     *         + `-2`: Failure. The reason is that any two of the 3D coordinate vectors of your position are not perpendicular to each other.
     * @notes
     *        Call this API after joining the room. Before calling this API, you should call [enableSpatialAudio](#enablespatialaudio) first to enable the spatial audio function.
     *        The settings made locally will not influence other users' spatial audio experience.
     */
    /** {zh}
     * @brief  设置本地用户在自建空间直角坐标系中的收听坐标和收听朝向，以实现本地用户预期的空间音频收听效果。
     * @param position_info 空间音频位置信息。
     * @return + `0`：成功。
     *         + `<0`：失败。
     *         + `-2`: 失败，原因是校验本地用户的三维朝向信息时，三个向量没有两两垂直。
     * @notes
     *        该方法需在进房后调用。调用该接口更新坐标前，你需调用 [enableSpatialAudio](#enablespatialaudio) 开启空间音频功能。空间音频相关 API 和调用时序详见[空间音频](https://www.volcengine.com/docs/6348/93903)。
     *        调用此接口在本地进行的设定对其他用户的空间音频收听效果不会产生任何影响。
     */
    updateSelfPosition(position_info) {
        if (utils_1.isNull(position_info)) {
            return utils_1.errorFeedback("updateSelfPosition");
        }
        return this.instance.updateSelfPosition(position_info);
    }
    /** {en}
     * @brief Sets the coordinate and orientation of the remote user as a speaker in the rectangular coordinate system of the local user. In this case, the local user hears from the remote user with the expected spatial audio effects.
     * @param uid User ID
     * @param position_info Information on the remote user's position.
     * @return + `0`: Success.
     *         + `<0`: Failure.
     *         + `-2`: Failure. The reason is that any two of the 3D coordinate vectors of the position of the remote user are not perpendicular to each other.
     * @notes
     *        Call this API after creating the room.
     *        The settings made locally will not influence other users' spatial audio experience.
     */
    /** {zh}
     * @brief 设置房间内某一远端用户在本地用户自建的空间音频坐标系中的发声位置和发声朝向，以实现本地用户预期的空间音频收听效果。
     * @param uid 用户 ID
     * @param position_info 远端用户的空间音频位置信息。
     * @return + `0`：成功。
     *         + `<0`：失败。
     *         + `-2`: 失败，原因是校验远端用户的三维朝向信息时，三个向量没有两两垂直。
     * @notes
     *        该方法需在创建房间后调用。
     *        调用此接口在本地进行的设定对其他用户的空间音频收听效果不会产生任何影响。
     */
    updateRemotePosition(uid, position_info) {
        if (utils_1.isNull(uid) || utils_1.isNull(position_info)) {
            return utils_1.errorFeedback("updateRemotePosition");
        }
        return this.instance.updateRemotePosition(uid, position_info);
    }
    /** {en}
     * @brief Disables all spatial audio effects set by calling [updateRemotePosition](85532#updateremoteposition) for a certain remote user.
     * @param uid User ID of the remote user.
     * @return + `0`: Success.
     *         + `<0`: Failure.
     */
    /** {zh}
     * @brief 移除调用 [updateRemotePosition](85532#updateremoteposition) 为某一远端用户设置的空间音频效果。
     * @param uid 远端用户 ID。
     * @return + `0`：成功。
     *         + `<0`：失败。
     */
    removeRemotePosition(uid) {
        if (utils_1.isNull(uid)) {
            return utils_1.errorFeedback("removeRemotePosition");
        }
        return this.instance.removeRemotePosition(uid);
    }
    /** {en}
     * @brief Disables all spatial audio effects set by calling [updateRemotePosition](85532#updateremoteposition) for all remote users.
     * @return + `0`: Success.
     *         + `<0`: Failure.
     */
    /** {zh}
     * @brief 移除调用 [updateRemotePosition](85532#updateremoteposition) 为所有远端用户设置的空间音频效果。
     * @return + `0`：成功。
     *         + `<0`：失败。
     */
    removeAllRemotePosition() {
        return this.instance.removeAllRemotePosition();
    }
    /**
     * @private
     */
    fire(event, ...args) {
        setImmediate(() => {
            this.emit(event, ...args);
        });
    }
    /** {en}
     * @brief Turn off the effect of the orientation of the local user as the sound source.
     *        After the effect is off, all the other users in the room listen to the local user as if the local user is in right front of each of them.
     * @notes + After the orientation effect as the sound source is disabled, you cannot enable it during the lifetime of the `SpatialAudio` instance.
     * + Calling this API does not affect the orientation effect of the local user as a listener. See [updateSelfOrientation](#updateselforientation) and [updateListenerOrientation](#updateListenerOrientation).
     */
    /** {zh}
     * @brief 关闭本地用户朝向对本地用户发声效果的影响。
     *        调用此接口后，房间内的其他用户收听本地发声时，声源都在收听者正面。
     * @notes + 调用本接口关闭朝向功能后，在当前的空间音频实例的生命周期内无法再次开启。
     * + 调用此接口不影响本地用户收听朝向的音频效果。要改变本地用户收听朝向，参看 [updateSelfOrientation](#updateselforientation) 和 [updateListenerOrientation](#updateListenerOrientation)。
     */
    removeRemoteUser(userId) {
        let user = this.remoteUsers.get(userId);
        if (user) {
            user.videoRender && user.videoRender.destroy();
            user.screenRender && user.screenRender.destroy();
            user.screenRender = null;
            user.videoRender = null;
            this.remoteUsers.delete(userId);
        }
    }
    //************************************** api end
    //--------------------------------------- callback start
    /**
     * @hidden
     */
    //离开房间的回调中删除视图
    onLeaveRoom() {
        var _a, _b;
        (_a = this.localUser.videoRender) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = this.localUser.screenRender) === null || _b === void 0 ? void 0 : _b.destroy();
        this.localUser.screenRender = null;
        this.localUser.videoRender = null;
        this.remoteUsers.forEach((userInfo, userId) => {
            this.removeRemoteUser(userId);
        });
        data_1.default.delete(this.roomId);
    }
    /**
     * @hidden
     */
    onUserJoined(userId) {
        this.removeRemoteUser(userId);
        const newUser = { userId };
        this.remoteUsers.set(userId, newUser);
    }
    /**
     * @hidden
     */
    //远端用户离开房间时删除其视图
    onUserLeave(userId) {
        this.removeRemoteUser(userId);
    }
    /**
     * @hidden
     */
    cbRoom(event) {
        this.processCallback(event);
    }
    /**
     * @hidden
     */
    processCallback(event) {
        const { Type: type, Object: data } = event;
        switch (type) {
            case "onRoomStateChanged":
                {
                    const { room_id, uid, state, extra_info } = data;
                    this.fire(type, room_id, uid, state, extra_info);
                }
                break;
            case "onStreamStateChanged":
                {
                    const { room_id, uid, state, extra_info } = data;
                    this.fire(type, room_id, uid, state, extra_info);
                }
                break;
            case "onLeaveRoom":
                {
                    this.onLeaveRoom();
                    this.fire(type, data);
                }
                break;
            case "onUserJoined":
                {
                    const { user_info, elapsed } = data;
                    this.onUserJoined(user_info.uid);
                    this.fire(type, user_info, elapsed);
                }
                break;
            case "onUserLeave":
                {
                    const { uid, reason } = data;
                    this.onUserLeave(uid);
                    this.fire(type, uid, reason);
                }
                break;
            case "onTokenWillExpire":
                {
                    this.fire(type);
                }
                break;
            case "onAVSyncStateChange":
                {
                    const { state } = data;
                    this.fire(type, state);
                }
                break;
            case "onRoomStats":
                {
                    this.fire(type, data);
                }
                break;
            case "onLocalStreamStats":
                {
                    this.fire(type, data);
                }
                break;
            case "onRemoteStreamStats":
                {
                    this.fire(type, data);
                }
                break;
            case "onUserPublishStream":
                {
                    const { uid, type: mediaStreamType } = data;
                    this.fire(type, uid, mediaStreamType);
                }
                break;
            case "onUserUnpublishStream":
                {
                    const { uid, type: mediaStreamType, reason } = data;
                    this.fire(type, uid, mediaStreamType, reason);
                }
                break;
            case "onUserPublishScreen":
                {
                    const { uid, type: mediaStreamType } = data;
                    this.fire(type, uid, mediaStreamType);
                }
                break;
            case "onUserUnpublishScreen":
                {
                    const { uid, type: mediaStreamType, reason } = data;
                    this.fire(type, uid, mediaStreamType, reason);
                }
                break;
            case "onStreamSubscribed":
                {
                    const { state_code, user_id, info } = data;
                    this.fire(type, state_code, user_id, info);
                }
                break;
            case "onVideoStreamBanned":
                {
                    const { uid, banned } = data;
                    this.fire(type, uid, banned);
                }
                break;
            case "onAudioStreamBanned":
                {
                    const { uid, banned } = data;
                    this.fire(type, uid, banned);
                }
                break;
            case "onRoomMessageReceived":
                {
                    const { uid, message } = data;
                    this.fire(type, uid, message);
                }
                break;
            case "onRoomBinaryMessageReceived":
                {
                    const { uid, message } = data;
                    this.fire(type, uid, message);
                }
                break;
            case "onUserMessageReceived":
                {
                    const { uid, message } = data;
                    this.fire(type, uid, message);
                }
                break;
            case "onUserBinaryMessageReceived":
                {
                    const { uid, message } = data;
                    this.fire(type, uid, message);
                }
                break;
            case "onUserMessageSendResult":
                {
                    const { msgid, error } = data;
                    this.fire(type, msgid, error);
                }
                break;
            case "onRoomMessageSendResult":
                {
                    const { msgid, error } = data;
                    this.fire(type, msgid, error);
                }
                break;
            case "onForwardStreamStateChanged":
                {
                    const { infos, info_count } = data;
                    this.fire(type, infos, info_count);
                }
                break;
            case "onForwardStreamEvent": {
                const { infos, info_count } = data;
                this.fire(type, infos, info_count);
            }
            // case "onRangeAudioInfo": {
            //   const { range_audio_info, len } = data;
            //   this.fire(type, range_audio_info, len);
            // }
            case "onNetworkQuality":
                {
                    const { localQuality, remoteQualities } = data;
                    this.fire(type, localQuality, remoteQualities);
                }
                break;
            case "onPublishPrivilegeTokenWillExpire":
                {
                    this.fire(type);
                }
                break;
            case "onSubscribePrivilegeTokenWillExpire":
                {
                    this.fire(type);
                }
                break;
            case "onSetRoomExtraInfoResult":
                {
                    const { task_id, error_code } = data;
                    this.fire(type, task_id, error_code);
                }
                break;
            case "onRoomExtraInfoUpdate":
                {
                    const { key, value, last_update_user_id, last_update_time_ms } = data;
                    this.fire(type, key, value, last_update_user_id, last_update_time_ms);
                }
                break;
            case "onSubtitleStateChanged":
                {
                    const { state, error_code, error_message } = data;
                    this.fire(type, state, error_code, error_message);
                }
                break;
            case "onSubtitleMessageReceived":
                {
                    const { subtitles } = data;
                    this.fire(type, subtitles);
                }
                break;
            // 354
            case "onUserVisibilityChanged":
                {
                    const { current_user_visibility, error_code } = data;
                    this.fire(type, current_user_visibility, error_code);
                }
                break;
            default:
                {
                }
                break;
        }
    }
}
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "getRoomId", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "joinRoom", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "leaveRoom", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "setUserVisibility", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "setMultiDeviceAVSync", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "updateToken", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "setRemoteVideoConfig", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "publishStream", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "unpublishStream", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "publishScreen", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "unpublishScreen", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "subscribeStream", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "unsubscribeStream", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "subscribeAllStreams", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "unsubscribeAllStreams", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "subscribeScreen", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "unsubscribeScreen", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "pauseAllSubscribedStream", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "resumeAllSubscribedStream", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "sendUserMessage", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "sendUserBinaryMessage", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "sendRoomMessage", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "sendRoomBinaryMessage", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "startForwardStreamToRooms", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "updateForwardStreamToRooms", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "stopForwardStreamToRooms", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "pauseForwardStreamToAllRooms", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "resumeForwardStreamToAllRooms", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "enableRangeAudio", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "updateReceiveRange", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "updateRangePosition", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "setAttenuationModel", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "setNoAttenuationFlags", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "enableSpatialAudio", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "updateSpatialPosition", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "updateSelfOrientation", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "disableRemoteOrientation", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "updateListenerPosition", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "updateListenerOrientation", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "setRemoteRoomAudioPlaybackVolume", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "setAudioSelectionConfig", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "setRoomExtraInfo", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "startSubtitle", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "stopSubtitle", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "updateSelfPosition", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "updateRemotePosition", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "removeRemotePosition", null);
__decorate([
    checkRoomInstance
], RTCRoom.prototype, "removeAllRemotePosition", null);
exports.default = RTCRoom;
//# sourceMappingURL=room.js.map