import { AuthToken } from "./authToken";
import { Profile } from "./profile";

export interface User {
    email?: string;
    username?: string;
    password?: string;
    loginAttempts?: number;
    lockUntil?: number;
    role?: string;
    active?: boolean;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    activationToken?: string;
    activationExpires?: Date;
    tokens?: Array<AuthToken>;
    profile?: Profile;
}