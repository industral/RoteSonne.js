import './styles/style.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'

import fse from 'fs-extra'
import async from 'async'
import AV from 'av'

import utils from '../../../assets/js/Utils'

import database from '../../../context/db'

class LibraryProcess extends React.Component {
  constructor() {
    super();

    this.state = {};
    this.extensions = /\.aac|\.flac|\.m4a|\.mp3/;
    this.db = null;

    this.writeToDB = this.writeToDB.bind(this);
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

      if (files && files.length) {
        database.open((db) => {
          database.recreate(() => {
            this.db = db;

            this.getMetadataFromFiles(files, this.writeToDB).then(() => {
              this.done();
            })
          });
        });
      } else {
        this.done();
      }
    }).catch((error) => {
      console.error(error);

      this.done();
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

  getMetadataFromFiles(files, trackInfoCallback) {
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

          const covertArt = metadata.coverArt ? metadata.coverArt.data : undefined;

          trackInfoCallback({
            file: file,
            artist: utils.removeNonASCII(metadata.artist || 'Unknow'),
            albumArtist: utils.removeNonASCII(metadata.albumArtist || metadata.artist || 'Unknow'),
            album: utils.removeNonASCII(metadata.album || 'Unknow'),
            title: utils.removeNonASCII(metadata.title || file.split('/').pop().replace(this.extensions, '')),
            diskNumber: metadata.diskNumber,
            trackNumber: metadata.trackNumber,
            coverArt: covertArt
          }, callback);

          this.releaseResource(asset, {
            onError,
            onMetadata,
            onData
          });

          // callback();
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

        resolve();
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

  writeToDB(fileInfo, callback) {
    this.db.run('INSERT INTO `playlist` VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [null, fileInfo.artist, fileInfo.albumArtist, fileInfo.album, fileInfo.title, fileInfo.file, fileInfo.diskNumber,
        fileInfo.trackNumber], (error) => {

        if (error) {
          console.error(error);
        }

        this.db.run('INSERT OR IGNORE INTO `albums` VALUES  (?, ?, ?, ?)',
          [null, fileInfo.albumArtist, fileInfo.album, fileInfo.coverArt], (error) => {
            if (error) {
              console.error(error);
            }

            callback();
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
