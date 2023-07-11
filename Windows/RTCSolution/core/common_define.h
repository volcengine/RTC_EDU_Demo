#pragma once

struct SnapshotAttr {
    // {zh} 缩略图类型
    // {en} thumbnails type
    enum SnapshotType
    {
    kUnkonw = 0,
    // {zh} 屏幕类型
    // {en} display screen share
    kScreen,
    // {zh} 窗口类型
    // {en}  window share
    kWindow
    };
    // {zh} 缩略图名字
    // {en} thumbnail name
    std::string name;
    SnapshotType type = kUnkonw;
    // {zh} 共享源ID
    // {en} share source id
    void* source_id;
    // {zh} 缩略图序号
    // {en} thumbnail index
    int index = 0;
};