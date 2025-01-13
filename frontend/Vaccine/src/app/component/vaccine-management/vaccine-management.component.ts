import { Component, OnInit } from '@angular/core';
import { VaccineService } from '../../service/vaccine.service';
@Component({
  selector: 'app-vaccine-management',
  standalone: false,
  templateUrl: './vaccine-management.component.html',
  styleUrls: ['./vaccine-management.component.css'],
})
export class VaccineManagementComponent implements OnInit {
  vaccines: any[] = [];
  errorMessage: string = '';
  newVaccine = { name: '', description: '', dose: '' };
  editVaccine: any = null;

  constructor(private vaccineService: VaccineService) {}

  ngOnInit(): void {
    this.loadVaccines();
  }

  loadVaccines(): void {
    this.vaccineService.getVaccines().subscribe({
      next: (data) => {
        this.vaccines = data;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Lỗi tải danh sách vaccine. Vui lòng kiểm tra quyền truy cập.';
      },
    });
  }

  addVaccine(): void {
    this.vaccineService.addVaccine(this.newVaccine).subscribe({
      next: () => {
        this.loadVaccines();
        this.errorMessage = 'Thêm vaccine thành công.';
        this.newVaccine = { name: '', description: '', dose: '' }; // Reset form
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Không thể thêm vaccine.';
      },
    });
  }

  startEdit(vaccine: any): void {
    this.editVaccine = { ...vaccine }; // Copy vaccine to edit
  }

  updateVaccine(): void {
    if (!this.editVaccine) return;

    this.vaccineService.updateVaccine(this.editVaccine.id, this.editVaccine).subscribe({
      next: () => {
        this.loadVaccines();
        this.errorMessage = 'Cập nhật thành  thành công.';
        this.editVaccine = null;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Lỗi, không thể cập nhật vaccine.';
      },
    });
  }

  deleteVaccine(id: number): void {
    if (!confirm('Bạn có muốn xóa vaccine này không?')) {
      return; 
    }
  
    this.vaccineService.deleteVaccine(id).subscribe({
      next: (response) => {
        console.log(response);
        this.loadVaccines();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Lỗi! Không thể xóa vaccine. Vui lòng kiểm tra lại.';
      },
    });
    
  }
}
