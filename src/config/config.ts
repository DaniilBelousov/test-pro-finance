const { PG_USER, PG_PASSWORD, PG_DB, PG_PORT, PG_HOST, JWT_SECRET } =
  process.env;

export default () => ({
  db: {
    database: PG_DB,
    username: PG_USER,
    password: PG_PASSWORD,
    port: PG_PORT,
    host: PG_HOST,
  },
  jwt: {
    secret: JWT_SECRET,
    expiresIn: '15m',
    refreshExpiresIn: 6,
  },
  hash: {
    scryptParams: { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
    saltLen: 32,
    keyLen: 64,
  },
});
