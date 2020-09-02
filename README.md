[![Build status](https://github.com/zakhar-petrov/rocketchat-youtrack-linker/workflows/build/badge.svg?branch=master)](https://github.com/zakhar-petrov/rocketchat-youtrack-linker/actions?query=workflow%3Abuild)

# YouTrack Linker
Turns YouTrack references into links.

## Installation
Make sure that you have Node already installed on your machine. To verify Node installation, use the following command in your terminal.
```
node -v
# v10.15.3
# It should return you a valid version.
```
Once you have installed Node, run the following command in your terminal to install the CLI globally.
```
npm install -g @rocket.chat/apps-cli
```
It will take a while to install the CLI depending upon your internet connection. After installation, run the following command to verify the installation.
```
rc-apps -v
# @rocket.chat/apps-cli/1.4.0 darwin-x64 node-v10.15.3
```
Note that the response may vary depending upon your machine and environment, but it should look similar.

Now you can deploy the application:
```
rc-apps deploy --url <rocketchat_url> --username <your_username> --password <your_password>
```
Or update:
```
rc-apps deploy --url <rocketchat_url> --username <your_username> --password <your_password>  --update
```
## Settings
To start using the app you should set YouTrack base URL in the App Administration Page.
