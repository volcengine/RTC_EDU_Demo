////
////  EMBind.m
////  Core
////
////  Created by guojian on 2023/1/11.
////
//
//#import "EMBind.h"
//#import <objc/message.h>
//#import "Constants.h"
//
//static void *NSObjectEMBindKey = &NSObjectEMBindKey;
//
//@implementation EMBinding
//
//+ (void)bindObserver:(NSObject *)observer target:(NSObject *)target keyPath:(NSString *)keyPath block:(EMBindBlock)block {
//    [observer.KVOController em_observe:target keyPath:keyPath block:block];
//}
//
//@end
//
//@implementation FBKVOController (EMBind)
//
//- (void)em_observe:(id)object keyPath:(NSString *)keyPath block:(EMBindBlock)block {
//    @weakify(self);
//    [self observe:object keyPath:keyPath
//          options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld
//            block:^(id  _Nullable observer, id  _Nonnull object, NSDictionary<NSString *,id> * _Nonnull change) {
//        block(observer, change[NSKeyValueChangeNewKey]);
//    }];
//}
//
//- (EMBindBlock)block
//{
//  id block = objc_getAssociatedObject(self, NSObjectEMBindKey);
//
//  return block;
//}
//
//- (void)setBlock:(EMBindBlock)block
//{
//  objc_setAssociatedObject(self, NSObjectEMBindKey, block, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
//}
//@end
