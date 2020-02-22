import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service'
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import "firebase/storage";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  file = "";
  URL: any;
  downloadURL: Observable<string>;
  uploadPercent: Observable<number>;
  profileUrl: Observable<string | null>;
  task: any;
  
  private formSubmitAttempt: boolean;

  get f() { return this.registerForm.controls; }

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private storage: AngularFireStorage
  ) {
    this.createForm();
   }

   isFieldInvalid(field: string) { 
    return (
      (!this.registerForm.get(field).valid && this.registerForm.get(field).touched) ||
      (this.registerForm.get(field).untouched && this.formSubmitAttempt)
    );
  }

   createForm() {
     this.registerForm = this.fb.group({
      username: ['',Validators.required],
       email: ['', Validators.required ],
       password: ['',Validators.required],
       image: [null, Validators.required]
     });
   }

   onUploadOutput(event) {
      const filename = event.target.files[0].name;
      // if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      const filePath = "profiles/" + filename;
      const fileRef = this.storage.ref(filePath);
      this.task = fileRef.put(this.file);
    
      this.uploadPercent = this.task.percentageChanges();
      this.task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL()
            fileRef.getDownloadURL().subscribe(res=>{
              console.log(res);
              this.URL = res
              this.registerForm.value.image = this.URL
            });
          })
        )
        .subscribe(() => {});

      // this.img = URL.createObjectURL(this.file)
    }

  //  tryFacebookLogin(){
  //    this.authService.doFacebookLogin()
  //    .then(res =>{
  //      this.router.navigate(['/user']);
  //    }, err => console.log(err)
  //    )
  //  }

  //  tryTwitterLogin(){
  //    this.authService.doTwitterLogin()
  //    .then(res =>{
  //      this.router.navigate(['/user']);
  //    }, err => console.log(err)
  //    )
  //  }

   tryGoogleLogin(){
     this.authService.doGoogleLogin()
     .then(res =>{
       this.router.navigate(['/user']);
     }, err => console.log(err)
     )
   }

   tryRegister(value){
     this.authService.doRegister(value)
     .then(res => {
       console.log(res);
       this.errorMessage = "";
       this.successMessage = "Your account has been created";
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "";
     })
   }

}
