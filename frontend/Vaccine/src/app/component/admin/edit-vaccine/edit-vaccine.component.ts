import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vaccine } from '../../../model/vaccine';
import { VaccineService } from '../../../service/vaccine.service';

@Component({
  selector: 'app-edit-vaccine',
  standalone: false,
  templateUrl: './edit-vaccine.component.html',
  styleUrls: ['./edit-vaccine.component.css'],
})
export class EditVaccineComponent implements OnInit {
  vaccine: Vaccine = {
    id: 0,
    name: '',
    manufacturer: '',
    expirationDate: '',
    quantity: 0,
    description: '',
    details: [],
  };

  errorMessage: string = '';

  constructor(
    private vaccineService: VaccineService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    if (id) {
      this.getVaccineById(id);
    }
  }

  // Lấy vaccine theo ID
  private getVaccineById(id: number): void {
    this.vaccineService.getVaccineById(id).subscribe({
      next: (data) => {
        this.vaccine = data;
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
    });
  }

  // Cập nhật vaccine
  updateVaccine(): void {
    this.vaccineService.updateVaccine(this.vaccine).subscribe({
      next: () => {
        alert('Cập nhật vaccine thành công!');
        this.router.navigate(['/vaccines']);
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
    });
  }

  cancelEdit() {
    this.router.navigate(['/vaccine-list']); // Điều hướng về trang danh sách
  }
}
