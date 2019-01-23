# slack-logger
* Change logger.config.json to change `url`, `logfilePath`, `levels`
  * `url`: url to slack hook api
  * `logfilePath`: path to logfile in local filesystem
  * `levels`: logger levels to send (for django, you can select from DEBUG, INFO, ERROR, WARNING)

- Initial implementaion : for django.

### - You should change `logger.config.1.json` to `logger.config.json` to use.
  * For security for my own slack app, I made another file `logger.config.1.json` to store my slack api url.

Change this
```javascript
// <index.ts: line 13>
let data = fs.readFileSync('./logger.config.1.json');
```

into
```javascript
// <index.ts: line 13>
let data = fs.readFileSync('./logger.config.json');
```

### Install & start
* Install
```//color=#acb0b7
npm install
```

* Build
```
yarn build
```

* Start
```
yarn start
```
