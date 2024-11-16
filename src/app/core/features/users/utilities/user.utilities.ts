import { map, OperatorFunction } from "rxjs";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { signal } from "@angular/core";
import { mapToSignalPaginatedResponse } from "../../../../shared/utilities/signals.utilities";
import { IUser } from "../models/user.model";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { addressFormBuilderControl } from "../../address/utilities/address.utilities";

export const mapUserToSignalSmallListInputOperator = (): OperatorFunction<IPaginatedResponse<IUser>, ISignalPaginatedResponse<ISmallListTableInput>
> => {
    return map((paginatedUsers) => ({
        ...mapToSignalPaginatedResponse(paginatedUsers),
        results: signal(mapUsersToSmallListInput(paginatedUsers.results)),
    }));
};

const mapUsersToSmallListInput = (users: IUser[]): ISmallListTableInput[] => {
    return users.map((user) => ({
        ...user,
    }));
}

export const userFormGroupBuilder = (fb: NonNullableFormBuilder, user?: IUser) => {
    return fb.group({
        id: fb.control({ value: user?.id ?? 0, disabled: false }),
        firstName: fb.control<string | null>( user?.firstName ?? null, [Validators.required, Validators.maxLength(50), Validators.minLength(2), ]),
        lastName: fb.control<string | null>(user?.lastName ?? null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
        email: fb.control<string | null>(user?.email ?? null, [Validators.required, Validators.email]),
        phoneNumber: fb.control<string | null>(user?.phoneNumber ?? null, [Validators.required ,Validators.pattern("^[0-9]*$"), Validators.maxLength(8), Validators.minLength(8)]),
        address: addressFormBuilderControl(fb),
        settings: userSettingsFormGroupBuilder(fb),
        roleIds: fb.control<number[] | []>(user?.roleIds ?? []),
    });
}

export const userSettingsFormGroupBuilder = (fb: NonNullableFormBuilder): FormGroup => {
    return fb.group({
        inheritWorkSchedule: fb.control(false),
        inheritedWorkScheduleId: fb.control<number | null>(null, {updateOn: "change"}),
        autoCheckInOut: fb.control(false),
        autoCheckOutDisabled: fb.control(false),
        isEmailPrivate: fb.control(false),
        isAddressPrivate: fb.control(false),
        isPhoneNumberPrivate: fb.control(false),
        isBirthdayPrivate: fb.control(false),
    });
}
