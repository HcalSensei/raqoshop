import dotenv from 'dotenv';

dotenv.config();

const envVariable: NodeJS.ProcessEnv=process.env

export const config = {
    apiPath: envVariable.API_PATH,

    dburl:
        envVariable.ENV === 'PROD'
        ? envVariable.DB_URL_PROD
        : envVariable.DB_URL_DEV,

    dbUserName :
        envVariable.ENV === 'PROD' 
        ? envVariable.DB_USERNAME_PROD 
        : envVariable.DB_USERNAME_DEV,
    
    dbname:
        envVariable.ENV === 'PROD'
        ? envVariable.DB_NAME_PROD
        : envVariable.DB_NAME_DEV,
    
    dbport:
        envVariable.ENV === 'PROD'
        ? envVariable.DB_PORT_PROD
        : envVariable.DB_PORT_DEV,

    appName: envVariable.API_NAME,

    serverport:
        envVariable.ENV === 'prod'
        ? envVariable.SERVER_PORT_DEV
        : envVariable.SERVER_PORT_PROD,

    serverhost:
        envVariable.ENV === 'prod'
            ? envVariable.SERVER_HOST_DEV
            : envVariable.SERVER_HOST_PROD,

    jwt: {
        secret: process.env.JWT_SECRET,
        public: process.env.JWT_PUBLIC,
    },

    auth: {
        secret: process.env.AUTH_SECRET,
        public: process.env.AUTH_PUBLIC,
        key: process.env.AUTH_KEY,
    },
}