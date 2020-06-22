# News-App

![news app](https://cdn0.iconfinder.com/data/icons/simplicity/512/news_article_blog-512.png)

News-App is a Progressive Web Application([PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)) that is used to subscribe to news sources and read articles from [News-API](https://newsapi.org)


## Prerequisites
1- MongoDB: you can follow this [link](https://docs.mongodb.com/manual/administration/install-on-linux/) to install it.

2- Redis: install it from [here](https://redis.io/topics/quickstart).

3- Node.js and npm: follow this [guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install it.

4- Environment variables
```bash
PORT                 #Express port (default: 5000)
DATABASE             #Database name (default: newsApp)
ACCESS_TOKEN_SECRET  #JWT Access token key
NEWS_API_KEY         #News-API account secret key
COOKIE_SECRET        #Cookie signing key
```
## Installation

Clone the repo to your local machine 
```bash
git clone https://github.com/M-tarek93/News-App.git
```
then
```bash
cd News-App
```
Install package.json modules for both servers
```bash
npm install
```
```bash
cd Client/ && npm install
```

## Usage

```bash
npm start
```

## Further Steps to implement
- Filtering sources by category, country, and language.
- Enable user to search about an article.

### Live Demo
<https://news-app.eu-central-1.elasticbeanstalk.com/>
