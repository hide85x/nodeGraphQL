import express from 'express';
import dotenv from 'dotenv';

import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import consola from 'consola';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

const { DB, IN_PROD, APP_PORT } = dotenv.config().parsed;
consola.success(DB)

//init the APP
const app = express()

//seting up midlleware
app.disable("x-powered-by")

//starting Apollo-Express-Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: IN_PROD 
    ? false 
    : {
        settings: {
            "request.credentials": "include"
        }
    }
})


//start APP function

const startApp= async ()=> {
    try {
        await mongoose.connect(DB, {
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        consola.success({
            msg: `WE DID IT ! WE ARE CONNECTED TO DB! 
            on :${DB}`,
            badge: true
        });
        server.applyMiddleware({app, cors:false})
        app.listen(4000, ()=> {
            consola.success({
                msg: `WE DID IT ! WE ARE CONNECTED TO APOLLO SERVER! Listening 
                on: http://localhost:${APP_PORT}${server.graphqlPath}`,
                badge: true
            })
        })
    }
    catch(err) {
        consola.error({
            msg: err.message,
            badge: true
        })
    }
}
startApp()