package com.koperasiapp;

import android.app.Application;
import android.content.Context;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Arrays;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.joshuapinter.RNUnifiedContacts.RNUnifiedContactsPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import com.oblador.vectoricons.VectorIconsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.imagepicker.ImagePickerPackage;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import com.airbnb.android.react.maps.MapsPackage;

public class MainApplication extends NavigationApplication {
    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        ReactGateway gateway = new ReactGateway(this, isDebug(), host);
        return gateway;
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        @SuppressWarnings("UnnecessaryLocalVariable")
        List<ReactPackage> packages = new PackageList(this).getPackages();
        new VectorIconsPackage();
        new SnackbarPackage();
        new ImagePickerPackage();
        new RNFirebasePackage();        
        new MapsPackage();
        //firebase package unsupported new name_package but mush package.add(new name_pakcage) <== OKE BRO
        packages.add(new RNFirebaseMessagingPackage());
        packages.add(new RNFirebaseNotificationsPackage());
        return packages;
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}