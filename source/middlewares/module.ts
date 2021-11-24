import { NextFunction, Request, Response } from 'express';
import createResponse from '../utils/http-response';

function authorize(module: string) {
    return [
        (req: Request, res: Response, next: NextFunction) => {
            if (res.locals.modules.length && !res.locals.modules.includes(module)) {
                return createResponse(res, 401, { message: { id: 'Unauthorized' } }, {});
            }
            next();
        }
    ];
}

export default authorize;
