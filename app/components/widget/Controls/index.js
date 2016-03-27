import './styles/style.scss'
import React from 'react'
import { connect } from 'react-redux'



class Controls extends React.Component {
  constructor() {
    super();
  }

  togglePlayPause() {
    this.props.dispatch({
      type: 'TOGGLE_PLAY'
    });
  }

  render() {
    // window.player = AV.Player.fromFile(`${window.__dirname}/file.flac`);
    //player.play();


    return (
      <div className="cmp-widget cmp-widget-controls">
        <div className="controls">
          <button data-id="backward" />

          <button data-id="start-pause"
                  data-is-playing={this.props.isPlaying}
                  onClick={this.togglePlayPause.bind(this)} />

          <button data-id="forward" />
        </div>

        <div>
          <h3></h3>
          <input type="range" />
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
