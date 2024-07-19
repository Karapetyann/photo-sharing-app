import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PhotoListComponent } from './photo-list/photo-list.component';
import { AuthGuard } from './auth-guard';
import { ProfileComponent } from './profile/profile.component';
import { FriendRequestsComponent } from './friend-request/friend-request.component';
import {FriendProfileComponent} from "./friend-profile/friend-profile.component";
import {FriendFriendsComponent} from "./friend-friends/friend-friends.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'friends', component: FriendRequestsComponent },
  { path: 'photos', component: PhotoListComponent, canActivate: [AuthGuard] },
  { path: 'profile/:username', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'friend-profile/:username', component: FriendProfileComponent, canActivate: [AuthGuard] },
  { path: 'friend-friends/:username', component: FriendFriendsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
