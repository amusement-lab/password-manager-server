# Password Manager

Just deploy your own password manager. Just trust yourself. Very simple server for basic password manager. Open for contribute. Your a front end dev? You can check and contribute to [password manager client](https://github.com/amusement-lab/password-manager-client).

Some excellent features:

- Open API implementation (doc and ui)
- Implements many basic cryptographic concepts
- Applying the Zero Knowledge principle
- Implement integration testing via vitest
- Use Typescript

## Run This Project

1. Install package

```js
pnpm install
```

2. Optional, for use docker compose

```sh
docker-compose up -d
```

3. Setup your `.env`. If you use docker, the settings are in accordance with the config in `docker-compose.yml`

```js
PORT = 3000
JWT_SECRET = ''
// This project use prisma as ORM.
// Please see this doc for your refrence database
// https://www.prisma.io/docs/concepts/database-connectors
DATABASE_URL = ''
```

4. Setup the prisma ORM

```sh
pnpm dlx prisma generate
pnpm dlx prisma migrate dev
```

5. Run the project

```sh
pnpm dev
```

5. You can access the open api documention at

```sh
http://localhost:3000/open-api
```

## NodeJS Version Environment

- Typescript = v5.6.3
- NodeJS = v22.11.0
- PNPM = v9.13.2

## Some further developments, if you want to contribute, here the top priority

- The error handler still doesn't cover all errors (critpyo ~~and zod~~ errors don't yet)
- For now, you can only save the password, but later you can save bank cards, notes, addresses and documents
- Test cases are still few, only positive tests, many negative tests are needed to validate the error
- Currently it's still TSC for the typescript compiler, and then we'll move to `SWC` for faster development and testing
- Implement export import feature for password backup
- Implement new id template `[prefix]_[id]`

### Notice

Before upgrading dependencies, make sure the versions of the dependencies in the list below are compatible with each other.
If they are not compatible, the program will fail to compile and crash (type of error).

- eslint
- @types/express
- express

## Refrence

- [Basic Encryption & Hashing in Node.js](https://www.zacfukuda.com/blog/basic-crypto-nodejs)
- [NodeJS Native Library for Cryptographic](https://nodejs.org/api/crypto.html)
- [Basic Example Cryptographic for NodeJS](https://fireship.io/lessons/node-crypto-examples/)
- [Password Hashing Algorithm](https://appwrite.io/blog/post/password-hashing-algorithms)
- [5 Common Encryption](https://www.arcserve.com/blog/5-common-encryption-algorithms-and-unbreakables-future)
