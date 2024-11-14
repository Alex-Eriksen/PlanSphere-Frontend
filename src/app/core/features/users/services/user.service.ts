import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IUser } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { IUserLookUp } from "../models/user-look-up.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    readonly #userRepository = inject(UserRepository);

    getUserDetails(userId?: number): Observable<IUser> {
        return this.#userRepository.getUserDetails(userId);
    }

    patchUser(body: any, userId?: number): Observable<void> {
        return this.#userRepository.patchUserDetails(body, userId);
    }

    lookUpUsers(organisationId?: number): Observable<IUserLookUp[]> {
        return this.#userRepository.lookUpUsers(organisationId);
    }
}
