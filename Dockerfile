FROM node:latest

WORKDIR /MUJI_MOCK

COPY . .

COPY /server/package*.json server/

RUN cd server

RUN npm i && npm cache clean --force 

EXPOSE 5000

CMD cd server; npm run start
