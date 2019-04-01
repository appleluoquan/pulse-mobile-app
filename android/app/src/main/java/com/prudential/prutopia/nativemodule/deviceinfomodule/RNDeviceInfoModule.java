package com.prudential.prutopia.nativemodule.deviceinfomodule;

import android.os.Build;
import android.provider.Settings;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.prudential.prutopia.nativemodule.Constants;

public class RNDeviceInfoModule extends ReactContextBaseJavaModule {


    public RNDeviceInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return Constants.DEVICE_INFO_BRIDGE;
    }


    @ReactMethod
    public void execute(String methodtype, ReadableMap details, Promise promise){

        switch(methodtype){
            case Constants.GET_DEVICE_DETAIL:
                  getDeviceDetial( promise);
                break;

            default:
                promise.reject(Constants.METHOD_TYPE_ERROR, Constants.METHOD_TYPE_ERROR_MESSAGE);
                break;
        }
    }

    private void getDeviceDetial(Promise promise){
        WritableMap detail = Arguments.createMap();
        String uniqueID  =  Settings.Secure.getString(getReactApplicationContext().getContentResolver(), Settings.Secure.ANDROID_ID);
        String deviceType = "DEVICE_TYPE_ANDROID";
        String notificationToken = "";
        detail.putString("deviceId", uniqueID);
        detail.putString("deviceType", deviceType);
        detail.putString("notificationToken", notificationToken);
        promise.resolve(detail);
    }
}
