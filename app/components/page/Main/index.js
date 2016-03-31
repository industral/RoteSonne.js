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
      <div className="cmp-page">
        PAGE

        <Controls />
        <ArtistList />
        <AlbumList />
        <SongList />

      </div>
    )
  }
}

export default Main;
