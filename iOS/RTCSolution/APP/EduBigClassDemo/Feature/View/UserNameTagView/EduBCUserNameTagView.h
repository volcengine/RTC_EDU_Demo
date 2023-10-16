//
//  UserNameView.h
//
//  Created by on 2022/11/12.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface EduBCUserNameTagView : UIView

@property (nonatomic, assign) NSInteger fontSize;

@property (nonatomic, copy) NSString *title;

@property (nonatomic, assign) BOOL isHost;

@property (nonatomic, assign) BOOL isShare;

@property (nonatomic, assign) BOOL isBanMic;

@end

NS_ASSUME_NONNULL_END
