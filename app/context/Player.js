import AV from 'av';
require('flac.js');
require('av/src/devices/webaudio');

window.AV = AV;

class Player {
  constructor() {
    this.player = null;
  }

  play(fileName) {
    if (fileName) {
      this.player = AV.Player.fromFile(`${window.__dirname}/file.flac`);
    }

    if (this.player) {
      this.player.play();
    } else {
      throw new Error('Select a file first!');
    }

  }

  pause() {
  }

  toggle() {
  }


}

export default new Player;
