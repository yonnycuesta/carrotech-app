import { AfterViewInit, Component, OnInit } from '@angular/core';
import { User } from '../../../../../home/interfaces/auth/user-interface';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  user!: User;
  userId: string = '';

  constructor(private readonly sUser: UserService,
    private readonly route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.getData(this.userId);
      }
    })
  }

  getData(id: string) {
    this.sUser.getProfile(id).subscribe({
      next: (resp: any) => {
        this.user = resp;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}

