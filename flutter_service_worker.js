'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "2fb0cd66212d9bb9c72334954bde4386",
"/": "2fb0cd66212d9bb9c72334954bde4386",
"main.dart.js": "bba28bbc57c9b2c0e16453fb9313deb3",
"assets/assets/wordpress.jpg": "4c5c0daf4e65ed3c6b4aace9fbc7ffbb",
"assets/assets/twitter.png": "8f35a40403a84631c4125c4f1859c7a6",
"assets/assets/computervisionn.jpg": "e84692154bd077a65b0b951d595231c8",
"assets/assets/github.png": "d22ee3727a7216019c3848df6eafa024",
"assets/assets/instagram.png": "26631a4043b14dff84180bdf51c3cacb",
"assets/assets/moon.png": "a270b8a10d1a9a52441bf5a322dd1b86",
"assets/assets/avatar.jpg": "da20d77ff86d7105a0b33f8fa44361bb",
"assets/assets/FontManifest.json": "59c37979205b4b43589051e92e27cbcd",
"assets/assets/works/emotion.png": "8ae362cdf0050fd04a69b2ca5a967fc0",
"assets/assets/works/commonsapp.png": "f8d98254690e21cb7abf58b610dd3ff6",
"assets/assets/works/computer-vision.jpg": "fc2ca7439f64bd773391df43792c6546",
"assets/assets/works/badgemagic.png": "1068aac879d03cfb8ad0026513d08ffe",
"assets/assets/works/templeapp.png": "feb56ae7e6f70143983d0c8f818ac3a0",
"assets/assets/works/vibe.jpg": "c1bcc9cba92987b3b11825e7fa789a44",
"assets/assets/works/hand.png": "baca024caaf49f67add194e6ba12fa9b",
"assets/assets/works/computervision.jpg": "e84692154bd077a65b0b951d595231c8",
"assets/assets/works/kiwix.png": "286e0afb2cfc047115f2293d9c1efba4",
"assets/assets/works/mifos.png": "7f85d2e0715ff102b75319947a36c2d5",
"assets/assets/works/cms.png": "60fae13591d3805db2fcebd44088c203",
"assets/assets/works/covid.jpg": "cc9625a5cdbe14b0b74d42eed54945cc",
"assets/assets/works/phimpme.png": "766dff8e142e26f4e67eda3fbf1d2fb8",
"assets/assets/works/image.jpeg": "e5187aaebabff8e030d560f3827884fa",
"assets/assets/works/asha.jpg": "df6d84677e8bf157307175895e709545",
"assets/assets/works/tweegenous.png": "587e54ba3904dee07a0455c458c26123",
"assets/assets/linkedin.png": "926e2dcf5ab4220a359867614556df68",
"assets/assets/gitlab.png": "d8dd9f3a3a1275356f9e1428b144e99f",
"assets/assets/GoogleSansRegular.ttf": "b5c77a6aed75cdad9489effd0d5ea411",
"assets/assets/blog.png": "1269539dc4954cd7f8a8f75b2de5ac8c",
"assets/FontManifest.json": "592290621294619b16740a9d89232ba6",
"assets/AssetManifest.json": "2c1a90440053820b99c310fa89707bdf",
"assets/NOTICES": "816bfdd32fb5294788017424a42f3dd5",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a no-cache param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'no-cache'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'no-cache'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
