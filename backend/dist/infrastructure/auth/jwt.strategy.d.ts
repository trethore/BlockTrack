declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: {
        userId: string;
        username: string;
        iat: number;
        exp: number;
    }): Promise<{
        id: string;
        username: string;
    }>;
}
export {};
