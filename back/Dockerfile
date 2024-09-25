FROM node:18 AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p '/srv/www/api/uploads'
EXPOSE 3000
