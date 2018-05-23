"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = require("../models/schemas/userSchema");
const bcrypt = require("bcrypt-nodejs");
/**
 * @class UserService
 */
class UserService {
    /**
     * @description
     * @param Email
     * @returns { Promise<User> }
     */
    async findByEmail(email) {
        return await userSchema_1.default.findOne({ email: email });
    }
    async getById(id) {
        return await userSchema_1.default.findById({ id: id });
    }
    async create(user) {
        console.log(`created new User`);
        return (await new userSchema_1.default(user).save()).toObject({ virtuals: true });
    }
    async findByUsernameOrEmail(username, email) {
        console.log(`find ${username}  ${email}`);
        return await userSchema_1.default.findOne({ $or: [{ email: email }, { username: username }] });
    }
    async findOneAndUpdate(activationToken) {
        return await userSchema_1.default.findOneAndUpdate({ activationToken: activationToken }, { activate: true }, { new: true });
    }
    comparePassword(candidatePassword, storedPassword) {
        return bcrypt.compareSync(candidatePassword, storedPassword);
    }
}
exports.userService = new UserService();
//# sourceMappingURL=user.js.map