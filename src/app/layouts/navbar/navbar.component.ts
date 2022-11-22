import { Company } from './../../entities/company/company.model';
import { Language } from './../../entities/language/language.model';
import { Router } from '@angular/router';
import { CreateCompanyDialog } from './../../account/create-company-dialog/create-company-dialog.component';
import { ServicesPageComponent } from './../../pages/services/services-page.component';
import { LoginDialogComponent } from './../../account/login-dialog/login-dialog.component';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppComponent } from 'src/app/app.component';
import { isUserLogin, USER_ROLE } from 'src/app/account/authority/authority.component';
import { Authority } from 'src/app/account/authority/authority.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    @ViewChild('menu', {static: false}) menu?: ElementRef<HTMLElement>;

    role = '';
    isClient = true;

    showMenu = false;

    languagesMenu = false;

    logIn = false;

    items: MenuItem[] = [];
    languages: Language[] = [];
    companies: Company[] = [];
    selectedComapny: Company | null = null;
    selectedLanguage: Language | null = new Language('pl', '/src/assets/photos/flags/flaga_polski.jpg');
    selectedLanguages: any;
    amoutOfNotification = 1;

    constructor(public dialogService: DialogService, public messageService: MessageService, public appComponent: AppComponent,
      private servicesPageComponent: ServicesPageComponent, private router: Router, private cd: ChangeDetectorRef) {}

    ngOnInit(): void {
      this.languages = [
        new Language('pl', '../../../assets/photos/flags/flaga_polski.jpg'),
        new Language('en', '../../../assets/photos/flags/flaga_wielkiejbrytani.jpg')
      ];
      this.logIn = isUserLogin;
      this.role = USER_ROLE;
      if(this.role !== Authority.EMPLOYEE && this.role !== Authority.OWNER) {
        this.setUserMenu();
      } else if (this.role !== Authority.OWNER) {
        this.isClient = false;
        this.setEmployeeMenu();
      }
      else {
        this.isClient = false;
        this.setMenagerMenu();
      }
    }

    setUserMenu(): void {
      this.items = [
        {
            label: 'Home',
            routerLink: '/'
        },
        {
            label: 'Usługi',
            items: [
              {
                label: 'Fryzjer',
                routerLink: '/services/hairdresser',
                state: {type: 'hairdresser'},
                command: () => this.onServiceChange('hairdresser')
              },
              {
                label: 'Barber',
                routerLink: '/services/barber',
                state: {type: 'barber'},
                command: () => this.onServiceChange('barber')
              },
              {
                label: 'Kosmetyka',
                routerLink: '/services/beautician',
                state: {type: 'beautician'},
                command: () => this.onServiceChange('beautician')
              },
              {
                label: 'Salony tatuażu',
                routerLink: '/services/tatoo',
                state: {type: 'tatoo'},
                command: () => this.onServiceChange('tatoo')
              },
              {
                label: 'SPA',
                routerLink: '/services/spa',
                state: {type: 'spa'},
                command: () => this.onServiceChange('spa')
              },
              {
                label: 'Piercing',
                routerLink: '/services/piercing',
                state: {type: 'piercing'},
                command: () => this.onServiceChange('piercing')
              }
            ]
        },
        {
            label: 'O nas',
            routerLink: '/aboutus'
        },
        {
            label: 'Kontakt',
            routerLink: '/contact'
        }
    ];
    }

    setEmployeeMenu(): void {
      this.items = [
        {
          label: 'Home',
          routerLink: '/'
        }
      ]
    }

    setMenagerMenu(): void {
      this.items = [
        {
          label: 'Home',
          routerLink: '/'
        },
        {
          label: 'Pracownicy',
          routerLink: 'manager/company-workers'
        },
        {
          label: 'Rezerwacje',
          routerLink: 'manager/company-reservations'
        },
        {
          label: 'Usługi',
          routerLink: 'manager/company-services'
        },
        {
          label: 'Harmonogram rezerwacji',
          routerLink: '/manager/company-schedule'
        },
        {
          label: 'Harmonogram pracowników',
          routerLink: '/manager/company-worker-schedule'
        }
      ];
    }

    showUserMenu(): void {
      this.languagesMenu = false;
      this.showMenu = !this.showMenu;
    }

    showLanguageMenu(): void {
      this.showMenu = false;
      this.languagesMenu = !this.languagesMenu;
    }

    changeLanguage(): void {
      if (this.selectedLanguage?.name === 'en') {
        this.appComponent.translate('en/global');
      } else if (this.selectedLanguage?.name === 'pl') {
        this.appComponent.translate('pl/global');
      }
    }

    openLoginDialog(type: string): void {
      const ref = this.dialogService.open(LoginDialogComponent, {
        header: 'Logowanie',
        width: '25%',
        data: {
          type: type
        }
      });
      ref.onClose.subscribe((response) => this.handleLoginDialogResponse(response));
    }

    handleLoginDialogResponse(response: any): void {
      if (response.result) {
        this.logIn = true;
        this.messageService.add({key: 'mainToast', severity: 'success', summary:'Sukces', detail:'Sukces'});
      } else {
        this.messageService.add({key: 'mainToast', severity: 'error', summary:'Błąd', detail:'Błąd'});
    }
  }

  logoutAccount(): void {
    this.showMenu = false;
    localStorage.setItem('jwt', '');
    window.location.reload();
    //this.router.navigateByUrl('')
  }

  filterCompanies(event: any) {
    console.log(event.query);
  }

  onServiceChange(type: string): void {
    this.servicesPageComponent.changeServiceType(type);
  }
}
