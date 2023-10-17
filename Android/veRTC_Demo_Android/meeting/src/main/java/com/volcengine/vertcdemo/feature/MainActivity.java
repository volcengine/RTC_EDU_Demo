package com.volcengine.vertcdemo.feature;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContract;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityOptionsCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import com.ss.video.rtc.demo.basic_module.acivities.BaseActivity;
import com.ss.video.rtc.demo.basic_module.utils.WindowUtils;
import com.volcengine.vertcdemo.core.SolutionDataManager;
import com.volcengine.vertcdemo.core.eventbus.SolutionDemoEventManager;
import com.volcengine.vertcdemo.core.eventbus.TokenExpiredEvent;
import com.volcengine.vertcdemo.login.ILoginImpl;
import com.volcengine.vertcdemo.meeting.R;

import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

public class MainActivity extends BaseActivity {

    private static final String TAG_SCENES = "fragment_tag_scenes";
    private static final String TAG_PROFILE = "fragment_tag_profile";

    private View mTabScenes;
    private View mTabProfile;
    private Fragment mFragmentScenes;
    private Fragment mFragmentProfile;

    private final ILoginImpl mLogin = new ILoginImpl();

    private final ActivityResultLauncher mLauncher = new ActivityResultLauncher<Intent>() {
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
    };

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        String token = SolutionDataManager.ins().getToken();
        if (TextUtils.isEmpty(token)) {
            mLogin.showLoginView(mLauncher);
        }
    }

    @Override
    protected void setupStatusBar() {
        WindowUtils.setLayoutFullScreen(getWindow());
    }

    @Override
    protected void onGlobalLayoutCompleted() {
        mTabScenes = findViewById(R.id.tab_scenes);
        mTabScenes.setOnClickListener(v -> switchMainLayout(true));
        mTabProfile = findViewById(R.id.tab_profile);
        mTabProfile.setOnClickListener(v -> switchMainLayout(false));

        final FragmentManager fragmentManager = getSupportFragmentManager();
        Fragment tabScene = fragmentManager.findFragmentByTag(TAG_SCENES);
        if (tabScene == null) {
            tabScene = new SceneEntryFragment();
            fragmentManager
                    .beginTransaction()
                    .add(R.id.tab_content, tabScene, TAG_SCENES)
                    .commit();
        }
        mFragmentScenes = tabScene;

        Fragment tabProfile = fragmentManager.findFragmentByTag(TAG_PROFILE);
        if (tabProfile == null) {
            tabProfile = new ProfileFragment();
            fragmentManager
                    .beginTransaction()
                    .add(R.id.tab_content, tabProfile, TAG_PROFILE)
                    .commit();
        }
        mFragmentProfile = tabProfile;

        switchMainLayout(true);
        SolutionDemoEventManager.register(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SolutionDemoEventManager.unregister(this);
    }

    private void switchMainLayout(boolean isEntrance) {
        mTabScenes.setSelected(isEntrance);
        mTabProfile.setSelected(!isEntrance);

        if (isEntrance) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .hide(mFragmentProfile)
                    .show(mFragmentScenes)
                    .commit();
        } else {
            getSupportFragmentManager()
                    .beginTransaction()
                    .hide(mFragmentScenes)
                    .show(mFragmentProfile)
                    .commit();
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onTokenExpiredEvent(TokenExpiredEvent event) {
        mLogin.showLoginView(mLauncher);
    }
}
