/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <NewRelicAgent/NewRelic.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTPushNotificationManager.h>
NSDictionary *Componet_Dict;
NSMutableString * value_cart;
@implementation AppDelegate
@synthesize Store_Msg,Store_name;
RCT_EXPORT_MODULE();
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  Store_name=@"";
  Store_Msg=@"";
  Componet_Dict=[[NSDictionary alloc] init];
  [NewRelicAgent startWithApplicationToken:@"AA3c424f74367957ecef00e66a399c12bc04399af7"];
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"HM"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  //Notification
 UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeSound |
                                          UIUserNotificationTypeAlert | UIUserNotificationTypeBadge categories:nil];
  [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
  [[UIApplication sharedApplication] registerForRemoteNotifications];
  return YES;
}
#pragma react native communication
RCT_REMAP_METHOD(getThing,
                 resolver: (RCTPromiseResolveBlock)resolve
                 rejecter: (RCTPromiseRejectBlock)reject)
{
  NSString *thingToReturn = @"a5446c4537385d09550b3bb17979cf470b523b24e0b197ccafcfa89925aa6e40";//@"Hello World!";
  NSString * device_ID =[[NSUserDefaults standardUserDefaults] valueForKey:@"device_token"];
  NSLog(@"Kumar Vasu Device ID %@",device_ID);
  if (device_ID.length>0) {
    resolve(device_ID);
  }
  else{
  resolve(thingToReturn);
  }
}

