import { DataSource } from 'typeorm';
import { config } from './config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  entities: [__dirname + '/../entities/*.{ts,js}'],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  subscribers: [__dirname + '/../subscribers/*.{ts,js}'],
  charset: 'utf8mb4',
  timezone: '-06:00',
  extra: {
    connectionLimit: 10,
  },
});

export default AppDataSource;

