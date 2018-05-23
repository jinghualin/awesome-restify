import * as mongoose from "mongoose";
import { AuthToken } from "../authToken";
import { Profile } from "../profile";
import * as bcrypt from "bcrypt-nodejs";
import { User } from "../user";
import { DatabaseProvider } from "../../database/mongodb";

export type UserType = mongoose.Document & {
    email: string,
    username: string,
    password: string,
    role: string,
    loginAttempts: number,
    lockUntil: number,
    active: boolean,

    passwordResetToken: string,
    passwordResetExpires: Date,

    activationToken: string,
    activationExpires: Date,

    tokens: Array<AuthToken>,

    profile: Profile,

    comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void
};

const UserSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true},
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    role: String,
    loginAttempts: { type: Number, required: true, default: 0},
    lockUntil: {type: Number},

    active: Boolean,

    passwordResetToken: String,
    passwordResetExpires: Date,

    activationToken: String,
    activationExpires: Date,

    profile: {
        firstName: String,
        lastName: String,
        gender: String,
        picture: String,
    }
}, {timestamps: true});


UserSchema.pre("save", function save(next) {
    const user: any = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

/* note that do not tell the end user why a login has failed */
UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};


type UserType = User & mongoose.Document;
// const UserRepository = mongoose.model<UserType>("User", UserSchema);
const UserRepository = mongoose.model<UserType>("User", UserSchema);
export default UserRepository;