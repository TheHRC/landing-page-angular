import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  // TODO: make sure we receive the value from the parent component
  @Input() numberOfPages: number;
  pageOptions: number[];

  @Output() pageNumberEmitter = new EventEmitter()

  currentPage = 1;



  constructor() {

  }

  ngOnInit(): void {

    this.addToPageOptions()

  }


  onClick(index: number) {
    this.currentPage = index
    this.pageNumberEmitter.emit(index)
    // console.log(index)
    this.addToPageOptions()

  }

  addToPageOptions(): void {
    this.pageOptions = [
      this.currentPage - 2,
      this.currentPage - 1,
      this.currentPage,
      this.currentPage + 1,
      this.currentPage + 2,
    ].filter(pageNumber => pageNumber >= 1 && pageNumber <= this.numberOfPages)
  }

}
