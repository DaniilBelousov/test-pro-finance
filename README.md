## Задание

Сделать простую систему авторизации/регистрации/получение информации о пользователе на Node.js. 

☝🏾Обязательно, чтобы фигурировал jwt токен из-за микросервисной архитектуры. Чтобы потом любые другие сервисы, зная публичный сертификат, могли валидировать токен, не обращаясь к базам. 

База данных для хранения пользователей - postgresql. База данных хранения сессий - redis.

☝🏾Обязательно использовать nest.js.

## Installation
1. Install dependencies
```bash
$ npm install
```
2. Start docker
Start docker
```bash
$ npm run docker:up
```
## Start

```bash
$ npm run start
```

## Usage
1. Sign up
```bash
$ curl 'localhost:3000/sign-up' -H 'Content-Type: application/json' -d '{"nickname": "user", "password": "123123"}'
```
2. Log in
```bash
$ curl 'localhost:3000/log-in' -H 'Content-Type: application/json' -d '{"nickname": "user", "password": "123123"}'
```
3. Refresh
```bash
$ curl 'localhost:3000/refresh' -H 'Content-Type: application/json' -d '{ "refreshToken": "<refresh_token>" }'
```
4. Check Auth
```bash
$ curl -H 'Authorization: <access_token>' 'localhost:3000/users'
```
