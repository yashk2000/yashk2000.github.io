'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "main.dart.js": "fb9728557dd6b1c2879d9b4b728ed7ef",
"index.html": "2fb0cd66212d9bb9c72334954bde4386",
"/": "2fb0cd66212d9bb9c72334954bde4386",
"assets/FontManifest.json": "592290621294619b16740a9d89232ba6",
"assets/LICENSE": "5c0c5a77cbe0bf68f7fb4156bf7584d0",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/assets/FontManifest.json": "59c37979205b4b43589051e92e27cbcd",
"assets/assets/instagram.png": "26631a4043b14dff84180bdf51c3cacb",
"assets/assets/GoogleSansRegular.ttf": "b5c77a6aed75cdad9489effd0d5ea411",
"assets/assets/moon.png": "a270b8a10d1a9a52441bf5a322dd1b86",
"assets/assets/linkedin.png": "926e2dcf5ab4220a359867614556df68",
"assets/assets/twitter.png": "8f35a40403a84631c4125c4f1859c7a6",
"assets/assets/github.png": "d22ee3727a7216019c3848df6eafa024",
"assets/assets/computervisionn.jpg": "e84692154bd077a65b0b951d595231c8",
"assets/assets/wordpress.jpg": "4c5c0daf4e65ed3c6b4aace9fbc7ffbb",
"assets/assets/avatar.jpg": "da20d77ff86d7105a0b33f8fa44361bb",
"assets/assets/works/badgemagic.png": "1068aac879d03cfb8ad0026513d08ffe",
"assets/assets/works/vibe.jpg": "c1bcc9cba92987b3b11825e7fa789a44",
"assets/assets/works/commonsapp.png": "f8d98254690e21cb7abf58b610dd3ff6",
"assets/assets/works/image.jpeg": "e5187aaebabff8e030d560f3827884fa",
"assets/assets/works/covid.jpg": "cc9625a5cdbe14b0b74d42eed54945cc",
"assets/assets/works/emotion.png": "8ae362cdf0050fd04a69b2ca5a967fc0",
"assets/assets/works/tweegenous.png": "587e54ba3904dee07a0455c458c26123",
"assets/assets/works/hand.png": "baca024caaf49f67add194e6ba12fa9b",
"assets/assets/works/asha.jpg": "df6d84677e8bf157307175895e709545",
"assets/assets/works/computer-vision.jpg": "fc2ca7439f64bd773391df43792c6546",
"assets/assets/works/computervision.jpg": "e84692154bd077a65b0b951d595231c8",
"assets/assets/works/phimpme.png": "766dff8e142e26f4e67eda3fbf1d2fb8",
"assets/assets/works/templeapp.png": "feb56ae7e6f70143983d0c8f818ac3a0",
"assets/assets/works/cms.png": "60fae13591d3805db2fcebd44088c203",
"assets/assets/works/kiwix.png": "286e0afb2cfc047115f2293d9c1efba4",
"assets/assets/gitlab.png": "d8dd9f3a3a1275356f9e1428b144e99f",
"assets/AssetManifest.json": "21f615a1f0a2d518632a38245337457c"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
