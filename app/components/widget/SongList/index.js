//import './styles/style.scss'
import React from 'react'
import {connect} from 'react-redux'
import Player from '../../../context/Player'

import db from '../../../context/db'

class SongList extends React.Component {
  constructor() {
    super();

    this.player = Player.getInstance();
  }

  setSelectTrack(f) {
    this.props.dispatch({
      type: 'SET_SELECTED_TRACK',
      value: f
    });
  }

  playTrack(e) {
    this.player.stop();
    this.player.play(e);

    this.props.dispatch({
      type: 'PLAY',
      value: e
    });
  }

  getPlayList() {
    // let request = db.open();
    //
    // request.onsuccess = (event) => {
    //   let tx = event.target.result.transaction('library', 'readonly');
    //   let store = tx.objectStore('library');
    //
    //   // let store.getAll().result);
    //
    //   // library.forEach((value) => {
    //   //   store.put(value);
    //   // });
    //
    //   tx.oncomplete = () => {
    //     db.close();
    //   };
    //
    //   tx.onabort = () => {
    //     console.error(tx.error);
    //   };
    // };
  }

  render() {
    this.getPlayList();

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
            <tr
              onClick={this.setSelectTrack.bind(this, `/Data/Music/Music/Epica/2004 - Feint/Epica - Cry For The Moon CD2/(01)_[EPICA]_Cry_For_The_Moon_(Single_Version).m4a`)}
              onDoubleClick={this.playTrack.bind(this, `/Data/Music/Music/Epica/2004 - Feint/Epica - Cry For The Moon CD2/(01)_[EPICA]_Cry_For_The_Moon_(Single_Version).m4a`)}
            >
              <td>1</td>
              <td>Test 1</td>
            </tr>
            <tr
              onClick={this.setSelectTrack.bind(this, `/Data/Music/Music/Epica/2004 - Feint/Epica - Cry For The Moon CD2/(04)_[EPICA]_Run_For_A_Fall.m4a`)}>
              <td>1</td>
              <td>Test 1</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStatesToProps = (store) => {
  return {
    store: store
  }
};

export default connect(mapStatesToProps, null)(SongList)
