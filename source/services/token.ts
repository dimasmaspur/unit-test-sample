import jwt from 'jsonwebtoken';

import createResponse from '../utils/http-response';
import { NextFunction, Request, Response } from 'express';
import config from '../configs/config';

import UserLoginService, { IUserLogin } from '../repositories/modules/userLogin';
import RefreshTokenService, { IRefreshToken } from '../repositories/modules/refreshToken';
import UserService, { IUser } from '../repositories/modules/user';
import { v4 as uuidv4 } from 'uuid';

export interface RequestCustom extends Request {
    auth: any;
    connection: any;
    token: any;
    refreshToken: any;
}

class TokenService {
    private user: IUser;
    private userLogin: IUserLogin;
    private userLogins: Array<IUserLogin>;
    private refreshToken: IRefreshToken;

    constructor() {
        this.user = <IUser>{};
        this.userLogin = <IUserLogin>{};
        this.userLogins = <IUserLogin[]>[];
        this.refreshToken = <IRefreshToken>{};
    }

    public createToken = async (req: RequestCustom) => {
        const ipAddress = (((req.headers['x-forwarded-for'] || '') as string).split(',').pop() || '').trim() || req.connection.remoteAddress || req.socket.remoteAddress;
        const filter = {
            user: req.auth.id,
            ipAddress: ipAddress,
            device: req.headers['user-agent'],
            tokenDeleted: false
        };
        this.userLogins = await UserLoginService.list(filter);
        const tokenId = uuidv4();

        /*
        if (this.userLogins.length > 0) {
            let deletedLogins = this.userLogins.map((x) => {
                return { id: x.id };
            });
            console.log(deletedLogins)
            // await UserLoginService.update({ $or: deletedLogins }, { $set: { tokenDeleted: true } });

            let tokenIds = this.userLogins.map((x) => {
                return { tokenId: x.tokenId };
            });
            console.log(tokenIds)


            // await UserLoginService.delete({ $or: tokenIds });
        }
        */

        this.userLogin = <IUserLogin>{
            user: req.auth.id,
            tokenId: tokenId,
            ipAddress: ipAddress,
            device: req.headers['user-agent']
        };
        this.userLogin = await UserLoginService.create(this.userLogin);
        const options = { expiresIn: 18000 };

        const payload = { id: req.auth.id, tokenId: tokenId };
        const accessToken = await jwt.sign(payload, config.jwt.secret_key, options);

        return {
            accessToken: accessToken,
            tokenId: tokenId,
            id: this.userLogin.user
        };
    };

    public createRefreshToken = async (tokenId: any, id: string) => {
        const payload = { tokenId: tokenId, id: id };
        const options = { expiresIn: '1y' };

        const jwtToken = await jwt.sign(payload, config.jwt.secret_key, options);
        if (jwtToken) {
            this.refreshToken = <IRefreshToken>{
                tokenId: tokenId,
                token: jwtToken
            };
            this.refreshToken = await RefreshTokenService.create(this.refreshToken);
        }

        return this.refreshToken;
    };

    public tokenUtil = {
        generateToken: async (req: RequestCustom, res: Response, next: NextFunction) => {
            var tokenCreated = await this.createToken(req);
            var refreshTokenCreated = await this.createRefreshToken(tokenCreated.tokenId, tokenCreated.id);

            req.token = tokenCreated.accessToken;
            req.refreshToken = refreshTokenCreated.token;

            return next();
        },

        sendToken: async (req: RequestCustom, res: Response, next: NextFunction) => {
            res.setHeader('x-auth-token', req.token);

            this.user = await UserService.findOne({ id: req.auth.id });

            res.cookie('idToken', req.token);
            res.cookie('refreshToken', req.refreshToken);

            const response = {
                email: this.user.email,
                displayName: this.user.name,
                idToken: req.token,
                refreshToken: req.refreshToken,
                expiresIn: 1800
            };

            createResponse(res, 200, { response: response });
            return;
        }
    };
}

export default new TokenService();
