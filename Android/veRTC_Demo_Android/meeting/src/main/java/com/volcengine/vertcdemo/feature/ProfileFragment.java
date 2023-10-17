package com.volcengine.vertcdemo.feature;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.ss.bytertc.engine.RTCEngine;
import com.ss.video.rtc.demo.basic_module.ui.CommonDialog;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.core.eventbus.RefreshUserNameEvent;
import com.volcengine.vertcdemo.core.eventbus.SolutionDemoEventManager;
import com.volcengine.vertcdemo.login.ILoginImpl;
import com.volcengine.vertcdemo.meeting.BuildConfig;
import com.volcengine.vertcdemo.meeting.R;

import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

public class ProfileFragment extends Fragment {

    private TextView mUserAvatar;
    private View mUserNameLayout;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_profile, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        mUserAvatar = view.findViewById(R.id.profile_user_avatar);
        mUserNameLayout = view.findViewById(R.id.profile_user_name);

        // region 用户头像、用户名称
        updateUserInfo();
        // endregion

        // region 隐私协议、服务协议、免责声明
        View privacyAgreementLayout = view.findViewById(R.id.profile_privacy_agreement);
        TextView privacyAgreementTv = privacyAgreementLayout.findViewById(R.id.left_tv);
        privacyAgreementTv.setText(R.string.privacy_agreement);
        privacyAgreementLayout.setOnClickListener(v -> openBrowser(BuildConfig.URL_PRIVACY_AGREEMENT));

        View userAgreementLayout = view.findViewById(R.id.profile_user_agreement);
        TextView userAgreementTv = userAgreementLayout.findViewById(R.id.left_tv);
        userAgreementTv.setText(R.string.user_agreement);
        userAgreementLayout.setOnClickListener(v -> openBrowser(BuildConfig.URL_USER_AGREEMENT));

        View disclaimerLayout = view.findViewById(R.id.profile_disclaimer);
        TextView disclaimerTv = disclaimerLayout.findViewById(R.id.left_tv);
        disclaimerTv.setText(R.string.disclaimer);
        disclaimerLayout.setOnClickListener(v -> openBrowser(BuildConfig.URL_DISCLAIMER));
        // endregion

        // region App 信息、SDK 信息
        View permissionListLayout = view.findViewById(R.id.profile_permission_list);
        TextView permissionListTv = permissionListLayout.findViewById(R.id.left_tv);
        permissionListTv.setText(R.string.permission_list);
        permissionListLayout.setOnClickListener(v -> openBrowser(BuildConfig.URL_PERMISSION_LIST));

        View licenseListLayout = view.findViewById(R.id.profile_license_list);
        TextView licenseListTv = licenseListLayout.findViewById(R.id.left_tv);
        licenseListTv.setText(R.string.license_list);
        licenseListLayout.setOnClickListener(v -> startActivity(new Intent(getActivity(), LicensesActivity.class)));

        View demoVersionLayout = view.findViewById(R.id.profile_demo_version);
        TextView demoVersionLabel = demoVersionLayout.findViewById(R.id.left_tv);
        demoVersionLabel.setText(R.string.demo_version_label);
        TextView demoVersionTv = demoVersionLayout.findViewById(R.id.right_tv);
        demoVersionTv.setText(String.format("v%1$s", BuildConfig.VERSION_NAME));

        View sdkVersionLayout = view.findViewById(R.id.profile_sdk_version);
        TextView sdkVersionLabel = sdkVersionLayout.findViewById(R.id.left_tv);
        sdkVersionLabel.setText(R.string.sdk_version_label);
        TextView sdkVersionTv = sdkVersionLayout.findViewById(R.id.right_tv);
        sdkVersionTv.setText(String.format("v%1$s", RTCEngine.getSdkVersion()));
        // endregion

        view.findViewById(R.id.profile_delete_account).setOnClickListener((v) -> {
            confirmDeleteAccount();
        });

        view.findViewById(R.id.profile_exit_login).setOnClickListener((v) -> {
            new ILoginImpl().closeAccount(null);
        });

        // 监听修改用户信息事件
        SolutionDemoEventManager.register(this);
    }

    @Override
    public void onResume() {
        super.onResume();
        updateUserInfo();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        SolutionDemoEventManager.unregister(this);
    }

    private void confirmDeleteAccount() {
        CommonDialog dialog = new CommonDialog(getActivity());
        dialog.setMessage(getString(R.string.delete_account_tips));
        dialog.setPositiveListener(v -> {
            dialog.dismiss();
            new ILoginImpl().closeAccount(null);
        });
        dialog.setNegativeListener(v -> dialog.dismiss());
        dialog.show();
    }

    private void updateUserInfo() {
        TextView userNameLabel = mUserNameLayout.findViewById(R.id.left_tv);
        userNameLabel.setText(R.string.user_name_label);
        mUserNameLayout.setOnClickListener(v -> startActivity(new Intent(Actions.EDIT_PROFILE)));
        final String userNameStr = SolutionDataManager.ins().getUserName();
        if (!TextUtils.isEmpty(userNameStr)) {
            String namePrefix = userNameStr.substring(0, 1);
            mUserAvatar.setText(namePrefix);
        }
        TextView userNameTv = mUserNameLayout.findViewById(R.id.right_tv);
        if (!TextUtils.isEmpty(userNameStr)) {
            userNameTv.setText(userNameStr);
        }
    }

    private void openBrowser(String url) {
        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onRefreshUserNameEvent(RefreshUserNameEvent event) {
        if (event.isSuccess) {
            updateUserInfo();
        }
    }
}
