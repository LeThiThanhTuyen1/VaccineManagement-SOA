import { VaccineDetail } from "./vaccine-detail";

export interface Vaccine {
    id?: number; // Id có thể là undefined khi thêm mới
    name: string;
    manufacturer: string;
    expirationDate: string;
    quantity: number;
    description: string;
    details: VaccineDetail[]; // Mảng các vaccine details
  }

  