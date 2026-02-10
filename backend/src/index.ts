import Fastify, { type FastifyInstance } from 'fastify';
import { addDecorators } from './init/addDecorators.ts';
import { registerPlugins } from './init/registerPlugins.ts';
import { registerRoutes } from './init/registerRoutes.ts';
import { startListening } from './init/startListening.ts';

const fastify: FastifyInstance = Fastify({
  ajv: {
    customOptions: {
      coerceTypes: false,
      removeAdditional: false,
    },
  },
});

// Calculation of the environment variables
addDecorators(fastify);

// Mostly fastify's own plugins that need to be registered
registerPlugins(fastify);

// All our own API routes definitions
registerRoutes(fastify);

// And here is where we actually start the server
startListening(fastify);
