import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { UserService } from "../core/user.service";
import * as AOS from 'aos';

@Component({
  selector: "page-about",
  templateUrl: "about.component.html",
  styleUrls: ["about.scss"]
})
export class AboutComponent implements OnInit {
  profile = "";
  showBtn = false
  users: Array<any>;
  image = "";
  @Output() show = new EventEmitter();
  @Output() shows = new EventEmitter();
  
  isShow: boolean = false;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    AOS.init();
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
    this.showBtn = true
  }

  hideAnime(){
    this.shows.emit(this.isShow)
    this.showBtn = false
  }
}
