import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../service/registration.service';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { VaccineService } from '../../../service/vaccine.service';
import { CitizensService } from '../../../service/citizens.service';
import { NgForm } from '@angular/forms';
import { forkJoin } from 'rxjs';  // Import forkJoin

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  vaccination: any = {
    citizenId: '',
    vaccineId: '',
    registrationDate: '',
    location: ''
  };
  vaccines: any[] = [];
  citizens: any[] = [];
  locations = [
    { name: 'Cơ sở 1 - Ghềnh Ráng', value: 'Cơ sở 1 - Ghềnh Ráng' },
    { name: 'Cơ sở 2 - Tây Sơn', value: 'Cơ sở 2 - Tây Sơn' }
  ];
  
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private registrationService: RegistrationService,
    private authService: AuthService,
    private vaccineService: VaccineService,
    private citizensService: CitizensService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkTokenAndLoadData();
  }

  // Kiểm tra token và tải dữ liệu công dân, vaccine
  checkTokenAndLoadData(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Bạn cần đăng nhập để tiếp tục!';
      return;
    }

    // Fetch citizens and vaccines concurrently
    forkJoin({
      citizens: this.citizensService.getCitizens(),
      vaccines: this.vaccineService.getVaccines()
    }).subscribe({
      next: (data) => {
        this.citizens = data.citizens;
        this.vaccines = data.vaccines;
      },
      error: (err) => {
        this.errorMessage = 'Không thể lấy danh sách công dân và vaccine.';
      }
    });
  }

  // Phương thức xác nhận thông tin trước khi gửi đăng ký
  validateForm(vaccinationForm: NgForm): boolean {
    const registrationDate = new Date(this.vaccination.registrationDate);
    const currentDate = new Date();

    if (!vaccinationForm.valid) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin!';
      return false;
    }

    if (registrationDate < currentDate) {
      this.errorMessage = 'Ngày đăng ký phải lớn hơn hoặc bằng ngày hiện tại!';
      return false;
    }

    return true;
  }

  // Phương thức gửi đăng ký tiêm
  onSubmit(vaccinationForm: NgForm): void {
    this.errorMessage = null;
    this.successMessage = null;
  
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Bạn cần đăng nhập để tiếp tục!';
      return;
    }
  
    // Kiểm tra hợp lệ form
    if (!this.validateForm(vaccinationForm)) {
      return;
    }
  
    // Gửi đăng ký tiêm
    this.registrationService.registerVaccination(this.vaccination).subscribe({
      next: () => {
        this.successMessage = 'Đăng ký tiêm thành công!';
        this.resetForm(vaccinationForm); // Reset form sau khi đăng ký thành công
      },
      error: (err) => {
        this.errorMessage = err.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      }
    });
  }

  // Phương thức reset form
  private resetForm(form: NgForm): void {
    form.resetForm();
    this.vaccination = {
      citizenId: '',
      vaccineId: '',
      registrationDate: '',
      location: ''
    };
  }
}
