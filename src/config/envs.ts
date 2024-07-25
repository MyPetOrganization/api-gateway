import { Logger } from '@nestjs/common';
import 'dotenv/config';
import * as joi from 'joi';

/**
 * Interface for the environment variables.
 */
interface EnvVars {
    // The port of the server
    PORT: number;
    // The NATS servers
    NATS_SERVERS: string;
    // The client URL
    CLIENT_URL: string;
    // The logtail token
    LOGTAIL_TOKEN: string;
}

/**
 * Schema for the environment variables.
 */
const envsSchema = joi.object({
    // Verify that the port is received.
    PORT: joi.number().required(),
    // Verify that the NATS servers are received.
    NATS_SERVERS: joi.string().required(),
    // Verify that the client URL is received.
    CLIENT_URL: joi.string().required(),
    // Verify that the logtail token is received.
    LOGTAIL_TOKEN: joi.string().required(),
}).unknown(true);

/**
 * Validate the environment variables.
 */
const { error, value } = envsSchema.validate({ 
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVER,
    CLIENT_URL: process.env.CLIENT_URL,
    LOGTAIL_TOKEN: process.env.LOGTAIL_TOKEN, 
});

// If there is an error, log it.
Logger.log(error, 'NATS ERROR');

// Set the environment variables.
const envVars: EnvVars = value;

/**
 * Export the environment variables.
 */
export const envs = {
    port: envVars.PORT,
    natsServers: envVars.NATS_SERVERS,
    clientUrl: envVars.CLIENT_URL,
    logtailToken: envVars.LOGTAIL_TOKEN,
}