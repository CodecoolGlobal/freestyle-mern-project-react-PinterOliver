FROM node:slim

ENV NODE_ENV=production

WORKDIR /express

COPY . .

RUN npm install

RUN chmod +x /express/entrypoint.sh

CMD ["node", "server.js", "npm", "install", "dotenv" ]

RUN node populate/populate.js

EXPOSE 8080


