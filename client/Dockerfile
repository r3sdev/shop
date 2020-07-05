FROM node:alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production=true
COPY . .

CMD ["yarn", "run", "start"]