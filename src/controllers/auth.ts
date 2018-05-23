import { Controller } from "./controller";
import { HttpServer } from "../server/httpServer";
import { Request, Response } from "restify";
import { User } from "../models/user";
import { userService } from "../services/user";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { promisify } from "util";

export class AuthController implements Controller {
    public initialize(httpServer: HttpServer): void {
        httpServer.post("/login", this.login.bind(this));
        httpServer.post("/register", this.register.bind(this));
        httpServer.get("/activate/:activationToken", this.activate.bind(this));
    }

    private async login(req: Request, res: Response): Promise<void> {
        // TODO: here need request validator to check email password etc.

        const errors = false; // need validator
        if (errors) {
            return res.send(400, {
                msg: errors,
                code: 400
            });
        }

        try {
            const user: User = await userService.findByEmail(req.body.email);
            if (!user) {
                return res.send(404, {
                    msg: "User not found",
                    code: 404
                });
            }
            const isSamePassword = await userService.comparePassword(req.body.password, user.password);
            if (isSamePassword) {
                const token = jwt.sign({
                    email: user.email,
                    role: user.role,
                    username: user.username
                }, process.env.JWT_SECRET, { expiresIn: "1h"});
                return res.send(200, {token: token});
            } else {
                return res.send(401, {
                    msg: "Unauthorized",
                    code: 401
                });
            }
        } catch (err) {
            return res.send(400, {
                msg: err,
                code: 400
            });
        }
    }

    private async register(req: Request, res: Response): Promise<void> {
        // TODO: here need request validator to check email password etc.
        const errors = false;
        if (errors) {
            return res.send(401, {
                msg: errors,
                code: 401
            });
        }


        const user: User = req.body;
        try {
            // Check if user  already exists
            const existedUser: User = await userService.findByUsernameOrEmail(user.username, user.email);
            if (existedUser) {
                return res.send(409, {
                    msg: "User already exists",
                    code: 409
                });
            }

            const randomBytes = promisify(crypto.randomBytes);
            const cryptedValue = await randomBytes(16);
            user.activationToken = cryptedValue.toString("hex");
            user.activationExpires = new Date(Date.now() + 3600000);

            // TODO: Send activation email

            const savedUser: User = await userService.create(user);
            return res.send(200, savedUser);
        } catch (err) {
            console.log(err);
            res.send(400, {
                msg: "Unable to send Email",
                code: 400
            });
        }
    }

    private async activate(req: Request, res: Response): Promise<void> {
        try {
            const user: User = await userService.findOneAndUpdate(req.params.activationToken);
            const token = jwt.sign({
                email: user.email,
                role: user.role,
                username: user.username
            }, process.env.JWT_SECRET, { expiresIn: "1h"});
            return res.send(200, { token: token });
        } catch (err) {
            console.log(err);
            res.send(400, {
                msg: "Activation token expired, please register again",
                code: 400
            });
        }
    }
}