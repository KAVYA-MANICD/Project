import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductService, ProductServiceService } from '../product-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-service-management',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule, HttpClientModule],
  templateUrl: './product-service-management.component.html',
  styleUrls: ['./product-service-management.component.css']
})
export class ProductServiceManagementComponent implements OnInit {
  productServices: ProductService[] = [];
  productServiceForm!: FormGroup;
  isModalOpen = false;
  isEditing = false;
  currentProductServiceId: number | null = null;

  constructor(
    private productServiceService: ProductServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productServiceForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });
    this.loadProductServices();
  }

  loadProductServices(): void {
    this.productServiceService.getProductServices().subscribe(data => {
      this.productServices = data;
    });
  }

  openModal(): void {
    this.isModalOpen = true;
    this.isEditing = false;
    this.productServiceForm.reset();
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  editProductService(productService: ProductService): void {
    this.isEditing = true;
    this.currentProductServiceId = productService.id!;
    this.productServiceForm.setValue({
      name: productService.name,
      price: productService.price
    });
    this.isModalOpen = true;
  }

  deleteProductService(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.productServiceService.deleteProductService(id).subscribe(() => {
        this.loadProductServices();
      });
    }
  }

  onSubmit(): void {
    if (this.productServiceForm.invalid) {
      return;
    }

    const productServiceData = this.productServiceForm.value;

    if (this.isEditing && this.currentProductServiceId) {
      this.productServiceService.updateProductService(this.currentProductServiceId, productServiceData).subscribe(() => {
        this.loadProductServices();
        this.closeModal();
      });
    } else {
      this.productServiceService.addProductService(productServiceData).subscribe(() => {
        this.loadProductServices();
        this.closeModal();
      });
    }
  }
}
