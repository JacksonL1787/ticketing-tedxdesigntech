FROM node:12

COPY . /app

WORKDIR /app
RUN npm i

EXPOSE 3000
CMD npm run watch
#Comments
