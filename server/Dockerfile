FROM node:lts

ARG _DIR_NAME

WORKDIR /usr/src/app

COPY ./$_DIR_NAME/package*.json ./

RUN npm install

COPY ./$_DIR_NAME .

RUN npm run build

CMD ["npm","run","start"]