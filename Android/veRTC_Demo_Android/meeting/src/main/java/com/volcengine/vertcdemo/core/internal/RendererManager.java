package com.volcengine.vertcdemo.core.internal;

import android.content.Context;
import android.view.TextureView;

import androidx.annotation.MainThread;
import androidx.annotation.NonNull;

import com.ss.bytertc.engine.VideoCanvas;
import com.volcengine.vertcdemo.core.impl.RtcDataProviderImpl;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

public class RendererManager extends AbsRtcManager {

    private VideoCanvas mLocalVideoRenderer;
    private final Map<String, VideoCanvas> mRemoteVideoRenderer = new HashMap<>();
    private final Map<String, VideoCanvas> mRemoteScreenRenderer = new HashMap<>();

    public RendererManager(@NonNull RtcDataProviderImpl dataProvider) {
        super(dataProvider);
    }

    @Override
    public void dispose() {
        mLocalVideoRenderer = null;
        mRemoteVideoRenderer.clear();
        mRemoteScreenRenderer.clear();
    }

    @MainThread
    @NonNull
    public synchronized VideoCanvas getLocalVideoRenderer(Context context) {
        if (mLocalVideoRenderer == null) {
            mLocalVideoRenderer = new VideoCanvas(new TextureView(context), VideoCanvas.RENDER_MODE_HIDDEN);
        }
        return mLocalVideoRenderer;
    }

    @MainThread
    @NonNull
    public synchronized VideoCanvas getRemoteVideoRenderer(Context context, String roomId, String userId) {
        String key = roomId + "," + userId;
        VideoCanvas canvas = mRemoteVideoRenderer.get(key);
        if (canvas != null) {
            return canvas;
        }
        canvas = new VideoCanvas(new TextureView(context), VideoCanvas.RENDER_MODE_HIDDEN);
        mRemoteVideoRenderer.put(key, canvas);
        return canvas;
    }

    @NonNull
    public synchronized VideoCanvas getRemoteScreenRenderer(Context context, String roomId, String userId) {
        String key = roomId + "," + userId;
        VideoCanvas canvas = mRemoteScreenRenderer.get(key);
        if (canvas != null) {
            return canvas;
        }
        canvas = new VideoCanvas(new TextureView(context), VideoCanvas.RENDER_MODE_FIT);
        mRemoteScreenRenderer.put(key, canvas);
        return canvas;
    }

    public synchronized void clearRemoteRenderer(String roomId) {
        String keyPrefix = roomId + ",";
        for (String key : new HashSet<>(mRemoteVideoRenderer.keySet())) {
            if (key.startsWith(keyPrefix)) {
                mRemoteVideoRenderer.remove(key);
            }
        }
        for (String key : new HashSet<>(mRemoteScreenRenderer.keySet())) {
            if (key.startsWith(keyPrefix)) {
                mRemoteScreenRenderer.remove(key);
            }
        }
    }
}
