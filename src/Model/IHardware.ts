export interface IHardware {
  id: number;
  hardwareType: number;
  barcode: string;
  hardwareName: string;

  statusId: number;
  statusName: string;

  remark: string;
  cusName: string;

  tokefExpire: string;
  tokefExpireEN: string;
  place: string;
}
