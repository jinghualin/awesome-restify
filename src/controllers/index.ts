import { PingController } from "./ping";
import { UserController } from "./user";

export const CONTROLLERS = [
    new PingController(),
    new UserController()
];