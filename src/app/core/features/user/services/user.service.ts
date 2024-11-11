import { inject, Injectable } from "@angular/core";
import { UserRepository } from "../repositories/user.repository";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { Observable } from "rxjs";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapUserToSignalSmallListInputOperator } from "../utilities/mapUserToSignalSmallListInputOperator";
import { IUser } from "../models/user.model";
import { IUserPayload } from "../utilities/user-payload";

@Injectable({
    providedIn: "root"
})
export class UserService {
    readonly #userRepository = inject(UserRepository);

    createUser(bodyRequest: any): Observable<void> {
        return this.#userRepository.createUser(bodyRequest);
    }

    getUserById(sourceLevelId: number): Observable<IUser> {
        return this.#userRepository.getUserById(sourceLevelId);
    }

    listUsers(params: IPaginationSortPayload): Observable<ISignalPaginatedResponse<ISmallListTableInput>> {
        return this.#userRepository.listUsers(params).pipe(mapUserToSignalSmallListInputOperator());
    }

    deleteUser(sourceLevelId: number): Observable<void> {
        return this.#userRepository.deleteUser(sourceLevelId);
    }

    patchUser(sourceLevelId: number, bodyRequest: any): Observable<void> {
        return this.#userRepository.patchUser(sourceLevelId, bodyRequest);
    }

    updateUser(sourceLevelId: number, bodyRequest: IUserPayload): Observable<void> {
        return this.#userRepository.updateUser(sourceLevelId, bodyRequest);
    }
}
