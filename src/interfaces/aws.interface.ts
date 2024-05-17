export interface SecretManagerSecretString {
    username: string;
    engine: string;
    port: number;
    host: string;
    password: string;
    schema: string;
    dbname: string;
    dbInstanceIdentifier: string;
}

export interface IRedisSecretManagerSecretString {
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
    REDIS_TTL: number;
}

export interface IAuth0SecretManagerSecretString {
    AUTH0_ENTERPRISE_M2M_CLIENT_ID: string;
    AUTH0_ENTERPRISE_M2M_CLIENT_SECRET: string;
}
