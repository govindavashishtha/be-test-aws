FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .env.example ./.env
COPY src ./src

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 