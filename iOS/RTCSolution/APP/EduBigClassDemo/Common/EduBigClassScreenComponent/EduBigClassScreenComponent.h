//
//  EduBigClassScreenComponent.h
//  quickstart
//
//  Created by on 2021/4/6.
//  
//

#import <Foundation/Foundation.h>

@interface EduBigClassScreenComponent : NSObject

@property (nonatomic, assign, readonly) BOOL isSharing;

@property (nonatomic, assign) BOOL isTurnOffCamera;

- (void)start:(ByteRTCScreenMediaType)mediaType withBlock:(void (^)(void))block;

- (void)update:(ByteRTCScreenMediaType)mediaType;

- (void)stop;

-(void)stopScreenCapture;

@end
