import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { CarService } from '../../../../services/car.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserService } from '../../../../services/user.service';
import { HelperService } from '../../../../services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.scss'
})
export class CarFormComponent implements OnInit {

  _route = inject(ActivatedRoute);

  carForm!: FormGroup;
  staffes: any;
  cardId: string = '';

  isEdit: boolean = false;

  constructor(
    private readonly sCar: CarService,
    private readonly fb: FormBuilder,
    private readonly sUser: UserService,
    private readonly sHelper: HelperService,
    private readonly _router: Router

  ) {
    this.carForm = this.fb.group({
      user_id: ['', [Validators.required]],
      plate: ['', [Validators.required, Validators.maxLength(7)]],
      model: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      color: ['', [Validators.required]],
      capacity: [0],
      assigned_date: [Date, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this._route.params.subscribe({
      next: (params) => {
        this.cardId = params['id'];
        this.isEdit = this.cardId ? true : false;
        if (this.isEdit) {
          this.getCarById(this.cardId);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.getStaffs();
  }

  getStaffs() {
    try {
      this.sUser.indexStorageManagers().subscribe({
        next: (res) => {
          this.staffes = res;
        },
        error: (error) => {
          console.error(error);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  getCarById(id: string) {
    try {
      this.sCar.show(id).subscribe({
        next: (res: any) => {
          this.carForm.patchValue(res);
        },
        error: (error) => {
          console.error('Error: ', error);
        }
      });
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  onSave() {
    try {
      if (this.carForm.invalid) {
        return;
      }
      if (!this.isEdit) {
        this.sCar.store(this.carForm.value).subscribe({
          next: (res: any) => {
            this.sHelper.successMessage('Registro Agregado', res.msg);
            this._router.navigate(['/carros']);
          },
          error: (error) => {
            console.error('Error: ', error);
          }
        });
      } else {
        this.sCar.update(this.cardId, this.carForm.value).subscribe({
          next: (res: any) => {
            this.sHelper.successMessage('Registro Actualizado', res.msg);
            this._router.navigate(['/carros']);
          },
          error: (error) => {
            console.error('Error: ', error);
          }
        });
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  goBack(): void {
    // window.history.back();
  }
}
