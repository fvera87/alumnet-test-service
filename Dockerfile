FROM amaysim/serverless:1.53.0

WORKDIR  /usr/app

COPY package.json .

RUN yarn

COPY . .

EXPOSE 3000

