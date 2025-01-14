import { Component, OnInit } from '@angular/core';
import { CitizensService } from '../../../service/citizens.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-management',
  standalone: false,
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent implements OnInit {
  
  citizens: any[] = []; // Array to store filtered citizen data
  originalCitizens: any[] = []; // Array to store the original, unfiltered citizen data
  targetGroups: { name: string; displayName: string }[] = [
    { name: 'CHILD', displayName: 'CHILD' },
    { name: 'OTHER', displayName: 'OTHER' },
    { name : 'ELDERLY', displayName : 'ELDERLY'},
    { name : 'PREGNANT_WOMEN' , displayName  : 'PREGNANT_WOMEN'}

  ]; // List of target groups for the dropdown
  selectedGroup: string = ''; // Variable to hold the selected group
  message: string | null = null; // Success message placeholder
  noDataMessage: string | null = null; // Message for no data found

  constructor(private citizenService: CitizensService, private router: Router) {}

  ngOnInit(): void {
    this.fetchCitizens();
  }

  /**
   * Fetch all citizens from the server
   */
  fetchCitizens(): void {
    this.citizenService.getCitizens().subscribe(
      (data) => {
        this.citizens = data;
        this.originalCitizens = [...data]; // Store a copy of the original data
        console.log(this.citizens);
      },
      (error) => {
        console.error('Error fetching citizens:', error);
      }
    );
  }

  /**
   * Handle group change and filter citizens
   */
  onGroupChange(): void {
    if (this.selectedGroup) {
      // Filter citizens based on selected group
      this.citizens = this.originalCitizens.filter(
        (citizen) => citizen.targetGroup === this.selectedGroup
      );
      // Check if no data is found
      this.noDataMessage = this.citizens.length === 0 ? 'Không có công dân nào thuộc nhóm này.' : null;
    } else {
      // Show all citizens if no group is selected
      this.citizens = [...this.originalCitizens];
      this.message = null;
      this.noDataMessage = null;
    }
  }

  /**
   * Add a new citizen (placeholder)
   */
  addCitizen(): void {
    console.log("Add Citizen clicked");
    // Implement the logic to add a new citizen here
  }

  /**
   * Edit citizen (placeholder)
   */
  editCitizen(citizenId: string): void {
    console.log("Edit Citizen with ID:", citizenId);
    this.router.navigate(['/edit-management', citizenId]);

    // Implement the logic to edit the citizen
  }

  /**
   * Delete citizen (placeholder)
   */
  deleteCitizen(citizenId: number): void {
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa công dân này không?');
    if (confirmDelete) {
      this.citizenService.deleteCitizen(citizenId).subscribe(
        () => {
          // Xóa công dân khỏi danh sách trên giao diện
          this.citizens = this.citizens.filter(citizen => citizen.id !== citizenId);
          this.originalCitizens = this.originalCitizens.filter(citizen => citizen.id !== citizenId);
        },
        (error) => {
          console.error('Lỗi khi xóa công dân:', error);
          this.message = 'Có lỗi xảy ra khi xóa công dân!';
        }
      );
    }
}
}
