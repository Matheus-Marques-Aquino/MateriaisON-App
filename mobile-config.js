App.info({
  id: 'app.MateriaisON',
  name: 'MateriaisON',
  version: "0.5.0"
});

App.accessRule('*');
App.accessRule('http://materiaison.meteorapp.com/*');
App.appendToConfig('content src="http://materiaison.meteorapp.com:80/');
App.appendToConfig('<allow-navigation href="http://materiaison.meteorapp.com/*');

App.icons({
  // iOS
  'app_store': 'resources/icons/1024.png',//Icon-marketing-1024x1024.png', // Apple App Store
  'iphone_2x': 'resources/icons/120.png',//Icon-60x60@2x.png', // iPhone 5, SE, 6, 6s, 7, 8
  'iphone_3x': 'resources/icons/180.png',//Icon-60x60@3x.png', // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus, X
  'ipad_2x': 'resources/icons/152.png',//Icon-76x76@2x.png', // iPad, iPad mini
  'ipad_pro': 'resources/icons/167.png',//Icon-83.5@2x.png', // iPad Pro
  'ios_settings_2x': 'resources/icons/48.png',//Icon-29x29@2x.png', // iPhone 5, SE, 6, 6s, 7, 8, iPad, mini, Pro
  'ios_settings_3x': 'resources/icons/87.png',//Icon-29x29@3x.png', // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus, X
  'ios_spotlight_2x': 'resources/icons/80.png',//Icon-40x40@2x.png', // iPhone 5, SE, 6, 6s, 7, 8, iPad, mini, Pro
  'ios_spotlight_3x': 'resources/icons/120.png',//Icon-40x40@3x.png', // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus, X
  'ios_notification_2x': 'resources/icons/40.png',//Icon-20x20@2x.png', // iPhone 5, SE, 6, 6s, 7, 8, iPad, mini, Pro
  'ios_notification_3x': 'resources/icons/60.png',//Icon-20x20@3x.png', // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus, X
  'ipad': 'resources/icons/76.png',//Icon-76x76@1x.png', // Legacy
  'ios_settings': 'resources/icons/29.png',//Icon-29x29@1x.png', // Legacy
  'ios_spotlight': 'resources/icons/40.png',//Icon-20x20@2x.png', // Legacy
  'ios_notification': 'resources/icons/20.png',//Icon-20x20@1x.png', // Legacy
  'iphone_legacy': 'resources/icons/57.png',//Icon-57x57@1x.png', // Legacy
  'iphone_legacy_2x': 'resources/icons/144.png',//Icon-114x114@1x.png', // Legacy
  'ipad_spotlight_legacy': 'resources/icons/50.png',//icons/Icon-50x50@1x.png', // Legacy
  'ipad_spotlight_legacy_2x': 'resources/icons/100.png',//Icon-100x100@1x.png', // Legacy
  'ipad_app_legacy': 'resources/icons/72.png',//Icon-72x72@1x.png', // Legacy
  'ipad_app_legacy_2x': 'resources/icons/144.png',//Icon-144x144@1x.png', // Legacy
  'android_mdpi': 'resources/icons/48.png',//Icon-48x48@1x.png', 
  'android_hdpi': 'resources/icons/72.png',//Icon-72x72@1x.png', 
  'android_xhdpi': 'resources/icons/96.png',//Icon-96x96@1x.png', 
  'android_xxhdpi': 'resources/icons/144.png',//Icon-144x144@1x.png', 
  'android_xxxhdpi': 'resources/icons/192.png',//Icon-192x192@1x.png'
});

App.launchScreens({
  // iOS
  'iphone5': 'resources/splash/splash_640x1136.png', //(640x1136) // iPhone 5, SE
  'iphone6': 'resources/splash/splash_750x1334.png', //(750x1334) // iPhone 6, 6s, 7, 8
  'iphone6p_portrait': 'resources/splash/splash_1242x2208.png', //(1242x2208) // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus
  'iphone6p_landscape': 'resources/splash/splash_2208x1242.png', //(2208x1242) // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus
  'iphoneX_portrait': 'resources/splash/splash_1125x2436.png', //(1125x2436) // iPhone X
  'iphoneX_landscape': 'resources/splash/splash_2436x1125.png', //(2436x1125) // iPhone X
  'ipad_portrait_2x': 'resources/splash/splash_1536x2048.png', //(1536x2048) // iPad, iPad mini
  'ipad_landscape_2x': 'resources/splash/splash_2048x1536.png', //(2048x1536) // iPad, iPad mini
  'iphone': 'resources/splash/splash_320x480.png', //(320x480) // Legacy
  'iphone_2x': 'resources/splash/splash_640x960.png', //(640x960) // Legacy
  'ipad_portrait': 'resources/splash/splash_768x1024.png', //(768x1024) // Legacy
  'ipad_landscape': 'resources/splash/splash_1024x768.png', //(1024x768) // Legacy
  'android_mdpi_portrait': 'resources/splash/splash_320x480.png', //(320x480)
  'android_mdpi_landscape': 'resources/splash/splash_480x320.png', //(480x320)
  'android_hdpi_portrait': 'resources/splash/splash_480x800.png', //(480x800)
  'android_hdpi_landscape': 'resources/splash/splash_800x480.png', //(800x480)
  'android_xhdpi_portrait': 'resources/splash/splash_720x1280.png', //(720x1280)
  'android_xhdpi_landscape': 'resources/splash/splash_1280x720.png', //(1280x720)
  'android_xxhdpi_portrait': 'resources/splash/splash_960x1600.png', //(960x1600)
  'android_xxhdpi_landscape': 'resources/splash/splash_1600x960.png', //(1600x960)
  'android_xxxhdpi_portrait': 'resources/splash/splash_1280x1920.png', //(1280x1920)
  'android_xxxhdpi_landscape': 'resources/splash/splash_1920x1280.png', //(1920x1280)*/
});