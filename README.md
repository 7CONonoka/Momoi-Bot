# Momoi-Bot
A Discord bot for Blue Archive game, using API from [torikushiii](https://github.com/torikushiii/BlueArchiveAPI). If you could, please support both of us ❤
# Installing
**Node.js 16 or higher is required**
To install all libraby, you can use the following commands:
```
# NPM
npm install

# yarn
yarn
```
To use the bot, you need to create a .env file with following commands:
```
# create .env file
touch .env
```
.env content should be like this:
```env
TOKEN=YOUR_TOKEN_HERE
API=https://api.ennead.cc/buruaka
```
Add your Bot client ID and your Server Id in
``
.config/config.json
``
# Run the bot
To run Momoi-bot you can use few ways:
```
# PM2
yarn add -D pm2

pm2 start ./src/index.js --name "ANYTHING"

# Nodemon
yarn add -D nodemon

nodemon ./src/index.js

# Node
Node ./src/index.js
```
## Footer
I hope you have a good times with my bot, feel free to contribute or contact with me if you needs something!
