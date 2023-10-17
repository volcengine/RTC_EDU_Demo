package com.volcengine.vertcdemo.feature;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContract;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityOptionsCompat;
import androidx.fragment.app.Fragment;

import com.ss.video.rtc.demo.basic_module.utils.SafeToast;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.core.net.ServerResponse;
import com.volcengine.vertcdemo.core.net.http.NetworkException;
import com.volcengine.vertcdemo.core.net.rtm.RtmInfo;
import com.volcengine.vertcdemo.feature.createroom.CreateClassLargeActivity;
import com.volcengine.vertcdemo.feature.createroom.CreateClassSmallActivity;
import com.volcengine.vertcdemo.feature.createroom.CreateMeetingActivity;
import com.volcengine.vertcdemo.framework.RoomType;
import com.volcengine.vertcdemo.login.ILoginImpl;
import com.volcengine.vertcdemo.login.LoginApi;
import com.volcengine.vertcdemo.meeting.R;

public class SceneEntryFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_scene_entry, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        view.findViewById(R.id.scene_meeting).setOnClickListener(v -> startScene(CreateMeetingActivity.class, RoomType.MEETING));
        view.findViewById(R.id.scene_class_small).setOnClickListener(v -> startScene(CreateClassSmallActivity.class, RoomType.CLASS_SMALL));
        view.findViewById(R.id.scene_class_large).setOnClickListener(v -> startScene(CreateClassLargeActivity.class, RoomType.CLASS_LARGE));
    }

    private void startScene(Class<? extends Activity> targetActivity, RoomType roomType) {
        LoginApi.getRTMAuthentication(SolutionDataManager.ins().getToken(), roomType.getSense(),
                new IRequestCallback<ServerResponse<RtmInfo>>() {
                    @Override
                    public void onSuccess(ServerResponse<RtmInfo> response) {
                        Activity activity = getActivity();
                        if (activity == null || activity.isFinishing()) {
                            return;
                        }
                        RtmInfo data = response == null ? null : response.getData();
                        if (data == null || !data.isValid()) {
                            onError(-1, "");
                        } else {
                            Intent intent = new Intent(activity, targetActivity);
                            intent.putExtra(RtmInfo.KEY_RTM, data);
                            startActivity(intent);
                        }
                    }

                    @Override
                    public void onError(int errorCode, String message) {
                        Activity activity = getActivity();
                        if (activity == null || activity.isFinishing()) {
                            return;
                        }
                        if (errorCode == NetworkException.CODE_TOKEN_EXPIRED) {
                            requestLogin();
                        } else {
                            if (errorCode == NetworkException.CODE_ERROR) {
                                SafeToast.show(R.string.network_lost_tips);
                            } else {
                                SafeToast.show(R.string.request_rtm_fail);
                            }
                        }
                    }
                });
    }

    private void requestLogin() {
        new ILoginImpl().showLoginView(new ActivityResultLauncher<Intent>() {
            @Override
            public void launch(Intent input, @Nullable ActivityOptionsCompat options) {
                startActivity(input);
            }

            @Override
            public void unregister() {

            }

            @NonNull
            @Override
            public ActivityResultContract<Intent, ?> getContract() {
                return null;
            }
        });
    }
}
