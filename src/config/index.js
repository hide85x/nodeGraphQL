export const {
    DB,
    APP_PORT,
    NODE_ENV,
    APP_SECRET,
    APP_REFRESH_SECRET,
    
}= process.env

export const IN_PROD = NODE_ENV === 'production'