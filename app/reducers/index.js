const initObject = {
  isPlaying: false,
  playing: {
    album: '',
    artist: '',
    track: ''
  }
};

function mainReducer(state = initObject, action) {
  switch (action.type) {
    case 'PLAY':
      return Object.assign({}, state, {
        isPlaying: true
      });

    case 'STOP':
      return Object.assign({}, state, {
        isPlaying: false
      });

    case 'TOGGLE_PLAY':
      return Object.assign({}, state, {
        isPlaying: !state.isPlaying
      });

    default:
      return state;
  }
}

export default mainReducer;
