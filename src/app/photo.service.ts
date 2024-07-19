import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private apiUrl: string = 'http://localhost:8080/api/photo'



  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getPhotos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/photos`, {
    });
  }

  setProfilePicture(photoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/setProfilePicture/${photoId}`, {}, {
    });
  }

  deletePhoto(photoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deletePhoto/${photoId}`, {
    });
  }

  uploadPhoto(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/uploadPhoto`, formData, {
    });
  }

  getFriendPhotos(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/friendPhotos/${username}`)
  }

  likePhoto(photoId: number, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/likePhoto`, { photoId, username })
  }

  getPhotoLikes(photoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/photos/likes/${photoId}`);
  }

  getPhotoLikesCount(photoId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/photo/likes/count/${photoId}`);
  }

  unlikePhoto(photoId: number): Observable<any> {
    const params = new HttpParams()
      .set('photoId', photoId.toString());
    return this.http.delete<any>(`${this.apiUrl}/unlikes`, { params });
  }

  getUserLikedPhotos(userId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/userLikes/${userId}`);
  }


}
