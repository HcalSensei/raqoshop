import {Server} from './core';
import './utils/config';
import './core/router/service/index';

const server = new Server;
server.handle400()
      .setRoutes()
      .handle404()
      .startServer()