FROM node:20-alpine AS npm
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci --production

FROM node:20-alpine

WORKDIR /app

COPY --from=npm /app/node_modules ./node_modules
COPY . .

EXPOSE 8080

RUN npm run build

CMD ["npm", "run", "start:prod"]