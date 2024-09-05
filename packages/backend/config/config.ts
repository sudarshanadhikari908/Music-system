import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

interface AppConfig {
  db: DbConfig;
  port: number;
}

const config: AppConfig = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'my_database'
  },
  port: Number(process.env.PORT) || 5000
};

export default config;
