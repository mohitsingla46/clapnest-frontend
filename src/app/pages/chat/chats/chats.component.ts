import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppService } from 'src/app/core/services/app.services';
import { HeaderComponent } from 'src/app/shared/components/layouts/header/header.component';

@Component({
    selector: 'app-chats',
    standalone: true,
    imports: [HeaderComponent, RouterLink, NgFor, NgIf],
    templateUrl: './chats.component.html',
    styleUrl: './chats.component.css'
})
export class ChatsComponent implements OnInit {

    chats: any[] = [];
    appService = inject(AppService);

    ngOnInit(): void {
        this.fetchChats();
    }

    fetchChats() {
        this.appService.getChats().subscribe({
            next: (data) => {
                this.chats = data;
            },
            error: (error) => {
                console.error('Error fetching users:', error);
            },
        });
    }

}
