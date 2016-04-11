//import './styles/style.scss'
import React from 'react'
import {connect} from 'react-redux'
import I from 'immutable'

import database from '../../../context/db'
import utils from '../../../assets/js/Utils'

class AlbumList extends React.Component {
  constructor() {
    super();
  }

  /**
   * Return a list of artists from library.
   *
   * @returns {Promise}
   */
  getAlbumList(selectedArtist) {
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
      database.open((db) => {
        db.all(sql, {$artist: selectedArtist}, function(error, results) {
          if (results) {
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
    let albumList = this.props.library.get('albums').map((value, index) => {
      const classList = 'list-group-item ' + (this.props.selected.get('album') === value.get('album') ? 'active' : '');
      const coverArt = utils.getURLfromBlob(value.get('coverArt'));

      return (
        <li className={classList} key={index} onClick={this.setSelectedAlbum.bind(this, value.get('album'))}
            title={value.get('album')}>
          <img className="media-object pull-left" src={coverArt} width="50" height="50" />
          <div className="media-body">
            <strong>{value.get('album')}</strong>
            <p>{value.get('tracks')} songs</p>
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
    const selectedArtist = nextProps.selected.get('artist');

    if (this.props.selected.get('artist') !== selectedArtist) {
      this.getAlbumList(selectedArtist).then((data) => {
        this.props.dispatch({
          type: 'SET_LIBRARY_ALBUMS',
          value: data
        });
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return !I.is(this.props.library.get('albums'), nextProps.library.get('albums')) ||
           !I.is(this.props.selected.get('album'), nextProps.selected.get('album'));
  }
}

const mapStatesToProps = (store) => {
  return {
    selected: store.get('selected'),
    library: store.get('library')
  }
};

export default connect(mapStatesToProps, null)(AlbumList)
