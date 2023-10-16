//
//  EduBigClassDemoConstants.h
//  Pods
//
//  Created by on 2022/4/18.
//

#ifndef EduBigClassDemoConstants_h
#define EduBigClassDemoConstants_h

#define HomeBundleName @"EduBigClassDemo"
#define LightBundleName @"EduBigClassDemoLight"

/*
 火山控制台账户id， 使用会议录制功能时需要。
 https://console.volcengine.com/user/basics/
 */
#define AccountID @"2100153949"

/*
 点播空间名， 使用会议录制功能时需要。
 https://console.volcengine.com/vod/overview/
 */
#define VodSpace @"eduBigClass-product-demo"

#ifdef DEBUG

// 屏幕共享使用
#define ExtensionName @"vertc.veRTCDemo.ios.EduBigClassScreenShare"
#define APPGroupId @"group.vertc.veRTCDemo.ios.EduBigClassScreenShare"

#else
   
// 屏幕共享使用
#define ExtensionName @"rtc.veRTCDemo.ios.EduBigClassScreenShare"
#define APPGroupId @"group.rtc.veRTCDemo.ios.EduBigClassScreenShare"

#endif

#define MaxEduBigClassLimitedTimeInSecs         1800
#define MaxEduBigClassRecordLimitedTimeInSecs         15*60
#endif /* EduBigClassDemoConstants_h */
