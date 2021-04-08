FROM node:latest

WORKDIR /MUJI_MOCK

COPY /server/package*.json server/

RUN cd server; npm i && npm cache clean --force 

COPY . .

EXPOSE 5000

CMD cd server; npm run start
