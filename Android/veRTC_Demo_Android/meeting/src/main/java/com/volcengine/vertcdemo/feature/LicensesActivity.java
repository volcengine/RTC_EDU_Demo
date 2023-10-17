package com.volcengine.vertcdemo.feature;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.ss.video.rtc.demo.basic_module.acivities.BaseActivity;
import com.volcengine.vertcdemo.meeting.R;

public class LicensesActivity extends BaseActivity {
    private View bizLicenseBtn;
    private ImageView titleBarBackIv;
    private TextView titleBarTitleTv;
    private View telecomLicenseBtn;
    private View netCultureLicenseBtn;
    private TextView licenseContent;
    private View divider1;
    private View divider2;
    private View divider3;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_licenses);
        View titleBar = findViewById(R.id.title_bar_layout);
        titleBarBackIv = titleBar.findViewById(R.id.title_bar_left_iv);
        titleBarTitleTv = titleBar.findViewById(R.id.title_bar_title_tv);

        bizLicenseBtn = findViewById(R.id.business_license);
        telecomLicenseBtn = findViewById(R.id.telecom_license);
        netCultureLicenseBtn = findViewById(R.id.net_culture_license);
        licenseContent = findViewById(R.id.license_content);

        divider1 = findViewById(R.id.divider_1);
        divider2 = findViewById(R.id.divider_2);
        divider3 = findViewById(R.id.divider_3);

        bind(bizLicenseBtn, R.string.business_license, v -> openUrl("https://lf3-static.bytednsdoc.com/obj/eden-cn/pojnupibps/VE-RTC/20230919-112237.jpeg"));
        bind(telecomLicenseBtn, R.string.telecom_license, view -> showTelecomLicense());
        bind(netCultureLicenseBtn, R.string.net_culture_license, v -> showNetCultureLicense());
        showLicenses();
    }

    private void bind(View btn, int btnText, View.OnClickListener clickListener) {
        TextView leftTv = btn.findViewById(R.id.left_tv);
        leftTv.setText(getText(btnText));
        leftTv.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.black));
        btn.setOnClickListener(clickListener);
    }

    private void showTelecomLicense() {
        titleBarTitleTv.setText(R.string.telecom_license);
        titleBarBackIv.setOnClickListener(v -> showLicenses());
        bizLicenseBtn.setVisibility(View.GONE);
        telecomLicenseBtn.setVisibility(View.GONE);
        netCultureLicenseBtn.setVisibility(View.GONE);
        licenseContent.setText("【京B2-20202418，B1.B2-20202637】");
        licenseContent.setOnClickListener(v -> {
            openUrl("https://dxzhgl.miit.gov.cn/#/home");
        });
        licenseContent.setVisibility(View.VISIBLE);
        divider1.setVisibility(View.GONE);
        divider2.setVisibility(View.GONE);
        divider3.setVisibility(View.GONE);
    }

    private void showNetCultureLicense() {
        titleBarTitleTv.setText(R.string.net_culture_license);
        titleBarBackIv.setOnClickListener(v -> showLicenses());
        bizLicenseBtn.setVisibility(View.GONE);
        telecomLicenseBtn.setVisibility(View.GONE);
        netCultureLicenseBtn.setVisibility(View.GONE);
        licenseContent.setText("【京网文（2020）5702-1116号】");
        licenseContent.setOnClickListener(null);
        licenseContent.setVisibility(View.VISIBLE);
        divider1.setVisibility(View.GONE);
        divider2.setVisibility(View.GONE);
        divider3.setVisibility(View.GONE);
    }

    private void showLicenses() {
        titleBarTitleTv.setText(R.string.license_list);
        titleBarBackIv.setOnClickListener(v -> {
            finish();
        });
        bizLicenseBtn.setVisibility(View.VISIBLE);
        telecomLicenseBtn.setVisibility(View.VISIBLE);
        netCultureLicenseBtn.setVisibility(View.VISIBLE);
        licenseContent.setVisibility(View.GONE);
        divider1.setVisibility(View.VISIBLE);
        divider2.setVisibility(View.VISIBLE);
        divider3.setVisibility(View.VISIBLE);
    }

    private void openUrl(String url) {
        if (TextUtils.isEmpty(url)) {
            return;
        }
        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
    }

    @Override
    public void onBackPressed() {
        if (licenseContent.getVisibility() == View.VISIBLE) {
            showLicenses();
            return;
        }
        super.onBackPressed();
    }
}