#pragma  Notification Method
- (void) application:(UIApplication *) application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *) deviceToken {
  [UIApplication sharedApplication];
  SBNotificationHub* hub = [[SBNotificationHub alloc] initWithConnectionString:HUBLISTENACCESS notificationHubPath:HUBNAME];
  NSLog(@"Data = %@",deviceToken);
  NSString *device_token =  [[[[deviceToken description]
                      stringByReplacingOccurrencesOfString: @"<" withString: @""]
                     stringByReplacingOccurrencesOfString: @">" withString: @""]
                    stringByReplacingOccurrencesOfString: @" " withString: @""];
[[NSUserDefaults standardUserDefaults] setValue:device_token forKey:@"device_token"];
  //////
 /* UIAlertController * alert = [UIAlertController
                               alertControllerWithTitle:@""
                               message:device_token
                               preferredStyle:UIAlertControllerStyleAlert];
  UIAlertAction* yesButton = [UIAlertAction
                              actionWithTitle:@"OK"
                              style:UIAlertActionStyleDefault
                              handler:^(UIAlertAction * action) {
                              }];
  UIAlertAction* noButton = [UIAlertAction
                             actionWithTitle:@"Cancel"
                             style:UIAlertActionStyleDefault
                             handler:^(UIAlertAction * action) {
                               //Handle no, thanks button
                             }];
  [alert addAction:noButton];
  [alert addAction:yesButton];
  [self.window.rootViewController presentViewController:alert animated:YES completion:nil];*/
  ///////////
NSLog(@"The generated device token string is : %@",device_token);
NSDictionary *deviceT = @{@"devicetoken":device_token};
NSLog(@"Dictionary %@",deviceT);
NSSet * set1=[NSSet setWithObject:device_token];
[hub registerNativeWithDeviceToken:deviceToken tags:set1 completion:^(NSError* error){
    if (error != nil) {
      NSLog(@"Error registering for notifications: %@", error);
    }
    else {
       NSLog(@"Message registering for this device notifications: %@", device_token);
      [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
    }
  }];
}

/*-(void)MessageBox:(NSString *) title message:(NSString *)messageText
{
//  UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title message:messageText delegate:self
//                                        cancelButtonTitle:@"OK" otherButtonTitles: nil];
//  [alert show];
  /////////////
//  if (![title isEqualToString:Store_name] && ![messageText isEqualToString:Store_Msg] && [title length]>0 && [messageText length]>0) {
//    [self performSelector:@selector(message) withObject:self afterDelay:1.0];
//  }
  UIAlertController * alert = [UIAlertController
                               alertControllerWithTitle:title
                               message:messageText
                               preferredStyle:UIAlertControllerStyleAlert];
  //Add Buttons
  //image code on alert
  UIImageView *imageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 40, 40,40)];
  NSString *path = [[NSString alloc] initWithString:[[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"ios.png"]];
  UIImage *bkgImg = [[UIImage alloc] initWithContentsOfFile:path];
  [imageView setImage:bkgImg];
  [alert.view addSubview:imageView];
 
  UIAlertAction* yesButton = [UIAlertAction
                              actionWithTitle:@"OK"
                              style:UIAlertActionStyleDefault
                              handler:^(UIAlertAction * action) {
                                //Handle your yes please button action here
                                //[self clearAllData];
                                [self Componet_Redirect];
                               // [self subscribe:[NSString stringWithFormat:@"%@"]
                              }];
  UIAlertAction* noButton = [UIAlertAction
                             actionWithTitle:@"Cancel"
                             style:UIAlertActionStyleDefault
                             handler:^(UIAlertAction * action) {
                               //Handle no, thanks button
                             }];
  //Add your buttons to alert controller
  [alert addAction:noButton];
  [alert addAction:yesButton];
  [self.window.rootViewController presentViewController:alert animated:YES completion:nil];
  /////////////////////////////////////////
}
-(void)Componet_Redirect
{
NSString * convert_string = [NSString stringWithFormat:@"%@",Componet_Dict];
NSLog(@"Componet Dictionary is that ---------   - -   - - - - %@",convert_string);
[[NSUserDefaults standardUserDefaults] setObject:convert_string forKey:@"Controller redirect"];
}
-(void)subscribe:(NSString *)event withCallback:(RCTResponseSenderBlock) callback
{
  
}
////////////////
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  NSLog(@"%@", userInfo);
  Componet_Dict=userInfo;
  //UIApplicationState state = [application applicationState];
  NSDictionary *value=[[NSDictionary alloc] initWithDictionary:userInfo];
  NSDictionary * value1 =[[value objectForKey:@"aps"] valueForKey:@"alert"];
  NSString * Key_Match=@"";
  NSString *timing =@"";
  NSDictionary *dict1;
  NSString * value_cart =@"";
  id product_value;
  NSString * product_type =@"";
  for (NSString *key in value1) {
    if ([key isEqualToString:@"DAYPART"]) {
      Key_Match = key;
    }
    if ([key isEqualToString:@"DAY"]) {
      Key_Match = key;
      }
    id value = value1[key];
    NSLog(@"Value: %@ for key: %@", value, key);
  }
  
  
  dict1=[value1 objectForKey:Key_Match];
  //dict1=[value1 objectForKey:@"DAYPART"];
  NSString *start_time = [dict1 valueForKey:@"StartTime"];
  NSString *end_time = [dict1 valueForKey:@"EndTime"];
  int numberOfSeconds = [start_time intValue];
  //int seconds = numberOfSeconds % 60;
  int minutes = (numberOfSeconds / 60) % 60;
  int hours = numberOfSeconds / 3600;
  int end_numbertOfSeconds = [end_time intValue];
  //int end_seconds = end_numbertOfSeconds % 60;
  int end_minutes = (end_numbertOfSeconds / 60) % 60;
  int end_hours = end_numbertOfSeconds / 3600;
  
  //we have >=1 hour => example : 3h:25m
  if (hours) {
    [NSString stringWithFormat:@"%d:%02d", hours, minutes];
  }
  //we have 0 hours and >=1 minutes => example : 3m:25s
  if (end_hours) {
    [NSString stringWithFormat:@"%d:%02d", end_hours, end_minutes];
  }
  timing = [NSString stringWithFormat:@"%@%@%@%@%@",Key_Match,@" ",[NSString stringWithFormat:@"%d:%02d", hours, minutes],@" - ",[NSString stringWithFormat:@"%d:%02d", end_hours, end_minutes]];
  for (NSString *key in dict1) {
    if (![key isEqualToString:@"EndTime"] && ![key isEqualToString:@"StartTime"]) {
      value_cart = key;
      product_value = dict1[key];
    }
  }
  product_type = [NSString stringWithFormat:@"%@%@%@%@%@",value_cart,@" ",@">",@" ",product_value];
  // NSString *timing = [NSString stringWithFormat:@"%@%@%@%@%@",Key_Match,@" ",[dict1 valueForKey:@"StartTime"],@"-",[dict1 valueForKey:@"EndTime"]];
  NSLog(@"timing ------ %@",timing);
  NSLog(@"Product type ----- %@",product_type);
  //NSArray *next =[value1 objectForKey:@"loc-args"];
  NSLog(@"how to show it --------%@",[value1 valueForKey:@"StoreName"]);
  
  
  
  //Application state
  if(application.applicationState == UIApplicationStateInactive) {
    NSLog(@"Inactive");
    //Show the view with the content of the push
    [self MessageBox:[value1 valueForKey:@"StoreName"] message:[NSString stringWithFormat:@"%@%@%@",timing,@"\n",product_type]];
    completionHandler(UIBackgroundFetchResultNewData);
  } else if (application.applicationState == UIApplicationStateBackground) {
    NSLog(@"Background");
    //Refresh the local model
    [self MessageBox:[value1 valueForKey:@"StoreName"] message:[NSString stringWithFormat:@"%@%@%@",timing,@"\n",product_type]];
    completionHandler(UIBackgroundFetchResultNewData);
  } else {
    NSLog(@"Active");
    [self MessageBox:[value1 valueForKey:@"StoreName"] message:[NSString stringWithFormat:@"%@%@%@",timing,@"\n",product_type]];
    //Show an in-app banner
    completionHandler(UIBackgroundFetchResultNewData);
  }
}*/
/////////////////////////////// NOtification part ///////////////////////
// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
//- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
//{
//  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
//}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}


@end
