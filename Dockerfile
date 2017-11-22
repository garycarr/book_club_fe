FROM node:latest
Maintainer G Carr

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

ENV PORT_APP=8000 \
    PORT_COVERAGE=8001 \
    API_PROXY_PROTOCOL=http:// \
    API_PROXY_HOST=localhost \
    API_PROXY_PORT=3000 \
    API_PROXY_PATH=/

COPY . /usr/src/app/

CMD npm start

EXPOSE 8000
