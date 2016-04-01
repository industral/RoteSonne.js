var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/Users/alex/rotesonne.db');

let create = (cb) => {
  const sql = 'CREATE TABLE IF NOT EXISTS "playlist" (' +
              '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
              '`artist` TEXT NOT NULL,' +
              '`album` TEXT NOT NULL,' +
              '`title` TEXT NOT NULL,' +
              '`file` TEXT NOT NULL UNIQUE,' +
              '`trackNumber` TEXT)';
  db.run(sql, cb);
};

let clear = () => {
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

  open: () => {
    return db;
  }
};
