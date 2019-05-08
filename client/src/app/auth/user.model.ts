

export interface Credentials {
    email: string;
    uid: string;
    ra: string;
}

export class UserModel {
    constructor(public id: string) {}
}