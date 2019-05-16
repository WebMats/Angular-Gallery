import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { environment } from '../../environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = this.auth.getToken();
        const authedRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
            url: `${environment.baseURL}${req.url}`
        });
        return next.handle(authedRequest);
    }
}