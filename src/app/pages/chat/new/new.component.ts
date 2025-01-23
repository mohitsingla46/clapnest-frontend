import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AppService } from 'src/app/core/services/app.services';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, NgFor],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent implements OnInit {

  faArrowLeft = faArrowLeft;

  users: any;
  appService = inject(AppService);

  ngOnInit(): void {
    this.fetchChatUsers();
  }

  fetchChatUsers() {
    this.appService.chatusers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }
}
