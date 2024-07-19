import {Component} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {PhotoListComponent} from "./photo-list/photo-list.component";
import {RegisterComponent} from "./register/register.component";
import {SendFriendRequestComponent} from "./send-friend-request/send-friend-request.component";
import {ProfileComponent} from "./profile/profile.component";
import {FriendRequestsComponent} from "./friend-request/friend-request.component";

@Component({
  imports: [RouterOutlet, LoginComponent, RegisterComponent, PhotoListComponent, SendFriendRequestComponent, ProfileComponent, FriendRequestsComponent],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.component.css',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'photo-sharing-app';
  constructor() {}


}
