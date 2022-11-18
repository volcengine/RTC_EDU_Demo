package com.volcengine.vertcdemo.edu.feature.classhistory;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.ss.video.rtc.demo.basic_module.acivities.BaseActivity;
import com.volcengine.vertcdemo.core.net.IRequestCallback;
import com.volcengine.vertcdemo.edu.R;
import com.volcengine.vertcdemo.edu.bean.EduRecordInfo;
import com.volcengine.vertcdemo.edu.core.EduRTCManager;
import com.volcengine.vertcdemo.edu.event.UpdateHistoryListOfClassEvent;

import static androidx.recyclerview.widget.RecyclerView.VERTICAL;

import java.util.List;

public class ClassHistoryListActivity extends BaseActivity {

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
    }

    @Override
    protected void onGlobalLayoutCompleted() {
        super.onGlobalLayoutCompleted();

        ImageView backArrow = findViewById(R.id.title_bar_left_iv);
        backArrow.setImageResource(R.drawable.back_arrow);
        backArrow.setOnClickListener(v -> finish());
        TextView title = findViewById(R.id.title_bar_title_tv);
        title.setText(mClassName);

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
