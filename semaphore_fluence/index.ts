import { runServer } from './src/index';
import dotenv from 'dotenv';

dotenv.config();

runServer();

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});