import React from 'react'

import TrackItem from './TrackItem'


const TrackList = (props) => {
console.log(props);
  return (
    <tbody>
      {props.data.trackList.map((value, index) => {
        return (<TrackItem
          key={index}
          trackInfo={value}
          selectedFile={props.selectedFile}
          playingFile={props.playingFile}
          onClick={props.setSelectTrack.bind(this, value.get('title'), value.get('file'))}
          onDoubleClick={props.playTrack.bind(this, value.get('title'), value.get('file'))}
        />);
      })}
    </tbody>
  );
};

export default TrackList;
