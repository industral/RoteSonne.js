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
    return state.set('isPlaying', true).
      setIn(['playing', 'file'], action.value.file).
      setIn(['playing', 'title'], action.value.title).
      setIn(['selected', 'file'], action.value.file).
      setIn(['selected', 'title'], action.value.title);

    case 'STOP':
      return state.set('isPlaying', false);

    case 'TOGGLE_PLAY':
      return state.set('isPlaying', !state.get('isPlaying'));

    case 'SET_SELECTED_ARTIST':
      return state.setIn(['selected', 'artist'], action.value);

    case 'SET_SELECTED_ALBUM':
      return state.setIn(['selected', 'album'], action.value);

    case 'SET_SELECTED_TRACK':
      return state.setIn(['selected', 'title'], action.value.title).
        setIn(['selected', 'file'], action.value.file);

    case 'SET_PLAYING_TRACK':
      return state.setIn(['playing', 'title'], action.value.title).
       setIn(['playing', 'file'], action.value.file);

    case 'LIBRARY_UPDATED':
      return state.set('libraryUpdated', true).
        set('selected', Immutable.Map());

    case 'LIBRARY_DID_UPDATE':
      return state.set('libraryUpdated', false);

    case 'SET_LIBRARY_ARTISTS':
      return state.setIn(['library', 'artists'], Immutable.fromJS(action.value)).
        setIn(['library', 'albums'], Immutable.List());

    case 'SET_LIBRARY_ALBUMS':
      return state.setIn(['library', 'albums'], Immutable.fromJS(action.value)).
        setIn(['library', 'tracks'], Immutable.List());

    case 'SET_LIBRARY_TRACKS':
      return state.setIn(['library', 'tracks'], Immutable.fromJS(action.value));

    default:
      return state;
  }
}

export default mainReducer;
