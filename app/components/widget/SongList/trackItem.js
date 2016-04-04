import React from 'react'

class TrackItem extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <tr onClick={this.props.onClick} onDoubleClick={this.props.onDoubleClick} className={this.props.classList}>
        <td>{this.props.trackNumber}</td>
        <td>{this.props.title}</td>
      </tr>
    )
  }
}

export default TrackItem;
