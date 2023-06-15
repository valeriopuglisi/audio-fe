FROM node:16-alpine3.11 as build

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install --legacy-peer-deps
COPY . /app
RUN npm run build



FROM nginx:1.21.3

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/templates/default.conf.template


EXPOSE 80


