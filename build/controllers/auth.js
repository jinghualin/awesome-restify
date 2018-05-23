"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../services/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const util_1 = require("util");
class AuthController {
    initialize(httpServer) {
        httpServer.post("/login", this.login.bind(this));
        httpServer.post("/register", this.register.bind(this));
        httpServer.get("/activate/:activationToken", this.activate.bind(this));
    }
    async login(req, res) {
        // TODO: here need request validator to check email password etc.
        const errors = false; // need validator
        if (errors) {
            return res.send(400, {
                msg: errors,
                code: 400
            });
        }
        try {
            const user = await user_1.userService.findByEmail(req.body.email);
            if (!user) {
                return res.send(404, {
                    msg: "User not found",
                    code: 404
                });
            }
            const isSamePassword = await user_1.userService.comparePassword(req.body.password, user.password);
            if (isSamePassword) {
                const token = jwt.sign({
                    email: user.email,
                    role: user.role,
                    username: user.username
                }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return res.send(200, { token: token });
            }
            else {
                return res.send(401, {
                    msg: "Unauthorized",
                    code: 401
                });
            }
        }
        catch (err) {
            return res.send(400, {
                msg: err,
                code: 400
            });
        }
    }
    async register(req, res) {
        // TODO: here need request validator to check email password etc.
        const errors = false;
        if (errors) {
            return res.send(401, {
                msg: errors,
                code: 401
            });
        }
        const user = req.body;
        try {
            // Check if user  already exists
            const existedUser = await user_1.userService.findByUsernameOrEmail(user.username, user.email);
            if (existedUser) {
                return res.send(409, {
                    msg: "User already exists",
                    code: 409
                });
            }
            const randomBytes = util_1.promisify(crypto.randomBytes);
            const cryptedValue = await randomBytes(16);
            user.activationToken = cryptedValue.toString("hex");
            user.activationExpires = new Date(Date.now() + 3600000);
            // TODO: Send activation email
            const savedUser = await user_1.userService.create(user);
            return res.send(200, savedUser);
        }
        catch (err) {
            console.log(err);
            res.send(400, {
                msg: "Unable to send Email",
                code: 400
            });
        }
    }
    async activate(req, res) {
        try {
            const user = await user_1.userService.findOneAndUpdate(req.params.activationToken);
            const token = jwt.sign({
                email: user.email,
                role: user.role,
                username: user.username
            }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.send(200, { token: token });
        }
        catch (err) {
            console.log(err);
            res.send(400, {
                msg: "Activation token expired, please register again",
                code: 400
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.js.map