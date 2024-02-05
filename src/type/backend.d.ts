// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript
export { }
declare global {

    interface IUser {
        _id: string,
        name: string,
        email: string,
        role: string,
        age:number,
        address:string,
        gender:string,
        isVerify: boolean,
        type: string,
        createdAt: string,
        updatedAt: string,
        __v: 0
    }
    
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IUserPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

}
