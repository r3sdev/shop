FROM node:alpine

WORKDIR /app
COPY . .
RUN yarn install --production=true
RUN yarn build

CMD ["yarn", "run", "start"]