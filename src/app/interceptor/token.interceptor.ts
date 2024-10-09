import {
    HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class tokenInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        request = request.clone({
            setHeaders: { Authorization: `Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjQxIiwiVXNlck5hbWUiOiJPTiIsImV4cCI6MTc1NjQ0MTUwNCwiaXNzIjoiQUpFIiwiYXVkIjoiQUpFLUluZm8ifQ.dNMR28e3UklMv0qc1BupPt7jX0mcE8T1_wc0Tb-jPjY` },
        });
        return next.handle(request);
    }
}
