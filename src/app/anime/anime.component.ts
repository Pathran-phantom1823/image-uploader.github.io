import { Component, OnInit } from "@angular/core";
import { UserService } from "../core/user.service";
import { AuthService } from "../core/auth.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FirebaseUserModel } from "../core/user.model";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

@Component({
  selector: "page-anime",
  templateUrl: "anime.component.html",
  styleUrls: ["anime.scss"]
})
export class AnimeComponent implements OnInit {
  isShow = false;
  user: FirebaseUserModel = new FirebaseUserModel();
  imageForm: FormGroup;
  profile = "";
  users: Array<any>;
  file = "";
  image = "";
  URL: any;
  downloadURL: Observable<string>;
  uploadPercent: Observable<number>;
  profileUrl: Observable<string | null>;
  task: any;
  uploads:Array<any>= []
  data:any

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.imageForm = this.fb.group({
      image:[null, Validators]
    })
  }

  onUploadOutput(event){
    const filename = event.target.files[0].name;
    // if (event.target.files && event.target.files[0]) {
    this.file = event.target.files[0];
    const filePath = "imageUploads/" + filename;
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
            this.imageForm.value.image = this.URL
          });
        })
      )
      .subscribe(() => {});
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(res => {
      this.users = res;
      console.log(this.users);
      this.users.forEach(element => {
        this.userService.getCurrentUser().then(res => {
          this.profile = res.email;
          console.log(
            element.payload.doc._document.proto.fields.email.stringValue
          );
          if (
            this.profile ==
            element.payload.doc._document.proto.fields.email.stringValue
          ) {
            this.image =
              element.payload.doc._document.proto.fields.image.stringValue;
            console.log(this.image);
          }
        });
      });
    });

    this.userService.getImages().subscribe(res=>{
      this.data = res
      this.uploads.push(this.data)
      
    })
  }
  cancel(){
    this.downloadURL = null;
    this.imageForm.reset()
  }


  upload(value){
    this.userService.uploadImage(value).then(res=>{
      this.imageForm.reset()
      this.downloadURL = null
      console.log(res);
      
    })
  }
}
