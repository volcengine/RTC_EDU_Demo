package com.volcengine.vertcdemo.core;

import java.util.concurrent.CopyOnWriteArraySet;

public class AbsHandlerPool<T> {

    private final CopyOnWriteArraySet<T> mHandlers = new CopyOnWriteArraySet<>();

    public void addHandler(T listener) {
        mHandlers.add(listener);
    }

    public void removeHandler(T listener) {
        mHandlers.remove(listener);
    }

    public void dispose() {
        mHandlers.clear();
    }

    public void notifyHandler(Consumer<T> action) {
        forEach(mHandlers, action);
    }

    public interface Consumer<T> {
        void accept(T t);
    }

    static <T> void forEach(CopyOnWriteArraySet<T> set, Consumer<T> action) {
        for (T t : set) {
            action.accept(t);
        }
    }
}
