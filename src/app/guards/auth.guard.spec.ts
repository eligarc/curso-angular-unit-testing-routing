import { TestBed } from "@angular/core/testing";
import { AuthGuard } from "./auth.guard";
import { TokenService } from "../services/token.service";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { fakeActivatedRouteSnapshot, fakeParamMap, fakeRouterStateSnapshot, mockObservable } from "src/testing";
import { generateOneUser } from "../models/user.mock";

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let tokenService: jasmine.SpyObj<TokenService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getToken', 'removeToken']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if user is logged in', (doneFn) => {
    const activatedRoute = fakeActivatedRouteSnapshot({
      // params: {
      //   idProduct: '1',
      // },
      // paramMap: fakeParamMap({
      //   idProduct: '1',
      // }),
    });
    const routerState = fakeRouterStateSnapshot({});
    const userMock = generateOneUser();

    authService.getUser.and.returnValue(mockObservable(userMock));
    guard.canActivate(activatedRoute, routerState)
      .subscribe(canActivate => {
        expect(canActivate).toBeTruthy();
        doneFn();
      });
  });

  it('should return false without session', (doneFn) => {
    const activatedRoute = fakeActivatedRouteSnapshot({
      // params: {
      //   idProduct: '1',
      // },
      // paramMap: fakeParamMap({
      //   idProduct: '1',
      // }),
    });
    const routerState = fakeRouterStateSnapshot({});

    authService.getUser.and.returnValue(mockObservable(null));
    guard.canActivate(activatedRoute, routerState)
      .subscribe(canActivate => {
        expect(canActivate).toBeFalsy();
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        doneFn();
      });
  });

  it('should return false with idProduct params', (doneFn) => {
    const activatedRoute = fakeActivatedRouteSnapshot({
      // params: {
      //   idProduct: '1',
      // },
      // paramMap: fakeParamMap({
      //   idProduct: '1',
      // }),
    });
    const routerState = fakeRouterStateSnapshot({});

    authService.getUser.and.returnValue(mockObservable(null));
    guard.canActivate(activatedRoute, routerState)
      .subscribe(canActivate => {
        expect(canActivate).toBeFalsy();
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        doneFn();
      });
  });
});
