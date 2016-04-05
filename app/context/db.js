const sqlite3 = require('sqlite3').verbose();
const userHome = process.env.HOME || process.env.USERPROFILE;
let db = null;

const create = (cb = () => {
}) => {
  const sql = 'CREATE TABLE IF NOT EXISTS "playlist" (' +
              '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
              '`artist` TEXT,' +
              '`albumArtist` TEXT NOT NULL,' +
              '`album` TEXT NOT NULL,' +
              '`title` TEXT NOT NULL,' +
              '`file` TEXT NOT NULL UNIQUE,' +
              '`diskNumber` TEXT,' +
              '`trackNumber` TEXT)';
  db.run(sql, cb);
};

const clear = () => {
  db.run('DROP TABLE IF EXISTS `playlist`');
};

export default {
  create: create,
  clear: clear,

  recreate: (cb) => {
    db.serialize(() => {
      clear();
      create(cb);
    });
  },

  open: (cb) => {
    if (db) {
      cb(db);
    } else {
      db = new sqlite3.Database(`${userHome}/rotesonne.db`,
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        () => {
          create(() => {
            cb(db);
          });
        });
    }
  }
};
