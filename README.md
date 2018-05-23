# TypeScript Rest Node Restful API Example

This repository can be used as a convenient starting point for building
`NODE REST API`'s using `TypeScript` on top of `restify` web framework. 

# Features
 - JWT
 - MongoDB

# Pre-requires
 - Node.js
 - MongoDB
 - SMTP account


# For test
## Register
`curl -d '{"email":"hello@example.com", "password":"PASSWORD", "lastName": "Test", "firstName": "John", "role": "guest", "username": "hello"}' -H "Content-Type: application/json" -X POST http://localhost:8080/register
`
## Login
`curl -i -d '{"email":"hello@example.com", "password":"PASSWORD"}' -H "Content-Type: application/json" -X POST http://localhost:8080/login
`

# import sample data
```
mongoimport --db dev --collection users --file users.json --jsonArray
```

# TODO
 - SWAGGER
 - Redis
 - API version controll