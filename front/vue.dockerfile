FROM node:22.12-alpine3.21 as build-stage

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json .

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

FROM nginx:1.21.3-alpine as production-stage

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


