FROM node:12-alpine

USER root

WORKDIR /atlas-plus

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]