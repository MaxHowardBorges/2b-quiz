# Equipe2b

## Structure
Te projet is separated in 2 app:
* **frotend-vue**: User interface(front) of the project
* **backend-nest**: API 

Detailed commands of each app is in their README.md

## Prerequisites
* Install [Nodejs](https://nodejs.org/fr).
* Install **yarn** with `npm install --global yarn`.
* Install **Docker** ou **Docker desktop** [link](https://docs.docker.com/engine/install/).

---

## Deployment build and launch
* Optional: setup custom (or exposed) IP address:
  * Create a `.env.production.local` file from a copy of `.env`.
  * Replace `localhost` in the line `VITE_API_URL` with the IP address.
* Execute `docker-compose up -d`.

<span style="color: #E40306">**ATTENTION**: Port 3000 and 80 must not be in use.</span>

If you want to use another port change the config in `docker-compose.yaml`

---

## Setup development environment

Create a `.env.local` file for each app with your environment parameters.

Follow the examples in `.env.example` in each app.

If the environment parameters of `.env` suit to you, you doesn,'t need to create a `.env.local` file.


### Setup local database
#### With docker
Execute `docker-compose -f .\docker-compose.dev.yaml up -d`.

<span style="color: #E40306">**ATTENTION**: Port 3307 and 7777 must not be in use.</span>

To down the docker container, execute `docker-compose -f .\docker-compose.dev.yaml down`.

#### With mariadb.exe
1. Install [MariaDB](https://mariadb.com/downloads/) or MySQL (don't forget to note password for root user).
2. Open MySQL Client (MariaDB) and log in.
3. Create a database `CREATE DATABASE db_name;`
4. Add and complete to the .env file in backend-nest app

Past connection information in `.env.local` files in `backend-nest`

## Start programs in development environment
1. Install dependencies with `yarn install`.
2. Start backend with `yarn start-backend`.
3. Start frontend with `yarn start-frontend`.

## Other commands
### Start backend locally in a production mode
* Execute `build-backend-prod`.
* Execute `migrate-backend-prod`.
* Execute `start-backend-prod`.

### Start frontend locally in a production mode
* Execute `build-frontend-prod`.
* Execute `start-frontend-prod`.


## Contributors
* BENIZRI Sam 
* BORGES Maxime
* EL ARMOUZI Rayan
* EL OUDGHIRI Elias
* GUILLOU Axel
* LENTINI Matthieu 
* PALOTAS Tamas 

