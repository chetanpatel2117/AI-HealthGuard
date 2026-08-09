/**
 * AI HealthGuard - Step-by-step Android Studio WebView Conversion Guide
 */

import React, { useState } from 'react';
import { Smartphone, Copy, Check, Terminal, Shield, Download } from 'lucide-react';

export const AndroidGuidePage: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.aihealthguard.app">

    <!-- Permissions required for AI HealthGuard -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="AI HealthGuard"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:usesCleartextTraffic="true"
        android:theme="@style/Theme.MaterialComponents.Light.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const mainActivityKt = `package com.aihealthguard.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)

        // WebSettings configuration for React SPA
        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        webSettings.databaseEnabled = true
        webSettings.allowFileAccess = true
        webSettings.loadWithOverviewMode = true
        webSettings.useWideViewPort = true
        webSettings.mediaPlaybackRequiresUserGesture = false

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                view?.loadUrl(url ?: "")
                return true
            }
        }

        // Host web app URL or local assets/index.html
        val appUrl = "https://your-cloud-run-url.a.run.app"
        webView.loadUrl(appUrl)
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}`;

  const layoutXml = `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-12">
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center space-x-2 text-emerald-300 text-xs font-semibold mb-2">
          <Smartphone className="w-4 h-4" />
          <span>Android APK Conversion Guide</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Convert AI HealthGuard into an Android App</h1>
        <p className="text-xs text-emerald-100/90 mt-1">
          Follow these 4 simple steps to wrap this web application into a native Android APK using Android Studio WebView.
        </p>
      </div>

      {/* Step 1 */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
            1
          </span>
          <h3 className="font-bold text-slate-900 text-sm">Create New Android Studio Project</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed pl-9">
          Open <strong>Android Studio</strong> &gt; Select <strong>New Project</strong> &gt; Choose <strong>Empty Views Activity</strong>. Name your application <code>AI HealthGuard</code> and set Package Name to <code>com.aihealthguard.app</code>. Language: <strong>Kotlin</strong>.
        </p>
      </div>

      {/* Step 2 */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Update AndroidManifest.xml Permissions</h3>
          </div>

          <button
            onClick={() => copyToClipboard(manifestXml, 'manifest')}
            className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center space-x-1"
          >
            {copiedSection === 'manifest' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'manifest' ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
          {manifestXml}
        </pre>
      </div>

      {/* Step 3 */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-slate-900 text-sm">MainActivity.kt Code</h3>
          </div>

          <button
            onClick={() => copyToClipboard(mainActivityKt, 'kt')}
            className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center space-x-1"
          >
            {copiedSection === 'kt' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'kt' ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
          {mainActivityKt}
        </pre>
      </div>

      {/* Step 4 */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
              4
            </span>
            <h3 className="font-bold text-slate-900 text-sm">activity_main.xml Layout</h3>
          </div>

          <button
            onClick={() => copyToClipboard(layoutXml, 'layout')}
            className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center space-x-1"
          >
            {copiedSection === 'layout' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'layout' ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
          {layoutXml}
        </pre>
      </div>
    </div>
  );
};
