import type { Config } from './config.interface';

const config: Config = {
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'API Documentation',
    description: 'API description',
    version: '1.0',
    path: 'docs',
    bearerAuth: {
      type: 'http', // Specifies the type of authentication
      scheme: 'bearer', // Uses Bearer token
      bearerFormat: 'JWT', // Optional: to specify that it's a JWT
    },
    tokenFieldName: 'accessToken' // Name the auth to use in Swagger interface
  },
  security: {
    expiresIn: '15m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
