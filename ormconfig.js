require('dotenv').config();
module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    logging: true,
    synchronize: true,
    dropSchema: true,
    entities: ['src/**/*.entity{.ts,.js}'],
    seeds: ['src/database/seeds/**/*.seed{.ts,.js}'],
    factories: ['src/database/factories/**/*.factory{.ts,.js}'],
    // seeds: ['src/database/seeds/04-category.seed.ts'],
    // factories: ['src/database/factories/category.factory.ts'],
  },
];
