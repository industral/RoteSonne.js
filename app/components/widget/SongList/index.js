//import './styles/style.scss'
import React from 'react'
import {connect} from 'react-redux'
import Player from '../../../context/Player'
import TrackItem from './trackItem'

import database from '../../../context/db'

class SongList extends React.Component {
  constructor() {
    super();

    this.state = {
      tracks: []
    };

    this.player = Player.getInstance();
  }

  setSelectTrack(title) {
    this.props.dispatch({
      type: 'SET_SELECTED_TRACK',
      value: title
    });
  }

  playTrack(file) {
    this.player.stop();

    // setTimeout(() => {
      this.player.play(file);

      this.props.dispatch({
        type: 'PLAY',
        value: file
      });
    // }, 5000);


  }

  getPlayList(props) {
    let selected = props.store.selected;
    let db = database.open();

    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM playlist WHERE albumArtist = ? and album = ?",
        [selected.artist, selected.album], function(error, results) {
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
    var tracks = this.state.tracks.map((value, index) => {
      return (<TrackItem
        key={index}
        {...value}
        onClick={this.setSelectTrack.bind(this, value.file)}
        onDoubleClick={this.playTrack.bind(this, value.file)}
      />)
    });

    return (
      <div className="cmp-widget cmp-widget-song-list">
        <table>
          <thead>
            <tr>
              <th>Track</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {tracks}
          </tbody>
        </table>
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {
    console.log(333, nextProps);
    this.getPlayList(nextProps).then((data) => {
      console.log(123, data);
      this.setState({
        tracks: data
      });
    });
  }
}

const mapStatesToProps = (store) => {
  return {
    store: store
  }
};

export default connect(mapStatesToProps, null)(SongList)
