# Password Manager

- Typescript = v5.0.4
- NodeJS = v18.16.0
- NPM = v9.6.

## Run this project

1. Install package

```js
npm install
```

1b. Optional, for use docker compose

```sh
docker-compose up -d
```

2. Setup your `.env`. If you use docker, the settings are in accordance with the config in `docker-compose.yml`

```js
PORT = 3000
JWT_SECRET = ''
// This project use prisma as ORM.
// Please see this doc for your refrence database
// https://www.prisma.io/docs/concepts/database-connectors
DATABASE_URL = ''
```

3. Setup the prisma ORM

```sh
npx prisma generate
npx prisma migrate dev
```

4. Run the project

```sh
npm run dev
```

## Refrence

- [Basic Encryption & Hashing in Node.js](https://www.zacfukuda.com/blog/basic-crypto-nodejs)
- [CryptoJS](https://cryptojs.gitbook.io/docs/#ciphers)
