import { Component, OnInit } from '@angular/core';
import { ProvinceService } from '../../../service/province.service';
import { DistrictService } from '../../../service/district.service';
import { WardService } from '../../../service/ward.service';
import { HttpClient } from '@angular/common/http';
import { CitizensService } from '../../../service/citizens.service';
import { Citizen } from '../../../model/citizen.model';

@Component({
  selector: 'app-add-management',
  standalone: false,
  
  templateUrl: './add-management.component.html',
  styleUrl: './add-management.component.css'
})
export class AddManagementComponent implements OnInit {
  showAddForm: boolean = false;
  newCitizen: Citizen = {
    id: 0,
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    fullAddress: '',
    targetGroup: '',
    provinceId: 0,
    districtId: 0,
    wardId: 0,
    addressDetail :'',
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
    private wardService: WardService,
    private provinceService: ProvinceService,
    private districtService: DistrictService
  ) {}

  ngOnInit() {
    // Fetch provinces on component load
    this.provinceService.getProvinces().subscribe((data) => {
      this.provinces = data;
    });
  }

  // Get districts based on selected province
  onProvinceChange() {
    const selectedProvinceId = this.newCitizen.provinceId;
    console.log(selectedProvinceId);
    if (selectedProvinceId) {
      this.districtService.getDistrictsByProvince(selectedProvinceId).subscribe((data) => {
        this.districts = data;
        this.wards = []; // Clear wards when province changes
      });
    }
  }

  // Get wards based on selected district
  onDistrictChange() {
    const selectedDistrictId = this.newCitizen.districtId;
    if (selectedDistrictId) {
      this.wardService.getWardsByDistrict(selectedDistrictId).subscribe((data) => {
        this.wards = data;
      });
    }
  }

  // Form submission method to add new citizen
  addNewCitizen(): void {
    this.citizensService.addCitizen(this.newCitizen).subscribe((response) => {
      console.log('New Citizen Added:', response);
      alert('Thêm thông tin công dân thành công');
      this.resetForm();
    }, error => {
      console.error('Error adding citizen:', error);
    });
  }

  // Reset the form after successful submission
  resetForm(): void {
  
    this.newCitizen = {
      id : 0,
      fullName: '',
      dateOfBirth: '',
      phoneNumber: '',
      fullAddress: '',
      targetGroup: '',
      provinceId: 0,
      districtId: 0,
      wardId: 0,
      addressDetail :'',
    };
    this.showAddForm = false; // Close form after submission
  }
}