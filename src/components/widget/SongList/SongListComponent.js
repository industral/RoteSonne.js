import './styles/style.css'

import React from 'react'
import {connect} from 'react-redux'

import Player from '../../../context/Player'

import TrackList from './TrackList'

class SongListComponent extends React.Component {
  constructor() {
    super();

    this.player = Player.getInstance();

    this.setSelectTrack = this.setSelectTrack.bind(this);
    this.playTrack = this.playTrack.bind(this);
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

  render() {
  console.log(444, this.props);
    return (
      <div className="cmp-widget cmp-widget-song-list table-striped">
        <table>
          <thead>
            <tr>
              <th className="track">Track</th>
              <th>Name</th>
            </tr>
          </thead>
          <TrackList
            data={this.props}
            setSelectTrack={this.setSelectTrack}
            playTrack={this.playTrack}
          />
        </table>
      </div>
    )
  }

}

export default connect(null, null)(SongListComponent)
