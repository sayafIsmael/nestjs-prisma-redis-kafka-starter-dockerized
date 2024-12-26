<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## NestJS Starter Kit

A comprehensive NestJS starter kit designed for building scalable, secure, and modern applications. This repository provides a fully functional boilerplate with essential features for rapid development, including authentication, authorization, caching, role based access control and real-time capabilities.

## Key Features:

- **NestJS Framework**: A TypeScript-based, extensible backend framework for building efficient and modular applications.
- **OAuth & Google Authentication**: Easy-to-integrate OAuth 2.0 support with Passport, including Google Sign-In, for seamless third-party authentication.
- **JWT Authentication**: Secure authentication using Passport JSON Web Tokens (JWT) with support for access and refresh tokens.
- **Role-Based Access Control (RBAC)**: Implement fine-grained security with user roles and permissions to control access to resources and routes.
- **Swagger**: Auto-generated API documentation with Swagger for easy testing and exploring your API endpoints.
- **Docker**: Full Dockerization to ensure consistent development, testing, and production environments.
- **Prisma ORM**: Simplified database management and interactions with PostgreSQL using Prisma ORM.
- **Redis Integration**: For caching, session storage, and message brokering to improve performance and scalability.
- **PostgreSQL**: A robust relational database setup with Prisma, ready for production-grade applications.
- **Kafka**: Event-driven architecture using Kafka for handling real-time data and message queues.


## Tech Stack

- **Backend**: NestJS (TypeScript), Prisma, Passport, JWT
- **Database**: PostgreSQL
- **Redis** (Caching, Session Storage, Message Brokering)
- **Message Queue**: Kafka
- **API Documentation**: Swagger
- **Containerization**: Docker

## Get started

```bash
# Clone the Repository
$ git clone https://github.com/sayafIsmael/nestjs-prisma-redis-kafka-starter-dockerized.git
$ cd nestjs-prisma-redis-kafka-starter-dockerized

#Install node modules
$ npm install
```

## Build docker image and start the required servers in docker containers

<p>Copy .env.example and create a new .env file. If you want to run the backend server in docker environment then you can make the .env file using .env.docker file. Before satrting this step make sure to install <span><a href="https://www.docker.com/">Docker Desktop</a></span> on your computer. If you are on linux you might need to install docker-compose plugin after that. You can comment out the services in docker-compose.yml file which you don't need. The required services are postgres, redis, kafka, zookeeper </p>

```bash
# Build docker image
$ docker-compose build

# Run the image in containers
$ docker-compose up -d

```

## Prepare database

```bash
# Generate prisma models
$ npx prisma generate

# Migrate database
$ npx prisma migrate dev

# Seed database with seed data
$ npm run db:seed
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
<p>
The app will start on port 8080
</p>

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Swagger API Documentation
<p>Visit <span><a href="http://localhost:8080/docs">http://localhost:8080/docs</a></span> to access the swagger API Documentation</p>
![image](https://github.com/user-attachments/assets/a0db7114-459e-44b9-92ac-57f1b59bcf57)


## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.


## Stay in touch

- Author - [Abu Sayaf](https://www.abusayaf.tech/)
- Website - [https://www.abusayaf.tech/)
- Facebook - [@abusayaftech](https://www.facebook.com/abusayaftech)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

