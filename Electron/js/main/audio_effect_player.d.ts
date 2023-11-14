/// <reference types="node" />
import { EventEmitter } from "events";
import { EventType, RTCAUDIOEFFECTPLAYERCALLBACK } from "../types/common";
import { AudioEffectPlayerConfig } from "../types";
/** {en}
 * @list 85530
 * @detail 85532
 */
/** {zh}
 * @list 85530
 * @detail 85532
 */
declare class RTCAudioEffectPlayer extends EventEmitter {
    private instance;
    constructor();
    /** {en}
     * @brief Starts to play the audio effect file.
     *        This API can be called multiple times with different IDs and filepaths for multiple effects at the same time.
     * @param effect_id Audio effect ID. Used for identifying the audio effect, please ensure that the audio effect ID is unique.
     *        If this API is called repeatedly with the same ID, the previous effect will stop and the next effect will start, and you'll receive [onAudioEffectPlayerStateChanged](85533#rtcaudioeffectplayercallback-onaudioeffectplayerstatechanged).
     * @param file_path Audio effect file paths.
     *        URL of online file, URI of local file, or full path to the local file are supported. For URL of online file, only the https protocol is supported.
     *        Recommended sample rate for audio effect files: 8KHz、16KHz、22.05KHz、44.1KHz、48KHz.
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
     * @param config Effect config
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + If the file has been loaded into memory via [preload](85532#rtcaudioeffectplayer-preload), make sure that the ID here is the same as the ID set by [preload](85532#rtcaudioeffectplayer-preload).
     * + After starting to play an audio effect file, you can call the [stop](85532#rtcaudioeffectplayer-stop) API to stop playing the audio effect file.
     */
    /** {zh}
     * @brief 开始播放音效文件。
     *        可以通过传入不同的 ID 和 filepath 多次调用本方法，以实现同时播放多个音效文件，实现音效叠加。
     * @param effect_id 音效 ID。用于标识音效，请保证音效 ID 唯一性。
     *        如果使用相同的 ID 重复调用本方法后，上一个音效会停止，下一个音效开始，并收到 [onAudioEffectPlayerStateChanged](85533#rtcaudioeffectplayercallback-onaudioeffectplayerstatechanged)。
     * @param file_path 音效文件路径。
     *        支持在线文件的 URL、本地文件的 URI、或本地文件的绝对路径。对于在线文件的 URL，仅支持 https 协议。
     *        推荐的音效文件采样率：8KHz、16KHz、22.05KHz、44.1KHz、48KHz。
     *        不同平台支持的本地音效文件格式:
     *        <table>
     *           <tr><th></th><th>mp3</th><th>mp4</th><th>aac</th><th>m4a</th><th>3gp</th><th>wav</th><th>ogg</th><th>ts</th><th>wma</th></tr>
     *           <tr><td>Android</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td></td></tr>
     *           <tr><td>iOS/macOS</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td></td><td></td></tr>
     *           <tr><td>Windows</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td>Y</td><td>Y</td></tr>
     *        </table>
     *        不同平台支持的在线音效文件格式:
     *        <table>
     *           <tr><th></th><th>mp3</th><th>mp4</th><th>aac</th><th>m4a</th><th>3gp</th><th>wav</th><th>ogg</th><th>ts</th><th>wma</th></tr>
     *           <tr><td>Android</td><td>Y</td><td></td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td></td><td></td></tr>
     *           <tr><td>iOS/macOS</td><td>Y</td><td></td><td>Y</td><td>Y</td><td></td><td>Y</td><td></td><td></td><td></td></tr>
     *           <tr><td>Windows</td><td>Y</td><td></td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td></td><td>Y</td><td>Y</td></tr>
     *        </table>
     * @param config 音效配置
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 如果已经通过 [preload](85532#rtcaudioeffectplayer-preload) 将文件加载至内存，确保此处的 ID 与 [preload](85532#rtcaudioeffectplayer-preload) 设置的 ID 相同。
     * + 开始播放音效文件后，可以调用 [stop](85532#rtcaudioeffectplayer-stop) 方法停止播放音效文件。
     */
    start(effect_id: number, file_path: string, config: AudioEffectPlayerConfig): number;
    /** {en}
     * @brief Stops the playback of audio effect files.
     * @param effect_id Audio effect ID
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + After calling the [start](85532#rtcaudioeffectplayer-start) API to start playing the audio effect file, you can call this API to stop playing the audio effect file.
     * + After calling this API to stop playing an audio effect file, the audio effect file will be unloaded automatically.
     */
    /** {zh}
     * @brief 停止播放音效文件。
     * @param effect_id 音效 ID
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 调用 [start](85532#rtcaudioeffectplayer-start) 方法开始播放音效文件后，可以调用本方法停止播放音效文件。
     * + 调用本方法停止播放音效文件后，该音效文件会被自动卸载。
     */
    stop(effect_id: number): number;
    /** {en}
     * @brief Stops playback of all audio effect files.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + After calling [start](85532#rtcaudioeffectplayer-start) to start playing audio effect files, you can call this API to stop playing all audio effect files.
     * + After calling this API to stop playing all audio effect files, the audio effect files will be unloaded automatically.
     */
    /** {zh}
     * @brief 停止播放所有音效文件。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 调用 [start](85532#rtcaudioeffectplayer-start) 方法开始播放音效文件后，可以调用本方法停止播放所有音效文件。
     * + 调用本方法停止播放所有音效文件后，该音效文件会被自动卸载。
     */
    stopAll(): number;
    /** {en}
     * @brief Preloads specified music files into memory to avoid repeated loading when playing the same file frequently and reduce CPU usage.
     * @param effect_id Audio effect ID。Used for identifying the audio effect. Please ensure that the audio effect ID is unique.
     *        If this API is called repeatedly with the same ID, the later one will overwrite the previous one.
     *        If you call [start](85532#rtcaudioeffectplayer-start) first and then call this API with the same ID, the SDK will stop the previous effect and then load the next one, and you will receive [onAudioEffectPlayerStateChanged](85533#rtcaudioeffectplayercallback-onaudioeffectplayerstatechanged).
     *        After calling this API to preload A.mp3, if you need to call [start](85532#rtcaudioeffectplayer-start) to play B.mp3 with the same ID, please call [unload](85532#rtcaudioeffectplayer-unload) to unload A.mp3 first, otherwise SDK will report an error AUDIO_MIXING_ERROR_LOAD_CONFLICT.
     * @param file_path The filepath of effect file. URL of online file, URI of local file, or full path to local file. For URL of online file, only the https protocol is supported.
     *        The length of the pre-loaded file must not exceed 20s.
     *        Audio effect file formats supported are the same as [start](85532#rtcaudioeffectplayer-start).
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + This API just preloads the specified audio effect file, and only calls the [start](85532#rtcaudioeffectplayer-start) API to start playing the specified audio effect file.
     * + The specified audio effect file preloaded by calling this API can be unloaded by [unload](85532#rtcaudioeffectplayer-unload).
     */
    /** {zh}
     * @brief 预加载指定音乐文件到内存中，以避免频繁播放同一文件时的重复加载，减少 CPU 占用。
     * @param effect_id 音效 ID。用于标识音效，请保证音效 ID 唯一性。
     *        如果使用相同的 ID 重复调用本方法，后一次会覆盖前一次。
     *        如果先调用 [start](85532#rtcaudioeffectplayer-start)，再使用相同的 ID 调用本方法 ，会收到回调 [onAudioEffectPlayerStateChanged](85533#rtcaudioeffectplayercallback-onaudioeffectplayerstatechanged) ，通知前一个音效停止，然后加载下一个音效。
     *        调用本方法预加载 A.mp3 后，如果需要使用相同的 ID 调用 [start](85532#rtcaudioeffectplayer-start) 播放 B.mp3，请先调用 [unload](85532#rtcaudioeffectplayer-unload) 卸载 A.mp3 ，否则会报错 AUDIO_MIXING_ERROR_LOAD_CONFLICT。
     * @param file_path 音效文件路径。支持在线文件的 URL、或本地文件的 URI。对于在线文件的 URL，仅支持 https 协议。
     *                 预加载的文件长度不得超过 20s。
     *                 不同平台支持的音效文件格式和 [start](85532#rtcaudioeffectplayer-start) 一致。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 本方法只是预加载指定音效文件，只有调用 [start](85532#rtcaudioeffectplayer-start) 方法才开始播放指定音效文件。
     * + 调用本方法预加载的指定音效文件可以通过 [unload](85532#rtcaudioeffectplayer-unload) 卸载。
     */
    preload(effect_id: number, file_path: string): number;
    /** {en}
     * @brief Unloads the specified audio effect file.
     * @param effect_id Audio effect ID
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes Call this API after [start](85532#rtcaudioeffectplayer-start) or [preload](85532#rtcaudioeffectplayer-preload).
     */
    /** {zh}
     * @brief 卸载指定音效文件。
     * @param effect_id 音效 ID
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes 仅在调用 [start](85532#rtcaudioeffectplayer-start) 或 [preload](85532#rtcaudioeffectplayer-preload) 后调用此接口。
     */
    unload(effect_id: number): number;
    /** {en}
     * @brief Unloads all audio effect files.
     * @returns + 0: Success
     * + < 0: Failure.
     */
    /** {zh}
     * @brief 卸载所有音效文件。
     * @return + `0`: 成功
     * + `-1`: 失败
     */
    unloadAll(): number;
    /** {en}
     * @brief Pauses the playback of audio effect files.
     * @param effect_id Audio effect ID
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + After calling the [start](85532#rtcaudioeffectplayer-start) API to start playing the audio effect file, you can pause the audio effect file by calling this API.
     * + After calling this API to pause the audio effect file, you can call the [resume](85532#rtcaudioeffectplayer-resume) API to resume playback.
     */
    /** {zh}
     * @brief 暂停播放音效文件。
     * @param effect_id 音效 ID
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 调用 [start](85532#rtcaudioeffectplayer-start) 方法开始播放音效文件后，可以通过调用本方法暂停播放音效文件。
     * + 调用本方法暂停播放音效文件后，可调用 [resume](85532#rtcaudioeffectplayer-resume) 方法恢复播放。
     */
    pause(effect_id: number): number;
    /** {en}
     * @brief Pauses the Playback of all audio effect files.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + After calling the [start](85532#rtcaudioeffectplayer-start) API to start playing audio effect files, you can pause playing all audio effect files by calling this API.
     * + After calling this API to pause the playback of all audio effect files, you can call the [resumeAll](85532#rtcaudioeffectplayer-resumeall) API to resume all playback.
     */
    /** {zh}
     * @brief 暂停播放所有音效文件。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 调用 [start](85532#rtcaudioeffectplayer-start) 方法开始播放音效文件后，可以通过调用本方法暂停播放所有音效文件。
     * + 调用本方法暂停播放所有音效文件后，可调用 [resumeAll](85532#rtcaudioeffectplayer-resumeall) 方法恢复所有播放。
     */
    pauseAll(): number;
    /** {en}
     * @brief Resumes the playback of audio effect files.
     * @param effect_id Audio effect ID
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes After calling the [pause](85532#rtcaudioeffectplayer-pause) API to pause the audio effect file, you can resume playback by calling this API.
     */
    /** {zh}
     * @brief 恢复播放音效文件。
     * @param effect_id 音效 ID
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes 调用 [pause](85532#rtcaudioeffectplayer-pause) 方法暂停播放音效文件后，可以通过调用本方法恢复播放。
     */
    resume(effect_id: number): number;
    /** {en}
     * @brief Resumes the playback of all audio effect files.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes After calling the [pauseAll](85532#rtcaudioeffectplayer-pauseall) API to pause all the audio effect files being played, you can resume playback by calling this API.
     */
    /** {zh}
     * @brief 恢复播放所有音效文件。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes 调用 [pauseAll](85532#rtcaudioeffectplayer-pauseall) 方法暂停所有正在播放音效文件后，可以通过调用本方法恢复播放。
     */
    resumeAll(): number;
    /** {en}
     * @brief Sets the start position of the audio effect file.
     * @param effect_id Audio effect ID
     * @param pos The starting playback position of the audio effect file in milliseconds.
     *        You can get the total duration of the audio effect file by calling [getDuration](85532#rtcaudioeffectplayer-getduration), the value of pos should be less than the total duration of the audio effect file.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes + When playing online files, calling this API may cause a delay in playback.
     * + Call this API after [start](85532#rtcaudioeffectplayer-start).
     */
    /** {zh}
     * @brief 设置音效文件的起始播放位置。
     * @param effect_id 音效 ID
     * @param pos 音效文件起始播放位置，单位为毫秒。
     *        你可以通过 [getDuration](85532#rtcaudioeffectplayer-getduration) 获取音效文件总时长，pos 的值应小于音效文件总时长。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes + 在播放在线文件时，调用此接口可能造成播放延迟的现象。
     * + 仅在调用 [start](85532#rtcaudioeffectplayer-start) 后调用此接口。
     */
    setPosition(effect_id: number, pos: number): number;
    /** {en}
     * @brief Gets the current position of audio effect file playback.
     * @param effect_id  Audio effect ID
     * @return + >0: Success, the current progress of audio effect file playback in milliseconds.
     * + < 0: Failure.
     * @notes + When playing online files, calling this API may cause a delay in playback.
     * + Call this API after [start](85532#rtcaudioeffectplayer-start).
     */
    /** {zh}
     * @brief 获取音效文件播放进度。
     * @param effect_id  音效 ID
     * @return + >0: 成功, 音效文件播放进度，单位为毫秒。
     * + < 0: 失败
     * @notes + 在播放在线文件时，调用此接口可能造成播放延迟的现象。
     * + 仅在调用 [start](85532#rtcaudioeffectplayer-start) 后调用此接口。
     */
    getPosition(effect_id: number): number;
    /** {en}
     * @brief Adjusts the volume level of a specified audio effect, including audio effect file and PCM effect.
     * @param effect_id Audio effect ID
     * @param volume The ratio of the volume to the original volume in % with overflow protection. The range is `[0, 400]` and the recommended range is `[0, 100]`.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes Call this API after [start](85532#rtcaudioeffectplayer-start).
     */
    /** {zh}
     * @brief 调节指定音效的音量大小，包括音效文件和 PCM 音频。
     * @param effect_id 音效 ID
     * @param volume 播放音量相对原音量的比值。单位为 %。范围为 `[0, 400]`，建议范围是 `[0, 100]`。带溢出保护。
     * @notes 仅在调用 [start](85532#rtcaudioeffectplayer-start) 后调用此接口。
     */
    /** {en}
     * @brief Adjusts the volume level of a specified audio effect, including audio effect file and PCM effect.
     * @param effect_id Audio effect ID
     * @param volume The ratio of the volume to the original volume in % with overflow protection. The range is `[0, 400]` and the recommended range is `[0, 100]`.
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes Call this API after [start](85532#rtcaudioeffectplayer-start).
     */
    setVolume(effect_id: number, volume: number): number;
    /** {en}
     * @brief Sets the volume of all audio effect, including audio effect files and PCM effects.
     * @param volume The ratio of the volume to the original volume in % with overflow protection. The range is `[0, 400]` and the recommended range is `[0, 100]`.
     * @returns + 0: Success
     * + < 0: Failure.
     * @notes This API has a lower priority than [setVolume](85532#rtcaudioeffectplayer-setvolume), i.e. the volume of the audio effect set by [setVolume](85532#rtcaudioeffectplayer-setvolume) is not affected by this API.
     */
    /** {zh}
     * @brief 设置所有音效的音量大小，包括音效文件和 PCM 音效。
     * @param volume 播放音量相对原音量的比值。单位为 %。范围为 `[0, 400]`，建议范围是 `[0, 100]`。带溢出保护。
     * @return + `0`: 成功
     * + `-1`: 失败
     * @notes 该接口的优先级低于 [setVolume](85532#rtcaudioeffectplayer-setvolume)，即通过 [setVolume](85532#rtcaudioeffectplayer-setvolume) 单独设置了音量的音效 ID，不受该接口设置的影响。
     */
    setVolumeAll(volume: number): number;
    /** {en}
     * @brief Gets the current volume.
     * @param effect_id  Audio effect ID
     * @return + >0: Success, the current volume value.
     * + < 0: Failed.
     * @notes Call this API after [start](85532#rtcaudioeffectplayer-start).
     */
    /** {zh}
     * @brief 获取当前音量。
     * @param effect_id  音效 ID
     * @return + >0: 成功, 当前音量值。
     * + < 0: 失败
     * @notes 仅在调用 [start](85532#rtcaudioeffectplayer-start) 后调用此接口。
     */
    getVolume(effect_id: number): number;
    /** {en}
     * @brief Get the duration of the audio effect file.
     * @param effect_id  Audio effect ID
     * @return + >0: Success, the duration of the audio effect file in milliseconds.
     * + < 0: failed.
     * @notes Call this API after [start](85532#rtcaudioeffectplayer-start).
     */
    /** {zh}
     * @brief 获取音效文件时长。
     * @param effect_id  音效 ID
     * @return + >0: 成功, 音效文件时长，单位为毫秒。
     * + < 0: 失败
     * @notes 仅在调用 [start](85532#rtcaudioeffectplayer-start) 后调用此接口。
     */
    getDuration(effect_id: number): number;
    /** {en}
     * @brief Set the event handler.
     * @returns + 0: Success
     * + < 0: Failure.
     */
    /** {zh}
     * @brief 设置回调句柄。
     * @return + `0`: 成功
     * + `-1`: 失败
     */
    setEventHandler(): number;
    /**
     * @private
     */
    fire(event: string, ...args: any[]): void;
    /**
     * @hidden
     */
    private callback;
    /**
     * @hidden
     */
    processCallback(event: EventType): void;
}
declare interface RTCAudioEffectPlayer {
    on(evt: "onAudioEffectPlayerStateChanged", cb: RTCAUDIOEFFECTPLAYERCALLBACK["onAudioEffectPlayerStateChanged"]): this;
}
export default RTCAudioEffectPlayer;
