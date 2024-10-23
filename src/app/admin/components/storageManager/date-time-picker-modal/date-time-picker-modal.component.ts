import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-date-time-picker-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    NgxMatTimepickerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './date-time-picker-modal.component.html',
  styleUrl: './date-time-picker-modal.component.scss'
})
export class DateTimePickerModalComponent implements OnInit {

  selectedTime: string | null = null;
  selectedDate: Date | null = null;

  constructor(
    public dialogRef: MatDialogRef<DateTimePickerModalComponent>
  ) { }

  ngOnInit(): void {
    this.selectedDate = new Date();
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.selectedTime) {
      const dateString = new Date().toISOString().split('T')[0];
      const dateTimeIn24HourFormat = this.convertTo24HourDateTimeFormat(dateString, this.selectedTime);
      this.dialogRef.close(dateTimeIn24HourFormat);

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, seleccione una fecha y hora válida',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  }


  convertTo24HourDateTimeFormat(date: string, time: string): string {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);


    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    const formattedTime = this.formatToTwoDigits(hours) + ':' + this.formatToTwoDigits(minutes) + ':00'; // Añadir los segundos

    return `${date}T${formattedTime}`;
  }

  formatToTwoDigits(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }
}
