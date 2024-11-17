import { map, OperatorFunction } from "rxjs";
import { IPaginatedResponse } from "../../../../shared/interfaces/paginated-response.interface";
import { IOrganisation } from "../models/organisation.model";
import { ISignalPaginatedResponse } from "../../../../shared/interfaces/signal-paginated-response.interface";
import { ISmallListTableInput } from "../../../../shared/interfaces/small-list-table-input.interface";
import { mapToSignalPaginatedResponse } from "../../../../shared/utilities/signals.utilities";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { IOrganisationSettings } from "../models/organisation-settings.model";
import { IRole } from "../../roles/models/role.model";
import { IWorkSchedule } from "../../workSchedules/models/work-schedule.model";
import { IOrganisationDetails } from "../models/organisation-details.model";
import { constructAddressFormGroup } from "../../address/utilities/address.utilities";

export const mapOrganisationToSignalSmallListInputOperator = (): OperatorFunction<IPaginatedResponse<IOrganisation>, ISignalPaginatedResponse<ISmallListTableInput>
> => {
    return map((paginatedOrganisations) => ({
        ...mapToSignalPaginatedResponse(paginatedOrganisations),
    }));
};

export const organisationFormGroupBuilder = (fb: NonNullableFormBuilder, organisation?: IOrganisationDetails)  => {
    return fb.group({
        name: fb.control<string | null>({ value: organisation?.name ?? null, disabled: false }, Validators.required),
        logoUrl: fb.control<string | null>({ value: organisation?.logoUrl ?? null, disabled: false }),
        address: constructAddressFormGroup(fb, organisation?.address),
        settings: constructOrganisationSettingsFormGroup(fb, organisation?.settings),
        createdAt: fb.control<Date | null>({ value: organisation?.createdAt ?? null, disabled: false }),
    })
}

export const constructOrganisationSettingsFormGroup = (fb: NonNullableFormBuilder, settings?: IOrganisationSettings): FormGroup => {
    return fb.group({
        defaultRole: fb.control<IRole | null>({ value: settings?.defaultRole ?? null, disabled: false }),
        defaultWorkSchedule: fb.control<IWorkSchedule | null>({ value: settings?.defaultWorkSchedule ?? null, disabled: false }),
    });
}
