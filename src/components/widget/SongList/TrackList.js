import React from 'react'

import TrackItem from './TrackItem'


const TrackList = (props) => {
  return (
    <tbody>
      {props.trackList.map((value, index) => {
        return (<TrackItem
          key={index}
          trackInfo={value}
          selectedFile={props.selectedFile}
          playingFile={props.playingFile}
          onClick={props.setSelectTrack.bind(this, value.title, value.file)}
          onDoubleClick={props.playTrack.bind(this, value.title, value.file)}
        />);
      })}
    </tbody>
  );
};

export default TrackList;
