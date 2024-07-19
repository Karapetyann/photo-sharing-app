import {Component, OnInit} from '@angular/core';
import {PhotoService} from '../photo.service';
import {UserService} from '../user.service';
import {NgForOf, NgIf} from "@angular/common";
import {PhotoUploadComponent} from "../photo-upload/photo-upload.component";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {FriendRequestsComponent} from "../friend-request/friend-request.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../auth.service";
import {LikersDialogComponent} from "../likers-diolog/likers-diolog.component";

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  standalone: true,
  imports: [
    NgForOf,
    PhotoUploadComponent,
    RouterLink,
    NgIf,
    FormsModule,
    LikersDialogComponent,
    FriendRequestsComponent
  ],
  styleUrls: ['./photo-list.component.css']
})
export class PhotoListComponent implements OnInit {
  photos: any[] = [];
  recommendedUsers: any[] = [];
  filteredUsers: any[] = [];
  currentUser: string = '';
  searchQuery: string = '';
  friendsList: string[] = [];
  showFriendRequests: boolean = false;


  constructor(public dialog: MatDialog,
              private photoService: PhotoService,
              private userService: UserService,
              private authService: AuthService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadPhotos();
    this.loadCurrentUser();
    this.loadRecommendedUsers();
    this.loadFriends();
  }

  loadPhotos(): void {
    this.photoService.getPhotos().subscribe({
      next: photos => {
        this.photos = photos
          .filter(photo => photo !== null)
          .map(photo => ({
            ...photo,
            url: this.convertBytesToUrl(photo.fileContent),
            likesCount: 0
          }));
        this.photos.forEach(photo => {
          this.loadLikesCount(photo.id);
        })
      },
      error: err => console.error(err)
    });
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: user => {
        this.currentUser = user.username;
      },
      error: err => console.error(err)
    });
  }

  loadRecommendedUsers(): void {
    this.userService.getRecommendedUsers().subscribe({
      next: users => {
        this.recommendedUsers = users.map(user => {
          const profilePictureUrl = this.convertBytesToUrl(user.photo);
          return {
            ...user,
            profilePictureUrl
          };
        });
        this.filteredUsers = [...this.recommendedUsers];
      },
      error: err => console.error(err)
    });
  }

  private convertBytesToUrl(fileContent: string | null): string {
    if (!fileContent) {
      console.error('Пустое содержимое файла');
      return '';
    }
    const url = 'data:image/jpeg;base64,' + fileContent;
    return url;
  }

  filterUsers(): void {
    if (this.searchQuery.trim().length > 0) {
      this.userService.searchUsers(this.searchQuery).subscribe({
        next: users => {
          this.recommendedUsers = users.map(user => {
            const profilePictureUrl = this.convertBytesToUrl(user.photo);
            return {
              ...user,
              profilePictureUrl
            };
          });
        },
        error: err => console.error(err)
      });
    } else {
      this.loadRecommendedUsers();
    }
  }

  setProfilePicture(photoId: number) {
    this.photoService.setProfilePicture(photoId).subscribe({
      error: err => console.error('Error setting profile picture', err)
    });
  }

  deletePhoto(photoId: number): void {
    this.photoService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos = this.photos.filter(photo => photo.id !== photoId);
        this.loadPhotos()
      },
      error: err => console.error('Error deleting photo', err)
    });
  }

  addFriend(username: string): void {
    this.userService.sendFriendRequest(username).subscribe({
      next: () => {
      },
      error: err => {
        console.error(err);
        if (err.status === 400 && err.error === 'The request has already been sent previously') {
          alert('The request has already been sent previously');
        }
      }
    });
  }

  openFriendRequestDialog() {
    this.showFriendRequests = !this.showFriendRequests;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadFriends(): void {
    this.userService.getFriends().subscribe({
      next: friends => {
        this.friendsList = friends;
      },
      error: err => console.error(err)
    });
  }

  isFriend(username: string): boolean {
    return this.friendsList.includes(username);
  }

  loadLikesCount(photoId: number): void {
    this.photoService.getPhotoLikesCount(photoId).subscribe({
      next: likesCount => {
        const photo = this.photos.find(p => p.id === photoId);
        if (photo) {
          photo.likesCount = likesCount;
        }
      },
      error: err => console.error('Error fetching likes count:', err)
    });
  }

  viewLikers(photoId: number): void {
    this.photoService.getPhotoLikes(photoId).subscribe({
      next: likers => {
        if (likers && likers.length > 0) {
          const dialog = this.dialog.open(LikersDialogComponent, {
            data: { likers: likers }
          });
          dialog.afterClosed().subscribe(result => {
          });
        } else {
          alert('No likes yet');
        }
      },
      error: err => console.error('Error getting list of likes', err)
    });
  }

}
