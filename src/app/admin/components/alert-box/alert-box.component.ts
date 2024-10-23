import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-box',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatDialogTitle],
  templateUrl: './alert-box.component.html',
  styleUrl: './alert-box.component.scss'
})
export class AlertBoxComponent implements OnInit{

    constructor(@Inject(MAT_DIALOG_DATA) public data: {
      cancelText: string,
      confirmText: string,
      message: string,
      title: string
    },private mdDialogRef: MatDialogRef<AlertBoxComponent>) { }

    ngOnInit(): void {
    }

    public cancel() {
      this.mdDialogRef.close(false);
    }

    public confirm() {
      this.mdDialogRef.close(true);
    }
}
