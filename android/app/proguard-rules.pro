# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

-verbose

-keepnames class java.nio.file.Files { *; }

-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn org.andengine.**
-dontwarn org.hibernate.**
-dontwarn org.jboss.**
-dontwarn org.jboss.**
-dontwarn org.slf4j.**

-keep class com.shephertz.** { *; }

-keep class org.json.**

# Retrofit
-dontwarn retrofit2.**
-dontwarn org.codehaus.mojo.**
-keep class retrofit2.** { *; }
-keepattributes Signature
-keepattributes Exceptions
-keepattributes *Annotation*

-keepattributes RuntimeVisibleAnnotations
-keepattributes RuntimeInvisibleAnnotations
-keepattributes RuntimeVisibleParameterAnnotations
-keepattributes RuntimeInvisibleParameterAnnotations

-keepattributes EnclosingMethod

-keepclasseswithmembers class * {
    @retrofit2.* <methods>;
}
-keepclasseswithmembers interface * {
    @retrofit2.* <methods>;
}

# Jackson
-keepattributes *Annotation*,EnclosingMethod,Signature

-keepattributes InnerClasses

# Annotations
-keep public interface com.google.common.base.FinalizableReference { void finalizeReferent(); }
# Missing annotations are harmless.
-dontwarn sun.misc.Unsafe
-dontwarn javax.annotation.**

-keep public interface com.google.common.base.FinalizableReference { void finalizeReferent(); }


#Specific method signatures.
-keepclasseswithmembernames class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}

-keepclasseswithmembernames class * {
    public <init>(android.content.Context, android.util.AttributeSet, int);
}

-keep public class com.google.android.gms.* { public *; }
-dontwarn com.google.android.gms.**

-keep public class com.babylon.* { public *;}
-dontwarn com.babylon.**

# React Native

# Keep our interfaces so they can be used by other ProGuard rules.
# See http://sourceforge.net/p/proguard/bugs/466/
-keep,allowobfuscation,includedescriptorclasses @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation,includedescriptorclasses @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation,includedescriptorclasses @interface com.facebook.common.internal.DoNotStrip

# SoLoader
-keep class com.facebook.soloader.** { *; }
-keepclassmembers class com.facebook.soloader.SoLoader {
     static <fields>;
}

# Do not strip any method/class that is annotated with @DoNotStrip
-keep,includedescriptorclasses @com.facebook.proguard.annotations.DoNotStrip class *
-keep,includedescriptorclasses @com.facebook.common.internal.DoNotStrip class *
-keepclassmembers,includedescriptorclasses class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
}

-keepclassmembers,includedescriptorclasses @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

-keep,includedescriptorclasses class * { native <methods>; }
-keep,includedescriptorclasses class * { @com.facebook.react.uimanager.UIProp <fields>; }
-keep,includedescriptorclasses class * { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keep,includedescriptorclasses class * { @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>; }
-keep,includedescriptorclasses class com.facebook.react.uimanager.UIProp { *; }

-keep,includedescriptorclasses class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keep,includedescriptorclasses class * extends com.facebook.react.bridge.NativeModule { *; }
-keep,includedescriptorclasses class com.facebook.react.bridge.CatalystInstanceImpl { *; }
-keep,includedescriptorclasses class com.facebook.react.bridge.JavaScriptExecutor { *; }
-keep,includedescriptorclasses class com.facebook.react.bridge.queue.NativeRunnable { *; }
-keep,includedescriptorclasses class com.facebook.react.bridge.ExecutorToken { *; }
-keep,includedescriptorclasses class com.facebook.react.bridge.ReadableType { *; }

-dontwarn com.facebook.react.**
-dontnote com.facebook.**

-keep class com.facebook.react.devsupport.** { *; }
-dontwarn com.facebook.react.devsupport.**
-dontwarn com.facebook.react.**

# TextLayoutBuilder uses a non-public Android constructor within StaticLayout.
# See libs/proxy/src/main/java/com/facebook/fbui/textlayoutbuilder/proxy for details.
-dontwarn android.text.StaticLayout

-keep public class com.google.firebase.* { public *;}
-dontwarn com.google.firebase.**

-keep public class dagger.android.* { public *;}
-dontwarn dagger.android.**


# Obfuscation rules for gson library

-keep,allowobfuscation @interface com.google.gson.annotations.*
-dontnote com.google.gson.annotations.Expose
-keepclassmembers class * {
    @com.google.gson.annotations.Expose <fields>;
}

-keepclasseswithmembers,allowobfuscation,includedescriptorclasses class * {
    @com.google.gson.annotations.Expose <fields>;
}

-dontnote com.google.gson.annotations.SerializedName
-keepclasseswithmembers,allowobfuscation,includedescriptorclasses class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

-keepclassmembers enum * { *; }

# Gson uses generic type information stored in a class file when working with fields. Proguard removes such information
# by default, so configure it to keep all of it.
-keepattributes Signature

# For using GSON @Expose annotation
-keepattributes *Annotation*

# Prevent proguard from stripping interface information from TypeAdapterFactory,
# JsonSerializer, JsonDeserializer instances (so they can be used in @JsonAdapter)
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

-keep public class com.google.firebase.* { public *; }
-dontwarn com.google.firebase.**

-keep public class com.google.android.gms.* { public *; }
-dontwarn com.google.android.gms.**

# if using notifications from RNFirebase
-keep public class me.leolin.shortcutbadger.* { public *; }
-dontwarn me.leolin.shortcutbadger.**

-keep class com.opentok.** { *; }
-dontwarn com.opentok.** 

-keep class org.webrtc.** { *;}
-dontwarn org.webrtc.** 