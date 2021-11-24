const bcrypt = require('bcryptjs');
const totp = require('totp-generator');
import Config from '../configs/config';
const saltRounds = Config.password.saltRounds;
const totpKey = Config.password.totp;
import { v4 as uuidv4 } from 'uuid';
const generator = require('generate-password');

const Password = {
    randomPassword: (): any => {
        let password = generator.generate({
            length: 10,
            numbers: true,
            symbols: true,
            uppercase: true
        });
        return password;
    },
    generatePassword: (password: string): any => {
        let passwordHash = bcrypt.hashSync(password, saltRounds);
        return passwordHash;
    },
    generateToken: (): any => {
        const token = totp(totpKey, {
            digits: 6,
            algorithm: 'SHA-512',
            period: 60
        });
        return token;
    },
    generateUuid: (): any => {
        const token = uuidv4();
        return token;
    }
};

export default Password;
