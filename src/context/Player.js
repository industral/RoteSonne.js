import AV from 'av';

window.AV = AV;

require('av/src/devices/webaudio');

require('flac.js');
require('aac/build/aac');
require('alac/build/alac');
require('mp3/build/mp3');

class Player {
  constructor() {
    this.player = null;

    this.state = {
      isPlaying: false
    };

    this.store = window._store;
  }

  static getInstance() {
    if (!Player.instance) {
      Player.instance = new Player();
    }

    return Player.instance;
  }

  play(file) {
    let store = this.store.getState();

    if (!this.state.isPlaying) {
      if (!this.player || this.player.isStop) {
        let track = file || store.playing.track || store.selected.track;

        if (!track) {
          throw new Error('Select a file first!');
        }

        this.player = AV.Player.fromFile(track);
      }

      this.player.play();
    }
  }

  pause() {
    this.player.pause();
  }

  stop() {
    if (this.player) {
      this.player.pause();
      this.player.stop();
      this.player.isStop = true;
    }
  }

  toggle() {
    let store = this.store.getState();

    if (store.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}

Player.instance = null;

export default Player;
