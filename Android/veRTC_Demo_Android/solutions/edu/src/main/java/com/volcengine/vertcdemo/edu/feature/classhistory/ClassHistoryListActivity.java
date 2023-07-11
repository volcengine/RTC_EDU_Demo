// Copyright (c) 2023 Beijing Volcano Engine Technology Ltd.
// SPDX-License-Identifier: MIT

package com.volcengine.vertcdemo.edu.feature.classhistory;

import static androidx.recyclerview.widget.RecyclerView.VERTICAL;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;

import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.volcengine.vertcdemo.common.CommonTitleLayout;
import com.volcengine.vertcdemo.common.SolutionBaseActivity;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.edu.R;
import com.volcengine.vertcdemo.edu.bean.EduRecordInfo;
import com.volcengine.vertcdemo.edu.core.EduRTCManager;
import com.volcengine.vertcdemo.edu.event.UpdateHistoryListOfClassEvent;

import java.util.List;

public class ClassHistoryListActivity extends SolutionBaseActivity {

    public static final String EXTRA_ROOM_TITLE = "room_title";
    public static final String EXTRA_CLASS_ID = "class_id";

    private String mClassName = "";
    private String mRoomId = "";

    private ClassHistoryAdapter mAdapter;
    private final ClassHistoryAdapter.HistoryClickListener mItemClickListener = this::reviewEduFile;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history);
        mClassName = getIntent().getStringExtra(EXTRA_ROOM_TITLE);
        mRoomId = getIntent().getStringExtra(EXTRA_CLASS_ID);

        CommonTitleLayout titleLayout = findViewById(R.id.title_bar_layout);
        titleLayout.setLeftBack(v -> onBackPressed());
        titleLayout.setTitle(mClassName);

        RecyclerView recyclerView = findViewById(R.id.meeting_record_recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(this, VERTICAL, false));
        mAdapter = new ClassHistoryAdapter(mItemClickListener);
        recyclerView.setAdapter(mAdapter);
    }

    @Override
    protected void onResume() {
        super.onResume();
        EduRTCManager.ins().getRTMClient().requestHistoryListOfClass(mRoomId, new IRequestCallback<UpdateHistoryListOfClassEvent>() {
            @Override
            public void onSuccess(UpdateHistoryListOfClassEvent data) {
                refreshRecordEvent(data);
            }

            @Override
            public void onError(int errorCode, String message) {

            }
        });
    }

    public void reviewEduFile(String url) {
        if (TextUtils.isEmpty(url)) {
            return;
        }
        Intent i = new Intent(Intent.ACTION_VIEW);
        i.setData(Uri.parse(url));
        startActivity(i);
    }

    private void refreshRecordEvent(UpdateHistoryListOfClassEvent event) {
        List<EduRecordInfo> recordInfoList = event.getHistoryList();
        if (recordInfoList != null && mAdapter != null) {
            mAdapter.setData(recordInfoList);
        }
    }
}
