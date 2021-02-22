import bcrypt from 'bcryptjs';

import { User } from '../../models';

import Joi from "@hapi/joi";
import { registerValidate, loginValidate } from '../validators';

import { issueToken } from '../../functions/auth';
import consolaGlobalInstance from 'consola';


export default {
    Query: {
        users: () => { },
        login: async (root, args, { req }, info) => {
            let validationResult = await loginValidate.validate(args, { abortEarly: true })
            //if error exist throw new Error
            if (validationResult.error) {
                let errorMsg = loginValidate.validate(args, { abortEarly: true }).error.details[0].message
                throw new Error(errorMsg)
            }
            
            let user = await User.findOne({ username: args.username });

            if (!user) {
                throw new Error(`There is no user that goes with the username of ${args.username}`);
            }
            let pswCheck = await bcrypt.compare(args.password, user.password);

            if (!pswCheck) {
                throw new Error("Password is incorrect!")
            }
            let tokens = await issueToken(user)
            return {
                user,
                ...tokens
            }
        },
        profile: () => { },
        refreshToken: () => { }
    },
    Mutation: {
        register: async (root, args, { req }, info) => {
            //validate user data
            let validationResult = await registerValidate.validate(args, { abortEarly: true })
            //if error exist throw new Error
            if (validationResult.error) {
                let errorMsg = registerValidate.validate(args, { abortEarly: true }).error.details[0].message
                throw new Error(errorMsg)
            }

            consola.success(args)
            //check the user is in database already
            let user = await User.findOne({ username: args.username })
            if (user) {
                throw new Error('User with that username already exists!')
            }
            user = await User.findOne({ email: args.email })
            if (user) {
                throw new Error('User with that email already exists!')
            }
            //adding user to database
            args.password = await bcrypt.hash(args.password, 9)
            consola.success(args.password)
            let newUser = await User.create(args)
            consola.success(newUser)
            let tokens = await issueToken(newUser)
            return {
                user: newUser,
                ...tokens
            }

        }
    }
}