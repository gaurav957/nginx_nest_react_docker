FROM node:14.17.6 
WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .
# RUN npm install pm2 -g
RUN npm run start