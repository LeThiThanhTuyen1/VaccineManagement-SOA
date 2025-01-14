import { Component, OnInit } from '@angular/core';
import { VaccineService } from '../../../service/vaccine.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vaccine-list',
  standalone: false,
  templateUrl: './vaccine-list.component.html',
  styleUrls: ['./vaccine-list.component.css']
})
export class VaccineListComponent implements OnInit {
  vaccines: any[] = [];
  searchTerm: string = '';
  errorMessage: string = '';
  isLoading: boolean = true;
  constructor(private vaccineService: VaccineService, private router: Router) {}

  ngOnInit(): void {
    this.getVaccines();
  }
  
  getVaccines(): void {
    this.isLoading = true;
    this.vaccineService.getVaccines().subscribe((data) => {
      this.vaccines = data;
      this.isLoading = false;
    });
  }

  searchVaccines(): void {
    if (!this.searchTerm.trim()) {
      this.handleError("Vui lòng nhập tên tìm kiếm");
      return;
    }

    this.errorMessage = '';
    this.vaccineService.searchVaccines(this.searchTerm).subscribe({
      next: (data) => {
        this.vaccines = data;
      },
      error: () => {
        this.handleError("Không tìm thấy vaccine tương ứng!");
      }
    });
  }
  viewDetails(id: number): void {
    this.router.navigate([`/vaccine-details/${id}`]);
  }

  editVaccine(id: number): void {
    this.router.navigate([`/edit-vaccine/${id}`]);
  }

  deleteVaccine(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa vaccine này không?')) {
      this.vaccineService.deleteVaccine(id).subscribe({
        next: (response) => {
          // Sau khi xóa thành công, lấy danh sách vaccine mới
          this.showSuccess('Xóa thành công.');
          this.getVaccines();
        },
        error: (error) => {
          console.error('Lỗi khi xóa vaccine:', error); // Log chi tiết lỗi
          this.handleError(error.error?.message || 'Xóa thất bại.');
        }        
      });
    }
  }  
  
  private handleError(message: string): void {
    this.errorMessage = message;
    console.error(message);
    alert(message); // Hiển thị thông báo lỗi
  }
  
  private showSuccess(message: string): void {
    this.errorMessage = '';
    alert(message); // Hiển thị thông báo thành công
  }
}  