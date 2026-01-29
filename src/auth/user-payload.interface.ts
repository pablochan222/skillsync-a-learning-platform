import { RolesEnum } from "./roles.enum";
import { GenderEnum } from "../common/gender-enum";

export interface UserPayload {
    id: string;
    name: string | null;
    email: string;
    phone: string;
    gender: GenderEnum | null;
    imageUrl: string | null;
    role : RolesEnum | null;
    is_verified: boolean;
    bio : string | null;
    specilization: string | null;
    birth_date : Date | null;
    otp : string | null;
    expires_at : Date | null;
    created_at: Date;
    updated_at: Date;
}