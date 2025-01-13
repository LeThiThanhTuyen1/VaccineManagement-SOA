import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { RegistrationService } from '../../../service/registration.service';

@Component({
  selector: 'app-registration-list',
  standalone: false,
  
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.css']  // Đúng cú pháp
})
export class RegistrationListComponent implements OnInit {
  registrations: any[] = [];
  filteredRegistrations: any[] = [];
  errorMessage: string = '';
  token: string = '';
  isLoading: boolean = true;

  // Các biến bộ lọc
  filterDate: string = '';
  filterLocation: string = '';
  locations = [
    { name: 'Cơ sở 1 - Ghềnh Ráng', value: 'Cơ sở 1 - Ghềnh Ráng' },
    { name: 'Cơ sở 2 - Tây Sơn', value: 'Cơ sở 2 - Tây Sơn' }
  ];

  constructor(private authService: AuthService, 
              private registrationService: RegistrationService) { }

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Bạn cần đăng nhập để tiếp tục!';
      this.isLoading = false;
      return;
    }

    this.registrationService.getRegistrations(token).subscribe({
      next: (data) => {
        this.registrations = data;
        this.filteredRegistrations = data;  // Lưu dữ liệu ban đầu vào biến bộ lọc
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
      // Kiểm tra ngày nếu có bộ lọc
      const matchesDate = !this.filterDate || this.formatDate(new Date(registration.registrationDate)) === this.filterDate;

      // Kiểm tra địa điểm nếu có bộ lọc
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
}
