// friend-requests.component.ts

import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-request.component.html',
  standalone: true,
  imports: [
    NgForOf,
    MatButton,
    NgIf
  ],
  styleUrls: ['./friend-request.component.css']
})
export class FriendRequestsComponent implements OnInit {
  friendRequests: any[] = [];
  showRequests: boolean = true;
  isMessageVisible: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadFriendRequests();
  }

  loadFriendRequests(): void {
    this.userService.getFriendRequests().subscribe(requests => {
      this.friendRequests = requests;
      this.checkForNoRequests();
    });
  }

  acceptRequest(username: string): void {
    this.userService.acceptFriendRequest(username).subscribe({
      next: () => {
        this.friendRequests = this.friendRequests.filter(request => request.senderUsername !== username);
      },
      error: err => {
        console.error('Error accepting friend request:', err);
      }
    });
  }

  rejectRequest(username: string): void {
    this.userService.rejectFriendRequest(username).subscribe({
      next: () => {
        this.friendRequests = this.friendRequests.filter(request => request.senderUsername !== username);
        this.checkForNoRequests();
      },
      error: err => {
        console.error(err);
      }
    });
  }

  checkForNoRequests(): void {
    if (this.friendRequests.length === 0) {
      this.showRequests = false;
    }
  }

  closeRequests(): void {
    this.showRequests = false;
    this.isMessageVisible = true;
  }

  hideMessage(): void {
    this.isMessageVisible = !this.isMessageVisible;
  }
}
