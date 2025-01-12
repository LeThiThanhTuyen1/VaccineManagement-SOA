import { Component, OnInit } from '@angular/core';
import { VaccineService } from '../../service/vaccine.service';
@Component({
  selector: 'app-vaccines-list',
  standalone: false,

  templateUrl: './vaccines-list.component.html',
  styleUrl: './vaccines-list.component.css'
})
export class VaccinesListComponent implements OnInit {
  vaccines: any[] = [];
  displayedColumns: string[] = ['name', 'manufacturer', 'quantity', 'description'];
  dataSource: any[] = [];
  constructor(private vaccineService: VaccineService) { }

  ngOnInit(): void {
    this.vaccineService.getVaccines().subscribe((data: any[]) => {
      this.dataSource = data;  // Assign the data to the dataSource
    });
  }

  deleteVaccine(id: number): void {
    if (confirm('Bạn có chắc muốn xóa không?')) {
      this.vaccineService.deleteVaccine(id).subscribe(() => {
        this.vaccines = this.vaccines.filter((v) => v.id !== id);
      });
    }
  }

  viewDetails(id: number): void {
    // Điều hướng tới trang chi tiết
  }
}
