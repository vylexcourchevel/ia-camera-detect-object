// import { openDB } from 'idb';

// const dbPromise = openDB('my-database', 1, {
//   upgrade(db) {
//     if (!db.objectStoreNames.contains('images')) {
//       db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
//     }
//   },
// });

// export const addImage = async (image) => {
//   const db = await dbPromise;
//   const tx = db.transaction('images', 'readwrite');
//   const store = tx.objectStore('images');
//   await store.add(image);
//   await tx.done;
// };

// export const getImages = async () => {
//   const db = await dbPromise;
//   const tx = db.transaction('images', 'readonly');
//   const store = tx.objectStore('images');
//   return await store.getAll();
// };

// export const clearImages = async () => {
//   const db = await dbPromise;
//   const tx = db.transaction('images', 'readwrite');
//   const store = tx.objectStore('images');
//   await store.clear();
//   await tx.done;
// };
import { openDB } from 'idb';

const dbPromise = openDB('my-database', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('items')) {
      db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
    }
  },
});

export const addItem = async (item) => {
  const db = await dbPromise;
  const tx = db.transaction('items', 'readwrite');
  const store = tx.objectStore('items');
  await store.add(item);
  await tx.done;
};

export const getItems = async () => {
  const db = await dbPromise;
  const tx = db.transaction('items', 'readonly');
  const store = tx.objectStore('items');
  return await store.getAll();
};

export const clearItems = async () => {
  const db = await dbPromise;
  const tx = db.transaction('items', 'readwrite');
  const store = tx.objectStore('items');
  await store.clear();
  await tx.done;
};
