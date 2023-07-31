CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4(),
  nickname varchar(255),
  password varchar(255),
  email varchar(255),
  PRIMARY KEY (id)
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
