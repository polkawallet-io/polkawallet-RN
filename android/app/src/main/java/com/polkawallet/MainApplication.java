package com.polkawallet;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.rnfingerprint.FingerprintAuthPackage;
import cn.jystudio.local.barcode.recognizer.LocalBarcodeRecognizerPackage;
import com.imagepicker.ImagePickerPackage;
import fr.bamlab.rncameraroll.CameraRollPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.lewin.qrcode.QRScanReaderPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import cn.reactnative.modules.update.UpdatePackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import li.yunqi.rnsecurestorage.RNSecureStoragePackage;
import com.peel.react.rnos.RNOSModule;
import org.reactnative.camera.RNCameraPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import cn.jpush.reactnativejpush.JPushPackage;

import java.util.Arrays;
import java.util.List;

import cn.reactnative.modules.update.UpdateContext;

public class MainApplication extends Application implements ReactApplication {

  // 设置为 true 将不会弹出 toast
  private boolean SHUTDOWN_TOAST = true;
  // 设置为 true 将不会打印 log
  private boolean SHUTDOWN_LOG = true;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile() {
        return UpdateContext.getBundleUrl(MainApplication.this);
}
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new FingerprintAuthPackage(),
            new LocalBarcodeRecognizerPackage(),
            new ImagePickerPackage(),
            new CameraRollPackage(),
            new RNViewShotPackage(),
            new QRScanReaderPackage(),
            new RNI18nPackage(),
            new UpdatePackage(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new RNSecureStoragePackage(),
            new RNOSModule(),
            new RNCameraPackage(),
            new RandomBytesPackage(),
            new RNSensitiveInfoPackage(),
            new SvgPackage(),
            new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG)
      );
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
  }
}
