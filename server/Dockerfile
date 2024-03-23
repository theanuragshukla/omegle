FROM node:18-alpine

ENV MONGO_URL
ENV CLIENT_URL

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 8000

CMD [ "node" , "index.js" ]
