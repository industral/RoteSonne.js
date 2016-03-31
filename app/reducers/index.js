const initObject = {
  isPlaying: false,
  playing: {
    artist: null,
    album: null,
    track: null
  },
  selected: {
    artist: null,
    album: null,
    track: null
  }
};

function mainReducer(state = initObject, action) {
  switch (action.type) {
    case 'PLAY':
      var output = {
        isPlaying: true
      };

      if (action.value) {
        output.playing = Object.assign({}, output.playing, {
          track: action.value
        });
        output.selected = Object.assign({}, output.selected, {
          track: action.value
        });
      }

      return Object.assign({}, state, output);

    case 'STOP':
      return Object.assign({}, state, {
        isPlaying: false
      });

    case 'TOGGLE_PLAY':
      return Object.assign({}, state, {
        isPlaying: !state.isPlaying
      });

    case 'SET_SELECTED_ARTIST':
      return Object.assign({}, state, {
        selected: {
          artist: action.value
        }
      });

    case 'SET_SELECTED_TRACK':
      return Object.assign({}, state, {
        selected: {
          track: action.value
        }
      });

    case 'SET_PLAYING_TRACK':
      return Object.assign({}, state, {
        playing: {
          track: action.value
        }
      });

    default:
      return state;
  }
}

export default mainReducer;
