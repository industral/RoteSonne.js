import React from 'react'
import {connect} from 'react-redux'
import I from 'immutable'

import database from '../../../context/db'

import SongListComponent from './songListComponent'


class SongList extends React.Component {
  constructor() {
    super();
  }

  getPlayList(props) {
    return new Promise((resolve, reject) => {
      database.open((db) => {
        db.all('SELECT * FROM playlist WHERE albumArtist = ? and album = ?',
          [props.selected.get('artist'), props.selected.get('album')], (error, results) => {
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

  render() {
    return (<SongListComponent
      trackList={this.props.library.get('tracks')}
      selectedFile={this.props.selected.get('file')}
      playingFile={this.props.playing.get('file')}
    />)
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.selected.get('album') && this.props.selected.get('artist')) &&
        this.props.selected.get('artist') !== nextProps.selected.get('artist') ||
        this.props.selected.get('album') !== nextProps.selected.get('album')) {
      this.getPlayList(nextProps).then((data) => {
        this.props.dispatch({
          type: 'SET_LIBRARY_TRACKS',
          value: data
        });
      });
    }
  }

  shouldComponentUpdate(nextState) {
    return !I.is(nextState.library.get('tracks'), this.props.library.get('tracks')) ||
           nextState.selected.get('file') !== this.props.selected.get('file') ||
           nextState.playing.get('file') !== this.props.playing.get('file');
  }

}

const mapStatesToProps = (store) => {
  return {
    selected: store.get('selected'),
    playing: store.get('playing'),
    library: store.get('library')
  }
};

export default connect(mapStatesToProps, null)(SongList)
