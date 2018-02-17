FROM node:8-alpine

EXPOSE 3000
ENV NODE_ENV=production

WORKDIR /app
COPY package*.json /app/
COPY .npmrc /app/
RUN npm install --production

COPY build/ /app/

ENTRYPOINT [ "npm", "start", "$@" ]