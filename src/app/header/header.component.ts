import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'page-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.scss']
})
export class HeaderComponent implements OnInit{
  @Input() User: Array<any>
  slide= false
  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  profile = ""
  users:Array<any>
  image= ''
  owner=""

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location : Location,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.userService.getCurrentUser().then(res=>{
      // this.owner = res
      if(res.email == 'johnpatrick.cabia-an@student.passerellesnumeriques.org' || res.email == 'patrick.pathran23@gmail.com'){
        this.image = res.photoURL
        console.log(this.image);
        
      }
      else{
        this.userService.getUsers().subscribe(res=>{
          this.users = res
          // console.log(this.users);
          this.users.forEach(element=>{
            this.userService.getCurrentUser().then(res=>{
              console.log('current user',res)
              this.profile = res.email
              // console.log(element.payload.doc._document.proto.fields.email.stringValue);
              if(this.profile == element.payload.doc._document.proto.fields.email.stringValue){
                this.image = element.payload.doc._document.proto.fields.image.stringValue
                // console.log(this.image);
              }else{
    
              }
          })
           
          })
        })
      }
    });
    
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
        this.createForm(this.user.name);
      }
    })
  }
   
  showSideNav(){
    this.slide = true
  }
  hideSideNav(){
    this.slide = false
  }

  createForm(name) {
    this.profileForm = this.fb.group({
      name: [name, Validators.required ]
    });
  }

  save(value){
    this.userService.updateCurrentUser(value)
    .then(res => {
      console.log(res);
    }, err => console.log(err))
  }

  logout(){
    this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log("Logout error", error);
    });
  }
}
