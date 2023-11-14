"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const utils_1 = require("../utils");
const types_1 = require("../types");
const data_1 = require("../data");
const NativeSDK = require("../../build/Release/electron-sdk.node");
function checkInit(target, propertyName, projectDescriptor) {
    const method = projectDescriptor.value;
    projectDescriptor.value = function (...args) {
        let result = 0;
        try {
            if (!this.instance) {
                throw "AudioEffectPlayer instance is null";
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
class RTCMediaPlayer extends events_1.EventEmitter {
    constructor(player_id) {
        super();
        this.instance = null;
        this.instance = new NativeSDK.veRTCMediaPlayer(player_id, this.callback.bind(this));
        data_1.createdMediaPlayer.set(player_id, this);
    }
    /** {en}
     * @brief Open the audio file.
     *        You can only open one audio file with one player instance at the same time. For multiple audio files at the same time, create multiple player instances.
     * @param file_path Audio file paths.
     *        URL of online file, URI of local file, or full path to local file. For URL of online file, only the https protocol is supported.
     *        Recommended sample rate for audio eccect files: 8KHz、16KHz、22.05KHz、44.1KHz、48KHz.
     *        Local audio effect file formats supported by different platforms:
     *        <table>
     *           <tr><th></th><th>mp3</th><th>mp4</th><th>aac</th><th>m4a</th><th>3gp</th><th>wav</th><th>ogg</th><th>ts</th><th>wma</th></tr>
     *           <tr><td>Android</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td></td></tr>
     *           <tr><td>iOS/macOS</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td></td><td></td></tr>
     *           <tr><td>Windows</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td>Y</td><td>Y</td></tr>
     *        </table>
     *        Online audio effect file formats supported by different platforms.
     *        <table>
     *           <tr><th></th><th>mp3</th><th>mp4</th><th>aac</th><th>m4a</th><th>3gp</th><th>wav</th><th>ogg</th><th>ts</th><th>wma</th></tr>
     *           <tr><td>Android</td><td>Y</td><td></td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td></td><td></td></tr>
     *           <tr><td>iOS/macOS</td><td>Y</td><td></td><td>Y</td><td>Y</td><td></td><td>Y</td><td></td><td></td><td></td></tr>
     *           <tr><td>Windows</td><td>Y</td><td></td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td>Y</td><td>Y</td></tr>
     *        </table>
     * @param config
     * @returns + 0: Success
     * + < 0: Failure.
     */
    /** {zh}
     * @brief 打开音乐文件。
     *        一个播放器实例仅能够同时打开一个音乐文件。如果需要同时打开多个音乐文件，请创建多个音乐播放器实例。
     * @param file_path 音乐文件路径。
     *        支持在线文件的 URL、本地文件的 URI、或本地文件的绝对路径。对于在线文件的 URL，仅支持 https 协议。
     *        推荐的采样率：8KHz、16KHz、22.05KHz、44.1KHz、48KHz。
     *        不同平台支持的本地文件格式:
     *        <table>
     *           <tr><th></th><th>mp3</th><th>mp4</th><th>aac</th><th>m4a</th><th>3gp</th><th>wav</th><th>ogg</th><th>ts</th><th>wma</th></tr>
     *           <tr><td>Android</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td></td></tr>
     *           <tr><td>iOS/macOS</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td></td><td></td></tr>
     *           <tr><td>Windows</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td>Y</td><td>Y</td></tr>
     *        </table>
     *        不同平台支持的在线文件格式:
     *        <table>
     *           <tr><th></th><th>mp3</th><th>mp4</th><th>aac</th><th>m4a</th><th>3gp</th><th>wav</th><th>ogg</th><th>ts</th><th>wma</th></tr>
     *           <tr><td>Android</td><td>Y</td><td></td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td></td><td></td></tr>
     *           <tr><td>iOS/macOS</td><td>Y</td><td></td><td>Y</td><td>Y</td><td></td><td>Y</td><td></td><td></td><td></td></tr>
     *           <tr><td>Windows</td><td>Y</td><td></td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td>Y</td><td>Y</td></tr>
     *        </table>
     * @param config
     * @return + `0`: 成功
     * + `-1`: 失败
     */
    open(file_path, config) {
        if (utils_1.isNull(file_path) || utils_1.isNull(config)) {
            return utils_1.errorFeedback("RTCMediaPlayerOpen");
        }
        const defaultConfig = {
            play_count: 1,
            start_pos: 0,
            callback_on_progress_interval: "0",
            sync_progress_to_record_frame: false,
            auto_play: true,
            type: types_1.AudioMixingType.kAudioMixingTypePlayoutAndPublish,
        };
        const res = this.instance.open(file_path, {
            ...defaultConfig,
            ...config,
        });
        return res;
    }
    /** {en}
     * @brief Start playing the audio. Call this API when you call [open](85532#rtcmediaplayer-open) and set `AutoPlay=False`.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes After calling this API, call [stop](85532#rtcmediaplayer-stop) to stop playing the audio file.
     */
    /** {zh}
     * @brief 播放音乐。你仅需要在调用 [open](85532#rtcmediaplayer-open)，且未开启自动播放时，调用此方法。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes 调用本方法播放音频文件后，可调用 [stop](85532#rtcmediaplayer-stop) 方法暂停播放。
     */
    start() {
        const res = this.instance.start();
        return res;
    }
    /** {en}
     * @brief After calling [open](85532#rtcmediaplayer-open) or [start](85532#rtcmediaplayer-start) to start audio mixing, call this method to stop audio mixing.
     * @returns + 0: Success
     * + < 0: Failure.
     */
    /** {zh}
     * @brief 调用 [open](85532#rtcmediaplayer-open) 或 [start](85532#rtcmediaplayer-start) 开始播放后，可以调用本方法停止。
     * @return + `0`: 成功
     * + `-1`: 失败
     */
    stop() {
        const res = this.instance.stop();
        return res;
    }
    /** {en}
     * @brief After calling [open](85532#rtcmediaplayer-open), or [start](85532#rtcmediaplayer-start) to start audio mixing, call this API to pause audio mixing.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes After calling this API to pause audio mixing, call [resume](85532#rtcmediaplayer-resume) to resume audio mixing.
     */
    /** {zh}
     * @brief 调用 [open](85532#rtcmediaplayer-open)，或 [start](85532#rtcmediaplayer-start) 开始播放音频文件后，调用本方法暂停播放。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes 调用本方法暂停播放后，可调用 [resume](85532#rtcmediaplayer-resume) 恢复播放。
     */
    pause() {
        const res = this.instance.pause();
        return res;
    }
    /** {en}
     * @brief After calling [pause](85532#rtcmediaplayer-pause) to pause audio mixing, call this API to resume audio mixing.
     * @returns + 0: Success
     * + < 0: Failure.
     */
    /** {zh}
     * @brief 调用 [pause](85532#rtcmediaplayer-pause) 暂停音频播放后，调用本方法恢复播放。
     * @return + `0`: 成功
     * + `-1`: 失败
     */
    resume() {
        const res = this.instance.resume();
        return res;
    }
    /** {en}
     * @brief Adjusts the volume of the specified audio mixing, including media file mixing and PCM mixing.
     * @param volume The ratio of the volume to the original volume in % with overflow protection. The range is `[0, 400]` and the recommended range is `[0, 100]`.
     * @param type
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes Call this API only when audio is mixing.
     */
    /** {zh}
     * @brief 调节指定混音的音量大小，包括音乐文件混音和 PCM 混音。
     * @param volume 播放音量相对原音量的比值。单位为 %。范围为 `[0, 400]`，建议范围是 `[0, 100]`。带溢出保护。
     * @param type
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes 仅在音频播放进行状态时，调用此方法。
     */
    setVolume(volume, type) {
        if (utils_1.isNull(volume) || utils_1.isNull(type)) {
            return utils_1.errorFeedback("RTCMediaPlayerSetVolume");
        }
        const res = this.instance.setVolume(volume, type);
        return res;
    }
    /** {en}
     * @brief Gets the current volume.
     * @param type
     * @return + >0: Success, the current volume.
     * + < 0: Failed.
     * @notes Call this API only when audio is mixing, including media file mixing and PCM mixing.
     */
    /** {zh}
     * @brief 获取当前音量
     * @param type
     * @return + >0: 成功, 当前音量值。
     * + < 0: 失败
     * @notes 仅在音频播放进行状态时，调用此方法。包括音乐文件混音和 PCM 混音。
     */
    getVolume(type) {
        if (utils_1.isNull(type)) {
            return utils_1.errorFeedback("RTCMediaPlayerGetVolume");
        }
        const res = this.instance.getVolume(type);
        return res;
    }
    /** {en}
     * @brief Gets the duration of the media file.
     * @return + >0: Success, the duration of the media file in milliseconds.
     * + < 0: Failed.
     * @notes + Call this API only when audio is mixing.
     * + The API is valid for audio file, not PCM data.
     */
    /** {zh}
     * @brief 获取音乐文件时长。
     * @return + >0: 成功, 音乐文件时长，单位为毫秒。
     * + < 0: 失败
     * @notes + 仅在音频播放进行状态时，调用此方法。
     * + 此接口仅支持音频文件，不支持 PCM 数据。
     */
    getTotalDuration() {
        const res = this.instance.getTotalDuration();
        return res;
    }
    /** {en}
     * @brief Gets the actual playback duration of the mixed media file, in milliseconds.
     * @return + >0: Success, the actual playback time.
     * + < 0: Failed.
     * @notes
     * + The actual playback time refers to the playback time of the song without being affected by stop, jump, double speed, and freeze. For example, if the song stops playing for 30 seconds at 1:30 or skips to 2:00, and then continues to play normally for 2 minutes, the actual playing time is 3 minutes and 30 seconds.
     * + Call this API only when audio is mixing.
     * + The API is valid for audio file, not PCM data.
     */
    /** {zh}
     * @brief 获取混音音乐文件的实际播放时长，单位为毫秒。
     * @return + >0: 实际播放时长。
     * + < 0: 失败。
     * @notes
     * + 实际播放时长指的是歌曲不受停止、跳转、倍速、卡顿影响的播放时长。例如，若歌曲正常播放到 1:30 时停止播放 30s 或跳转进度到 2:00, 随后继续正常播放 2分钟，则实际播放时长为 3分30秒。
     * + 仅在音频播放进行状态时，调用此方法。
     * + 此接口仅支持音频文件，不支持 PCM 数据。
     */
    getPlaybackDuration() {
        const res = this.instance.getPlaybackDuration();
        return res;
    }
    /** {en}
     * @brief Gets the playback progress of the media file.
     * @return + >0: Success, the playback progress of media file in ms.
     * + < 0: Failed.
     * @notes + Call this API only when audio is mixing.
     * + The API is valid for audio file, not PCM data.
     */
    /** {zh}
     * @brief 获取音乐文件播放进度。
     * @return + >0: 成功, 音乐文件播放进度，单位为毫秒。
     * + < 0: 失败
     * @notes + 仅在音频播放进行状态时，调用此方法。
     * + 此接口仅支持音频文件，不支持 PCM 数据。
     */
    getPosition() {
        const res = this.instance.getPosition();
        return res;
    }
    /** {en}
     * @brief Sets the starting playback position of the media file.
     * @param position The starting position of the media file in milliseconds.
     *        You can get the total duration of the media file through [getTotalDuration](85532#rtcmediaplayer-gettotalduration). The value of position should be less than the total duration of the media file.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes When playing online files, calling this API may cause playback delay.
     */
    /** {zh}
     * @brief 设置音乐文件的起始播放位置。
     * @param position 音乐文件起始播放位置，单位为毫秒。
     *        你可以通过 [getTotalDuration](85532#rtcmediaplayer-gettotalduration) 获取音乐文件总时长，position 的值应小于音乐文件总时长。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes 在播放在线文件时，调用此接口可能造成播放延迟的现象。
     */
    setPosition(position) {
        if (utils_1.isNull(position)) {
            return utils_1.errorFeedback("RTCMediaPlayerSetPosition");
        }
        const res = this.instance.setPosition(position);
        return res;
    }
    /** {en}
     * @brief Set the pitch of the local audio file mixing. Usually used in karaoke scenes.
     * @param pitch The increase or decrease value compared with the original pitch of the music file. The range is `[-12, 12]`. The default value is 0. The pitch distance between two adjacent values is half a step. A positive value indicates a rising pitch, and a negative value indicates a falling pitch.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + Call this API only when audio is mixing.
     * + Support audio file and PCM data.
     */
    /** {zh}
     * @brief 开启变调功能，多用于 K 歌场景。
     * @param pitch 与音乐文件原始音调相比的升高/降低值，取值范围为 `[-12，12]`，默认值为 0。每相邻两个值的音高距离相差半音，正值表示升调，负值表示降调。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 仅在音频播放进行状态时，调用此方法。
     * + 支持音乐文件混音和 PCM 混音。
     */
    setAudioPitch(pitch) {
        if (utils_1.isNull(pitch)) {
            return utils_1.errorFeedback("RTCMediaPlayerSetAudioPitch");
        }
        const res = this.instance.setAudioPitch(pitch);
        return res;
    }
    /** {en}
       * @brief Sets the channel mode of the mixing of the media file.
       * @param mode The mode of channel. The default channel mode is the same as the source file.
     * @returns + 0: Success
     * + < 0: Failure.
       * @notes
       *       + Call this API only when audio is mixing.
       *       + Audio file is supported, but not PCM data.
     */
    /** {zh}
       * @brief 设置当前音乐文件的声道模式
       * @param mode 声道模式。默认的声道模式和源文件一致
     * @return + `0`: 成功
     * + `-1`: 失败
       * @notes + 仅在音频播放进行状态时，调用此方法。
       * + 仅支持音频文件，不支持 PCM 数据。
     */
    setAudioDualMonoMode(mode) {
        if (utils_1.isNull(mode)) {
            return utils_1.errorFeedback("RTCMediaPlayerSetAudioDualMonoMode");
        }
        const res = this.instance.setAudioDualMonoMode(mode);
        return res;
    }
    /** {en}
       * @brief Gets the track count of the current media file.
       * @return + >= 0：Success. Return the track count of the current media file.
       *         + < 0：Failed.
       * @notes
       *       + Call this API only when audio is mixing.
       *       + This API is valid for audio file, not PCM data.
     */
    /** {zh}
       * @brief 获取当前音乐文件的音轨数
       * @return + >= 0：成功，返回当前音乐文件的音轨数
       *         + < 0：方法调用失败
       * @notes + 仅在音频播放进行状态时，调用此方法。
       * + 此方法仅支持音乐文件，不支持 PCM 数据。
     */
    getAudioTrackCount() {
        const res = this.instance.getAudioTrackCount();
        return res;
    }
    /** {en}
       * @brief Specifies the playback track of the current media file.
       * @param index The specified playback audio track, starting from 0, and the range is `[0, getAudioTrackCount()-1]`. The value must be less than the return value of [getAudioTrackCount](85532#rtcmediaplayer-getaudiotrackcount).
     * @returns + 0: Success
     * + < 0: Failure.
       * @notes
       *       + Call this API only when audio is mixing.
       *       + This API is valid for audio file, not PCM data.
     */
    /** {zh}
       * @brief 指定当前音乐文件的播放音轨
       * @param index 指定的播放音轨，从 0 开始，取值范围为 `[0, getAudioTrackCount()-1]`。
       *        设置的参数值需要小于 [getAudioTrackCount](85532#rtcmediaplayer-getaudiotrackcount) 的返回值
     * @return + `0`: 成功
     * + `-1`: 失败
       * @notes + 仅在音频播放进行状态时，调用此方法。
       * + 此方法仅支持音乐文件，不支持 PCM 数据。
     */
    selectAudioTrack(index) {
        if (utils_1.isNull(index)) {
            return utils_1.errorFeedback("RTCMediaPlayerSelectAudioTrack");
        }
        const res = this.instance.selectAudioTrack(index);
        return res;
    }
    /** {en}
       * @brief Set the playback speed of the audio file.
       * @param speed The ratio of the actual playback speed than that of the original speed of the audio file in %. The range is `[50,200]`. The default value is 100.
     * @returns + 0: Success
     * + < 0: Failure.
       * @notes
       *       + Call this API only when audio is mixing.
       *       + The API is valid for audio file and PCM data.
     */
    /** {zh}
       * @brief 设置播放速度
       * @param speed 播放速度与原始文件速度的比例，单位：%，取值范围为 `[50,200]`，默认值为 100。
     * @return + `0`: 成功
     * + `-1`: 失败
       * @notes + 仅在音频播放进行状态时，调用此方法。
       * + 此方法对音频文件和音频裸数据播放都可用。
     */
    setPlaybackSpeed(speed) {
        if (utils_1.isNull(speed)) {
            return utils_1.errorFeedback("RTCMediaPlayerSetPlaybackSpeed");
        }
        const res = this.instance.setPlaybackSpeed(speed);
        return res;
    }
    /** {en}
     * @brief Set the interval of the periodic callback [onMediaPlayerPlayingProgress](85533#rtcmediaplayercallback-onmediaplayerplayingprogress) during audio mixing.
     * @param interval interval in ms.
     *       + interval > 0: The callback is enabled. The actual interval is `10*(mod(10)+1)`.
     *       + interval <= 0: The callback is disabled.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes
     *       + Call this API only when audio is mixing.
     *       + This API is valid for audio file, not PCM data.
     */
    /** {zh}
     * @brief 设置音频文件混音时，收到 [onMediaPlayerPlayingProgress](85533#rtcmediaplayercallback-onmediaplayerplayingprogress) 的间隔。
     * @param interval 时间间隔，单位毫秒。
     *       + interval > 0 时，触发回调。实际间隔是 `10*(mod(10)+1)`。
     *       + interval <= 0 时，不会触发回调。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 仅在音频播放进行状态时，调用此方法。
     * + 此方法仅支持音频文件，不支持 PCM 数据。
     */
    setProgressInterval(interval) {
        if (utils_1.isNull(interval)) {
            return utils_1.errorFeedback("RTCMediaPlayerSetProgressInterval");
        }
        const res = this.instance.setProgressInterval(interval);
        return res;
    }
    /** {en}
     * @brief To call enableVocalInstrumentBalance{@link #IRTCVideo#enableVocalInstrumentBalance} to adjust the volume of the mixed media file or the PCM audio data, you must pass in its original loudness through this API.
     * @param loudness Original loudness in lufs. The range is `[-70.0, 0.0]`.
     *       When the value is less than -70.0lufs, it will be adjusted to -70.0lufs by default, and if it is more than 0.0lufs, the loudness will not be equalized. The default value is 1.0lufs, which means no processing.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes
     *       + Call this API only when audio is mixing.
     *       + The API is valid for audio file and PCM data.
     */
    /** {zh}
     * @brief 如果你需要使用 enableVocalInstrumentBalance{@link #IRTCVideo#enableVocalInstrumentBalance} 对音频文件/PCM 音频数据设置音量均衡，你必须通过此接口传入其原始响度。
     * @param loudness 原始响度，单位：lufs，取值范围为 `[-70.0, 0.0]`。
     *        当设置的值小于 -70.0lufs 时，则默认调整为 -70.0lufs，大于 0.0lufs 时，则不对该响度做音量均衡处理。默认值为 1.0lufs，即不做处理。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 仅在音频播放进行状态时，调用此方法。
     * + 此方法对音频文件和音频裸数据播放都可用。
     */
    setLoudness(loudness) {
        if (utils_1.isNull(loudness)) {
            return utils_1.errorFeedback("RTCMediaPlayerSetLoudness");
        }
        const res = this.instance.setLoudness(loudness);
        return res;
    }
    /** {en}
     * @brief Register an observer to receive related callbacks when the local media file is mixing.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes
     */
    /** {zh}
     * @brief 注册回调句柄以在本地音乐文件混音时，收到相关回调。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes 触发回调 [onMediaPlayerStateChanged](85533#rtcmediaplayercallback-onmediaplayerstatechanged) 和 [onMediaPlayerPlayingProgress](85533#rtcmediaplayercallback-onmediaplayerplayingprogress)。
     */
    setEventHandler() {
        const res = this.instance.setEventHandler();
        return res;
    }
    /**
     * @private
     */
    fire(event, ...args) {
        setImmediate(() => {
            this.emit(event, ...args);
        });
    }
    /**
     * @hidden
     */
    callback(event) {
        this.processCallback(event);
    }
    /**
     * @hidden
     */
    processCallback(event) {
        const { Type: type, Object: data } = event;
        switch (type) {
            case "onMediaPlayerStateChanged":
                {
                    const { player_id, state, error } = data;
                    this.fire(type, player_id, state, error);
                }
                break;
            case "onMediaPlayerPlayingProgress":
                {
                    const { player_id, progress } = data;
                    this.fire(type, player_id, progress);
                }
                break;
            default:
                break;
        }
    }
}
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "open", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "start", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "stop", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "pause", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "resume", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "setVolume", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "getVolume", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "getTotalDuration", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "getPlaybackDuration", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "getPosition", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "setPosition", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "setAudioPitch", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "setAudioDualMonoMode", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "getAudioTrackCount", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "selectAudioTrack", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "setPlaybackSpeed", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "setProgressInterval", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "setLoudness", null);
__decorate([
    checkInit
], RTCMediaPlayer.prototype, "setEventHandler", null);
exports.default = RTCMediaPlayer;
//# sourceMappingURL=media_player.js.map