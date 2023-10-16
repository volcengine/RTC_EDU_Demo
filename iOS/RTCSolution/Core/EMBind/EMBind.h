////
////  EMBind.h
////  Core
////
////  Created by guojian on 2023/1/11.
////
//
//#import <Foundation/Foundation.h>
//#import <KVOController/KVOController.h>
//#import "EXTKeyPathCoding.h"
//
//NS_ASSUME_NONNULL_BEGIN
//
////#define EMKP(KEYPATH) FBKVOKeyPath(KEYPATH)
////#define EMKPC(CLASS, KEYPATH) FBKVOClassKeyPath(CLASS, KEYPATH)
////#define EMBind(obj, tar, key, block) [EMBinding bindObserver:obj target:tar keyPath:@keypath(tar, key) block:block];
//
//
////typedef void(^EMBindBlock)(id observer, id value);
//
//@interface EMBinding : NSObject
//
////+ (void)bindObserver:(nonnull NSObject*)observer target:(nonnull NSObject*)target keyPath:(NSString *)keyPath block:(EMBindBlock)block;
//
//@end
//
//@interface FBKVOController (EMBind)
//
////- (void)em_observe:(nullable id)object keyPath:(NSString *)keyPath block:(EMBindBlock)block;
//
////@property(nonatomic, strong)EMBindBlock block;
//@end
//
//NS_ASSUME_NONNULL_END
