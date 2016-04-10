import React from 'react'
import utils from '../../../assets/js/Utils'

class AlbumCover extends React.Component {
  constructor() {
    super();

    this.albumsCovers = {};
    // this.state = {
    //   covers: null
    // };
  }

  render() {
    let covers = [];

    for (let i = 1; i < 5; ++i) {
      let cover = this.props.data.get(`coverArt${i}`);

      if (cover) {
        covers.push(cover);
      }
    }

    covers = covers && covers.length ? covers : [null];

    return (
      <div>
        {covers.map((value, index) => {
          const id = value ? `${this.props.data.get('id')}${index}` : 0;
          const cover = this.getCoverAsURL(id, value);
          return <img key={index} className="media-object pull-left" src={cover} />
        })}
      </div>
    )
  }

  getCoverAsURL(id, coverData) {
    return utils.getURLfromBlob(coverData);
  }

}

export default AlbumCover;
