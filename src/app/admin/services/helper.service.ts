import { inject, Injectable } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { AvailabilityService } from './availability.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private readonly url: string = environment.apiURL;
  private readonly sAvailable = inject(AvailabilityService);

  dateNow = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  constructor(
    private _fileSaver: FileSaverService,
    private _http: HttpClient
  ) { }

  public successMessage(title: string, message: string) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      background: '#f4f6f9',
      customClass: {
        title: 'swal2-title-custom',
        popup: 'swal2-popup-custom'
      }
    });
  }


  saveToExcelFile(jsonData: any[], excelFileName: string) {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blobData: Blob = new Blob([excelBuffer], {
      type: EXCEL_TYPE,
    });
    this._fileSaver.save(
      blobData,
      excelFileName + '_' + this.dateNow + EXCEL_EXTENSION
    );
  }

  downloadItems(userID: string, order_number: string) {
    return this._http.get(`${this.url}orders-storage_manager/export-items/${userID}/${order_number}`).pipe(
      map((res: any) => res.data)
    );
  }

  checkAvailability(): Observable<boolean> {
    return this.sAvailable.getAvailability().pipe(
      map((resp) => {
        if (!resp) {
          return false;
        }

        const availability = resp;
        const startDate = new Date(availability.start_date);
        const endDate = new Date(availability.end_date);
        const now = new Date();

        if (now < startDate || now > endDate) {
          return false;
        }

        const dailyStartHour = availability.daily_start_hour;
        const dailyStartMinute = availability.daily_start_minute;
        const dailyEndHour = availability.daily_end_hour;
        const dailyEndMinute = availability.daily_end_minute;

        const todayStartTime = new Date();
        todayStartTime.setHours(dailyStartHour, dailyStartMinute, 0, 0);

        const todayEndTime = new Date();
        todayEndTime.setHours(dailyEndHour, dailyEndMinute, 0, 0);

        return now >= todayStartTime && now <= todayEndTime;
      }),
      catchError((error) => {
        console.error('Error al obtener la disponibilidad: ', error);
        return of(false);
      })
    );
  }


}
