import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { AvailabilityService } from '../../../services/availability.service';
import { HelperService } from '../../../services/helper.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-available-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,
    MatDatepickerModule
  ],
  templateUrl: './available-config.component.html',
  styleUrl: './available-config.component.scss'
})
export class AvailableConfigComponent implements OnInit {

  startDate = new FormControl();
  endDate = new FormControl();

  dailyStartHour = new FormControl();
  dailyStartMinute = new FormControl();
  dailyEndHour = new FormControl();
  dailyEndMinute = new FormControl();

  isAvailable: boolean = false;

  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  minutes: number[] = [0, 15, 30, 45];


  constructor(
    private readonly sAvailable: AvailabilityService,
    private readonly sHelper: HelperService
  ) {

  }

  ngOnInit(): void {
    this.loadAvailability();

  }


  saveAvailability() {

    const availability = {
      startDate: this.startDate.value,
      endDate: this.endDate.value,
      dailyStartHour: this.dailyStartHour.value,
      dailyStartMinute: this.dailyStartMinute.value,
      dailyEndHour: this.dailyEndHour.value,
      dailyEndMinute: this.dailyEndMinute.value,
    };

    try {
      this.sAvailable.storage(availability).subscribe({
        next: (resp) => {
          this.checkAvailability();
          Swal.fire({
            title: 'Disponibilidad diaria guardada correctamente.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            title: 'Error al guardar la disponibilidad diaria.',
            icon: 'error',
            showConfirmButton: true,
          });
        }
      })
    } catch (error) {
      console.error(error);
      alert('Error al guardar la disponibilidad diaria.');
      return;
    }

  }

  loadAvailability() {
    this.sAvailable.getAvailability().subscribe({
      next: (resp) => {
        if (resp) {
          this.startDate.setValue(new Date(resp.start_date));
          this.endDate.setValue(new Date(resp.end_date));
          this.dailyStartHour.setValue(resp.daily_start_hour);
          this.dailyStartMinute.setValue(resp.daily_start_minute);
          this.dailyEndHour.setValue(resp.daily_end_hour);
          this.dailyEndMinute.setValue(resp.daily_end_minute);
          this.checkAvailability();
        }
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  checkAvailability() {
    this.sHelper.checkAvailability().subscribe((isAvailable) => {
      this.isAvailable = isAvailable;
    });
  }
}
