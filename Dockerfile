FROM node:11-stretch

RUN mkdir -p /bot
COPY / /bot

WORKDIR /bot

RUN npm install

ENTRYPOINT ["npm","start"]