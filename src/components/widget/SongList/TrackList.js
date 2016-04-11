import React from 'react'

import TrackItem from './TrackItem'


const TrackList = (props) => {
  return (
    <tbody>
      {props.data.trackList.map((value, index) => {
        return (<TrackItem
          key={index}
          trackInfo={value}
          selectedFile={props.data.selectedFile}
          playingFile={props.data.playingFile}
          onClick={props.setSelectTrack.bind(this, value.get('title'), value.get('file'))}
          onDoubleClick={props.playTrack.bind(this, value.get('title'), value.get('file'))}
        />);
      })}
    </tbody>
  );
};

export default TrackList;
