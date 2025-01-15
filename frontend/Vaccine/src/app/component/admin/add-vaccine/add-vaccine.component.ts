import { Component } from '@angular/core';
import { VaccineService } from '../../../service/vaccine.service';
import { VaccineDetail } from '../../../model/vaccine-detail';
import { Vaccine } from '../../../model/vaccine';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-vaccine',
  standalone: false,
  templateUrl: './add-vaccine.component.html',
  styleUrls: ['./add-vaccine.component.css']
})
export class AddVaccineComponent {
  newVaccine = {
    name: '',
    manufacturer: '',
    expirationDate: '',
    quantity: 0,
    description: '',
    vaccineDetails: []  as VaccineDetail[]
  };

  newVaccineDetail = {
    providerName: '',
    price: 1,
    status: ''
  };

  errorMessage: string = ''; // Để hiển thị lỗi

  constructor(private vaccineService: VaccineService, private router: Router) {}

  // Xử lý khi nhấn nút lưu
  onSubmit(form: any): void {
    if (form.valid) {
      console.log(this.newVaccine);
      // Thêm vaccine details vào vaccine
      this.newVaccine.vaccineDetails.push({ ...this.newVaccineDetail });

      this.vaccineService.addVaccine(this.newVaccine).subscribe({
        next: (response) => {
          alert('Thêm vaccine thành công!');
          this.resetForm(form);
        },
        error: (error) => {
          console.error('API Error: ', error); // Log toàn bộ error để xem chi tiết
          this.errorMessage = `Lỗi: ${error.message || 'Không thể thêm vaccine.'}`;
        }      
      });
    } else {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin vào các trường.';
    }
  }

  // Reset lại form
  resetForm(form: any): void {
    // Reset vaccine model
    this.newVaccine = {
      name: '',
      manufacturer: '',
      expirationDate: '',
      quantity: 0,
      description: '',
      vaccineDetails: []
    };

    // Reset vaccine detail model
    this.newVaccineDetail = {
      providerName: '',
      price: 0,
      status: ''
    };

    // Reset error message and form
    this.errorMessage = '';
    form.resetForm();
  }

  cancelAdd() {
    this.router.navigate(['/vaccine-list']); // Điều hướng về trang danh sách
  }
}
