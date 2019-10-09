FROM node:8

COPY . /app

WORKDIR /app
RUN npm i

EXPOSE 3000 27017
CMD npm run watch
#Comments
