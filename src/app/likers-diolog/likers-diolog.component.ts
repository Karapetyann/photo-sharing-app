import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-likers-dialog',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    MatButtonModule
  ],
  template: `
    <div class="container mt-3">
      <h1 mat-dialog-title class="text-center">Лайки</h1>
      <div mat-dialog-content>
        <p *ngIf="!data.likers.length" class="text-center">Лайков пока нет.</p>
        <ul *ngIf="data.likers.length" class="list-group">
          <li *ngFor="let liker of data.likers" class="list-group-item">{{ liker.username }}</li>
        </ul>
      </div>
      <div mat-dialog-actions class="d-flex justify-content-center mt-3">
        <button mat-button (click)="closeDialog()" class="btn btn-primary">Закрыть</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 500px;
    }

    .list-group-item {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.1rem;
    }

    .btn {
      border-radius: 10px;
    }
  `]
})
export class LikersDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LikersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { likers: any[] }
  ) {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
