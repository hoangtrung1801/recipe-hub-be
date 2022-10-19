export interface IConfigration {
    port: number;
    secretKey: string;
    database: {
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
        synchronize: boolean;
    };
}

export default (): IConfigration => ({
    port: Number.parseInt(process.env.PORT) || 3000,
    secretKey: process.env.SECRET_KEY,
    database: {
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: Number.parseInt(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
        synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    },
});
