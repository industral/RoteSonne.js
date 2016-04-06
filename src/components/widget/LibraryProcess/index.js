import './styles/style.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'

import fse from 'fs-extra'
import async from 'async'
import AV from 'av'

import database from '../../../context/db'

class LibraryProcess extends React.Component {
  constructor() {
    super();

    this.state = {};
    this.extensions = /\.aac|\.flac|\.m4a|\.mp3/;
  }

  componentDidMount() {
    if (this.props.files) {
      this.processPath(this.props.files[0]);
    }
  }

  render() {
    return (
      <div className="cmp-widget cmp-widget-library-process">
        <div>Processing library...</div>
        <progress />
      </div>
    )
  }

  processPath(libraryFiles) {
    this.getFilesInLibrary(libraryFiles).then((files) => {
      this.getMetadataFromFiles(files).then(this.writeToDB.bind(this));
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Scan library and return array of found files.
   * @param {String} files path to library
   * @returns {Promise}
   */
  getFilesInLibrary(files) {
    return new Promise((resolve) => {
      var items = [];

      fse.walk(files)
        .on('data', (item) => {
          console.log(item);
          if (!item.stats.isDirectory() && item.path.match(this.extensions)) {
            items.push(item.path);
          }
        })
        .on('error', (error) => {
          console.error(error);
        })
        .on('end', () => {
          resolve(items);
        });
    });
  }

  getMetadataFromFiles(files) {
    let output = [];

    return new Promise((resolve, reject) => {
      async.eachSeries(files, (file, callback) => {
        let asset = AV.Asset.fromFile(file);

        let onError = (e) => {
          console.error(e);

          this.releaseResource(asset, {
            onError,
            onMetadata,
            onData
          });

          callback();
        };

        let onMetadata = (metadata) => {
          console.log(metadata);

          output.push({
            file: file,
            artist: metadata.artist || 'Unknow',
            albumArtist: metadata.albumArtist || metadata.artist || 'Unknow',
            album: metadata.album || 'Unknow',
            title: metadata.title || file.split('/').pop().replace(this.extensions, ''),
            diskNumber: metadata.diskNumber,
            trackNumber: metadata.trackNumber
          });

          this.releaseResource(asset, {
            onError,
            onMetadata,
            onData
          });

          callback();
        };

        /**
         * Some decoders, doesn't fire any events if they don't find metadata.
         * To avoid hung, we check if program go to data section. If so, we don't
         * have metadata.
         * Give a time to ensure we don't have metadata.
         */
        let onData = () => {
          setTimeout(() => {
            asset.emit('error', `Can't read metadata from file ${file}`);
          }, 300);
        };

        console.log(file, asset);

        asset.on('error', onError);
        asset.get('metadata', onMetadata);
        asset.once('data', onData);
      }, (err) => {
        if (err) {
          console.error(e);

          reject(err);
        }

        console.log(output);
        resolve(output);
      });
    });
  }

  releaseResource(asset, callbacks) {
    asset.source.stream.close();
    asset.off('data', callbacks.onData);
    asset.off('error', callbacks.onError);
    asset.off('metadata', callbacks.onMetadata);
    asset = null;
  }

  writeToDB(library) {
    database.open((db) => {
      database.recreate(() => {

        if (library.length) {
          library.forEach((value, index) => {
            db.run("INSERT INTO playlist VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [index, value.artist, value.albumArtist, value.album, value.title, value.file, value.diskNumber,
                value.trackNumber], () => {
                if (index === library.length - 1) {
                  this.done();
                }
              });
          });
        } else {
          this.done();
        }
      });
    });
  }

  done() {
    this.props.dispatch({
      type: 'LIBRARY_UPDATED'
    });

    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
  }
}

const mapStatesToProps = (store) => {
  return {
    store: store
  }
};

export default connect(mapStatesToProps, null)(LibraryProcess)
