package com.prudential.prutopia;

import android.app.Application;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.babylon.sdk.core.BabylonCoreSDK;

import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.core.CrashlyticsCore;

import com.facebook.react.ReactApplication;
// import com.evollu.react.fcm.FIRMessagingPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.henninghall.date_picker.DatePickerPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.opensettings.OpenSettingsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.horcrux.svg.SvgPackage;
import com.prudential.prutopia.nativemodule.devicePermission.DevicePermissionPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.reactnative.googlefit.GoogleFitPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.rnfs.RNFSPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.prudential.prutopia.nativemodule.locationModule.LocationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.prudential.prutopia.library.babylon.healthcheck.HealthCheckPackage;
import com.google.firebase.analytics.FirebaseAnalytics;
import com.prudential.prutopia.library.babylon.auth.RNChatbotAuthPackage;
import com.prudential.prutopia.library.babylon.babyloncommon.RNBabylonCommonPackage;
import com.prudential.prutopia.library.babylon.chat.RNBabylonChatPackage;
import com.prudential.prutopia.library.babylon.clinicalrecords.RNClinicalRecordsPackage;
import com.prudential.prutopia.nativemodule.deviceinfomodule.RNDeviceInfoPackage;
import com.prudential.prutopia.library.babylon.digitaltwin.RNDigitalTwinPackage;
import com.opentokreactnative.OTPackage;

import java.util.Arrays;
import java.util.List;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.fabric.sdk.android.Fabric;

public class MainApplication extends Application implements ReactApplication {

  private static final String APP_IDENTIFIER = "prudential";
  private static final String BABYLON_MALAYSIAN_ENGLISH="en-MY";
  private static final String BABYLON_MALAYSIAN_BAHASA="ms-MY";
  private static final String BABYLON_DEFAULT_UK_ENGLISH="en-GB";

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(new MainReactPackage(),
            // new FIRMessagingPackage(),
          new RNFirebasePackage(),
          new RNFirebaseMessagingPackage(),
          new RNFirebaseNotificationsPackage(),
          new OTPackage(),
          new OpenSettingsPackage(),
          new DatePickerPackage(),
          new RNSensitiveInfoPackage(),
          new MapsPackage(),
          new RNI18nPackage(),
          new SvgPackage(),
          new FingerprintAuthPackage(),
          new GoogleFitPackage(BuildConfig.APPLICATION_ID),
          new RNFetchBlobPackage(),
          new VectorIconsPackage(),
          new RNShakeEventPackage(),
          new RNGoogleSigninPackage(),
          new RNFSPackage(),
          new FacebookLoginPackage(),
          new ReactNativeContacts(),
          new PickerPackage(),
          new LocationPackage(),
          new RNChatbotAuthPackage(),
          new RNBabylonChatPackage(),
          new RNClinicalRecordsPackage(),
          new RNDigitalTwinPackage(),
          new HealthCheckPackage(),
          new RNDeviceInfoPackage(),
          new RNBabylonCommonPackage(),
          new DevicePermissionPackage());

    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    BabylonCoreSDK.init(this, "PreprodPrudential", APP_IDENTIFIER, BABYLON_DEFAULT_UK_ENGLISH);
    FirebaseAnalytics.getInstance(this);
    configureCrashReporting();
  }

  private void configureCrashReporting() {
    CrashlyticsCore crashlyticsCore = new CrashlyticsCore.Builder()
            .disabled(BuildConfig.DEBUG)
            .build();
    Fabric.with(this, new Crashlytics.Builder().core(crashlyticsCore).build());
  }
}
