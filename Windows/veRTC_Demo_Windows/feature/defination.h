#pragma once

#define APP_KEY "5a7451222679214f668e7085"

namespace room_type{
    enum class CLASS_TYPE{
        UNKOWN=-1,
        LECTURE_HALL=0,
        BREAK_OUT=1,
    };

    enum class USER_ROLE{
        UNKOWN,
        TEACHER,
        STUDENT,
    };
};