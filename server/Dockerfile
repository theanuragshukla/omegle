FROM node:18-alpine

ARG CLIENT_URL
ARG MONGO_URL

ENV MONGO_URL $MONGO_URL
ENV CLIENT_URL $CLIENT_URL

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 8000

CMD [ "node" , "index.js" ]
