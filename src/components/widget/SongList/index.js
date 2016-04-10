import React from 'react'
import {connect} from 'react-redux'

import database from '../../../context/db'

import SongListComponent from './songListComponent'


class SongList extends React.Component {
  constructor() {
    super();

    // this.state = {
    //   tracks: []
    // };
  }

  getPlayList(props) {
    return new Promise((resolve, reject) => {
      database.open((db) => {
        db.all('SELECT * FROM playlist WHERE albumArtist = ? and album = ?',
          [props.selected.get('artist'), props.selected.get('album')], (error, results) => {
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
  // console.log(333, this.props.library, this.props.library.get('tracks'));
    return (<SongListComponent
      trackList={this.props.library.get('tracks')}
      selectedFile={this.props.selected.get('file')}
      playingFile={this.props.playing.get('file')}
    />)
  }

  componentWillReceiveProps(nextProps) {
    if  ((this.props.selected.get('album') && this.props.selected.get('artist')) && this.props.selected.get('artist') !== nextProps.selected.get('artist') ||
        this.props.selected.get('album') !== nextProps.selected.get('album')) {
      this.getPlayList(nextProps).then((data) => {
        // this.setState({
        //   tracks: data
        // });

        this.props.dispatch({
          type: 'SET_LIBRARY_TRACKS',
          value: data
        });
      });
    }
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
