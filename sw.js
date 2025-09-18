const CACHE_NAME = 'random-picker-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/metadata.json',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/components/icons.tsx',
  '/components/ResultDisplay.tsx',
  '/components/SettingsPanel.tsx',
  'https://cdn.tailwindcss.com',
  'https://esm.sh/react@^19.1.1',
  'https://esm.sh/react@^19.1.1/jsx-runtime',
  'https://esm.sh/react-dom@^19.1.1/client',
  'https://esm.sh/react-dom@^19.1.1'
];

// Cài đặt service worker và cache các tài nguyên cần thiết
self.addEventListener('install', event => {
  self.skipWaiting(); // Buộc service worker mới kích hoạt ngay lập tức
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache đã được mở, đang tiến hành cache tài nguyên...');
      return cache.addAll(urlsToCache).catch(err => {
        console.error('Không thể cache tài nguyên trong quá trình cài đặt:', err);
      });
    })
  );
});

// Kích hoạt service worker và xóa các cache cũ
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Đang xóa cache cũ:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Kiểm soát tất cả các trang đang mở
  );
});

// Can thiệp vào các yêu cầu mạng và trả về từ cache nếu có
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Nếu tìm thấy trong cache, trả về phản hồi từ cache
      if (response) {
        return response;
      }
      // Nếu không, thực hiện yêu cầu mạng như bình thường
      return fetch(event.request);
    })
  );
});
