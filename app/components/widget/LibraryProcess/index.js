//import './styles/style.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'

import wrench from 'wrench'
import async from 'async'

import AV from 'av'

import db from '../../../context/db'

class LibraryProcess extends React.Component {
  constructor() {
    super();

    this.state = {};
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

    return new Promise(function(resolve) {
      wrench.readdirRecursive(path, function(error, curFiles) {
        if (error) {
          console.error(error);
        } else if (curFiles) {
          output = output.concat(curFiles);
        } else {
          output = output.filter((value) => {
            return value.match(/\.aac|\.flac|\.m4a/)
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

        asset.on('error', function(e) {
          console.error(e);

          callback();
        });

        asset.get('metadata', (metadata) => {
          console.log(metadata);

          output.push({
            file: `${libraryPath}/${file}`,
            artist: metadata.artist,
            album: metadata.album,
            title: metadata.title,
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
    let request = db.open();

    request.onsuccess = (event) => {
      let tx = event.target.result.transaction('library', 'readwrite');
      let store = tx.objectStore('library');
      store.clear();

      library.forEach((value) => {
        store.put(value);
      });

      tx.oncomplete = () => {
        db.close();

        this.setState({
          done: true
        });

        setTimeout(() => {
          this.done();
        }, 1000);

      };

      tx.onabort = () => {
        console.error(tx.error);
      };
    };
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
