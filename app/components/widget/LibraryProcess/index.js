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
        <img src="./components/widget/LibraryProcess/images/ajax-loader.gif" />
      </div>
    )
  }

  processPath(libraryFiles) {
    this.getFilesInLibrary(libraryFiles).then((files) => {
      this.getMetadataFromFiles(files).then(this.writeToDB.bind(this));
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
        var asset = AV.Asset.fromFile(file);
        console.log(file);

        asset.on('error', (e) => {
          console.error(e);

          callback();
        });

        asset.get('metadata', (metadata) => {
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
