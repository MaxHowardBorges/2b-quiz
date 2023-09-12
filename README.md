# Equipe2b

## Setup Development Environment

Create .env.local file for each app with your environment parameters

Follow instructions in .env.example in each app

### Setup Local Database

#### With .exe
1. Install [MariaDB](https://mariadb.com/downloads/) or MySQL (don't forget to note password for root user).
2. Open MySQL Client (MariaDB) and log in.
3. Create a database `CREATE DATABASE db_name;`
4. Add and complete to the .env file in backend-nest app

#### With docker
In `backend-nest` execute `docker-compose -f .\docker-compose.dev.yaml up -d`.

ATTTENTION: Port 3307 and 7777 must not be in use.

### Nest CLI or Vue CLI for development

Download [Nest CLI](https://docs.nestjs.com/) with `npm i -g @nestjs/cli`.

Download [Vue CLI](https://cli.vuejs.org/#getting-started) with `npm install -g @vue/cli`.


## Contributors
* BENIZRI Sam 
* BORGES Maxime
* EL ARMOUZI Rayan
* EL OUDGHIRI Elias
* GUILLOU Axel
* LENTINI Matthieu 
* PALOTAS Tamas 

