self.addEventListener(`install`, (evt) => {
  const openChache = chaches.open(`STATIC_V1.0`)
    .then((cache) => {
      return cache.addAll([
        `/`,
        `/index.html`,
        `/main.js`
        ]);
    });

    evt.waitUntil(openChache);
});

self.addEventListener(`activate`, () => {
  console.log(`sw activated`);
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => response ? response : fetch(evt.request))
      .catch((err) => console.error({err}))
    );
});
