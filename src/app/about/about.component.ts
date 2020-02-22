import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { UserService } from "../core/user.service";
import { AuthService } from "../core/auth.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FirebaseUserModel } from "../core/user.model";
import { element } from "@angular/core/src/render3";

@Component({
  selector: "page-about",
  templateUrl: "about.component.html",
  styleUrls: ["about.scss"]
})
export class AboutComponent implements OnInit {
  profile = "";
  users: Array<any>;
  image = "";
  @Output() show = new EventEmitter();
  isShow: boolean = false;
  constructor(private userService: UserService) {}

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
  }

  goToAnime(){
    this.show.emit(this.isShow)
    this.isShow = true
  }
}
