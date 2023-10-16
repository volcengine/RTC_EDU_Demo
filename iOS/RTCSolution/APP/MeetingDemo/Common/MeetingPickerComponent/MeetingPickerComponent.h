//
//  MeetingPickerComponent.h
//  quickstart
//
//  Created by on 2021/3/23.
//  
//

#import <Foundation/Foundation.h>

@interface MeetingPickerComponent : NSObject

@property (nonatomic, copy) NSString *titleStr;

@property (nonatomic, copy) void (^clickDismissBlock)(BOOL isCancel, id selectItem, NSInteger row);

- (instancetype)initWithHeight:(CGFloat)height superView:(UIView *)superView;

- (void)show:(NSArray *)dataLists selectItem:(id)item;

@end
