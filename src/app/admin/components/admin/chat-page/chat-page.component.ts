import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements OnInit {
  contacts = [
    { id: 1, name: 'Alice', status: 'En línea', avatar: 'assets/avatar1.png' },
    { id: 2, name: 'Bob', status: 'Ausente', avatar: 'assets/avatar2.png' },
    { id: 3, name: 'Charlie', status: 'Ocupado', avatar: 'assets/avatar3.png' },
  ];
  selectedContact: any;
  messages: any[] = [];
  newMessage: string = '';
  notificationsEnabled: boolean = true;
  pusher: any;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.initializePusher();
  }

  initializePusher() {
    this.pusher = new Pusher('TU_APP_KEY', {
      cluster: 'TU_APP_CLUSTER',
      authEndpoint: 'http://localhost:8000/pusher/auth'
    });

    const channel = this.pusher.subscribe('private-user-channel');
    channel.bind('new-message', (data: any) => {
      this.messages.push(data);
      if (this.notificationsEnabled) {
        this.showNotification(data.sender, data.text);
      }
    });
  }

  selectContact(contact: any) {
    this.selectedContact = contact;
    // Aquí cargarías los mensajes del contacto seleccionado
    this.messages = [
      { sender: 'me', text: '¡Hola!', time: new Date() },
      { sender: contact.name, text: '¿Cómo estás?', time: new Date() },
    ];
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedContact) {
      const message = {
        sender: 'me',
        text: this.newMessage,
        time: new Date()
      };
      this.messages.push(message);
      this.newMessage = '';
      // Aquí enviarías el mensaje al backend
    }
  }

  toggleNotifications() {
    this.notificationsEnabled = !this.notificationsEnabled;
    const message = this.notificationsEnabled ? 'Notificaciones activadas' : 'Notificaciones desactivadas';
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

  showNotification(sender: string, message: string) {
    this.snackBar.open(`${sender}: ${message}`, 'Cerrar', { duration: 5000 });
  }

}
