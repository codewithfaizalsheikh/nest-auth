import { LoginService } from 'src/module/auth/login/login.service';
declare const GoogleStrategy_base: new (...args: any[]) => any;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private readonly loginService;
    constructor(loginService: LoginService);
    validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any>;
}
export {};
