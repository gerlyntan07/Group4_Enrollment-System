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
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    user: 'yy1aykyEhDRFQV6.vu-kO6X361C',
    password: 's1H58qHLAuuFWsQc62Gy1eCu7OD&3KavEOuU',
    database: 'cvsuenrollmentsystem',
    port: 4000,
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
