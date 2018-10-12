package com.hm;

/**
 * Created by vasu on 11/27/17.
 */

import android.content.Context;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.microsoft.windowsazure.notifications.NotificationsHandler;

public class MyHandler extends NotificationsHandler {
  Context mainContext;
  ReactContext reactApplicationContext;
  DeviceEventManagerModule.RCTDeviceEventEmitter emitter;

  public MyHandler() {
    Log.d("Handler", "ctor");
  }

  @Override
  public void onRegistered(Context context, String gcmRegistrationId) {
    Log.d("Handler", gcmRegistrationId);
    this.mainContext = context;
  }

  @Override
  public void onReceive(Context context, Bundle bundle) {
    emitter = ((ReactApplicationContext)mainContext).getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

    String nhMessage = bundle.getString("message");
    emitter.emit("Notification", nhMessage);
    Log.d("Handler", nhMessage);
  }
}