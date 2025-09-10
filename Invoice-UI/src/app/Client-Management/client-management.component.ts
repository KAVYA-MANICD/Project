import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, NavbarComponent, FormsModule],
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
})
export class ClientManagementComponent implements OnInit {
proceedWithInvoiceCreation() {
throw new Error('Method not implemented.');
}
isWarningModalOpen: any;
warningMessage: any;
closeWarningModal() {
throw new Error('Method not implemented.');
}
  clientForm!: FormGroup;
  clients: any[] = [];
  filteredClients: any[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  isModalOpen = false;
  isEditing = false;
  currentClientId: number | null = null;
  countries: string[] = ['India', 'USA', 'UK', 'Canada', 'Australia'];
  searchText = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadClients();
  }

  initializeForm() {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      billingAddress: ['', Validators.required],
      shippingAddress: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: [''],
      zipCode: [''],
      taxId: ['']
    });
  }

  loadClients() {
    this.http.get<any[]>('http://localhost:8080/clients/all').subscribe({
      next: (response) => {
        this.clients = response;
        this.filteredClients = response;
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.errorMessage = 'Failed to load clients';
      }
    });
  }

  filterClients() {
    const searchText = this.searchText.toLowerCase();
    this.filteredClients = this.clients.filter(client => {
      return client.name.toLowerCase().includes(searchText) ||
             client.companyName.toLowerCase().includes(searchText);
    });
  }

  openModal() {
    this.isModalOpen = true;
    this.isEditing = false;
    this.currentClientId = null;
    this.clientForm.reset();
  }

  closeModal() {
    this.isModalOpen = false;
    this.clientForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }

  editClient(client: any) {
    this.isEditing = true;
    this.currentClientId = client.id;
    this.clientForm.patchValue(client);
    this.isModalOpen = true;
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.loading = true;
      const clientData = this.clientForm.value;

      if (this.isEditing && this.currentClientId) {
        this.http.put(`http://localhost:8080/clients/${this.currentClientId}`, clientData)
          .subscribe({
            next: (response) => {
              this.successMessage = 'Client updated successfully!';
              this.loading = false;
              this.loadClients();
              this.closeModal();
            },
            error: (err) => {
              this.errorMessage = 'Failed to update client';
              this.loading = false;
            }
          });
      } else {
        this.http.post('http://localhost:8080/clients/add', clientData)
          .subscribe({
            next: (response) => {
              this.successMessage = 'Client created successfully!';
              this.loading = false;
              this.loadClients();
              this.closeModal();
            },
            error: (err) => {
              this.errorMessage = 'Failed to create client';
              this.loading = false;
            }
          });
      }
    }
  }

  deleteClient(id: number) {
    if (confirm('Are you sure you want to delete this client?')) {
      this.http.delete(`http://localhost:8080/clients/${id}`).subscribe({
        next: () => {
          this.successMessage = 'Client deleted successfully';
          this.loadClients();
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.errorMessage = 'Failed to delete client';
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  isListening = false;

  voiceSearch(): void {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        this.isListening = true;
      };

      recognition.onend = () => {
        this.isListening = false;
      };

      recognition.onresult = (event: any) => {
    let transcript: string = event.results[0][0].transcript;

    // Remove trailing dot (.) if it exists
    transcript = transcript.replace(/\.$/, '');

    this.searchText = transcript;
    this.filterClients();
};


      recognition.start();
    } else {
      alert('Voice recognition is not supported in your browser.');
    }
  }
}
