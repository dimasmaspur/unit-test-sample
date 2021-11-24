import * as express from 'express';
import createResponse from '../utils/http-response';

export abstract class BaseController {
    public static jsonResponse(res: express.Response, code: number, message: string) {
        return res.status(code).json({ message });
    }

    public ok<T>(res: express.Response, dto?: T) {
        if (!!dto) {
            createResponse(res, 200, { response: dto });
        } else {
            createResponse(res, 200);
        }
    }

    public unauthorized(res: express.Response, message?: string, errorDetail?: any) {
        createResponse(res, 401, { message: { id: message } }, errorDetail);
    }

    public badRequest(res: express.Response, message?: string) {
        createResponse(res, 400, { message: { id: message } });
    }

    public forbidden(res: express.Response, message?: string) {
        createResponse(res, 403, { message: { id: message } });
    }

    public dataConflict(res: express.Response, message?: string, errorDetail?: object) {
        createResponse(res, 409, { message: { id: message } }, errorDetail);
    }

    public created(res: express.Response) {
        return res.sendStatus(201);
    }

    public notFound(res: express.Response, message?: string) {
        createResponse(res, 404, { message: { id: message } });
    }

    public fail(res: express.Response, error: Error | string) {
        createResponse(res, 500, { message: error.toString() });
    }

    public createResponseForCsv(res: express.Response, opts: any) {
        res.set({
            'Content-Length': opts.file.length,
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename=${opts.fileName}`,
            'Access-Control-Expose-Headers': 'X-Filename',
            'X-Filename': `${opts.fileName}`
        });
        return res.send(opts.file);
    }
}
