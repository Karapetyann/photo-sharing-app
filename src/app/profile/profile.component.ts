import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user.service';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    NgForOf
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = '';
  profilePictureUrl: string = '';
  friends: any[] = [];

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      this.userService.getUserProfile(this.username).subscribe({
        next: profile => {
          if (profile.photo) {
            this.profilePictureUrl = 'data:image/jpeg;base64,' + profile.photo;
          }
          this.friends = profile.friends.map((friend: any) => ({
            username: friend.username,
            profilePictureUrl: 'data:image/jpeg;base64,' + friend.photo
          }));
        },
        error: err => console.error(err)
      });
    });
  }

  deleteFriend(username: string): void {
    this.userService.deleteFriend(username).subscribe({
      next: () => {
        this.friends = this.friends.filter(friend => friend.username !== username)
      },
      error: err => console.error(err)
    });
  }

  viewFriendProfile(username: string): void {
    this.router.navigate(['/friend-profile', username]);
  }
}
