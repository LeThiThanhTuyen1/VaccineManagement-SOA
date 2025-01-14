import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CitizensService } from '../../../service/citizens.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Citizen } from '../../../model/citizen.model';
import { ProvinceService } from '../../../service/province.service';
import { DistrictService } from '../../../service/district.service';
import { WardService } from '../../../service/ward.service';

@Component({
  selector: 'app-edit-management',
  standalone: false,
  templateUrl: './edit-management.component.html',
  styleUrls: ['./edit-management.component.css']
})
export class EditManagementComponent implements OnInit {
  editingCitizen: Citizen = {
    id: 0,
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    fullAddress: '',
    targetGroup: '',
    provinceId: 0,
    districtId: 0,
    wardId: 0,
    addressDetail: '',
  };

  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];

  constructor(
    private citizensService: CitizensService,
    private provinceService: ProvinceService,
    private districtService: DistrictService,
    private wardService: WardService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Fetch provinces when component loads
    this.provinceService.getProvinces().subscribe((data) => {
      this.provinces = data;
    });

    // Get citizen ID from the URL for editing
    const citizenId = this.route.snapshot.paramMap.get('id');
    console.log('Citizen ID from route:', citizenId);

    if (citizenId) {
      this.loadCitizenData(+citizenId); // Load citizen data using the ID
    } else {
      console.error('Citizen ID not found in the route');
    }
  }

  loadCitizenData(id: number): void {
    this.citizensService.getCitizenById(id).subscribe(
      (citizen) => {
        if (citizen) {
          this.editingCitizen = { ...citizen }; // Ensure we have all citizen data
          this.editingCitizen.dateOfBirth = this.formatDate(this.editingCitizen.dateOfBirth);
  
          // Check if the wardId is valid and assign it correctly
          console.log('Citizen Ward ID:', citizen.wardId); // Log the wardId from citizen data
  
          this.onProvinceChange(); // Fetch districts
          this.onDistrictChange(); // Fetch wards
        }
      },
      (error) => {
        console.error('Error fetching citizen data:', error);
      }
    );
  }
   

// Format the date in yyyy-MM-dd format
formatDate(date: string): string {
  if (!date) return ''; // Handle case where date is null or undefined
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2); // Ensure 2-digit month
  const day = ('0' + d.getDate()).slice(-2); // Ensure 2-digit day
  return `${year}-${month}-${day}`; // Return formatted date
}


  // Fetch districts based on selected province
onProvinceChange(): void {
  const selectedProvinceId = this.editingCitizen.provinceId;
  if (selectedProvinceId) {
    // Tải danh sách quận theo tỉnh
    this.districtService.getDistrictsByProvince(selectedProvinceId).subscribe((data) => {
      this.districts = data;

      // Sau khi chọn tỉnh, reset các giá trị của district và ward
      this.editingCitizen.districtId = this.editingCitizen.districtId || 0; // Nếu không có giá trị districtId, gán mặc định
      this.editingCitizen.wardId = 0; // Reset wardId về 0 khi tỉnh thay đổi
      this.wards = []; // Clear wards khi thay đổi tỉnh
    });
  }
}

// Fetch wards based on selected district
onDistrictChange(): void {
  const selectedDistrictId = this.editingCitizen.districtId;
  if (selectedDistrictId) {
    // Tải danh sách xã theo quận
    this.wardService.getWardsByDistrict(selectedDistrictId).subscribe((data) => {
      // After wards are fetched
this.wards = data;
console.log('Wards:', this.wards); // Check the wards array
console.log('Selected Ward ID:', this.editingCitizen.wardId); // Check the selected ward ID

      console.log('Wards:', this.wards); // Debugging line

      // Trigger change detection manually
      this.cdRef.detectChanges();
    });
  }
}
trackByWardId(index: number, ward: any): number {
  return ward.id; // Return the ward ID as the unique identifier
}


  // Update citizen information
  updateCitizen(): void {
    // Ensure the model contains the updated data
    console.log('Updated Citizen Data:', this.editingCitizen);
  
    // Call the service to update the citizen's details using the IDs and other data
    this.citizensService.updateCitizen(this.editingCitizen.id, this.editingCitizen).subscribe(
      (response) => {
        console.log('Citizen Updated:', response);
        this.router.navigate(['/management']); // Redirect to citizens list page after successful update
      },
      (error) => {
        console.error('Error updating citizen:', error);
      }
    );
  }
}
