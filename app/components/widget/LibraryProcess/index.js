//import './styles/style.scss'
import React from 'react'
import {connect} from 'react-redux'

class LibraryProcess extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="cmp-widget cmp-widget-library-process">
        LibraryProcess
      </div>
    )
  }
}

const mapStatesToProps = (store) => {
  return {
    store: store
  }
};

export default connect(mapStatesToProps, null)(LibraryProcess)
