// 忘記打卡申請類型
export enum RequestType {
  CHECK_IN = 'check_in',
  CHECK_OUT = 'check_out',
}

// 申請類型顯示文字
export const REQUEST_TYPE_LABELS = {
  [RequestType.CHECK_IN]: '忘記上班打卡',
  [RequestType.CHECK_OUT]: '忘記下班打卡',
} as const;

// 打卡方法類型
export enum CheckInMethod {
  IP = 'ip',
  LOCATION = 'location',
}

// 打卡狀態
export enum CheckInStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

// 打卡來源
export enum CheckInSource {
  NORMAL = 'normal',
  MISSED_CHECK_IN = 'missed_check_in',
}
