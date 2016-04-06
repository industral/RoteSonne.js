//import './styles/style.scss'
import React from 'react'
import {connect} from 'react-redux'

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
    return new Promise((resolve, reject) => {

      database.open((db) => {
        db.all('SELECT albumArtist as artist, COUNT(DISTINCT album) as albums FROM playlist GROUP BY albumArtist',
          function(error, results) {
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
