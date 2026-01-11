import Fastify, {
  type FastifyInstance,
  type RouteShorthandOptions,
} from 'fastify';
import { Person } from './otherFile.ts';
import 'dotenv/config';

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const server: FastifyInstance = Fastify({});

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string',
          },
        },
      },
    },
  },
};

server.get('/ping', opts, async (_request, _reply) => {
  return { pong: 'it worked!' };
});

const start = async (): Promise<void> => {
  try {
    await server.listen({ port: PORT });
    console.log(`Server running at: http://localhost:${PORT}/ping`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

const newPerson: Person = new Person('Robert');
console.log(`newPerson's name is: ${newPerson.name}`);
