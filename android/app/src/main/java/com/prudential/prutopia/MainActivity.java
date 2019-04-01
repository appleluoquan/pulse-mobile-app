package com.prudential.prutopia;

import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.util.Log;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.aisolve.babylonapp.CustomUnityPlayer;
import com.babylon.domainmodule.gateway.exceptions.NetworkException;
import com.babylon.sdk.digitaltwin.BabylonDigitalTwinApi;
import com.babylon.sdk.digitaltwin.BabylonDigitalTwinSdk;
import com.babylon.sdk.digitaltwin.UnityPlayerListener;
import com.babylon.sdk.digitaltwin.model.BodyPart;
import com.babylon.sdk.digitaltwin.model.BodyPartAppearance;
import com.babylon.sdk.digitaltwin.model.BodyPartConfig;
import com.babylon.sdk.digitaltwin.model.DigitalTwin;
import com.babylon.sdk.digitaltwin.model.DigitalTwinLayerType;
import com.babylon.sdk.digitaltwin.model.Gender;
import com.babylon.sdk.healthcheck.BabylonHealthCheckSdk;
import com.babylon.sdk.healthcheck.domain.interactors.gethealthcategories.GetHealthCategoriesOutput;
import com.babylon.sdk.healthcheck.domain.interactors.gethealthcategories.GetHealthCategoriesRequest;
import com.babylon.sdk.healthcheck.domain.model.HealthCategory;
import com.babylon.sdk.healthcheck.domain.model.HealthCategoryDataAvailability;
import com.babylon.sdk.healthcheck.domain.model.HealthCategoryId;
import com.babylon.sdk.healthcheck.domain.model.HealthCategoryStatus;
import com.babylon.sdk.healthcheck.domain.model.HealthCategoryType;
import com.facebook.react.bridge.Promise;
import com.prudential.prutopia.nativemodule.Constants;
import com.facebook.react.ReactFragmentActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.jetbrains.annotations.NotNull;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import butterknife.ButterKnife;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.disposables.Disposable;
import timber.log.Timber;
import com.prudential.prutopia.library.babylon.activity.AbstractMainActivity;

public class MainActivity extends AbstractMainActivity  {

    CompositeDisposable compositeDisposable = new CompositeDisposable();
    BabylonDigitalTwinApi babylonDigitalTwinApi;
    private Disposable layerSelectionDisposable;
    private Map<BodyPart, BodyPartConfig> digitalTwinBodyParts;
    ViewGroup customUnityPlayer;
    Gender gender = Gender.Male.INSTANCE;
    DigitalTwinLayerType digitalTwinLayerType=DigitalTwinLayerType.Organs.INSTANCE;
    private Map<Integer, Promise> devicePermissionsResolver = new HashMap<>();

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "HealthCareApp";
    }

    public void setResolver(Integer permissionRequestType, Promise promise){
        devicePermissionsResolver.put(permissionRequestType, promise);
    }

    public Promise retrieveResolver(Integer permissionRequestType){
        return devicePermissionsResolver.remove(permissionRequestType);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ButterKnife.bind(this);
        createDigitalTwinView();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        Promise promise = retrieveResolver(requestCode);
        if(promise == null){
            super.onRequestPermissionsResult(requestCode, permissions, grantResults);
            return;
        }
        if (grantResults.length > 0
                && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            promise.resolve(true);
        } else {
            // permission denied
            promise.resolve(false);
        }
        return;
    }

    @Override
    protected void onDestroy() {
        compositeDisposable.clear();
        if (layerSelectionDisposable != null) {
            layerSelectionDisposable.dispose();
            layerSelectionDisposable = null;
        }
        super.onDestroy();
    }
}