FROM node:18.7-alpine3.15 AS development

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4200

# Delete si utiliser dans docker-compose
CMD [ "npm", "run", "start" ]