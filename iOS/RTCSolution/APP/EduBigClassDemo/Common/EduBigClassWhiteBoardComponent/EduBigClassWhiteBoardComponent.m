//
//  EduBigClassWhiteBoardComponent.m
//  
//

#import "EduBigClassWhiteBoardComponent.h"

#import <WhiteBoard/ByteWhiteBoard.h>
#import <WhiteBoard/ByteWhiteBoardRoomManager.h>
#import <WhiteBoard/ByteWhiteBoardRoom.h>
#import "EduBCRoomWhiteBoardView.h"

@interface EduBigClassWhiteBoardComponent() <ByteWhiteBoardRoomDelegate, ByteWhiteBoardDelegate>

@property (nonatomic, strong) EduBCRoomWhiteBoardView *whiteBoardView;

@property (nonatomic, strong) ByteWhiteBoardRoomManager *boardRoomManager;
@property (nonatomic, strong) ByteWhiteBoardRoom *boardRoom;
@property (nonatomic, strong) ByteWhiteBoard *board;

@end

@implementation EduBigClassWhiteBoardComponent

- (instancetype)init
{
    self = [super init];
    if (self) {
        _isSharing = NO;
    }
    return self;
}

- (instancetype)initWithwhiteBoardView:(EduBCRoomWhiteBoardView *)whiteBoardView superView:(UIView *)superView {
    self = [super init];
    if (self) {
        _isSharing = NO;
        
        // 显示白板的view
        self.whiteBoardView = whiteBoardView;
        self.whiteBoardView.hidden = YES;
            
        [superView addSubview:self.whiteBoardView];
        [self.whiteBoardView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(superView);
        }];
        
        UIView *topView = whiteBoardView.topInfoView;
        [superView.superview addSubview:topView];//bgView
        [topView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.right.equalTo(superView);
            make.top.equalTo(superView);
            make.height.mas_equalTo(54);
        }];
        
        [superView setNeedsDisplay];
        [superView layoutIfNeeded];
    }
    return self;
}

- (void)setIsLandscape:(BOOL)isLandscape {
    _isLandscape = isLandscape;
    self.whiteBoardView.isLandscape = isLandscape;
}

#pragma mark - Publish Action

- (void)createBoardRoomManagerCompletionHandler:(void (^)(void))block {
    if (self.boardRoomManager != nil) {
        if (block) {
            block();
        }
        return;
    }
    
    // 创建白板
    int env = 0; //0 代表正式环境 2 test 1 boe
    NSString *appId = [PublicParameterComponent share].appId;
    NSString *deviceId = [NetworkingTool getDeviceId];
    NSString *aid = @"351599";
    
    [ByteWhiteBoardRoomManager setDeviceID:deviceId];
    [ByteWhiteBoardRoomManager setAid:aid];
    [ByteWhiteBoardRoomManager setEnv:env];

    UIView *boardView = self.whiteBoardView.boardView;
    
    self.boardRoomManager = [ByteWhiteBoardRoomManager sharedEngineWithAppId:appId bindToWindow:boardView completionHandler:^{
        NSLog(@"boardRoomManager create success");
        if (block) {
            block();
        }
    }];
    
    NSLog(@"self.boardRoomManager = %@",self.boardRoomManager);
}

- (void)joinRoom:(NSString *)roomId userId:(NSString *)uid token:(NSString *)token {
    
    WeakSelf
    
    [self createBoardRoomManagerCompletionHandler:^{
        
        wself.isSharing = YES;
        if (wself.boardRoomManager && !wself.boardRoom) {
            ByteWhiteBoardInfo *boardInfo = [[ByteWhiteBoardInfo alloc] init];
            boardInfo.boardID = 1;
            boardInfo.boardName = @"";
            boardInfo.backgroundInfo.bkColor = [UIColor greenColor];
            
            ByteWhiteBoardPageInfo *pageInfo = [[ByteWhiteBoardPageInfo alloc] init];
            pageInfo.pageID = @"000";
            pageInfo.bkInfo = [[ByteWhiteBoardBackgroundInfo alloc] init];
            
            boardInfo.pageInfos = @[pageInfo];
            
            [wself.boardRoomManager joinRoom:roomId userID:uid token:token defalutBoard:boardInfo completionHandler:^(ByteWhiteBoardRoom * _Nonnull boardRoom) {
                NSLog(@"boardRoomManager joinRoom success");
                
                wself.boardRoom = boardRoom;
                wself.whiteBoardView.hidden = NO;
                
            } delegate:wself];
        }
        
    }];
}

