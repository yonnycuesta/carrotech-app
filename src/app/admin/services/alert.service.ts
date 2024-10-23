import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertBoxComponent } from '../components/alert-box/alert-box.component';
import { map, Observable, take } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  dialogRef!: MatDialogRef<AlertBoxComponent>;

  constructor(private dialog: MatDialog) { }

  public open(options: any) {
    this.dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '400px',
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText,
        confirmText: options.confirmText
      },
    });
  }

  public confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(take(1), map(resp => {
      return resp;
    }
    ));
  }

}
