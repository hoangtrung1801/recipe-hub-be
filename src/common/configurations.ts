export interface IConfigration {
    port: number;
    secretKey: string;
}

export default (): IConfigration => ({
    port: Number.parseInt(process.env.PORT) || 3000,
    secretKey: process.env.SECRET_KEY,
});
