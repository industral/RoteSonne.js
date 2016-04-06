import React from 'react'

const TrackItem = (props) => {
  let classList = () => {
    var output = [];

    if (props.selectedFile === props.trackInfo.file) {
      output.push('selected');
    }

    if (props.playingFile === props.trackInfo.file) {
      output.push('active');
    }

    return output.join(' ');
  };

  return (
    <tr onClick={props.onClick} onDoubleClick={props.onDoubleClick} className={classList()}>
      <td>{props.trackInfo.trackNumber}</td>
      <td>{props.trackInfo.title}</td>
    </tr>
  );
};

export default TrackItem;
