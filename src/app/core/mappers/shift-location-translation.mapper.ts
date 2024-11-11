import { ShiftLocation } from "../enums/shift-location.enum";

export const ShiftLocationTranslationMapper = new Map<ShiftLocation, string>([
    [ShiftLocation.Office, "SHIFT_LOCATION.OFFICE"],
    [ShiftLocation.Remote, "SHIFT_LOCATION.REMOTE"]
])
