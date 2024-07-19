import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user.service';
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {PhotoService} from "../photo.service";
import {AuthService} from "../auth.service";
import {LikeUser} from "../like-user";

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    NgStyle
  ],
  styleUrls: ['./friend-profile.component.css']
})
export class FriendProfileComponent implements OnInit {
  username: string = '';
  profilePictureUrl: string = '';
  photos: any[] = [];
  selectedPhoto: any = null;
  isPhotoModalOpen: boolean = false;
  likesCount: number = 0;
  hasUserLiked: boolean = false;
  likersList: any[] = [];

  likedPhotosMap: Map<number, boolean> = new Map<number, boolean>();

  constructor(private authService: AuthService,
              private photoService: PhotoService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      this.userService.getUserProfile(this.username).subscribe({
        next: profile => {
          if (profile.photo) {
            this.profilePictureUrl = 'data:image/jpeg;base64,' + profile.photo;
          }
          if (profile.photos && Array.isArray(profile.photos)) {
            this.photos = profile.photos.map((photo: any) => 'data:image/jpeg;base64,' + photo);
          } else {
            this.photos = [];
          }
          this.loadPhotos();
          this.loadUserLikes();
        },
        error: err => console.error(err)
      });
    });
  }

  loadUserLikes(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.photoService.getUserLikedPhotos(user.id).subscribe({
      next: likedPhotos => {
        likedPhotos.forEach(photoId => {
          this.likedPhotosMap.set(photoId, true);
        });
      },
      error: err => console.error('Error fetching user liked photos:', err)
    });
  }


  loadPhotos(): void {
    this.photoService.getFriendPhotos(this.username).subscribe({
      next: photos => {
        this.photos = photos
          .filter(photo => photo !== null)
          .map(photo => ({
            ...photo,
            url: this.convertBytesToUrl(photo.fileContent)
          }));
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

  viewFriends(): void {
    this.router.navigate(['/friend-friends', this.username]);
  }

  openPhotoModal(photo: any): void {
    this.selectedPhoto = photo;
    this.isPhotoModalOpen = true;
    this.photoService.getPhotoLikesCount(photo.id).subscribe({
      next: likesCount => {
        if (typeof likesCount === 'number') {
          this.likesCount = likesCount;
        } else {
          console.error('Invalid likes count format:', likesCount);
          this.likesCount = 0;
        }
        this.checkIfUserLiked(photo.id);
      },
      error: err => {
        console.error('Error fetching likes count:', err);
        this.likesCount = 0;
      }
    });
  }

  checkIfUserLiked(photoId: number): void {
    this.hasUserLiked = this.likedPhotosMap.get(photoId) || false;
  }


  loadLikers(photoId: number): void {
    this.photoService.getPhotoLikes(photoId).subscribe({
      next: likers => {
        this.likersList = [];
        likers.forEach(liker => {
          if (liker && liker.userId) {
            this.userService.getUserProfile(liker.username).subscribe({
              next: userProfile => {
                const likeUser: LikeUser = {
                  id: liker.userId,
                  username: userProfile.username,
                  profilePictureUrl: 'data:image/jpeg;base64,' + userProfile.photo
                };
                this.likersList.push(likeUser);
              },
              error: err => console.error('Error fetching user profile:', err)
            });
          } else {
            console.error('Invalid liker object:', liker);
          }
        });
      },
      error: err => console.error('Error fetching photo likes:', err)
    });
  }

  closePhotoModal(): void {
    this.isPhotoModalOpen = false;
    this.selectedPhoto = null;
    this.likesCount = 0;
    this.likersList = [];
    this.hasUserLiked = false;
  }

  toggleLikePhoto(photoId: number): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    if (this.hasUserLiked) {
      this.unlikePhoto(photoId);
    } else {
      this.likePhoto(photoId);
    }
  }

  likePhoto(photoId: number): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    if (this.hasUserLiked) {
      console.error('User has already liked this photo');
      return;
    }
    this.photoService.likePhoto(photoId, user.username).subscribe({
      next: response => {
        this.likesCount++;
        this.hasUserLiked = true;
        this.likedPhotosMap.set(photoId, true);
        this.loadLikers(photoId);
      },
      error: err => console.error(err)
    });
  }

  unlikePhoto(photoId: number): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    this.photoService.unlikePhoto(photoId).subscribe({
      next: response => {
        this.likesCount--;
        this.hasUserLiked = false;
        this.likedPhotosMap.delete(photoId);
        this.loadLikers(photoId);
      },
      error: err => console.error(err)
    });
  }

  viewAllLikers(): void {
    this.loadLikers(this.selectedPhoto.id);
  }
}
