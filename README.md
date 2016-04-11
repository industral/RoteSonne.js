# RoteSonne.js

Audio Player using [Electron](http://electron.atom.io/), [Aurora.js]
(https://github.com/audiocogs/aurora.js/), [React](https://facebook.github.io/react/), 
[Redux](https://github.com/reactjs/redux)

Rewritten version of [RoteSonne](https://github.com/industral/RoteSonne)

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
