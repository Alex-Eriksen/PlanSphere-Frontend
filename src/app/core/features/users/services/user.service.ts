import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IUser } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapUserToSignalSmallListInputOperator } from "../utilities/mapUserToSignalSmallListInputOperator";
import { IUserPayload } from "../utilities/user-payload";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    readonly #userRepository = inject(UserRepository);

    createUser(bodyRequest: any): Observable<void> {
        return this.#userRepository.createUser(bodyRequest);
    }

    getUserDetails(userId?: number): Observable<IUser> {
        return this.#userRepository.getUserDetails(userId);
    }

    patchUser(body: any, userId?: number): Observable<void> {
        return this.#userRepository.patchUserDetails(body, userId);
    }

    listUsers(params: IPaginationSortPayload): Observable<ISignalPaginatedResponse<ISmallListTableInput>> {
        return this.#userRepository.listUsers(params).pipe(mapUserToSignalSmallListInputOperator());
    }

    deleteUser(sourceLevelId: number): Observable<void> {
        return this.#userRepository.deleteUser(sourceLevelId);
    }

    updateUser(sourceLevelId: number, bodyRequest: IUserPayload): Observable<void> {
        return this.#userRepository.updateUser(sourceLevelId, bodyRequest);
    }
}
