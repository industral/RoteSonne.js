const initObject = {
  isPlaying: false,
  playing: {
    artist: null,
    album: null,
    title: null,
    file: null
  },
  selected: {
    artist: null,
    album: null,
    title: null,
    file: null
  }
};

function mainReducer(state = initObject, action) {
  switch (action.type) {
    case 'PLAY':
      return Object.assign({}, state, {
        isPlaying: true,
        playing: Object.assign({}, state.playing, {
          file: action.value.file,
          title: action.value.title
        }),
        selected: Object.assign({}, state.selected, {
          file: action.value.file,
          title: action.value.title
        })
      });

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
        selected: Object.assign({}, state.selected, {
          artist: action.value
        })
      });

    case 'SET_SELECTED_ALBUM':
      return Object.assign({}, state, {
        selected: Object.assign({}, state.selected, {
          album: action.value
        })
      });

    case 'SET_SELECTED_TRACK':
      return Object.assign({}, state, {
        selected: Object.assign({}, state.selected, {
          title: action.value.title,
          file: action.value.file
        })
      });

    case 'SET_PLAYING_TRACK':
      return Object.assign({}, state, {
        playing: Object.assign({}, state.playing, {
          title: action.value.title,
          file: action.value.file
        })
      });

    default:
      return state;
  }
}

export default mainReducer;
