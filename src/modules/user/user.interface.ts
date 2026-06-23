import type { ROLES } from "../../types/index.js";

export interface IUser{
    name: string;
    email: string;
    password: string;
    role: ROLES;
    

}