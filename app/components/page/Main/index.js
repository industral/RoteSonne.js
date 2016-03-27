import './styles/style.scss'
import React from 'react'
import Controls from '../../widget/Controls'
import SongList from '../../widget/SongList'

class Main extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="cmp-page">
        PAGE

        <Controls />
        <SongList />

      </div>
    )
  }
}

export default Main;
