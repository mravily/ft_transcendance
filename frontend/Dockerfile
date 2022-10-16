FROM node:18.7-alpine3.15 AS development

WORKDIR /usr/app

COPY package*.json ./

RUN npm install -g npm
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4200

CMD [ "npm", "run", "start" ]