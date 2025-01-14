import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../service/registration.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-registration-list',
  standalone: false,
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.css']
})
export class RegistrationListComponent implements OnInit {
  registrations: any[] = [];
  filteredRegistrations: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  // Các biến bộ lọc
  filterDate: string = '';
  filterLocation: string = '';
  locations = [
    { name: 'Cơ sở 1 - Ghềnh Ráng', value: 'Cơ sở 1 - Ghềnh Ráng' },
    { name: 'Cơ sở 2 - Tây Sơn', value: 'Cơ sở 2 - Tây Sơn' }
  ];

  constructor(private registrationService: RegistrationService) {}

  ngOnInit(): void {
    this.loadRegistrations(); 
  }

  // Phương thức tải lại dữ liệu đăng ký từ API
  loadRegistrations(): void {
    this.isLoading = true;
    this.registrationService.getRegistrations().subscribe({
      next: (data) => {
        this.registrations = data;
        this.filteredRegistrations = data;  
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Không thể lấy danh sách đăng ký tiêm.';
        this.isLoading = false;
      }
    });
  }

  // Hàm áp dụng bộ lọc
  applyFilters(): void {
    this.filteredRegistrations = this.registrations.filter(registration => {
      const matchesDate = !this.filterDate || this.formatDate(new Date(registration.registrationDate)) === this.filterDate;
      const matchesLocation = !this.filterLocation || registration.location === this.filterLocation;
      return matchesDate && matchesLocation;
    });
  }

  // Hàm format ngày để so sánh chỉ ngày
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;  // Trả về định dạng yyyy-MM-dd
  }

  // Hàm reset bộ lọc
  resetFilters(): void {
    this.filterDate = '';
    this.filterLocation = '';
    this.filteredRegistrations = this.registrations; 
  }

  // Phương thức hoàn thành đăng ký
  completeRegistration(registrationId: number): void {
    this.handleRegistrationAction(
      registrationId,
      () => this.registrationService.completeVaccination(registrationId),
      'Hoàn thành đăng ký thành công!',
      'Không thể hoàn thành đăng ký. Vui lòng thử lại.'
    );
  }
  
  // Phương thức hủy đăng ký
  cancelRegistration(registrationId: number): void {
    this.handleRegistrationAction(
      registrationId,
      () => this.registrationService.cancelVaccination(registrationId),
      'Hủy đăng ký thành công!',
      'Không thể hủy đăng ký. Vui lòng thử lại.'
    );
  }

  // Xử lý logic chung cho hoàn thành hoặc hủy đăng ký
  private handleRegistrationAction(
    registrationId: number,
    action: () => Observable<any>,
    successMessage: string,
    errorMessage: string
  ): void {
    action().subscribe({
      next: (response) => {
        console.log(successMessage, response);
        alert(response.message || successMessage);
        this.loadRegistrations();  
      },
      error: (err) => {
        console.error('Lỗi khi xử lý đăng ký:', err);
        alert(err.error.message || errorMessage);
      }
    });
  }
}
