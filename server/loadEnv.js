// Loads backend config from server/.env (kept separate from the frontend's root .env).
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) });
