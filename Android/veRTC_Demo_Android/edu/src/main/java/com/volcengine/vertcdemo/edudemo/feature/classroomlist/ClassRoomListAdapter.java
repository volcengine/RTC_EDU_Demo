package com.volcengine.vertcdemo.edudemo.feature.classroomlist;

import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.volcengine.vertcdemo.edu.R;
import com.volcengine.vertcdemo.edudemo.bean.EduRoomInfo;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ClassRoomListAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {


    private final List<EduRoomInfo> mClassRoomList = new ArrayList<>();
    private final OnClassItemClickListener mOnClassClickListener;

    private int mActiveClassNum = 0;

    public ClassRoomListAdapter(OnClassItemClickListener itemClickListener) {
        mOnClassClickListener = itemClickListener;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_class_room_layout, parent, false);
        return new ClassRoomListViewHolder(view, mOnClassClickListener);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if (holder instanceof ClassRoomListViewHolder) {
            ((ClassRoomListViewHolder) holder).bind(mClassRoomList.get(position));
        }
    }

    @Override
    public int getItemCount() {
        return mClassRoomList.size();
    }

    public int getActiveClassSize() {
        return mActiveClassNum;
    }

    public void setActiveClassList(List<EduRoomInfo> list) {
        List<EduRoomInfo> meetRoomList = new ArrayList<>();
        meetRoomList.addAll(list);
        meetRoomList.addAll(mClassRoomList.subList(mActiveClassNum == 0 ? 0 : mActiveClassNum, mClassRoomList.size()));
        mClassRoomList.clear();
        mClassRoomList.addAll(meetRoomList);
        mActiveClassNum = list.size();
        notifyDataSetChanged();
    }

    public void setHistoryClassList(List<EduRoomInfo> list) {
        List<EduRoomInfo> meetRoomList = new ArrayList<>();
        meetRoomList.addAll(mClassRoomList.subList(0, mActiveClassNum));
        meetRoomList.addAll(list);
        mClassRoomList.clear();
        mClassRoomList.addAll(meetRoomList);
        notifyDataSetChanged();
    }

    private static class ClassRoomListViewHolder extends RecyclerView.ViewHolder {

        private final TextView mTitle;
        private final TextView mNamePrefix;
        private final TextView mHostname;
        private final TextView mRoomDate;
        private final TextView mRoomId;
        private final TextView mRoomStatus;
        private EduRoomInfo mClassRoomInfo;

        public ClassRoomListViewHolder(@NonNull View itemView, OnClassItemClickListener onClassItemClickListener) {
            super(itemView);
            mTitle = itemView.findViewById(R.id.item_class_room_layout_title);
            mNamePrefix = itemView.findViewById(R.id.item_class_room_layout_avatar);
            mHostname = itemView.findViewById(R.id.item_class_room_layout_user_name);
            mRoomDate = itemView.findViewById(R.id.item_class_room_layout_room_date);
            mRoomId = itemView.findViewById(R.id.item_class_room_layout_room_id);
            mRoomStatus = itemView.findViewById(R.id.item_class_room_layout_room_status);
            itemView.setOnClickListener(v -> {
                if (onClassItemClickListener != null) {
                    onClassItemClickListener.onClassClick(mClassRoomInfo);
                }
            });
        }

        public void bind(EduRoomInfo info) {
            mClassRoomInfo = info;
            if (info == null) {
                mTitle.setText("");
                mNamePrefix.setText("");
                mHostname.setText("");
                mRoomDate.setText("");
                mRoomId.setText("");
                mRoomStatus.setVisibility(View.GONE);
                return;
            }
            String hostName = info.teacherName;
            mTitle.setText(info.getDecodedRoomName());
            if (!TextUtils.isEmpty(hostName)) {
                mNamePrefix.setText(hostName.substring(0, 1));
            } else {
                mNamePrefix.setText("");
            }
            mHostname.setText(hostName);
            if (info.roomId == null) {
                info.roomId = "";
            }
            mRoomId.setText(String.format("ID: %s", info.roomId));
            if (info.status == 1) {
                mRoomStatus.setVisibility(View.VISIBLE);
                mRoomDate.setText("");
            } else if (info.status == 2) {
                mRoomStatus.setVisibility(View.GONE);
                mRoomDate.setText(new SimpleDateFormat("yyyy/MM/dd").format(new Date(info.beginClassTimeReal / 1000_000)));
            }
        }
    }

    public interface OnClassItemClickListener {
        void onClassClick(EduRoomInfo info);
    }
}
