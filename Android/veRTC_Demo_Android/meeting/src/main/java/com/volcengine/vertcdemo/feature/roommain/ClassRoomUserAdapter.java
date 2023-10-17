package com.volcengine.vertcdemo.feature.roommain;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.volcengine.vertcdemo.framework.classLarge.UIEduRoom;
import com.volcengine.vertcdemo.framework.classLarge.bean.EduUserInfo;
import com.volcengine.vertcdemo.meeting.R;

import java.util.List;

public class ClassRoomUserAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private static final int TYPE_EMPTY_TEACHER = 0;
    private static final int TYPE_VISIBLE_USER = 1;

    private final UIEduRoom mEduRoom;
    private final List<EduUserInfo> mUserList;
    private final float mViewHeightPercent;

    public ClassRoomUserAdapter(UIEduRoom eduRoom, @NonNull List<EduUserInfo> userList, float viewHeightPercent) {
        mEduRoom = eduRoom;
        mUserList = userList;
        mViewHeightPercent = viewHeightPercent;
    }

    @Override
    public int getItemCount() {
        return mUserList.size();
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (viewType == TYPE_EMPTY_TEACHER) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.edu_waiting_teacher_window, parent, false);
            ViewGroup.LayoutParams layoutParam = view.getLayoutParams();
            layoutParam.height = (int) (parent.getMeasuredHeight() * mViewHeightPercent);
            return new EmptyUserHolder(view);
        } else {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.edu_view_item_user, parent, false);
            ViewGroup.LayoutParams layoutParam = view.getLayoutParams();
            layoutParam.height = (int) (parent.getMeasuredHeight() * mViewHeightPercent);
            return new UserViewHolder(view);
        }
    }

    @Override
    public int getItemViewType(int position) {
        EduUserInfo userInfo = mUserList.get(position);
        if (userInfo.isHost && userInfo.isFakeUser) {
            return TYPE_EMPTY_TEACHER;
        } else {
            return TYPE_VISIBLE_USER;
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if (holder instanceof UserViewHolder) {
            EduUserInfo userInfo = mUserList.get(position);
            ((UserViewHolder) holder).bind(mEduRoom, userInfo);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position, @NonNull List<Object> payloads) {
        if (!payloads.isEmpty() && holder instanceof UserViewHolder) {
            ((UserViewHolder) holder).updateByPayloads(payloads);
        } else {
            super.onBindViewHolder(holder, position, payloads);
        }
    }

    public static class EmptyUserHolder extends RecyclerView.ViewHolder {

        public EmptyUserHolder(@NonNull View itemView) {
            super(itemView);
        }
    }

    public static class UserViewHolder extends RecyclerView.ViewHolder {

        private final ClassUserWindowView mMemberView;

        public UserViewHolder(@NonNull View itemView) {
            super(itemView);
            mMemberView = itemView.findViewById(R.id.user_window);
        }

        void bind(UIEduRoom eduRoom, EduUserInfo userInfo) {
            mMemberView.bind(eduRoom, userInfo);
            if (userInfo.isMe) {
                mMemberView.hideLocalOpt();
                mMemberView.setOnClickListener(v -> {
                    mMemberView.showLocalOpt();
                });
            } else {
                mMemberView.hideLocalOpt();
                mMemberView.setOnClickListener(null);
            }
        }

        void updateByPayloads(List<Object> payloads) {
            mMemberView.updateByPayloads(payloads);
        }
    }
}
