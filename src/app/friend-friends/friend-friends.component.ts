import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user.service';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-friend-friends',
  templateUrl: './friend-friends.component.html',
  standalone: true,
  imports: [
    NgForOf
  ],
  styleUrls: ['./friend-friends.component.css']
})
export class FriendFriendsComponent implements OnInit {
  username: string = '';
  friends: any[] = [];

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      this.userService.getUserProfile(this.username).subscribe({
        next: profile => {
          this.friends = profile.friends.map((friend: any) => ({
            username: friend.username,
            profilePictureUrl: 'data:image/jpeg;base64,' + friend.photo
          }));
        },
        error: err => console.error(err)
      });
    });
  }

  viewFriendProfile(username: string): void {
    this.router.navigate(['/friend-profile', username]);
  }
}
