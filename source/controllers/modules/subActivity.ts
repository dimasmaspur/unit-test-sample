import { NextFunction, Request, Response } from 'express';
import { BaseController } from './../base-controller';
import errorMessage from '../../utils/error-message';
import { ILike } from 'typeorm';
import SubActivityRepository, { ISubActivity } from '../../repositories/modules/subActivity';
import { SubActivity } from '../../models/subActivity';

const json2csv = require('json2csv').parse;

export interface RequestCustom extends Request {}

class SubActivityController extends BaseController {
    private subActivity: ISubActivity;

    constructor() {
        super();
        this.subActivity = <ISubActivity>{};
    }

    public validate = async (req: RequestCustom, res: Response, next: NextFunction) => {
        if (!req.body.name) {
            errorMessage.fieldsRequired(['nama']);
            this.badRequest(res, 'Nama harus diisi');
            return;
        }

        if (!req.body.accountNumber) {
            errorMessage.fieldsRequired(['no akun']);
            this.badRequest(res, 'No akun harus diisi');
            return;
        }

        if (!req.body.description) {
            errorMessage.fieldsRequired(['deskripsi']);
            this.badRequest(res, 'Deskripsi harus diisi');
            return;
        }

        if (!req.body.category) {
            errorMessage.fieldsRequired(['kategori']);
            this.badRequest(res, 'Kategori harus diisi');
            return;
        }

        const subActivity = await SubActivityRepository.findOne({
            name: req.body.name,
            isDeleted: false
        });

        if (subActivity.name) {
            this.dataConflict(res, errorMessage.alreadyExist('nama'));
            return;
        }

        return next();
    };
    public validateUpdate = async (req: RequestCustom, res: Response, next: NextFunction) => {
        if (!req.body.name) {
            errorMessage.fieldsRequired(['nama']);
            this.badRequest(res, 'Nama harus diisi');
            return;
        }

        if (!req.body.accountNumber) {
            errorMessage.fieldsRequired(['no akun']);
            this.badRequest(res, 'No akun harus diisi');
            return;
        }

        if (!req.body.description) {
            errorMessage.fieldsRequired(['deskripsi']);
            this.badRequest(res, 'Deskripsi harus diisi');
            return;
        }

        if (!req.body.category) {
            errorMessage.fieldsRequired(['kategori']);
            this.badRequest(res, 'Kategori harus diisi');
            return;
        }
        const subActivity = await SubActivityRepository.findOne({
            name: req.body.name,
            isDeleted: false
        });

        const currenctName = await SubActivityRepository.findOne({
            id: req.params.SubActivityId
        });
        if (req.body.name != currenctName.name) {
            if (subActivity.name) {
                this.dataConflict(res, errorMessage.alreadyExist('nama'));
                return;
            }
        }

        return next();
    };

    public create = async (req: Request, res: Response) => {
        try {
            this.subActivity = <ISubActivity>{};
            this.subActivity = req.body;
            this.subActivity.isDeleted = false;

            this.subActivity.createdBy = 1;
            this.subActivity.updatedBy = 1;

            let subActivityData = new SubActivity();
            subActivityData = await SubActivityRepository.create(this.subActivity);
            this.ok(res);
        } catch (error: any) {
            this.badRequest(res, error.message);
        }
    };

    public search = async (req: Request, res: Response) => {
        try {
            let search: { [key: string]: any } = {};
            let sort: { [key: string]: string } = {};

            const page: number = parseInt(req.query.page as any) || 1;
            const take = parseInt(req.query.limit as any) || 10;

            if (req.query.name) {
                search['name'] = ILike(`%${req.query.name}%`);
            }

            if (req.query.sort) {
                const sortBy = req.query.sort.toString();
                const gate = sortBy.split('|');
                gate.forEach((gateData) => {
                    const str = gateData.split(':');
                    let field = str[0].toString();
                    let value = str[1].toString().toUpperCase();
                    sort[field] = value;
                });
            }

            const total = await SubActivityRepository.count({ search });
            const params = {
                search,
                sort,
                totalDocs: total,
                limit: take,
                take,
                page,
                totalPages: Math.ceil(total / take),
                skip: (page - 1) * take
            };

            const subActivity = await SubActivityRepository.search(params);

            this.ok(res, subActivity);
        } catch (error: any) {
            this.badRequest(res, error.message);
        }
    };
}

export default new SubActivityController();
