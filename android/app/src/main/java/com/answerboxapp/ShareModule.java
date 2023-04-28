package com.answerboxapp;

import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ShareModule extends ReactContextBaseJavaModule{
    private static ReactApplicationContext reactContext;
    public ShareModule(ReactApplicationContext context){
        super(context);
        reactContext = context;
    }
    @NonNull
    @Override
    public String getName() {
        return "SystemShare";
    }
    @ReactMethod
    public void share(String content){
        Intent intent = new Intent();
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
        intent.setAction(Intent.ACTION_SEND);
        intent.putExtra(Intent.EXTRA_TEXT, content);
        intent.setType("text/plain");
        getReactApplicationContext().startActivity(intent);
    }
}
