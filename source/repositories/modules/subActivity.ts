import { getRepository } from 'typeorm';
import { SubActivity } from '../../models/subActivity';

export interface ISubActivity {
    id: string;
    name: string;
    accountNumber: string;
    description: string;
    category: any;
    isDeleted: boolean;
    createdAt: Date;
    createdBy: any;
    updatedAt: Date;
    updatedBy: any;
    deletedAt?: Date;
}

export interface ISubActivityPaginate {
    docs: Array<ISubActivity>;
}

const SubActivityRepository = {
    search: async (params: any): Promise<ISubActivityPaginate> => {
        const { page, search, sort, take, skip, totalDocs, totalPages, limit } = params;
        search.isDeleted = false;
        const options: any = {
            where: search,
            order: sort,
            cache: true,
            take,
            skip
        };
        const subActivityRepository = getRepository(SubActivity);
        const docs = await subActivityRepository.find(options);

        const subActivity = {
            docs
            // totalDocs, // edit
            // page,
            // totalPages, // edit
            // limit, // add
            // prevPage: page > 1 ? page - 1 : 1, // add = (page>1)?page-1:1;
            // nextPage: totalPages == page ? totalPages : page + 1, // add = (totalPages=page)?totalPages?page+1;
            // hasPrevPage: page > 1 ? true : false, // add = page>1
            // hasNextPage: page != totalPages ? true : false, // add = page!=totalPages
            // pagingCounter: 1 // default
        };
        return subActivity || <ISubActivityPaginate>{};
    },
    count: async (params: any): Promise<number> => {
        const { search } = params;
        search.isDeleted = false;
        const options: any = {
            where: search
        };

        const subActivityRepository = getRepository(SubActivity);
        const docs = await subActivityRepository.find(options);
        const subActivity = docs.length;
        return subActivity || 0;
    },
    create: async (payload: ISubActivity): Promise<SubActivity> => {
        const subActivityRepository = getRepository(SubActivity);
        const subActivity = new SubActivity();
        return subActivityRepository.save({
            ...subActivity,
            ...payload
        });
    },

    findOne: async (params: any): Promise<ISubActivity> => {
        const subActivityRepository = getRepository(SubActivity);
        const subActivity = await subActivityRepository.findOne(params);

        return subActivity || <ISubActivity>{};
    }
};

export default SubActivityRepository;
