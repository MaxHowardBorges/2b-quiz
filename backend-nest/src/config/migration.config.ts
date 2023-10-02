// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DataSource } = require('typeorm');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

// Check if .env.local exists
if (fs.existsSync('.env.local')) {
  // If .env.local exists, load its contents
  const result = dotenv.config({ path: '.env.local' });

  if (result.error) {
    throw new Error(`Error loading .env.local: ${result.error}`);
  }
} else {
  // If .env.local doesn't exist, load .env
  const result = dotenv.config();

  if (result.error) {
    throw new Error(`Error loading .env: ${result.error}`);
  }
}

const datasource = new DataSource({
  type: process.env.DB_TYPE, // Le type de base de données
  host: process.env.DB_HOST, // L'hôte de la base de données
  port: parseInt(process.env.DB_PORT), // Le port de la base de données (converti en nombre)
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'], // Chemin vers vos entités
  migrations: ['migrations/*{.ts,.js}'],
}); // config is one that is defined in datasource.config.ts file
datasource.initialize();
module.exports = { datasource };
