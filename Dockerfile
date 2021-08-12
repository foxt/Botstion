FROM node:11.13-stretch

RUN mkdir -p /bot
COPY / /bot

WORKDIR /bot

RUN npm install

ENTRYPOINT ["npm","start"]