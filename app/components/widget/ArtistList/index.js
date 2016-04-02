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
    let db = database.open();

    return new Promise((resolve, reject) => {
      db.all("SELECT albumArtist as artist FROM playlist GROUP BY albumArtist", function(error, results) {
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

  setSelectedArtist(event) {
    this.props.dispatch({
      type: 'SET_SELECTED_ARTIST',
      value: event.currentTarget.value
    });
  }

  render() {
    return (
      <div className="cmp-widget cmp-widget-artist-list">
        <select size="15" onChange={this.setSelectedArtist.bind(this)}>
          {this.state.artists}
        </select>
      </div>
    )
  }

  componentDidMount() {
    this.getPlayList().then((data) => {
      this.setState({
        artists: data.map((value, index) => {
          return <option value={value.artist} key={index}>{value.artist}</option>;
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

export default connect(mapStatesToProps, null)(ArtistList)
