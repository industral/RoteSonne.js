//import './styles/style.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'

import wrench from 'wrench'
import async from 'async'

import AV from 'av'

import database from '../../../context/db'

class LibraryProcess extends React.Component {
  constructor() {
    super();

    this.state = {};
    this.extensions = /\.aac|\.flac|\.m4a/;
  }

  componentDidMount() {
    if (this.props.path) {
      this.processPath(this.props.path[0]);
    }
  }

  render() {
    return (
      <div className="cmp-widget cmp-widget-library-process">
        LibraryProcess {String(this.state.done)}
      </div>
    )
  }

  processPath(libraryPath) {
    this.getFilesInLibrary(libraryPath).then((files) => {
      this.getMetadataFromFiles(libraryPath, files).then(this.writeToDB.bind(this));
    });
  }

  /**
   * Scan library and return array of found files.
   * @param {String} path path to library
   * @returns {Promise}
   */
  getFilesInLibrary(path) {
    let output = [];

    return new Promise((resolve) => {
      wrench.readdirRecursive(path, (error, curFiles) => {
        if (error) {
          console.error(error);
        } else if (curFiles) {
          output = output.concat(curFiles);
        } else {
          output = output.filter((value) => {
            return value.match(this.extensions)
          });

          resolve(output);
        }
      });
    });
  }

  getMetadataFromFiles(libraryPath, files) {
    let output = [];

    return new Promise((resolve, reject) => {
      async.eachSeries(files, (file, callback) => {
        var asset = AV.Asset.fromFile(`${libraryPath}/${file}`);
        console.log(`${libraryPath}/${file}`);

        asset.on('error', (e) => {
          console.error(e);

          callback();
        });

        asset.get('metadata', (metadata) => {
          console.log(metadata);

          output.push({
            file: `${libraryPath}/${file}`,
            artist: metadata.artist || 'Unknow',
            albumArtist: metadata.albumArtist || metadata.artist || 'Unknow',
            album: metadata.album || 'Unknow',
            title: metadata.title || file.split('/').pop().replace(this.extensions, ''),
            diskNumber: metadata.diskNumber,
            trackNumber: metadata.trackNumber
          });

          callback();
        });
      }, (err) => {
        if (err) {
          reject(err);
        }

        resolve(output);
      });
    });
  }

  writeToDB(library) {
    let db = database.open();
    database.recreate(() => {
      library.forEach((value, index) => {
        db.run("INSERT INTO playlist VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [index, value.artist, value.albumArtist, value.album, value.title, value.file, value.diskNumber,
            value.trackNumber]);
      });
    });
  }

  done() {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
  }
}

const mapStatesToProps = (store) => {
  return {
    store: store
  }
};

export default connect(mapStatesToProps, null)(LibraryProcess)