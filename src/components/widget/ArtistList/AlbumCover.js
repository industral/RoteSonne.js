import React from 'react'
import utils from '../../../assets/js/Utils'

class AlbumCover extends React.Component {
  constructor() {
    super();

    this.albumsCovers = {};
    this.state = {
      covers: null
    };
  }

  render() {
    const covers = this.state.covers && this.state.covers.length ? this.state.covers : [null];

    return (
      <div>
        {covers.map((value, index) => {
          const id = value ? `${this.props.id}${index}` : 0;
          const cover = this.getCoverAsURL(id, value);
          return <img key={index} className="media-object pull-left" src={cover} />
        })}
      </div>
    )
  }

  getCoverAsURL(id, coverData) {
    return this.albumsCovers[id] || (this.albumsCovers[id] = utils.getURLfromBlob(coverData));
  }

  componentWillReceiveProps() {
  }

  componentDidMount() {
    let covers = [];
    for (let i = 1; i < 5; ++i) {
      let cover = this.props[`coverArt${i}`];

      if (cover) {
        covers.push(cover);
      }
    }

    this.setState({
      covers: covers
    });
  }

}

export default AlbumCover;
