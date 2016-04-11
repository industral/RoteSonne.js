import React from 'react'
import utils from '../../../assets/js/Utils'

class AlbumCover extends React.Component {
  constructor() {
    super();
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
          const cover = utils.getURLfromBlob(value);
          return <img key={index} className="media-object pull-left" src={cover} />
        })}
      </div>
    )
  }

  shouldComponentUpdate(nextProps) {
    return !nextProps.data.equals(this.props.data);
  }

}

export default AlbumCover;
