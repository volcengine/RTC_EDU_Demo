//
//  EduSmallClassDemoConstants.h
//  Pods
//
//  Created by on 2022/4/18.
//

#ifndef EduSmallClassDemoConstants_h
#define EduSmallClassDemoConstants_h

#define HomeBundleName @"EduSmallClassDemo"
#define LightBundleName @"EduSmallClassDemoLight"

/*
 火山控制台账户id， 使用会议录制功能时需要。
 https://console.volcengine.com/user/basics/
 */
#define AccountID @"2100153949"

/*
 点播空间名， 使用会议录制功能时需要。
 https://console.volcengine.com/vod/overview/
 */
#define VodSpace @"EduSmallClass-product-demo"

#ifdef DEBUG

// 屏幕共享使用
#define ExtensionName @"vertc.veRTCDemo.ios.MeetingScreenShare"
#define APPGroupId @"group.vertc.veRTCDemo.ios.MeetingScreenShare"

#else
   
// 屏幕共享使用
#define ExtensionName @"rtc.veRTCDemo.ios.MeetingScreenShare"
#define APPGroupId @"group.rtc.veRTCDemo.ios.meetingScreenShare"

#endif

#define MaxEduSmallClassLimitedTimeInSecs         1800
#define MaxEduSmallClassRecordLimitedTimeInSecs         15*60
#endif /* EduSmallClassDemoConstants_h */
