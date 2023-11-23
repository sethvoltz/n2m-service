FROM node:20 as base

WORKDIR /app
COPY package*.json ./
RUN npm run docker:install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
