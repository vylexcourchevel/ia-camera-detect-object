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
