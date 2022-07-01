#include "util_error.h"

static const vrd::ErrorInfo errorInfos[] = 
{
	{ 406, "会议房间已满员", true },
	{ 407, "该用户正在使用老师身份上课，当前无法使用学生身份", true },
	{ 409, "该用户正在使用学生身份，当前无法使用老师身份", true },
	{ 412, "屏幕共享发起失败，请提示前一位参会者结束共享", true },
	{ 422, "房间已经解散", true },
	{ 430, "输入内容包含敏感词，请重新输入", true },
	{ 440, "验证码过期，请重新发送验证码", true },
	{ 441, "验证码不正确，请重新发送验证码", true },
	{ 450, "登录已经过期，请重新登录", true },
	{ 461, "视频互动已关闭", false },
	{ 471, "该学生已上台", false },
	{ 472, "上台学生已满", false },
	{ 500, "发生错误", true },
	{ 503, "全体静音失败，请重试", true },
	{ 504, "移交主持人失败，请重试", true },
	{ 702, "服务端Token生成失败，请重试", true },

	{ 0, nullptr, false }
};

namespace vrd
{
	namespace util
	{
		const ErrorInfo *getErrorInfo(int64_t code)
		{
			const ErrorInfo *p = errorInfos;
			while (p->error_code != 0)
			{
				if (p->error_code == code)
				{
					return p;
				}

				++p;
			}

			return nullptr;
		}
	}
}
