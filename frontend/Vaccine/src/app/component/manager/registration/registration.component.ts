import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../service/registration.service';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { VaccineService } from '../../../service/vaccine.service';
import { CitizensService } from '../../../service/citizens.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: false,
  
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit{
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
    private vaccinationService: RegistrationService,
    private authService: AuthService,
    private vaccineService: VaccineService,
    private citizensService: CitizensService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Bạn cần đăng nhập để tiếp tục!';
      return;
    }

    // Fetch the citizens list
    this.citizensService.getCitizens(token).subscribe({
      next: (data) => {
        this.citizens = data;
      },
      error: (err) => {
        this.errorMessage = 'Không thể lấy danh sách công dân.';
      }
    });

    // Fetch the vaccines list
    this.vaccineService.getVaccines(token).subscribe({
      next: (data) => {
        this.vaccines = data;
      },
      error: (err) => {
        this.errorMessage = 'Không thể lấy danh sách vaccine.';
      }
    });
  }

  // Method to submit vaccination registration
  onSubmit(vaccinationForm: NgForm): void {
    this.errorMessage = null;
    this.successMessage = null;
  
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Bạn cần đăng nhập để tiếp tục!';
      return;
    }
  
    // Kiểm tra nếu ngày đăng ký nhỏ hơn ngày hiện tại
    const currentDate = new Date();
    const registrationDate = new Date(this.vaccination.registrationDate);
  
    // Đảm bảo ngày đăng ký không lớn hơn ngày hiện tại
    if (registrationDate < currentDate) {
      this.errorMessage = 'Ngày đăng ký phải lớn hơn hoặc bằng ngày hiện tại!';
      return;
    }
  
    // Validate form
    if (!vaccinationForm.valid) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin!';
      return;
    } else {
      this.vaccinationService.registerVaccination(this.vaccination, token).subscribe({
        next: () => {
          this.successMessage = 'Đăng ký tiêm thành công!';
          this.errorMessage = '';
  
          // Reset form và đối tượng vaccination
          vaccinationForm.resetForm();
          this.vaccination = {
            citizenId: '',
            vaccineId: '',
            registrationDate: '',
            location: ''
          };
        },
        error: (err) => {
          this.errorMessage = err.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
        }
      });
    }
  }  
}