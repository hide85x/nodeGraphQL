import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

const { APP_SECRET, APP_REFRESH_SECRET } = dotenv.config().parsed;

export const issueToken = async ({ username, email, name, id }) => {
    let token = await jwt
        .sign(
            { username, email, name },
            APP_SECRET,
            { expiresIn: 120 })
    let refreshToken = await jwt
        .sign(
            { username, email, name },
            APP_REFRESH_SECRET,
            { expiresIn: '2d' })

    return {
        token,
        refreshToken
    }

}   