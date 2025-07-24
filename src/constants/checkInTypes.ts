export const CHECK_IN = 'check_in' as const;
export const CHECK_OUT = 'check_out' as const;

export const METHOD_IP = 'ip' as const;
export const METHOD_LOCATION = 'location' as const;

export type CheckInType = typeof CHECK_IN | typeof CHECK_OUT;
export type CheckInMethod = typeof METHOD_IP | typeof METHOD_LOCATION;
