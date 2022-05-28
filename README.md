# Template API (node/express/inversify/typescript/postgres)  

A template/boilerplate for starting a simple REST API.  

Written using [Node.js](https://nodejs.org/)/[Express.js](https://expressjs.com/)/[Inversify.js](https://inversify.io/)/[TypeScript](https://www.typescriptlang.org/), following the [Domain-Driven Design](https://khalilstemmler.com/articles/domain-driven-design-intro/) approach.  

Data is persisted using [PostgreSQL](https://www.postgresql.org/), without an ORM. Connection to the database is made through the [pg](https://github.com/brianc/node-postgres) library, and all access to data happens via parameterized [stored functions](https://www.postgresql.org/docs/current/xfunc.html). The database owner and the database app user are separate, with proper access levels.  

## Endpoints  

Example endpoints have been setup.  

- `POST   v1/examples`  
- `GET    v1/examples/{id}`
- `PUT    v1/examples/{id}`
- `DELETE v1/examples/{id}`

## Node.js  

Install the correct version of Node.js specified in the package.json file.  

## Database  

[HashiCorp Vagrant](https://www.vagrantup.com/) is used to make setting up a development database quick and easy. [Download](https://www.vagrantup.com/downloads) and [install Vagrant](https://learn.hashicorp.com/tutorials/vagrant/getting-started-install?in=vagrant/getting-started).  

From the root directory of this project, run the `vagrant up` command to create and configure a [Vagrant](https://www.vagrantup.com/intro) VM running PostgreSQL. Once the development database is running, run the `npm run flyway` command to download [Flyway](https://flywaydb.org/documentation/). Next, run the `npm run migrate` command to apply database migrations. Migration files are located in `./src/data/migrations`.  

```bash
vagrant up
npm run flyway
npm run migrate
```

If needed, connect to the development database via `psql` as the user `dbowner`:  

```bash
PGUSER=dbowner PGPASSWORD=dbpass psql -h localhost -p 15432 apidb
```

If needed, rollback all database migrations by first connecting to the database via `psql` as the user `dbowner` (instructions above) and then run these SQL commands. After this, all migrations can be applied fresh.  

```sql
DROP SCHEMA api CASCADE;
DROP TABLE flyway_schema_history;
```

## Env vars  

The following environment variables with development values provide an example of the environment variables required in production. Environment variable values may be set in the `/etc/environment` file on a Linux host system:  

```bash
export NODE_ENV="development"
export API_PORT="1138"
export API_DB_USER="dbuser"
export API_DB_OWNER="dbowner"
export API_DB_HOST="localhost"
export API_DB_DATABASE="apidb"
export API_DB_PASSWORD="dbpass"
export API_DB_PORT="15432"
export API_DB_URL="jdbc:postgresql://localhost:15432/apidb"
export API_DB_MIGRATIONS="filesystem:./src/data/migrations"
export API_LOG_TARGETS="trace.log+%json,stdout:warn%simple"
```

In a linux host system remember to log out and back in after adding environment variables to the `/etc/environment` file.  

## Install  

Install NPM dependencies from the root directory.  

```bash
npm install
```

## Running  

When you're ready to see it in action, run the `npm run develop` command to start the API. This will run both the `npm run build` command to [compile](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#tsc-the-typescript-compiler) the TypeScript into plain JavaScript, and the `npm run start` command to run that compiled JavaScript.  

```bash
npm run develop
```

## Developing  

During development, here are some additional optional helpful script commands.  

Run the `npm run updates` command to update the dependencies in package.json using [npm-check-updates](https://www.npmjs.com/package/npm-check-updates).  

Run the `npm run prettier` command to format the source code using the [Prettier](https://prettier.io/docs/en/index.html) opinionated styling.  

Run the `npm run linter` command to identify and report [ESLint](https://eslint.org/docs/user-guide/getting-started) code pattern findings.  

Prettier and ESLint can also be run automatically as IDE extensions.  
