import './styles/style.scss'
import React from 'react'

import Controls from '../../widget/Controls'
import SongList from '../../widget/SongList'
import ArtistList from '../../widget/ArtistList'
import AlbumList from '../../widget/AlbumList'

class Main extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="cmp-page pane-group">
        <div className="pane pane-sm sidebar">
          <ArtistList />
        </div>

        <div className="pane pane-sm sidebar">
          <AlbumList />
        </div>

        <div className="pane">
          <SongList />
        </div>
      </div>
    )
  }
}

export default Main;
