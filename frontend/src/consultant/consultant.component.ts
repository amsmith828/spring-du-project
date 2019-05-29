import { Component, OnInit, ViewChild } from "@angular/core";
import { ConsultantService } from "./consultant.service";
import { Consultant } from "./consultant";
import { Observable, Subscription, Subject } from "rxjs";
import { Router } from "@angular/router";
import { ConsultantCreateComponent } from "./consultant-create/consultant-create.component";
import {
  MatDialog,
  MatPaginator,
  MatTableDataSource,
  MatSort,
  MatSnackBar
} from "@angular/material";
import { AuthService } from "src/services/auth.service";
import { UserService } from "../user/user.service";

@Component({
  selector: "app-consultant",
  templateUrl: "./consultant.component.html",
  styleUrls: ["../shared/styles/consultant.component.scss"]
})
export class ConsultantComponent implements OnInit {
  public consultant: Consultant = new Consultant();
  public consultants$: Observable<Consultant[]>;
  public tableHeaders: string[] = [
    "lastName",
    "firstName",
    "role",
    "title",
    "email",
    "addToTeam"
  ];

  dataSource = new MatTableDataSource<Consultant>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public loggedInUserSub: Subscription;

  constructor(
    private consultantService: ConsultantService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getConsultants();
    this.consultants$.subscribe(results => {
      this.dataSource.data = results;
      console.log(this.dataSource.data);
    });
    this.loggedInUserSub = this.authService.getUser().subscribe();
  }

  getConsultants(): void {
    this.consultants$ = this.consultantService.getConsultants();
  }

  addToTeam(e: Event, consultant: Consultant) {
    e.stopPropagation();
    this.userService.addConsultant(consultant).subscribe(
      () => {
        this.snackbar.open("Added to Team", "", {
          duration: 3000,
          panelClass: ["green-snackbar"]
        });
      },
      err =>
        this.snackbar.open(err, "", {
          duration: 3000
        })
    );
  }

  goToConsultant(consultant: Consultant): void {
    this.router.navigate([`consultants/${consultant._id}`]);
  }

  public createConsultant(): void {
    let dialog = this.dialog.open(ConsultantCreateComponent);
    dialog.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.consultantService
          .createConsultant(result)
          .subscribe(consultant => {
            this.router.navigate([`consultants/${consultant._id}`]);
          });
      }
    });
  }

  
  private noResults$ = new Subject<boolean>();

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.noResults$.next(
      this.dataSource.filteredData.length === 0
    );
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
}
