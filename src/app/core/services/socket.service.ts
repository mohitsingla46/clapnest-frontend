import { Injectable, NgZone } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, BehaviorSubject } from 'rxjs';

export interface JoinRoomPayload {
	userId: string;
	otherUserId: string;
}

export interface LeaveRoomPayload {
	roomId: string;
	userId: string;
}

export interface MessagePayload {
	senderId: string;
	roomId: string;
	message: string;
	createdAt: Date
}

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	private _connectionStatus = new BehaviorSubject<boolean>(false);
	connectionStatus$ = this._connectionStatus.asObservable();

	constructor(
		private socket: Socket,
		private ngZone: NgZone
	) {
		this.setupConnectionHandlers();
	}

	private setupConnectionHandlers(): void {
		this.socket.on('connect', () => {
			this.ngZone.run(() => {
				this._connectionStatus.next(true);
				console.log('Socket connected');
			});
		});

		this.socket.on('disconnect', () => {
			this.ngZone.run(() => {
				this._connectionStatus.next(false);
				console.log('Socket disconnected');
			});
		});
	}

	joinRoom(payload: JoinRoomPayload): Observable<any> {
		this.socket.emit('joinRoom', payload);
		return this.socket.fromEvent('roomJoined');
	}

	leaveRoom(payload: LeaveRoomPayload): void {
		this.socket.emit('leaveRoom', payload);
	}

	sendMessage(payload: MessagePayload): void {
		this.socket.emit('message', payload);
	}

	receiveMessage(): Observable<MessagePayload> {
		return this.socket.fromEvent<MessagePayload>('message');
	}

	disconnect(): void {
		this.socket.disconnect();
	}

	connect(): void {
		this.socket.connect();
	}
}