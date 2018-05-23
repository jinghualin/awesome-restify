
import { User } from "../models/user";
import UserRepository from "../models/schemas/userSchema";
import * as bcrypt from "bcrypt-nodejs";

/**
 * @class UserService
 */
class UserService {
    /**
     * @description
     * @param Email
     * @returns { Promise<User> }
     */
    public async findByEmail(email: string): Promise<User> {
        return await UserRepository.findOne({ email: email });
    }

    public async getById(id: string): Promise<User> {
        return await UserRepository.findById({id: id});
    }

    public async create(user: User): Promise<User> {
        console.log(`created new User`);
        return (await new UserRepository(user).save()).toObject({ virtuals: true });
    }

    public async findByUsernameOrEmail(username: string, email: string): Promise<User> {
        console.log(`find ${username}  ${email}`);
        return await UserRepository.findOne({$or: [{email: email}, {username: username}]});
    }

    public async findOneAndUpdate(activationToken: string): Promise<User> {
        return await UserRepository.findOneAndUpdate({activationToken: activationToken}, {activate: true}, {new: true});
    }
    public comparePassword(candidatePassword: string, storedPassword: string): boolean {
        return bcrypt.compareSync(candidatePassword, storedPassword);
    }
}

export const userService = new UserService();