import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {PhotoService} from "../photo.service";

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./photo-upload.component.css']
})
export class PhotoUploadComponent {
  @Output() photoUpload = new EventEmitter<void>();
  photoForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private photoService: PhotoService) {
    this.photoForm = this.fb.group({
      photo: [null],
      description: ['']
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.photoForm.patchValue({
      photo: file
    });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.photoForm.get('photo')!.value);
    formData.append('description', this.photoForm.get('description')!.value);

    this.photoService.uploadPhoto(formData).subscribe(
      () => {
        this.photoUpload.emit();
      },
      error => {
        console.error('Error loading photo', error);
      }
    );
  }
}
