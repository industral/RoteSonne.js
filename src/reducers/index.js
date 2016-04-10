import Immutable from 'immutable';

const initObject = Immutable.fromJS({
  isPlaying: false,
  libraryUpdated: false,
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
  },
  library: {
    artists: [],
    albums: [],
    tracks: []
  }
});

function mainReducer(state = initObject, action) {
  switch (action.type) {
    case 'PLAY':
      return state.mergeDeep({
        isPlaying: true,
        playing: {
          file: action.value.file,
          title: action.value.title
        },
        selected: {
          file: action.value.file,
          title: action.value.title
        }
      });

    case 'STOP':
      return state.mergeDeep({
        isPlaying: false
      });

    case 'TOGGLE_PLAY':
      return state.mergeDeep({
        isPlaying: !state.get('isPlaying')
      });

    case 'SET_SELECTED_ARTIST':
      return state.mergeDeep({
        selected: {
          artist: action.value
        }
      });

    case 'SET_SELECTED_ALBUM':
      return state.mergeDeep({
        selected: {
          album: action.value
        }
      });

    case 'SET_SELECTED_TRACK':
      return state.mergeDeep({
        selected: {
          title: action.value.title,
          file: action.value.file
        }
      });

    case 'SET_PLAYING_TRACK':
      return state.mergeDeep({
        playing: {
          title: action.value.title,
          file: action.value.file
        }
      });

    case 'LIBRARY_UPDATED':
      return state.mergeDeep({
        libraryUpdated: true,
        selected: {}
      });


    case 'LIBRARY_DID_UPDATE':
      return state.set('libraryUpdated', false);

    case 'SET_LIBRARY_ARTISTS':
      return state.mergeDeep({
        library: {
          artists: action.value,
          albums: []
        }
      });

    case 'SET_LIBRARY_ALBUMS':
      return state.mergeDeep({
        library: {
          albums: action.value,
          tracks: []
        }
      });

    case 'SET_LIBRARY_TRACKS':
      return state.mergeDeep({
        library: {
          tracks: action.value
        }
      });

    default:
      return state;
  }
}

export default mainReducer;