- (void)leavRoom {
    NSLog(@"%@,%s",[NSThread currentThread],__func__);

    [self.boardRoom leaveRoom];
    self.boardRoom = nil;
    
    if (self.boardRoomManager) {
        [ByteWhiteBoardRoomManager destroy];
        self.boardRoomManager = nil;
    }

    self.isSharing = NO;
    self.whiteBoardView.hidden = YES;
}

- (void)destroy {
    [self leavRoom];
    
    if (self.boardRoomManager) {
        [ByteWhiteBoardRoomManager destroy];
        self.boardRoomManager = nil;
    }
}
#pragma mark - ByteWhiteBoardDelegate

- (void)byteWhiteBoardRoom:(ByteWhiteBoardRoom *)boardRoom onLeaveRoomResult:(NSString *)roomID reason:(NSInteger)errCode {
    NSLog(@"LeaveWbRoom:%@, errCode:%ld", roomID, errCode);
    if (self.whiteBoardView) {
        [self.whiteBoardView onWhiteBoardStoped:self.board];
    }
}

- (void)byteWhiteBoardRoom:(ByteWhiteBoardRoom *)boardRoom onCurrentWhiteBoardChanged:(NSString *)userId activeBoard:(NSInteger)activeBoardId whiteboard:(ByteWhiteBoard *)board {
    NSLog(@"%@,%s board = %@",[NSThread currentThread],__func__,board);

    self.board = board;
            
    if (self.whiteBoardView) {
        [self.whiteBoardView onWhiteBoardRoom:boardRoom started:board];
    }
}

- (void)byteWhiteBoardRoom:(ByteWhiteBoardRoom *)boardRoom onCreateWhiteBoard:(NSString *)userId boardId:(NSInteger)boardId whiteboard:(ByteWhiteBoard *)board pptInfo:(ByteWhiteBoardPptInfo *)pptInfo {
    NSLog(@"%@,%s, board = %@",[NSThread currentThread],__func__,board);

}

- (void)byteWhiteBoardRoom:(ByteWhiteBoardRoom *)boardRoom onRemoveWhiteBoard:(NSString *)userId boardId:(NSInteger)boardId pptInfo:(ByteWhiteBoardPptInfo *)pptInfo {
    NSLog(@"%@,%s, boardId = %ld",[NSThread currentThread],__func__,boardId);

}

- (void)byteWhiteBoard:(ByteWhiteBoard *)board onError:(ByteWhiteBoardErrorCode)code message:(NSString *)message {
    NSLog(@"onWbManagerError: %ld", code);
    if (self.whiteBoardView) {
        [self.whiteBoardView onWhiteBoardError:code];
    }
}

- (void)byteWhiteBoardRoom:(ByteWhiteBoardRoom *)boardRoom onError:(ByteWhiteBoardErrorCode)code message:(NSString *)message {
    NSLog(@"onWbRoomError: %ld", code);
    if (self.whiteBoardView) {
        [self.whiteBoardView onWhiteBoardError:code];
    }
}

- (void)byteWhiteBoard:(ByteWhiteBoard *)board onPageIndexChanged:(int)current_index {
    NSLog(@"%@,%s",[NSThread currentThread],__func__);

    if ([self.whiteBoardView respondsToSelector:@selector(onWhiteBoardPageIndexChange)]) {
        [self.whiteBoardView onWhiteBoardPageIndexChange];
    }
}

- (void)byteWhiteBoard:(ByteWhiteBoard *)board onRemovePages:(NSString *)userId boardId:(NSInteger)boardId pages:(NSArray<NSString *> *)pageIDs {
    
    NSLog(@"%@,%s",[NSThread currentThread],__func__);

    if ([self.whiteBoardView respondsToSelector:@selector(onWhiteBoardPageIndexChange)]) {
        [self.whiteBoardView onWhiteBoardPageIndexChange];
    }
}

@end
