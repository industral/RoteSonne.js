import './styles/style.scss'

import React from 'react'
import {connect} from 'react-redux'

import AlbumCover from './AlbumCover'

import database from '../../../context/db'

class ArtistList extends React.Component {
  constructor() {
    super();

    // this.state = {
    //   artists: []
    // };
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
  console.info("123", this.props.store.getIn(['library', 'artists']));
  
    let artistsList = this.props.store.getIn(['library', 'artists']).map((value, index) => {
      let classList = 'list-group-item ' + (this.props.store.getIn(['selected', 'artist']) === value.get('artist') ? 'active' : '');

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

  getListOfArtists() {
    this.getPlayList().then((data) => {
      // this.setState({
      //   artists: data
      // });

      console.log(data);

      // this.props.dispatch({
      //   type: 'LIBRARY_DID_UPDATE'
      // });

      this.props.dispatch({
        type: 'SET_LIBRARY_ARTISTS',
        value: data
      });
      
      
    });
  }

  componentDidMount() {
    this.getListOfArtists();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.store.get('libraryUpdated')) {
      this.getListOfArtists();
    }
  }

  // shouldComponentUpdate(nextProps) {
  //   return (!this.props.store.selected.artist ||
  //          (this.props.store.selected.artist !== nextProps.store.selected.artist))
  //          || nextProps.store.libraryUpdated;
  // }
}

const mapStatesToProps = (store) => {
  return {
    store: store
  }
};

export default connect(mapStatesToProps, null)(ArtistList)
