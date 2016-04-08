import './styles/style.scss'

import React from 'react'
import {connect} from 'react-redux'

import AlbumCover from './AlbumCover'

import database from '../../../context/db'

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

  setSelectedArtist(value) {
    this.props.dispatch({
      type: 'SET_SELECTED_ARTIST',
      value: value
    });
  }

  render() {
    let artistsList = this.state.artists.map((value, index) => {
      let classList = 'list-group-item ' + (this.props.store.selected.artist === value.artist ? 'active' : '');

      return (
        <li className={classList} key={index} onClick={this.setSelectedArtist.bind(this, value.artist)}
            title={value.artist}>
          <AlbumCover {...value} />
          <div className="media-body">
            <strong>{value.artist}</strong>
            <p>{value.albums} albums</p>
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

  getListOfArtists() {
    this.getPlayList().then((data) => {
      this.setState({
        artists: data
      });
    });
  }

  componentDidMount() {
    this.getListOfArtists();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.store.libraryUpdated) {
      this.getListOfArtists();
    }
  }

  shouldComponentUpdate(nextProps) {
    return (!this.props.store.selected.artist ||
            (this.props.store.selected.artist !== nextProps.store.selected.artist));
  }
}

const mapStatesToProps = (store) => {
  return {
    store: store
  }
};

export default connect(mapStatesToProps, null)(ArtistList)
