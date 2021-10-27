FROM node:17-alpine3.12

RUN mkdir -p /bot
COPY / /bot

WORKDIR /bot

RUN npm install

ENTRYPOINT ["npm","start"]