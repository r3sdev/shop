FROM node:alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production=true
RUN yarn build
COPY . .

CMD ["yarn", "run", "start"]