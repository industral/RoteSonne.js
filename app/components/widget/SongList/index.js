//import './styles/style.scss'
import React from 'react'

//import AV from 'av';
//require('flac.js');
//require('av/src/devices/webaudio');

class SongList extends React.Component {
  constructor() {
    super();
  }

  render() {
    //window.player = AV.Player.fromFile(`${window.__dirname}/file.flac`);
    //player.play();


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
            <tr>
              <td>1</td>
              <td>Test 1</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default SongList;
