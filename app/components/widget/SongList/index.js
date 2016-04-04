import './styles/style.css'

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

  setSelectTrack(title, file) {
    this.props.dispatch({
      type: 'SET_SELECTED_TRACK',
      value: {
        title: title,
        file: file
      }
    });
  }

  playTrack(title, file) {
    this.player.stop();

    setTimeout(() => {
      this.player.play(file);

      this.props.dispatch({
        type: 'PLAY',
        value: {
          title: title,
          file: file
        }
      });
    }, 500);

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
      let classList = () => {
        var output = [];

        if (this.props.store.selected.file === value.file) {
          output.push('selected');
        }

        if (this.props.store.playing.file === value.file) {
          output.push('active');
        }

        return output.join(' ');
      };

      return (<TrackItem
        classList={classList()}
        key={index}
        {...value}
        onClick={this.setSelectTrack.bind(this, value.title, value.file)}
        onDoubleClick={this.playTrack.bind(this, value.title, value.file)}
      />)
    });

    return (
      <div className="cmp-widget cmp-widget-song-list table-striped">
        <table>
          <thead>
            <tr>
              <th className="track">Track</th>
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
    this.getPlayList(nextProps).then((data) => {
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
