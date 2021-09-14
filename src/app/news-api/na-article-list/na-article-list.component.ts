import { Component, OnInit } from '@angular/core';
import { NewsApiService, Article } from '../news-api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-na-article-list',
  templateUrl: './na-article-list.component.html',
  styleUrls: ['./na-article-list.component.css']
})
export class NaArticleListComponent implements OnInit {
  articles?: Article[];
  public numberOfpages!: number;

  constructor(private newsApiService: NewsApiService) {

  }

  ngOnInit(): void {
    this.newsApiService.pagesOutput.subscribe(articles => {
      this.articles = articles;
    });


    this.newsApiService.getPage(1);
    if (this.numberOfpages === undefined) {
      this.newsApiService.numberOfPages.subscribe(num => {
        this.setTotalPages(num)

      })
    }
  }


  setTotalPages(theNumber: number) {

    this.numberOfpages = theNumber

  }


  getNewPage(pageNumber: number) {
    this.newsApiService.getPage(pageNumber)
  }

  onClick(index: Event) {

    this.getNewPage(index as unknown as number);
  }

}
