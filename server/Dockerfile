ARG NODE_VERSION
ARG APP_VERSION


FROM node:${NODE_VERSION}-alpine

WORKDIR "/app"

COPY ./package.json ./
COPY ./ ./

RUN npm install



CMD ["yarn", "start:dev"]
EXPOSE 9229
