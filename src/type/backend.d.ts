// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript
export { }
declare global {

    interface IUser {
        _id: string,
        name: string,
        email: string,
        role: string,
        age: number,
        address: string,
        gender: string,
        isVerify: boolean,
        type: string,
        createdAt: string,
        updatedAt: string,
        __v: 0
    }

    interface ITrack {
        "_id": string,
        "title": string,
        "description": string,
        "category": string,
        "imgUrl": string,
        "trackUrl": string,
        "countLike": number,
        "countPlay": number,
        "uploader": {
            "_id": string,
            "email": string,
            "name": string,
            "role": string,
            "type": string
        },
        "isDeleted": boolean,
        "__v": number,
        "createdAt": string,
        "updatedAt": string
    }

    interface IComment {
        "_id": string,
        "content": string,
        "moment": number,
        "user": {
            "_id": string,
            "email": string,
            "name": string,
            "role": string,
            "type": string
        },
        "track": {
            "_id": string,
            "title": string,
            "description": string,
            "trackUrl": string
        },
        "isDeleted": boolean,
        "__v": number,
        "createdAt": string,
        "updatedAt": string
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
