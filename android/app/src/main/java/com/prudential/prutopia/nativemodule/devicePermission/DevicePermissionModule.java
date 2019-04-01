package com.prudential.prutopia.nativemodule.devicePermission;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.ArrayList;
import java.util.List;
import 	java.util.Set;
import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.media.AudioManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.prudential.prutopia.AppConstants;
import com.prudential.prutopia.MainActivity;
import com.prudential.prutopia.nativemodule.Constants;

public class DevicePermissionModule extends ReactContextBaseJavaModule {

    public DevicePermissionModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @Override
    public String getName() {
        return Constants.DEVICE_PERMISSION_BRIDGE;
    }

    @ReactMethod
    public void execute(String methodtype, ReadableMap details, Promise promise){

        switch(methodtype){
            case Constants.GET_DEVICE_PERMISSION:
                getDevicePermission(details, promise);
                break;
            case Constants.TOGGLE_DEVICE_SPEAKER:
                switchAudioOutput(promise);
                break;
            case Constants.GRANT_CAMERA_PERMISSION:
               grantCameraPermission(promise);
                break;
            case Constants.GRANT_MICRO_PHONE_PERMISSION:
                grantMicroPhonePermission(promise);
                break;
            default:
                promise.reject(Constants.METHOD_TYPE_ERROR, Constants.METHOD_TYPE_ERROR_MESSAGE);
                break;
        }
    }

    private void getDevicePermission(ReadableMap details, Promise promise){
        Bundle bundle = Arguments.toBundle(details);
        Set<String> bundleKeySet = bundle.keySet();
        String permission = "", permissionName  = "";

        for(String key : bundleKeySet){
            permissionName = bundle.get(key).toString();
        }
        switch (permissionName) {
            case Constants.CAMERA:
                permission = Manifest.permission.CAMERA;
                break;
            case Constants.MICRO_PHONE:
                permission = Manifest.permission.RECORD_AUDIO;
                break;default:
                promise.reject(Constants.METHOD_TYPE_ERROR, Constants.METHOD_TYPE_ERROR_MESSAGE);
                break;
        }
        int res = this.getCurrentActivity().checkCallingOrSelfPermission(permission);
        boolean isPermissionAlllowed = (res==0);
        promise.resolve(isPermissionAlllowed);
    }

    private  void grantCameraPermission(Promise promise) {
        MainActivity currentActivity = (MainActivity)this.getCurrentActivity();
        currentActivity.setResolver(AppConstants.PERMISSIONS_REQUEST_CAMERA, promise);
        ActivityCompat.requestPermissions(currentActivity, new String[]{Manifest.permission.CAMERA}, AppConstants.PERMISSIONS_REQUEST_CAMERA);
    }

    private  void grantMicroPhonePermission(Promise promise) {
        MainActivity currentActivity = (MainActivity)this.getCurrentActivity();
        currentActivity.setResolver(AppConstants.PERMISSIONS_REQUEST_RECORD_AUDIO, promise);
        ActivityCompat.requestPermissions(currentActivity, new String[]{Manifest.permission.RECORD_AUDIO},AppConstants.PERMISSIONS_REQUEST_RECORD_AUDIO);
    }

    //TO enable speaker in video chat of DOC ON CALL
    public void switchAudioOutput(final Promise promise) {
        AudioManager audioManager = (AudioManager)this.getCurrentActivity().getSystemService(this.getCurrentActivity().AUDIO_SERVICE);
        Boolean speakerPhoneOnResult  = audioManager.isSpeakerphoneOn();
        audioManager.setSpeakerphoneOn(!speakerPhoneOnResult);
        promise.resolve(!speakerPhoneOnResult);
    }
}


