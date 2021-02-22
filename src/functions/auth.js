import jwt from 'jsonwebtoken'
import jwt_decode from "jwt-decode";

import dotenv from 'dotenv';

import User from '../models/User'

const { APP_SECRET, APP_REFRESH_SECRET } = dotenv.config().parsed;

export const issueToken = async ({ username, email, name, id }) => {
    let token = await jwt
        .sign(
            { username, email, name, id},
            APP_SECRET,
            { expiresIn: 120 })
    let refreshToken = await jwt
        .sign(
            { username, email, name, id },
            APP_REFRESH_SECRET,
            { expiresIn: '2d' })

    return {
        token,
        refreshToken
    }
    
}   
export const getAuthUser= async(request, requiresAuth= false ) => {
    const header= request.headers.authorization;
    if(header) {
        console.log(jwt_decode(header))
        try {
            const token = await jwt.verify(header, APP_SECRET)
        }
        catch(err) {
            throw new Error("Not authenticated")
        }
    }
}