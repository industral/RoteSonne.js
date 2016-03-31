let request, db;

export default {
  open: () => {
    request = indexedDB.open('rotesonne', 1);

    request.onerror = (event) => {
      console.error(event);
      alert("Can't open database");
    };

    request.onabort = (event) => {
      console.error(event);
      alert("An error occured");
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;

      let store = db.createObjectStore('library', {
        keyPath: 'id',
        autoIncrement: true
      });

      store.createIndex('artist', 'artist');
      store.createIndex('album', 'album');
      store.createIndex('title', 'title');

      store.createIndex('artist, album', ['artist', 'album']);
      // store.createIndex('artist albums', 'artist', {multiEntry: true});
      // store.createIndex('artist, album, title', ['artist, album, title']);
    };

    return request;
  },

  close: () => {
    if (db) {
      db.close();
    }
  }
}
