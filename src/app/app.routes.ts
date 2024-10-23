import { Routes } from '@angular/router';
import { DashboardCalendarComponent } from './admin/components/dashboard-calendar/dashboard-calendar.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { UserPageComponent } from './admin/components/users/user-page/user-page.component';
import { NavbarComponent } from './admin/shared/navbar/navbar.component';
import { LoginViewComponent } from './home/auth/login-view/login-view.component';
import { PasswordForgotComponent } from './home/auth/password-forgot/password-forgot.component';
import { RegisterViewComponent } from './home/auth/register-view/register-view.component';
import { CarFormComponent } from './admin/components/admin/cars/car-form/car-form.component';
import { CarPageComponent } from './admin/components/admin/cars/car-page/car-page.component';
import { ChatPageComponent } from './admin/components/admin/chat-page/chat-page.component';
import { MaterialFormComponent } from './admin/components/admin/material/material-form/material-form.component';
import { MaterialComponent } from './admin/components/admin/material/material.component';
import { OrderAdminComponent } from './admin/components/admin/order-admin/order-admin.component';
import { UserProfileComponent } from './admin/components/admin/profile/user-profile/user-profile.component';
import { AuthLogComponent } from './admin/components/admin/security/auth-log/auth-log.component';
import { NotificationListComponent } from './admin/components/notification-list/notification-list.component';
import { OrderDetailComponent } from './admin/components/storageManager/order-detail/order-detail.component';
import { OrderPageComponent } from './admin/components/storageManager/order-page/order-page.component';
import { OrderScheduleComponent } from './admin/components/storageManager/order-schedule/order-schedule.component';
import { OrderCreateComponent } from './admin/staff/components/order-create/order-create.component';
import { OrderItemFormComponent } from './admin/staff/components/order-item-form/order-item-form.component';
import { OrderListComponent } from './admin/staff/components/order-list/order-list.component';
import { isNotAuthenticatedGuard } from './home/guards/is-not-authenticated.guard';
import { isAuthenticatedGuard } from './home/guards/is-authenticated.guard';
import { OrderOpenendComponent } from './admin/components/storageManager/order-openend/order-openend.component';
import { OrderApprovedComponent } from './admin/components/storageManager/order-approved/order-approved.component';
import { OrderCompletedComponent } from './admin/components/storageManager/order-completed/order-completed.component';
import { OrderListOpenendComponent } from './admin/staff/components/order-list/order-list-openend/order-list-openend.component';
import { OrderListApprovedComponent } from './admin/staff/components/order-list/order-list-approved/order-list-approved.component';
import { OrderListCompletedComponent } from './admin/staff/components/order-list/order-list-completed/order-list-completed.component';
import { ApprovedComponent } from './admin/components/supervisor/approved/approved.component';
import { RejectedComponent } from './admin/components/supervisor/rejected/rejected.component';


export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    canActivate: [isAuthenticatedGuard],
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'ordenes_programadas',
        component: DashboardCalendarComponent,
      },
      {
        path: 'usuarios',
        component: UserPageComponent,
      },
      {
        path: 'chat',
        component: ChatPageComponent
      },
      {
        path: 'perfil/:id',
        component: UserProfileComponent,
      },
      {
        path: 'order_create',
        component: OrderCreateComponent,
      },
      {
        path: 'order_staff',
        component: OrderListComponent,
      },
      {
        path: 'order_items_add/:norder/:id',
        component: OrderItemFormComponent,
      },
      {
        path: 'order_manager',
        component: OrderPageComponent,
      },
      {
        path: 'order_manager/detail/:id',
        component: OrderDetailComponent,
      },
      {
        path: 'order_admin',
        component: OrderAdminComponent,
      },
      {
        path: 'ordenes_abiertas/:id',
        component: OrderOpenendComponent,
      },
      {
        path: 'ordenes_aprobadas/:id',
        component: OrderApprovedComponent,
      },
      {
        path: 'ordenes_completadas/:id',
        component: OrderCompletedComponent,
      },
      {
        path: 'ordenes_abiertas/staff/:id',
        component: OrderListOpenendComponent,
      },
      {
        path: 'ordenes_aprobadas/staff/:id',
        component: OrderListApprovedComponent,
      },
      {
        path: 'ordenes_completadas/staff/:id',
        component: OrderListCompletedComponent,
      },
      {
        path: 'ordenes_por_aprobar',
        component: ApprovedComponent,
      },
      {
        path: 'ordenes_rechazadas',
        component: RejectedComponent,
      },
      {
        path: 'order_schedule/:id',
        component: OrderScheduleComponent,
      },
      {
        path: 'carros',
        component: CarPageComponent,
      },
      {
        path: 'carro_agregar',
        component: CarFormComponent,
      },
      {
        path: 'carro_editar/:id',
        component: CarFormComponent,
      },
      {
        path: 'auth_logs',
        component: AuthLogComponent,
      },
      {
        path: 'notificaciones',
        component: NotificationListComponent,
      },
      {
        path: 'materiales',
        component: MaterialComponent,
      },
      {
        path: 'material_agregar',
        component: MaterialFormComponent,
      },
      {
        path: 'material_editar/:id',
        component: MaterialFormComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginViewComponent,
    canActivate: [isNotAuthenticatedGuard]
  },
  {
    path: 'create_account',
    component: RegisterViewComponent,
    canActivate: [isNotAuthenticatedGuard]
  },
  {
    path: 'password_reset',
    component: PasswordForgotComponent,
    canActivate: [isNotAuthenticatedGuard]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },

];
