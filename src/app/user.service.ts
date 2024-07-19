import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiFriendUrl: string = 'http://localhost:8080/api/friends';
  private apiUserUrl: string = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  getUserProfile(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUserUrl}/profile/${username}`);
  }

  getFriendRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiFriendUrl}/friendRequests`);
  }

  acceptFriendRequest(senderUsername: string): Observable<any> {
    return this.http.post<any>(`${this.apiFriendUrl}/acceptFriendRequest/${senderUsername}`,{});
  }

  rejectFriendRequest(username: string): Observable<void> {
    return this.http.post<void>(`${this.apiFriendUrl}/rejectFriendRequest/${username}`, {});
  }

  sendFriendRequest(username: string) {
    return this.http.post<any>(`${this.apiFriendUrl}/sendFriendRequest`, { username });
  }

  getRecommendedUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUserUrl}/recommendedUsers`).pipe(
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUserUrl}/currentUser`);
  }

  searchUsers(name: string): Observable<any[]>{
    console.log(name);
    return this.http.get<any>(`${this.apiUserUrl}/searchUsers/${name}`);
  }


  deleteFriend(username: string): Observable<void>{
     return  this.http.delete<void>(`${this.apiFriendUrl}/deleteFriend`,{params:{username}});
  }

  getFriends(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiFriendUrl}/friends`);
  }



}
