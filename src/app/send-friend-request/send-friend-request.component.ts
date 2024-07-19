import {Component, Input} from '@angular/core';
import {UserService} from '../user.service';

@Component({
  selector: 'app-send-friend-request',
  templateUrl: './send-friend-request.component.html',
  standalone: true,
  styleUrls: ['./send-friend-request.component.css']
})
export class SendFriendRequestComponent {
  @Input() username: string = '';

  constructor(private userService: UserService) {
  }

  sendRequest() {
    this.userService.sendFriendRequest(this.username).subscribe({
      error: err => console.error('Failed to send friend request', err)
    });
  }
}
