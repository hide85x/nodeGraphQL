import bcrypt from 'bcryptjs';

import { User } from '../../models';

import Joi from "@hapi/joi";
import { registerValidate, loginValidate } from '../validators';

import { issueToken } from '../../functions/auth';


export default {
    Query: {
        users: () => { },
        login: () => { },
        profile: () => { },
        refreshToken: () => { }
    },
    Mutation: {
        register: async (root, args, { req }, info) => {
            //validate user data
            let validationResult= await registerValidate.validate(args, { abortEarly: true })
            //if error exist throw new Error
            if( validationResult.error) { 
                let errorMsg= registerValidate.validate(args, { abortEarly: true }).error.details[0].message
                throw new Error(errorMsg)
            }


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
            // args.password = await bcrypt.hash(args.password)
            let newUser = await User.create(args)
            let tokens = await issueToken(newUser)
            return {
                user: newUser,
                ...tokens
            }

        }
    }
}