# Base image
FROM node:lts-alpine as api-build-stage

# Create app directory
WORKDIR /app

# copy yarn files
COPY package.json ./
COPY yarn.lock ./

# Bundle app source
COPY . .

# Install app dependencies
RUN yarn install

# Creates a "dist" folder with the production build
RUN yarn run build-backend-prod

FROM node:lts-alpine as api-prod-stage

# Create app directory
COPY --from=api-build-stage /app /app

WORKDIR /app

RUN chmod +x backend-nest/entrypoint.sh

EXPOSE 3000


WORKDIR /app/backend-nest

# Start the server using the production build
CMD ["./entrypoint.sh", "node", "dist/src/main" ]

# étape de build
FROM node:lts-alpine as front-build-stage
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY . .
RUN yarn install
RUN yarn build-frontend-prod

# étape de production
FROM nginx:stable-alpine as front-production-stage
COPY --from=front-build-stage /app/frontend-vue/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]