//
//  AppDelegate+FirebaseCrash.m
//  FirebaseXSample
//
//  Created by VENKADESH on 08/11/19.
//

#import "AppDelegate+FirebaseCrash.h"
#import <objc/runtime.h>
#import <Fabric/Fabric.h>
#import <FirebaseCore/FirebaseCore.h>

@implementation AppDelegate (FirebaseCrash)

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class class = [self class];
        
        SEL defaultSelector = @selector(application:didFinishLaunchingWithOptions:);
        SEL swizzledSelector = @selector(swizzled_application:didFinishLaunchingWithOptions:);
        
        Method defaultMethod = class_getInstanceMethod(class, defaultSelector);
        Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);
        
        BOOL isMethodExists = !class_addMethod(class, defaultSelector, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod));
        
        if (isMethodExists) {
            method_exchangeImplementations(defaultMethod, swizzledMethod);
        }
        else {
            class_replaceMethod(class, swizzledSelector, method_getImplementation(defaultMethod), method_getTypeEncoding(defaultMethod));
        }
    });
}

#pragma mark - Method Swizzling

- (BOOL)swizzled_application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions {
    [FIRApp configure];
    [Fabric sharedSDK].debug = true;
    return [self swizzled_application:application didFinishLaunchingWithOptions:launchOptions];
}

@end
