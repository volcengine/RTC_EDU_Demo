package com.volcengine.vertcdemo.edudemo.feature.classhistory;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.volcengine.vertcdemo.edu.R;
import com.volcengine.vertcdemo.edudemo.bean.EduRecordInfo;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class ClassHistoryAdapter extends RecyclerView.Adapter<ClassHistoryAdapter.ClassHistoryViewHolder> {

    private final List<EduRecordInfo> mMeetingRecordInfoList = new ArrayList<>();
    private final HistoryClickListener mItemClickListener;

    private SimpleDateFormat mDateFormat = new SimpleDateFormat("yyyy/MM/dd");
    private SimpleDateFormat mHMSFormat = new SimpleDateFormat("HH:mm:ss");

    public ClassHistoryAdapter(HistoryClickListener itemClickListener) {
        mItemClickListener = itemClickListener;
    }

    @NonNull
    @Override
    public ClassHistoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_class_history_list, parent, false);
        return new ClassHistoryAdapter.ClassHistoryViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ClassHistoryAdapter.ClassHistoryViewHolder holder, int position) {
        EduRecordInfo info = mMeetingRecordInfoList.get(position);
        holder.classHistoryName.setText(getFormatMessage(info.recordBeginTime / 1000_000, info.recordEndTime / 1000_000));
        holder.classHistoryName.setOnClickListener(view -> mItemClickListener.onItemClick(info.videoUrl));
    }

    private String getFormatMessage(long startTime, long endTime) {
        return String.format("%s %s-%s", mDateFormat.format(startTime),
                mHMSFormat.format(startTime),
                mHMSFormat.format(endTime));
    }

    @Override
    public int getItemCount() {
        return mMeetingRecordInfoList.size();
    }

    protected static class ClassHistoryViewHolder extends RecyclerView.ViewHolder {

        public TextView classHistoryName;

        public ClassHistoryViewHolder(@NonNull View itemView) {
            super(itemView);
            classHistoryName = itemView.findViewById(R.id.class_record_name);
        }
    }

    public interface HistoryClickListener {
        void onItemClick(String url);
    }

    public void setData(List<EduRecordInfo> recordInfos) {
        mMeetingRecordInfoList.clear();
        mMeetingRecordInfoList.addAll(recordInfos);
        notifyDataSetChanged();
    }
}
