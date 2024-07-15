import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    USERS_MICROSERVICE_HOST: string;
    USERS_MICROSERVICE_PORT: number;
    CARDS_MICROSERVICE_HOST: string;
    CARDS_MICROSERVICE_PORT: number;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    USERS_MICROSERVICE_HOST: joi.string().required,
    USERS_MICROSERVICE_PORT: joi.number().required,
    CARDS_MICROSERVICE_HOST: joi.string().required,
    CARDS_MICROSERVICE_PORT: joi.number().required,
}).unknown(true);

const { error, value } = envsSchema.validate( process.env );



const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    usersMicroserviceHost: envVars.USERS_MICROSERVICE_HOST,
    usersMicroservicePort: envVars.USERS_MICROSERVICE_PORT,
    cardsMicroserviceHost: envVars.CARDS_MICROSERVICE_HOST,
    cardsMicroservicePort: envVars.CARDS_MICROSERVICE_PORT,
}