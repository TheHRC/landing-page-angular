import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { tap, map, switchMap, pluck, catchError } from 'rxjs/operators'
import { HttpParams, HttpClient } from '@angular/common/http';
import { NotificationsService } from '../notifications/notifications.service';


export interface Article {
  title: string;
  url: string;
  urlToImage: string;
  author: string;
  description: string;
  source: {
    name: string;
  }
}

interface NewsApiResponse {
  totalResults: number;
  articles: Article[]
}


@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10;
  private apiKey = '10fde3f0859148acbd339e6458bbc492';
  private country = 'in';

  private pagesInput: Subject<number>;
  pagesOutput: Observable<Article[]>;
  numberOfPages: Subject<number>;

  private newsFetchedStatus: boolean

  constructor(private http: HttpClient, private notificationService: NotificationsService) {
    this.newsFetchedStatus = false;
    this.numberOfPages = new Subject();
    this.pagesInput = new Subject();
    this.pagesOutput = this.pagesInput.pipe(
      map((page) => {
        return new HttpParams()
          .set('apiKey', this.apiKey)
          .set('country', this.country)
          .set('pageSize', this.pageSize)
          .set('page', page)
      }),
      switchMap((params) => {
        return this.http.get<NewsApiResponse>(this.url, { params });
      }),
      tap(response => {
        const totalPages = Math.ceil(response.totalResults / this.pageSize)
        this.numberOfPages.next(totalPages);
        if (!this.newsFetchedStatus) {
          this.notificationService.addSuccess(`${response.totalResults} news fetched!`);
          this.newsFetchedStatus = true
        }
      }),
      catchError((err) => {
        this.notificationService.addError("Error while fetching news articles!")
        return throwError(err);
      }),
      pluck('articles')
    );
  }
  getPage(page: number) {
    this.pagesInput.next(page);
  }

}
