//import './styles/style.scss'
import React from 'react'
import {connect} from 'react-redux'

import db from '../../../context/db'

class ArtistList extends React.Component {
  constructor() {
    super();

    this.state = {
      artists: []
    };
  }

  /**
   * Return a list of artists from library.
   *
   * @returns {Promise}
   */
  getPlayList() {
    let result = [];
    let request = db.open();

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        let tx = event.target.result.transaction('library', 'readonly');
        let store = tx.objectStore('library');
        let index = store.index('artist');

        index.openCursor(null, 'nextunique').onsuccess = (event) => {
          let cursor = event.target.result;
          if (cursor) {
            result.push(cursor.key);

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

  setSelectedArtist(event) {
    this.props.dispatch({
      type: 'SET_SELECTED_ARTIST',
      value: event.currentTarget.value
    });
  }

  render() {
    this.getPlayList().then((data) => {
      this.setState({
        artists: data.map((value, index) => {
          return <option value={value} key={index}>{value}</option>;
        })
      });
    });

    return (
      <div className="cmp-widget cmp-widget-artist-list">
        <select size="15" onChange={this.setSelectedArtist.bind(this)}>
          {this.state.artists}
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

export default connect(mapStatesToProps, null)(ArtistList)
