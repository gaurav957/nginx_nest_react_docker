FROM node:14.17.6
WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install
COPY . .
CMD ["yarn", "start"]