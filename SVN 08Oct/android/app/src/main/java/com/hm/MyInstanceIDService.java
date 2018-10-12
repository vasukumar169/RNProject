package com.hm;

/**
 * Created by vasu on 11/26/17.
 */
import android.content.Intent;
import android.util.Log;
import com.google.android.gms.iid.InstanceIDListenerService;

public class MyInstanceIDService extends InstanceIDListenerService {
  private static final String TAG = "MyInstanceIDService";

  @Override
  public void onTokenRefresh() {
    Log.d(TAG, "Refreshing GCM Registration Token");

    Intent intent = new Intent(this, RegistrationIntentService.class);
    startService(intent);
  }
}
