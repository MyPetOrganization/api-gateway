import { Logger } from '@nestjs/common';
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    NATS_SERVERS: string;
    CLIENT_URL: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.string().required(),
    CLIENT_URL: joi.string().required(),
}).unknown(true);

const { error, value } = envsSchema.validate({ 
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS, 
});

Logger.log(error, 'NATS ERROR');

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    natsServers: envVars.NATS_SERVERS,
    clientUrl: envVars.CLIENT_URL,
}