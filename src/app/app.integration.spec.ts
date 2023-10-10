import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { RouterTestingModule } from "@angular/router/testing";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Router, RouterLinkWithHref } from "@angular/router";
import { asyncData, clickElement, getText, query, queryAllByDirective } from "src/testing";
import { routes } from './app-routing.module';
import { AppModule } from './app.module';
import { ProductsService } from "./services/product.service";
import { generateManyProducts } from "./models/product.mock";
import { AuthService } from "./services/auth.service";
import { generateOneUser } from "./models/user.mock";
// @Component({ selector: 'app-pico-preview' })

// class PicoPreviewComponent { }

// @Component({ selector: 'app-people' })

// class PeopleComponent { }

// @Component({ selector: 'app-others' })

// class OthersComponent { }

// const routers = [
//   {
//     path: 'pico-preview',
//     component: PicoPreviewComponent
//   },
//   {
//     path: 'people',
//     component: PeopleComponent
//   },
//   {
//     path: 'others',
//     component: OthersComponent
//   },
// ]

describe('App Integration test', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;
  let productService: jasmine.SpyObj<ProductsService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', ['getAll']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);

    await TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        { provide: ProductsService, useValue: productServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
      // declarations: [
      //   AppComponent,
      //   PicoPreviewComponent,
      //   PeopleComponent,
      //   OthersComponent
      // ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(fakeAsync(() => {
    router = TestBed.inject(Router);
    productService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router.initialNavigation();
    tick();
    fixture.detectChanges();
  }));

  it('shout create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should there are 7 routerlinks', () => {
    const links = queryAllByDirective(fixture, RouterLinkWithHref);

    expect(links.length).toEqual(7);
  });

  it('should render OthersComponent when clicked with session', fakeAsync(() => {
    const productsMocks = generateManyProducts(10);
    productService.getAll.and.returnValue(asyncData(productsMocks));

    const userMock = generateOneUser();
    authService.getUser.and.returnValue(asyncData(userMock));

    clickElement(fixture, 'others-link', true);

    tick(); // wait while nav...
    fixture.detectChanges(); // ngOnInit - OthersComponent

    tick();
    fixture.detectChanges(); // ngOnInit - OthersComponent

    expect(router.url).toEqual('/others');
    const element = query(fixture, 'app-others');
    expect(element).not.toBeNull();

    const text = getText(fixture, 'products-length');
    expect(text).toContain(productsMocks.length.toString());
  }));

  it('should render OthersComponent when clicked without session', fakeAsync(() => {

    authService.getUser.and.returnValue(asyncData(null));

    clickElement(fixture, 'others-link', true);

    tick(); // wait while nav...
    fixture.detectChanges(); // ngOnInit - OthersComponent

    tick();
    fixture.detectChanges(); // ngOnInit - OthersComponent

    expect(router.url).toEqual('/');
  }));

  it('should render PicoPreviewComponent when clicked', fakeAsync(() => {
    clickElement(fixture, 'pico-link', true);
    tick(); // wait while nav...
    fixture.detectChanges(); // ngOnInit - PicoPreviewComponent

    expect(router.url).toEqual('/pico-preview');
    const element = query(fixture, 'app-pico-preview');
    expect(element).not.toBeNull();
  }));
});
