FROM node
RUN apt-get -yqq update && \
    apt-get -yqq install unzip wget

RUN mkdir -p /usr/app
RUN mkdir -p /usr/app/vertcoind

COPY . /usr/app

WORKDIR /usr/app
RUN rm .npmrc
RUN npm install

WORKDIR /usr/app/vertcoind
RUN wget https://github.com/vertcoin/vertcoin/releases/download/v0.11.1.0/vertcoin-v0.11.1.0-linux-64bit.zip

RUN unzip vertcoin-v0.11.1.0-linux-64bit.zip && rm vertcoin-cli vertcoin-tx vertcoin-qt

WORKDIR /usr/app
EXPOSE 3001
CMD ["node","bin/www"]
