"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const UserSchema = new mongoose.Schema({
    email: { type: String, require: true, unique: true },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: String,
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number },
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
}, { timestamps: true });
UserSchema.pre("save", function save(next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, undefined, (err, hash) => {
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
// const UserRepository = mongoose.model<UserType>("User", UserSchema);
const UserRepository = mongoose.model("User", UserSchema);
exports.default = UserRepository;
//# sourceMappingURL=userSchema.js.map