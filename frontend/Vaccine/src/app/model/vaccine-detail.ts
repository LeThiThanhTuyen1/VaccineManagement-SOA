export interface VaccineDetail {
    detail_id?: number; // Id có thể là undefined khi thêm mới
    vaccine_id?: number; // VaccineId gán từ vaccine chính
    providerName: string;
    price: number | null;
    status: string;
  }
  