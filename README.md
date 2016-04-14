# RoteSonne.js Audio Player

Cross-platform **Audio Player** written in **JavaScript** using [Electron](http://electron.atom.io/), [Aurora.js]
(https://github.com/audiocogs/aurora.js/), [React](https://facebook.github.io/react/), 
[Redux](https://github.com/reactjs/redux) and [Immutable.js](https://facebook.github.io/immutable-js/) 

Rewritten version of [RoteSonne](https://github.com/industral/RoteSonne)

### Features

**Supported formats**: FLAC, WavPack, Ogg, mp3, AAC


![OS X](./docs/osx.png)


## Install


```bash
$ npm i electron-prebuilt -g
$ npm i

$ cd app/node_modules/av # temporary
$ npm i && make browser

$ cd ../aac
$ npm i && make browser

$ cd ../alac
$ npm i && make browser

$ cd ../flac.js
$ npm i && make browser

$ cd ../mp3
$ npm i && make browser

$ cd ../../..

$ webpack -w
$ electron app/
$ DEBUG=1 electron app/ # with Developer toolbar
$ DEBUG=1 REDUX=1 electron app/ # with Redux Developer toolbar
```


## Create a build

```bash
$ npm run pack # create .app
$ npm run dist # create .dmg
```
