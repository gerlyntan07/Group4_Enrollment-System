import mysql from 'mysql';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
import { connect } from 'http2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pemPath = path.resolve(__dirname, "../ssl/isrgrootx1.pem");

dotenv.config();

const dbConfig = {
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    port: process.env.TIDB_PORT,
    ssl: {
        ca: fs.readFileSync(pemPath)
    },
    connectionLimit: 10,
    connectionTimeout: 10000,
};


// const dbConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'cvsuenrollmentsystem',    
// };


export default dbConfig;
