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
      </div>
    )
  }
}


const mapStatesToProps = (store) => {
  return {
    isPlaying: store.isPlaying
  }
};

export default connect(mapStatesToProps, null)(Controls)
