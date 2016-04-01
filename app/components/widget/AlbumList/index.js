//import './styles/style.scss'
import React from 'react'
import {connect} from 'react-redux'

import database from '../../../context/db'

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
  getAlbumList(props) {
    let selectedArtist = props.store.selected.artist;
    let db = database.open();

    return new Promise((resolve, reject) => {
      db.all("SELECT album FROM playlist WHERE artist = ? GROUP BY album", [selectedArtist], function(error, results) {
        if (results) {
          console.debug(results);
          resolve(results);
        } else {
          console.error(error);

          reject(error);
        }
      });
    });
  }

  render() {
    return (
      <div className="cmp-widget cmp-widget-album-list">
        <select size="15">
          {this.state.albums}
        </select>
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {
    this.getAlbumList(nextProps).then((data) => {
      this.setState({
        albums: data.map((value, index) => {
          return <option value={value.album} key={index}>{value.album}</option>;
        })
      });
    });
  }
}

const mapStatesToProps = (store) => {
  return {
    store: store
  }
};

export default connect(mapStatesToProps, null)(AlbumList)
