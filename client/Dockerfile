FROM node:19.5.0-alpine

WORKDIR /react-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
