import { PingController } from "./ping";
import { AuthController } from "./auth";

export const CONTROLLERS = [
    new PingController(),
    new AuthController()
];