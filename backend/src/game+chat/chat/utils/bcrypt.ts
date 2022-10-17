import * as bcrypt from 'bcrypt';

// https://www.youtube.com/watch?v=i1-5eahxrgo

export function hashPassword(rawPassword: string) {
    const SALT = bcrypt.genSaltSync();
    // const SALT = 10;
    return bcrypt.hashSync(rawPassword, SALT);
}

export function comparePasswords(rawPassword: string, hash: string) {
    return bcrypt.compareSync(rawPassword, hash);
}