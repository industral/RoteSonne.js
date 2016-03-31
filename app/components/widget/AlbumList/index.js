//import './styles/style.scss'
import React from 'react'
import {connect} from 'react-redux'

import db from '../../../context/db'

class AlbumList extends React.Component {
  constructor() {
    super();

    this.state = {
      albums: []
    };
  }

  /**
   * Return a list of artists from library.
   *
   * @returns {Promise}
   */
  getAlbumList() {
    let selectedArtist = this.props.store.selected.artist;

    let result = [];
    let request = db.open();

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        let tx = event.target.result.transaction('library', 'readonly');
        let store = tx.objectStore('library');
        let index = store.index('artist, album');
        // index.getAll(selectedArtist).onsuccess = (event) => {
        //   console.log(event);
        // };

        index.openCursor(IDBKeyRange.only([selectedArtist, "Hunter"]), 'nextunique').onsuccess = (event) => {
          let cursor = event.target.result;
          if (cursor) {
          console.log(cursor);
            // result.push(cursor.key);

            cursor.continue();
          }
        };

        tx.oncomplete = () => {
          db.close();

          resolve(result);
        };

        tx.onabort = () => {
          console.error(tx.error);

          reject(tx.error);
        };
      };
    });
  }

  render() {
    this.getAlbumList();

    // .then((data) => {
    //   this.setState({
    //     albums: data.map((value, index) => {
    //       return <option value={value} key={index}>{value}</option>;
    //     })
    //   });
    // });

    return (
      <div className="cmp-widget cmp-widget-album-list">
        <select size="15">

        </select>
      </div>
    )
  }
}

const mapStatesToProps = (store) => {
  return {
    store: store
  }
};

export default connect(mapStatesToProps, null)(AlbumList)
