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
    return new Promise((resolve, reject) => {

      let selectedArtist = props.store.selected.artist;
      database.open((db) => {
        db.all('SELECT album, COUNT(title) as tracks FROM playlist WHERE albumArtist = ? GROUP BY album',
          [selectedArtist], function(error, results) {
            if (results) {
              console.debug(results);
              resolve(results);
            } else {
              console.error(error);

              reject(error);
            }
          });
      });

    });
  }

  setSelectedAlbum(value) {
    this.props.dispatch({
      type: 'SET_SELECTED_ALBUM',
      value: value
    });
  }

  render() {
    let albumList = this.state.albums.map((value, index) => {
      let classList = 'list-group-item ' + (this.props.store.selected.album === value.album ? 'active' : '');

      return (
        <li className={classList} key={index} onClick={this.setSelectedAlbum.bind(this, value.album)}
            title={value.album}>
          <div className="media-body">
            <strong>{value.album}</strong>
            <p>{value.tracks} songs</p>
          </div>
        </li>
      );
    });

    return (
      <ul className="cmp-widget cmp-widget-album-list list-group">
        {albumList}
      </ul>
    )
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.store.selected.artist !== nextProps.store.selected.artist) {
      this.getAlbumList(nextProps).then((data) => {
        this.setState({
          albums: data
        });
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.store.selected.artist ||
           (this.props.store.selected.artist !== nextProps.store.selected.artist);
  }
}

const mapStatesToProps = (store) => {
  return {
    store: store
  }
};

export default connect(mapStatesToProps, null)(AlbumList)
