import app from './src/index';
import http from 'http';

const port = '3000';

http.createServer(app).listen(port);