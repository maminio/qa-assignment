FROM node:12.16.2-alpine3.9 as builder


WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --pure-lockfile

COPY . .


EXPOSE 3000
EXPOSE 35729


CMD ["yarn", "start"]
