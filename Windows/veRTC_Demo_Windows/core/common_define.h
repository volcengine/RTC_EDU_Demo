#pragma once

struct SnapshotAttr {
    enum SnapshotType  // thumbnails type
    {
    kUnkonw = 0,
    kScreen,  // display screen share
    kWindow   // window share
    };

    std::string name;  // thumbnail name
    SnapshotType type = kUnkonw;
    void* source_id;  // share source id
    int index = 0;    // thumbnail index
};