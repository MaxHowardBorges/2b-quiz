FROM node:lts-alpine as api-build-stage

# Definition workdir
WORKDIR /usr/src/app

# Copy yarn files
COPY package.json ./
COPY yarn.lock ./
COPY backend-nest/package.json ./backend-nest/
COPY backend-nest/user.json backend-nest/

# Install dependences
RUN yarn install

# Copy codes files
COPY backend-nest ./backend-nest/

# Build projet
RUN yarn run build-backend-prod

FROM node:lts-bookworm-slim as api-prod-stage

# Definition workdir
WORKDIR /usr/src/app

# Copy yarn files
COPY package.json ./
COPY yarn.lock ./
COPY backend-nest/package.json ./backend-nest/
COPY backend-nest/user.json backend-nest/

# Copy builded files
COPY --from=api-build-stage /usr/src/app/backend-nest/dist  /usr/src/app/backend-nest/dist

# Install dependences
RUN yarn install

# Copy config files
COPY backend-nest/src/config ./backend-nest/src/config
COPY backend-nest/tsconfig* ./backend-nest/
COPY backend-nest/.env.docker ./backend-nest/.env.local

# Copy migration files
COPY backend-nest/migrations ./backend-nest/migrations/

# Expose port
EXPOSE 3000

# Definition workdir
WORKDIR /usr/src/app/backend-nest

# Change autorisation of script file
# RUN chmod +x ./entrypoint.sh
#
# Start the server using the production build and make migration to DB

CMD ["yarn", "start:prod"]

FROM node:lts-alpine as front-build-stage

# Definition workdir
WORKDIR /usr/src/app

# Copy yarn files
COPY package.json ./
COPY yarn.lock ./
COPY frontend-vue/package.json ./frontend-vue/

# Install dependences
RUN yarn install

# Copy codes files
COPY frontend-vue ./frontend-vue/

# Build projet
RUN yarn build-frontend-prod

FROM node:lts-bookworm-slim as front-production-stage

# Definition workdir
WORKDIR /usr/src/app

COPY --from=front-build-stage /usr/src/app/frontend-vue/dist  ./frontend-vue/dist

# Copy yarn files
COPY package.json ./
COPY yarn.lock ./
COPY frontend-vue ./frontend-vue/
# Install dependences
RUN yarn install

# Copy codes files

EXPOSE 4173

# Build projet
WORKDIR /usr/src/app/frontend-vue/
CMD ["yarn", "preview"]