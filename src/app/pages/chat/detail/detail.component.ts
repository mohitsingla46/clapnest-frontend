import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AppService } from 'src/app/core/services/app.services';
import { SocketService } from 'src/app/core/services/socket.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, ReactiveFormsModule, NgFor, CommonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {

  faArrowLeft = faArrowLeft;

  roomId: string | null = null;
  currentUserId: string | null = null;
  otherUserId: string | null = null;
  user: any;
  chatForm!: FormGroup;
  messages: { senderId: string, message: string }[] = [];

  appService = inject(AppService);
  socketService = inject(SocketService);

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getChatUserDetail();
    this.getCurrentUserId();
    this.joinRoom(this.currentUserId ?? '', this.otherUserId ?? '');

    this.chatForm = new FormGroup({
      message: new FormControl('', Validators.required)
    });

    this.socketService.receiveMessage().subscribe((msg) => {
      const newMessage = {
        senderId: msg.senderId,
        message: msg.message
      };
      this.messages = [...this.messages, newMessage];
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    const payload = {
      roomId: this.roomId ?? '',
      userId: this.currentUserId ?? ''
    }
    this.socketService.leaveRoom(payload);
  }

  sendMessage() {
    if (this.chatForm.valid) {
      const message = this.chatForm.value.message;
      const payload = {
        senderId: this.currentUserId ?? '',
        roomId: this.roomId ?? '',
        message: message,
        createdAt: new Date()
      };
      this.socketService.sendMessage(payload);
      this.chatForm.get('message')?.reset();
    }
  }

  getChatUserDetail() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.otherUserId = id;
        this.appService.chatuserdetails(id).subscribe({
          next: (data) => {
            this.user = data;
          },
          error: (error) => {
            console.error('Error fetching user details:', error);
          },
        });
      }
    });
  }

  getCurrentUserId() {
    const authUser: string | null = localStorage.getItem('user');
    console.log(authUser);

    if (authUser) {
      const user = JSON.parse(authUser) as { id: string };
      this.currentUserId = user.id;
    }
  }

  joinRoom(currentUserId: string, otherUserId: string) {
    const payload = {
      userId: currentUserId,
      otherUserId: otherUserId
    };
    this.socketService.joinRoom(payload).subscribe((response: any) => {
      this.roomId = response.roomId;
      this.fetchChathistory(otherUserId);
    });
  }

  fetchChathistory(otherUserId: string) {
    this.appService.getChatHistory(otherUserId).subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}
