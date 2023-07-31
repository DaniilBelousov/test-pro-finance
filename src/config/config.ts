const { PG_USER, PG_PASSWORD, PG_DB, PG_PORT, PG_HOST } = process.env;

export default () => ({
  db: {
    database: PG_DB,
    username: PG_USER,
    password: PG_PASSWORD,
    port: PG_PORT,
    host: PG_HOST,
  },
});
