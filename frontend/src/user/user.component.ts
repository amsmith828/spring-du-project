import { Component, OnInit, ViewChild } from "@angular/core";
import { Consultant } from "src/consultant/consultant";
import { UserService } from "./user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "src/services/auth.service";
import { User } from "./user";
import { MatTableDataSource, MatSort } from "@angular/material";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["../shared/styles/consultant.component.scss"]
})
export class UserComponent implements OnInit {
  public consultants: Consultant[];
  public consultants$: Observable<Consultant[]>;
  public user$: Observable<User>;
  private user: User;
  public tableHeaders: string[] = [
    "lastName",
    "firstName",
    "role",
    "title",
    "email"
  ];

  dataSource = new MatTableDataSource<Consultant>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // this.user = this.authService.getUserFromLocalStorage();
    // console.log(this.user);
    // this.userSub = this.authService.getUser().subscribe(user => {
    //   this.dataSource.data = user.consultants;
    //   console.log(user);
    // });
    this.getUser();
    this.user$.subscribe(user => {
      console.log(user);
      this.dataSource.data = user.consultants;
    });
    // this.dataSource.data = this.user.consultants;
    this.dataSource.sort = this.sort;
  }

  // ngOnDestroy(): void {
  //   //Called once, before the instance is destroyed.
  //   //Add 'implements OnDestroy' to the class.
  //   this.dataSource.data = [];
  //   this.userSub && this.userSub.unsubscribe();
  // }

  getUser() {
    this.user$ = this.authService.getUser();
  }

  goToConsultant(consultant: Consultant): void {
    this.router.navigate([`consultants/${consultant._id}`]);
  }

  removeFromTeam(e: Event, consultant: Consultant): void {
    e.stopPropagation();
    this.userService.removeConsultant(consultant).subscribe(user => {
      this.consultants = user.consultants;
      this.dataSource.data = this.consultants;
      console.log(this.consultants);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }
}
