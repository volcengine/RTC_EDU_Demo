package com.volcengine.vertcdemo.core;

import android.app.Activity;

import androidx.lifecycle.LiveData;

import com.ss.bytertc.engine.data.AudioRoute;
import com.ss.bytertc.engine.data.LocalAudioPropertiesInfo;
import com.ss.bytertc.engine.data.RemoteAudioPropertiesInfo;
import com.ss.bytertc.engine.type.ConnectionState;
import com.ss.video.rtc.demo.basic_module.utils.GsonUtils;
import com.volcengine.vertcdemo.core.net.rtm.RTMBaseClient;

import java.util.List;
import java.util.Map;

public interface IUIRtcDef {

    int ERROR_CODE_DEFAULT = RTMBaseClient.ERROR_CODE_DEFAULT;
    int ERROR_CODE_ROOM_FULL = 401;
    int ERROR_HOST_EXIST = 403;

    enum KickOutReason {
        LOGIN_IN_OTHER_DEVICE
    }

    interface IRtcDataProvider {
        LiveData<ConnectionState> getNetworkConnectionState();

        @SuppressWarnings("BooleanMethodIsAlwaysInverted")
        default boolean isNetworkConnected() {
            ConnectionState state = getNetworkConnectionState().getValue();
            return ConnectionState.CONNECTION_STATE_RECONNECTED.equals(state) || ConnectionState.CONNECTION_STATE_CONNECTED.equals(state);
        }

        LiveData<Boolean> rtmLoggedState();

        default boolean isRtmLogged() {
            return Boolean.TRUE.equals(rtmLoggedState().getValue());
        }

        LiveData<Boolean> micState();

        default boolean isMicOpen() {
            return Boolean.TRUE.equals(micState().getValue());
        }

        LiveData<Boolean> camState();

        default boolean isCamOpen() {
            return Boolean.TRUE.equals(camState().getValue());
        }

        LiveData<Boolean> facingFront();

        default boolean isFacingFront() {
            return Boolean.TRUE.equals(facingFront().getValue());
        }

        LiveData<Boolean> speakerPhone();

        default boolean isSpeakerPhone() {
            return Boolean.TRUE.equals(speakerPhone().getValue());
        }

        LiveData<Boolean> screenAudio();

        default boolean isSharingScreenAudio() {
            return Boolean.TRUE.equals(screenAudio().getValue());
        }

        LiveData<IUIRtcDef.KickOutReason> getRtmKickOutReason();

        LiveData<Boolean> appBackground();

        Activity currentActivity();

        LiveData<Boolean> canSwitchAudioRoute();

        default boolean isCanSwitchAudioRoute(){
            return Boolean.TRUE.equals(canSwitchAudioRoute().getValue());
        }
    }

    interface IRtcListener {

        default void onRoomStateChanged(int state, String extraInfo) {
        }

        default void onUserVideoStreamAvailable(String userId, boolean available) {
        }

        default void onUserScreenStreamAvailable(String userId, boolean available) {
        }

        default void onActiveSpeaker(String userId) {
        }

        default void onLocalAudioPropertiesReport(List<LocalAudioPropertiesInfo> audioProperties) {
        }

        default void onRemoteAudioPropertiesReport(List<RemoteAudioPropertiesInfo> audioProperties, int totalRemoteVolume) {
        }

        default void onAudioRouteChanged(AudioRoute route){
        }

        /**
         * 判断 onRoomStateChanged 中的extraInfo，是不是首次加入房间成功
         *
         * @param extraInfo 额外信息
         * @return true:加入房间成功
         */
        static boolean joinRoomSuccessWhenFirst(String extraInfo) {
            int joinType = -1;
            try {
                Map<?, ?> extra = GsonUtils.gson().fromJson(extraInfo, Map.class);
                // 341后 SDK传的固定键
                joinType = (int) Double.parseDouble(extra.get("join_type").toString());
            } catch (Exception e) {
                e.printStackTrace();
            }
            return joinType == 0;
        }
    }
}
