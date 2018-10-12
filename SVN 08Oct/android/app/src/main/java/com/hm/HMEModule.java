package com.hm;


import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.microsoft.windowsazure.notifications.NotificationsManager;

/**
 * Created by vasu on 11/30/17.
 */

public class HMEModule extends ReactContextBaseJavaModule {
  public HMEModule(ReactApplicationContext context) {
    super(context);
  }

  @ReactMethod
  public void startPushNotification() {
    NotificationsManager.handleNotifications(super.getReactApplicationContext(), NotificationSettings.SenderId, MyHandler.class);
  }

  @Override
  public String getName() {
    return "HME";
  }
}
