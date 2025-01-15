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
  targetGroups = [
    { name: 'CHILD', displayName: 'CHILD' },
    { name: 'OTHER', displayName: 'OTHER' },
    { name : 'ELDERLY', displayName : 'ELDERLY'},
    { name : 'PREGNANT_WOMEN' , displayName  : 'PREGNANT_WOMEN'}
    // Add more options here as needed
  ];
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
          // Gán thông tin của công dân cho đối tượng editingCitizen
          this.editingCitizen = { ...citizen }; 
          this.editingCitizen.dateOfBirth = this.formatDate(this.editingCitizen.dateOfBirth);
        
          // Tải các quận/huyện theo tỉnh của công dân
          this.onProvinceChange();
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
      this.districtService.getDistrictsByProvince(selectedProvinceId).subscribe((districts) => {
        this.districts = districts;
  
        // Đảm bảo districtId tồn tại, nếu không có thì đặt giá trị mặc định
        this.editingCitizen.districtId = this.editingCitizen.districtId || 0;
  
        // Sau khi tải danh sách quận/huyện, gọi hàm để tải xã/phường
        this.onDistrictChange();
      });
    }
  }
  
  onDistrictChange(): void {
    const selectedDistrictId = this.editingCitizen.districtId;
    if (selectedDistrictId) {
      this.wardService.getWardsByDistrict(selectedDistrictId).subscribe((wards) => {
        this.wards = wards;
  
        // Đảm bảo wardId tồn tại, nếu không có thì đặt giá trị mặc định
        this.editingCitizen.wardId = this.editingCitizen.wardId || 0;
  
        // Thực hiện change detection để cập nhật view
        this.cdRef.detectChanges();
      });
    }
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
