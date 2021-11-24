import createResponse from '../utils/http-response';
import { NextFunction, Request, Response } from 'express';
import JWT from '../utils/jsonwebtoken';
import UserLoginsRepository from '../repositories/modules/userLogin';
import BlacklistTokensRepository from '../repositories/modules/blacklistToken';
import JwtToken from '../utils/jsonwebtoken';

class AuthMiddleware {
    private tokenBearer: string;
    private bearer: string;
    private errorMessage = {
        notSignedIn: 'Not yet sign-in',
        notRegistered: 'Not registered'
    };

    constructor() {
        this.tokenBearer = '';
        this.bearer = '';
    }

    private getToken = (authorization: string) => {
        let [bearer, token] = authorization.split(' ');
        this.tokenBearer = token;
        this.bearer = bearer;
    };

    public userAuth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.headers.authorization) {
                createResponse(res, 403, { message: this.errorMessage.notSignedIn });
                return;
            }

            this.getToken(req.headers.authorization);

            if (!this.tokenBearer) {
                createResponse(res, 403, { message: this.errorMessage.notRegistered });
                return;
            }

            if (this.bearer != 'Bearer') {
                createResponse(res, 403, { message: this.errorMessage.notRegistered });
                return;
            }

            let verify = JWT.verifyToken(this.tokenBearer);
            if (!verify) {
                createResponse(res, 403, { message: this.errorMessage.notRegistered });
                return;
            }

            let blacklistToken = await BlacklistTokensRepository.findOne({ token: this.tokenBearer });
            if (blacklistToken.id) {
                createResponse(res, 403, { message: this.errorMessage.notRegistered });
                return;
            }

            let userToken = JwtToken.decodeToken(this.tokenBearer);

            let userLogin = await UserLoginsRepository.findOne({ tokenId: userToken.tokenId });
            if (userLogin.loggedOut == true || userLogin.tokenDeleted == true) {
                createResponse(res, 403, { message: this.errorMessage.notRegistered });
                return;
            }

            if (!userLogin.id) {
                createResponse(res, 403, { message: this.errorMessage.notRegistered });
                return;
            }

            const modules = userLogin.user.role.roleModules.map((item: any) => item.module.slug);
            res.locals.modules = modules;
            res.locals.user = userLogin.user;
            res.locals.refreshToken = userLogin.tokenId;
            res.locals.idToken = req.headers.authorization;
            res.cookie('modulesAccess', modules);

            next();
        } catch (error: any) {
            if (error.message == 'jwt expired') createResponse(res, 401, { message: this.errorMessage.notSignedIn });
            else createResponse(res, 500, { message: error.message });
            return;
        }
    };
}

export default new AuthMiddleware();
