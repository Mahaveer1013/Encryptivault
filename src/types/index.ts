export interface Folder {
    _id: string;
    name: string;
    salt: string;
    hashedKey: string;
    userId: string;
    createdAt: Date;
}

export interface Password {
    _id: string;
    site: string;
    username: string;
    encryptedPassword: string;
    iv: string;
    folder: string;
    userId: string;
    createdAt: Date;
}
