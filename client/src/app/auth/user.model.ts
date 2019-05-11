

export interface Credentials {
    email: string;
    uid: string;
    ra: string;
}

export class User {
    constructor(public id: string, public firebaseId: string, public email: string) {}
}