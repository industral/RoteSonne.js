//import './styles/style.scss'
import React from 'react'
import {connect} from 'react-redux'

import database from '../../../context/db'
import utils from '../../../assets/js/Utils'

class AlbumList extends React.Component {
  constructor() {
    super();

    this.state = {
      albums: []
    };

    // cache
    this.albumsCovers = {};
  }

  /**
   * Return a list of artists from library.
   *
   * @returns {Promise}
   */
  getAlbumList(props) {
    const sql = `SELECT
                  playlist.album,
                  COUNT(playlist.title) AS tracks,
                  (SELECT albums.coverArt FROM albums 
                    WHERE albums.albumArtist = $artist AND albums.album = playlist.album) as coverArt,
                  (SELECT albums.id FROM albums 
                    WHERE albums.albumArtist = $artist AND albums.album = playlist.album) as id
                
                FROM playlist

                WHERE playlist.albumArtist = $artist 
                GROUP BY playlist.album`;

    return new Promise((resolve, reject) => {
      const selectedArtist = props.store.selected.artist;

      database.open((db) => {
        db.all(sql, {$artist: selectedArtist}, function(error, results) {
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
      const classList = 'list-group-item ' + (this.props.store.selected.album === value.album ? 'active' : '');
      const coverArt = this.getCoverAsURL(value.id, value.coverArt);

      return (
        <li className={classList} key={index} onClick={this.setSelectedAlbum.bind(this, value.album)}
            title={value.album}>
          <img className="media-object pull-left" src={coverArt} width="50" height="50" />
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

  getCoverAsURL(id, coverData) {
    return this.albumsCovers[id] || (this.albumsCovers[id] = utils.getURLfromBlob(coverData));
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
