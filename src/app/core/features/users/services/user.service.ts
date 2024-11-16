import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IUser } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { IUserLookUp } from "../models/user-look-up.model";
import { IPaginationSortPayload } from "../../../../shared/interfaces/pagination-sort-payload.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapUserToSignalSmallListInputOperator } from "../utilities/user.utilities";
import { IUserPayload } from "../models/user-payload";
import { SourceLevel } from "../../../enums/source-level.enum";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    readonly #userRepository = inject(UserRepository);

    createUser(bodyRequest: any, sourceLevel: SourceLevel, sourceLevelId: number): Observable<void> {
        return this.#userRepository.createUser(bodyRequest, sourceLevel, sourceLevelId);
    }

    getUserDetails(userId?: number): Observable<IUser> {
        return this.#userRepository.getUserDetails(userId);
    }

    patchUser(body: any, userId?: number): Observable<void> {
        return this.#userRepository.patchUserDetails(body, userId);
    }

    lookUpUsers(organisationId?: number): Observable<IUserLookUp[]> {
        return this.#userRepository.lookUpUsers(organisationId);
    }

    listUsers(sourceLevel: SourceLevel, sourceLevelId: number, params: IPaginationSortPayload): Observable<ISignalPaginatedResponse<ISmallListTableInput>> {
        return this.#userRepository.listUsers(sourceLevel, sourceLevelId, params).pipe(mapUserToSignalSmallListInputOperator());
    }
    updateUser(sourceLevel: SourceLevel, sourceLevelId: number, userId: number, bodyRequest: IUserPayload): Observable<void> {
        return this.#userRepository.updateUser(sourceLevel, sourceLevelId, userId, bodyRequest);
    }

    deleteUser(sourceLevel: SourceLevel, sourceLevelId: number, userId: number): Observable<void> {
        return this.#userRepository.deleteUser(sourceLevel, sourceLevelId, userId,);
    }
}
