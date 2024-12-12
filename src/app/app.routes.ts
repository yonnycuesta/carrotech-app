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
import { StatusPageComponent } from './admin/components/admin/status-page/status-page.component';
import { OrderPrecompletedComponent } from './admin/components/storageManager/order-precompleted/order-precompleted.component';
import { OrderFormEditComponent } from './admin/components/admin/order-admin/order-form-edit/order-form-edit.component';
import { OrderListPendingComponent } from './admin/staff/components/order-list/order-list-pending/order-list-pending.component';
import { OrderListWopenendComponent } from './admin/components/warehouses/order-list-wopenend/order-list-wopenend.component';
import { OrderListCwopenendComponent } from './admin/components/warehouses/cars/order-list-cwopenend/order-list-cwopenend.component';
import { OrderListCwapprovedComponent } from './admin/components/warehouses/cars/order-list-cwapproved/order-list-cwapproved.component';
import { OrderCarApprovedComponent } from './admin/components/warehouses/cars/order-car-approved/order-car-approved.component';
import { OrderCarPreparedComponent } from './admin/components/warehouses/cars/order-car-prepared/order-car-prepared.component';
import { OrderCardTransferedComponent } from './admin/components/warehouses/cars/order-card-transfered/order-card-transfered.component';
import { OrderListReceivedComponent } from './admin/components/storageManager/receiveds/order-list-received/order-list-received.component';
import { OrderDetailWarehouseComponent } from './admin/components/warehouses/order-detail-warehouse/order-detail-warehouse.component';
import { OrderWarehouseApprovedComponent } from './admin/components/warehouses/order-warehouse-approved/order-warehouse-approved.component';
import { OrderListWapprovedComponent } from './admin/components/warehouses/order-list-wapproved/order-list-wapproved.component';
import { OrderListWpreparedComponent } from './admin/components/warehouses/order-list-wprepared/order-list-wprepared.component';
import { OrderListWcompletedComponent } from './admin/components/warehouses/order-list-wcompleted/order-list-wcompleted.component';
import { OrderBapprovedComponent } from './admin/components/warehouses/cars/boston/order-bapproved/order-bapproved.component';
import { OrderBopenendComponent } from './admin/components/warehouses/cars/boston/order-bopenend/order-bopenend.component';
import { OrderBpreparedComponent } from './admin/components/warehouses/cars/boston/order-bprepared/order-bprepared.component';
import { OrderBtransferedComponent } from './admin/components/warehouses/cars/boston/order-btransfered/order-btransfered.component';
import { OrderStaffOpenendComponent } from './admin/components/warehouses/staff/order-staff-openend/order-staff-openend.component';
import { OrderStaffApprovedComponent } from './admin/components/warehouses/staff/order-staff-approved/order-staff-approved.component';
import { OrderStaffPreparedComponent } from './admin/components/warehouses/staff/order-staff-prepared/order-staff-prepared.component';
import { OrderStaffCompletedComponent } from './admin/components/warehouses/staff/order-staff-completed/order-staff-completed.component';
import { OrderListPreparedComponent } from './admin/staff/components/order-list/order-list-prepared/order-list-prepared.component';


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
        path: 'ordenes_estados',
        component: StatusPageComponent,
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
        path: 'order_admin/editar/:id',
        component: OrderFormEditComponent,
      },



      // TODO:: BODEGA

      {
        path: 'ordenes_abiertas/bodega/:id',
        component: OrderListWopenendComponent,
      },
      {
        path: 'ordenes_aprobadas/bodega/:id',
        component: OrderListWapprovedComponent,
      },
      {
        path: 'ordenes_preparadas/bodega/:id',
        component: OrderListWpreparedComponent,
      },
      {
        path: 'ordenes_completadas/bodega/:id',
        component: OrderListWcompletedComponent,
      },
      {
        path: 'ordenes_bodega/detalle/:id',
        component: OrderDetailWarehouseComponent,
      },
      {
        path: 'ordenes_bodega/aprobar/:id',
        component: OrderWarehouseApprovedComponent,
      },








      // TODO:: BODEGA - Carros
      {
        path: 'ordenes_abiertas/bodega-carros',
        component: OrderListCwopenendComponent,
      },
      {
        path: 'ordenes_aprobadas/bodega-carros',
        component: OrderListCwapprovedComponent,
      },
      {
        path: 'ordenes_preparadas/bodega-carros',
        component: OrderCarPreparedComponent,
      },
      {
        path: 'ordenes_transferidas/bodega-carros',
        component: OrderCardTransferedComponent,
      },
      {
        path: 'bodega_carros/aprobar/:id',
        component: OrderCarApprovedComponent,
      },
      // TODO:: boston
      {
        path: 'ordenes_abiertas/bodega-boston',
        component: OrderBopenendComponent,
      },
      {
        path: 'ordenes_aprobadas/bodega-boston',
        component: OrderBapprovedComponent,
      },
      {
        path: 'ordenes_preparadas/bodega-boston',
        component: OrderBpreparedComponent,
      },
      {
        path: 'ordenes_transferidas/bodega-boston',
        component: OrderBtransferedComponent,
      },
      // TODO:: PERSONAL BODEGA
      {
        path: 'ordenes_abiertas/bodega-personal/:id',
        component: OrderStaffOpenendComponent,
      },
      {
        path: 'ordenes_aprobadas/bodega-personal/:id',
        component: OrderStaffApprovedComponent,
      },
      {
        path: 'ordenes_preparadas/bodega-personal/:id',
        component: OrderStaffPreparedComponent,
      },
      {
        path: 'ordenes_transferidas/bodega-personal/:id',
        component: OrderStaffCompletedComponent,
      },

      // TODO:: FIN BODEGA

      {
        path: 'ordenes_abiertas/:id',
        component: OrderOpenendComponent,
      },
      {
        path: 'ordenes_aprobadas/:id',
        component: OrderApprovedComponent,
      },
      {
        path: 'ordenes_pre-completadas/:id',
        component: OrderPrecompletedComponent,
      },
      {
        path: 'ordenes_completadas/:id',
        component: OrderCompletedComponent,
      },
      {
        path: 'ordenes_recibidas/:id',
        component: OrderListReceivedComponent,
      },
      // TODO: Técnico
      {
        path: 'ordenes_abiertas/staff/:id',
        component: OrderListOpenendComponent,
      },
      {
        path: 'ordenes_abiertas/staff/:id',
        component: OrderListOpenendComponent,
      },
      {
        path: 'ordenes_por_aprobar/staff/:id',
        component: OrderListPendingComponent,
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
        path: 'ordenes_preparadas/staff/:id',
        component: OrderListPreparedComponent,
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
