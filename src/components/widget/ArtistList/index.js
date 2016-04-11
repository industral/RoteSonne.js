import './styles/style.scss'

import React from 'react'
import {connect} from 'react-redux'
import I from 'immutable'

import AlbumCover from './AlbumCover'

import database from '../../../context/db'

class ArtistList extends React.Component {
  constructor() {
    super();
  }

  /**
   * Return a list of artists from library.
   *
   * @returns {Promise}
   */
  getPlayList() {
    const sql = `SELECT albumArtist as artist, id,
      COUNT(DISTINCT album) as albums,
      (SELECT coverArt from albums where albums.albumArtist = playlist.albumArtist AND coverArt NOT NULL LIMIT 0,1) as coverArt1,
      (SELECT coverArt from albums where albums.albumArtist = playlist.albumArtist AND coverArt NOT NULL LIMIT 1,1) as coverArt2,
      (SELECT coverArt from albums where albums.albumArtist = playlist.albumArtist AND coverArt NOT NULL LIMIT 2,1) as coverArt3,
      (SELECT coverArt from albums where albums.albumArtist = playlist.albumArtist AND coverArt NOT NULL LIMIT 3,1) as coverArt4

      FROM playlist 
      GROUP BY albumArtist`;

    return new Promise((resolve, reject) => {

      database.open((db) => {
        db.all(sql, (error, results) => {
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

  setSelectedArtist(value) {
    this.props.dispatch({
      type: 'SET_SELECTED_ARTIST',
      value: value
    });
  }

  render() {
    let artistsList = this.props.library.get('artists').map((value, index) => {
      let classList = 'list-group-item ' + (this.props.selected.get('artist') === value.get('artist') ? 'active' : '');

      return (
        <li className={classList} key={index} onClick={this.setSelectedArtist.bind(this, value.get('artist'))}
            title={value.get('artist')}>
          <AlbumCover data={value} />
          <div className="media-body">
            <strong>{value.get('artist')}</strong>
            <p>{value.get('albums')} albums</p>
          </div>
        </li>
      );
    });

    return (
      <ul className="cmp-widget cmp-widget-artist-list list-group">
        {artistsList}
      </ul>
    )
  }

  getListOfArtists(callback) {
    this.getPlayList().then((data) => {
      this.props.dispatch({
        type: 'SET_LIBRARY_ARTISTS',
        value: data
      });

      callback && callback();
    });
  }

  componentDidMount() {
    this.getListOfArtists();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.libraryUpdated) {
      this.getListOfArtists(() => {
        this.props.dispatch({
          type: 'LIBRARY_DID_UPDATE'
        });
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return !I.is(this.props.library.get('artists'), nextProps.library.get('artists')) ||
           !I.is(this.props.selected.get('artist'), nextProps.selected.get('artist'));
  }
}

const mapStatesToProps = (store) => {
  return {
    selected: store.get('selected'),
    library: store.get('library'),
    libraryUpdated: store.get('libraryUpdated')
  }
};

export default connect(mapStatesToProps, null)(ArtistList)
