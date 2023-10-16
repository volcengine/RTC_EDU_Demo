//
//  MockDataComponent.m
//  quickstart
//

#import "MockDataComponent.h"
#import "SettingsService.h"

@interface MockDataComponent ()

@property (nonatomic, copy) NSArray *bitRatelists;
@property (nonatomic, copy) NSDictionary *mockDataDic;

@end

@implementation MockDataComponent

- (instancetype)init {
    self = [super init];
    if (self) {
        _resolutionLists = [self resolutionListsWithMockData:self.mockDataDic];
        _bitRatelists = [self bitRateListsWithMockData:self.mockDataDic];
    }
    return self;
}

#pragma mark - Publish Action

- (NSRange)selectBitRateRangWithRow:(NSInteger)row {
    //根据分辨率选择对应的码率
    //Select the corresponding bit rate according to the resolution
    NSValue *value = self.bitRatelists[row];
    _bitRateRang = [value rangeValue];

    NSInteger bitRate = [SettingsService getKBitRate];
    if (bitRate < _bitRateRang.location) {
        bitRate = _bitRateRang.location;
    }
    if (bitRate > _bitRateRang.location + _bitRateRang.length) {
        bitRate = _bitRateRang.location + _bitRateRang.length;
    }
    [SettingsService setKBitRate:(int)bitRate];

    return _bitRateRang;
}

- (NSRange)selectScreenBitRateRangWithRow:(NSInteger)row isDefault:(BOOL)isDefault {
    //根据分辨率选择对应的码率
    //Select the corresponding bit rate according to the resolution
    NSValue *value = self.bitRatelists[row];
    _bitScreenRateRang = [value rangeValue];

    NSInteger bitRate = [SettingsService getKBitRate];
    if (bitRate < _bitScreenRateRang.location) {
        bitRate = _bitScreenRateRang.location;
    }
    if (bitRate > _bitScreenRateRang.location + _bitScreenRateRang.length) {
        bitRate = _bitScreenRateRang.location + _bitScreenRateRang.length;
    }
    if (!isDefault) {
        [SettingsService setScreenKBitRate:(int)bitRate];
    }

    return _bitScreenRateRang;
}

#pragma mark - Private Action

- (NSArray *)resolutionListsWithMockData:(NSDictionary *)mockDataDic {
    NSMutableArray *mutableLists = [[NSMutableArray alloc] init];
    NSArray *resolutionLists = mockDataDic[@"ResolutionLists"];
    for (int i = 0; i < resolutionLists.count; i++) {
        NSDictionary *dic = resolutionLists[i];
        NSMutableArray *lists = [[NSMutableArray alloc] init];
        [lists addObject:dic[@"width"]];
        [lists addObject:dic[@"height"]];
        
        [mutableLists addObject:lists];
    }
    return [mutableLists copy];
}

- (NSArray *)bitRateListsWithMockData:(NSDictionary *)mockDataDic {
    NSMutableArray *mutableLists = [[NSMutableArray alloc] init];
    NSArray *bitRatelists = mockDataDic[@"BitRatelists"];
    for (int i = 0; i < bitRatelists.count; i++) {
        NSDictionary *dic = bitRatelists[i];
        NSNumber *minValue = dic[@"min"];
        NSNumber *maxValue = dic[@"max"];
        NSValue *range = [NSValue valueWithRange:NSMakeRange([minValue integerValue], [maxValue integerValue] - [minValue integerValue])];
        [mutableLists addObject:range];
    }
    return [mutableLists copy];
}

- (NSArray *)frameRateLists {
    if (!_frameRateLists) {
        _frameRateLists = @[@(15),@(20),@(24)];
    }
    return _frameRateLists;
}

- (NSDictionary *)mockDataDic {
    if (!_mockDataDic) {
        _mockDataDic = @{
            @"BitRatelists" : @[
                @{
                    @"max" : @(150),
                    @"min" : @(40)
                },
                @{
                    @"max" : @(350),
                    @"min" : @(80)
                },
                @{
                    @"max" : @(400),
                    @"min" : @(100)
                },
                @{
                    @"max" : @(1000),
                    @"min" : @(200),
                },
                @{
                    @"max" : @(1000),
                    @"min" : @(200),
                },
                @{
                    @"max" : @(1000),
                    @"min" : @(250),
                },
                @{
                    @"max" : @(1600),
                    @"min" : @(400),
                },
                @{
                    @"max" : @(2000),
                    @"min" : @(500),
                },
                @{
                    @"max" : @(3000),
                    @"min" : @(800),
                }
            ],
            @"ResolutionLists" : @[
                @{
                    @"height" : @(160),
                    @"width" : @(160),
                },
                @{
                    @"height" : @(320),
                    @"width" : @(180),
                },
                @{
                    @"height" : @(320),
                    @"width" : @(240),
                },
                @{
                    @"height" : @(640),
                    @"width" : @(360),
                },
                @{
                    @"height" : @(480),
                    @"width" : @(480),
                },
                @{
                    @"height" : @(640),
                    @"width" : @(480),
                },
                @{
                    @"height" : @(960),
                    @"width" : @(540),
                },
                @{
                    @"height" : @(1280),
                    @"width" : @(720),
                },
                @{
                    @"height" : @(1920),
                    @"width" : @(1080),
                }
            ]
        };
    }
    return _mockDataDic;
}

@end
