import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VaccineService } from '../../../service/vaccine.service';
import { Vaccine } from '../../../model/vaccine';

@Component({
  selector: 'app-vaccine-details',
   standalone: false,
  templateUrl: './vaccine-details.component.html',
  styleUrls: ['./vaccine-details.component.css']
})
export class VaccineDetailsComponent implements OnInit {
  vaccine: Vaccine | null = null;
  errorMessage: string = '';

  constructor(
    private vaccineService: VaccineService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const vaccineId = Number(this.route.snapshot.paramMap.get('id'));
    if (vaccineId) {
      this.getVaccineDetails(vaccineId);
    }
  }

  // Lấy chi tiết vaccine theo ID
  getVaccineDetails(id: number): void {
    this.vaccineService.getVaccineById(id).subscribe({
      next: (data) => {
        this.vaccine = data;
        console.log(this.vaccine);
      },
      error: (error) => {
        this.errorMessage = `Lỗi: ${error.message || 'Không thể lấy chi tiết vaccine.'}`;
      }
    });
  }

  cancelDetail() {
    this.router.navigate(['/vaccine-list']); // Điều hướng về trang danh sách
  }
}
