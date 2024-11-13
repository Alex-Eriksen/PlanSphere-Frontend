import { JwtPayload } from "jwt-decode";

export interface DecodedAccessToken extends JwtPayload {
    UserId: number;
    OrganisationId: number;
    FirstName: string;
    LastName: string;
}
