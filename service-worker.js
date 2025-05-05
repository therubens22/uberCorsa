self.addEventListener('install', function (e) {
    console.log('Service Worker instalado');
  });
  
  self.addEventListener('fetch', function (e) {
    // Por ahora no hacemos cache
  });
  