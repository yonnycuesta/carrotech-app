import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from '../../../../services/material.service';
import { HelperService } from '../../../../services/helper.service';

@Component({
  selector: 'app-material-form',
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
  ],
  templateUrl: './material-form.component.html',
  styleUrl: './material-form.component.scss'
})
export class MaterialFormComponent implements OnInit {

  _route = inject(ActivatedRoute);

  storeForm!: FormGroup;
  mId: string = '';
  isEdit: boolean = false;

  constructor(
    private readonly sMaterial: MaterialService,
    private readonly fb: FormBuilder,
    private readonly sHelper: HelperService,
    private readonly _router: Router

  ) {
    this.storeForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this._route.params.subscribe({
      next: (params) => {
        this.mId = params['id'];
        this.isEdit = this.mId ? true : false;
        if (this.isEdit) {
          this.getCarById(this.mId);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getCarById(id: string) {
    try {
      this.sMaterial.show(id).subscribe({
        next: (res: any) => {
          this.storeForm.patchValue(res);
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
      if (this.storeForm.invalid) {
        return;
      }
      this.storeForm.value.type = parseInt(this.storeForm.value.type);
      if (!this.isEdit) {
        this.sMaterial.store(this.storeForm.value).subscribe({
          next: (res: any) => {
            this.sHelper.successMessage('Registro Agregado', res.msg);
            this._router.navigate(['/materiales']);
          },
          error: (error) => {
            console.error('Error: ', error);
          }
        });
      } else {
        this.sMaterial.update(this.storeForm.value, this.mId).subscribe({
          next: (res: any) => {
            this.sHelper.successMessage('Registro Actualizado', res.msg);
            this._router.navigate(['/materiales']);
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
