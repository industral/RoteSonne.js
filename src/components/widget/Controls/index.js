import './styles/style.scss'

import React from 'react'
import {connect} from 'react-redux'

import Player from '../../../context/Player'

class Controls extends React.Component {
  constructor() {
    super();

    this.player = Player.getInstance();
  }

  togglePlayPause() {
    this.player.toggle();

    this.props.dispatch({
      type: 'TOGGLE_PLAY'
    });
  }

  handleSeeking() {
    const progress = this.refs.progress;
    let moving = false;

    setInterval(() => {
      if (!moving) {
        progress.value = this.player.getProgress();
      }
    }, 1000);

    progress.onmousedown = () => {
      moving = true;
    };

    progress.onmouseup = () => {
      moving = false;

      this.player.setProgress(progress.value);
    };
  }

  render() {
    let toggleButtonClass = () => {
      return 'icon ' + (this.props.isPlaying ? 'icon-pause' : 'icon-play');
    };

    return (
      <div className="cmp-widget cmp-widget-controls">
        <div className="toolbar-actions">
          <div className="btn-group">
            <button className="btn btn-large btn-default">
              <span className="icon icon-fast-backward" />
            </button>

            <button className="btn btn-large btn-default"
                    data-id="start-pause"
                    data-is-playing={this.props.isPlaying}
                    onClick={this.togglePlayPause.bind(this)}>
              <span className={toggleButtonClass()} />
            </button>

            <button className="btn btn-large btn-default">
              <span className="icon icon-fast-forward" />
            </button>
          </div>
        </div>

        <input type="range" min="0" max="100" ref="progress" className="seek" defaultValue="0" step="0.1" />

      </div>
    )
  }

  componentDidMount() {
    this.handleSeeking();
  }
}


const mapStatesToProps = (store) => {
  return {
    isPlaying: store.isPlaying
  }
};

export default connect(mapStatesToProps, null)(Controls)
