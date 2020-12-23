FROM node:10-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm install
COPY . /usr/src/app
RUN npm run build

EXPOSE 80 443 3000 8080

CMD ["npm", "run", "start:prod"]