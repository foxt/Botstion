FROM node:11.10.1-stretch

RUN mkdir -p /bot
COPY / /bot

WORKDIR /bot

RUN npm install

ENTRYPOINT ["npm","start"]