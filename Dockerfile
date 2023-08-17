FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "node", "-r", "dotenv/config", "build" ]