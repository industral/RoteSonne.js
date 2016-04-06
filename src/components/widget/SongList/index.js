import React from 'react'
import {connect} from 'react-redux'

import database from '../../../context/db'

import SongListComponent from './songListComponent'


class SongList extends React.Component {
  constructor() {
    super();

    this.state = {
      tracks: []
    };
  }

  getPlayList(props) {
    return new Promise((resolve, reject) => {
      database.open((db) => {
        db.all('SELECT * FROM playlist WHERE albumArtist = ? and album = ?',
          [props.selected.artist, props.selected.album], (error, results) => {
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

  render() {
    return (<SongListComponent
      trackList={this.state.tracks}
      selectedFile={this.props.selected.file}
      playingFile={this.props.playing.file}
    />)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selected.artist !== nextProps.selected.artist ||
        this.props.selected.album !== nextProps.selected.album) {
      this.getPlayList(nextProps).then((data) => {
        this.setState({
          tracks: data
        });
      });
    }
  }

}

const mapStatesToProps = (store) => {
  return {
    selected: store.selected,
    playing: store.playing
  }
};

export default connect(mapStatesToProps, null)(SongList)
