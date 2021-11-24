import jwt from 'jsonwebtoken';
import Config from '../configs/config';
const secret_key = Config.jwt.secret_key;
import UserLoginService, { IUserLogin } from '../repositories/modules/userLogin';
import RefreshTokensRepository, { IRefreshToken } from '../repositories/modules/refreshToken';
import { v4 as uuidv4 } from 'uuid';
import { In } from 'typeorm';

const JWT = {
    createToken: async (filter: any, user: any) => {
        let filters = {
            user: { id: filter.user },
            ipAddress: filter.ipAddress,
            device: filter.device,
            tokenDeleted: filter.tokenDeleted
        };

        let userLogins = await UserLoginService.list(filters);
        const tokenId = uuidv4();

        if (userLogins.length > 0) {
            // let deletedLogins = userLogins.map((x) => {
            //     return { id: x.id };
            // });

            await UserLoginService.update({ tokenDeleted: true }, filters);

            let tokenIds = userLogins.map((x) => {
                return x.tokenId;
            });

            await UserLoginService.delete({ tokenId: In(tokenIds) });
        }

        let device;
        if (filter.isDekstop == true) device = 'web';
        else if (filter.isMobile == true) device = 'mobile';
        else device = 'unknown';

        let userLogin = <IUserLogin>{
            user: user.id,
            tokenId: tokenId,
            ipAddress: filter.ipAddress,
            loggedInAt: new Date(),
            device: filter.device,
            tokenDeleted: false,
            userAgent: filter.userAgent,
            typeDevice: device
        };
        userLogin = await UserLoginService.create(userLogin);

        const options = { expiresIn: Config.jwt.expires };
        const payload = {
            id: user.id,
            nip: user.nip,
            name: user.name,
            email: user.email,
            tokenId: tokenId
        };
        const accessToken = await jwt.sign(payload, Config.jwt.secret_key, options);

        return {
            accessToken: accessToken,
            tokenId: tokenId,
            id: userLogin.user
        };
    },
    createRefreshToken: async (tokenId: any, id: string) => {
        const payload = { tokenId: tokenId, id: id };
        const options = { expiresIn: Config.jwt.expiresRefresh };

        const jwtToken = await jwt.sign(payload, Config.jwt.secret_key, options);
        let refreshToken;
        if (jwtToken) {
            refreshToken = <IRefreshToken>{
                tokenId: tokenId,
                token: jwtToken
            };
            refreshToken = await RefreshTokensRepository.create(refreshToken);
        }

        return refreshToken;
    },
    verifyToken: (token: string): any => {
        return jwt.verify(token, secret_key);
    },
    decodeToken: (token: string): any => {
        return jwt.decode(token);
    },
    destroyToken: (token: string): any => {}
};

export default JWT;
