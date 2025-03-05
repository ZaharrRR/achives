FROM node:20.12.2-alpine3.19
WORKDIR /app

# Установите необходимые системные зависимости
RUN apk add --update --no-cache python3 make g++

COPY package*.json ./
RUN npm install --force
COPY . .

EXPOSE 8080
CMD ["npm", "run", "dev"]