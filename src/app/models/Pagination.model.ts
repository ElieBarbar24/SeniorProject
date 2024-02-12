export class Pagination {
    maxRows: number = 8
    currentthreePage: number[] = [1, 2, 3];
    currentPageIndex: number = 1;
    currentPage: Page = new Page(0, this.maxRows);
    tablePages: Page[] = [];


    genPages(length: number) {
        this.tablePages.push(new Page(0, this.maxRows));
        while (this.tablePages[this.tablePages.length - 1].max < length) {
            this.tablePages.push(new Page(this.tablePages[this.tablePages.length - 1].min + this.maxRows, this.tablePages[this.tablePages.length - 1].max + this.maxRows));
        }
    }

    nextPage() {
        this.currentPage = new Page(this.currentPage.min + this.maxRows, this.currentPage.max + this.maxRows);
        this.currentPageIndex += 1;
        if (this.currentthreePage.includes(this.currentPageIndex)) {
            return;
        }
        this.currentthreePage = [this.currentPageIndex, this.currentPageIndex + 1, this.currentPageIndex + 2];
    }

    prevPage() {
        this.currentPage = new Page(this.currentPage.min - this.maxRows, this.currentPage.max - this.maxRows);
        this.currentPageIndex -= 1;
        if (this.currentthreePage.includes(this.currentPageIndex)) {
            return;
        }
        this.currentthreePage = [this.currentPageIndex - 2, this.currentPageIndex - 1, this.currentPageIndex];
    }

    indexedPage(index: number) {
        this.currentPage = this.tablePages[index];
        this.currentPageIndex = index;
    }

    lastPage() {
        this.currentPage = this.tablePages[this.tablePages.length - 1];
        this.currentPageIndex = this.tablePages.length - 1;
        this.currentthreePage = [this.currentPageIndex - 2, this.currentPageIndex - 1, this.currentPageIndex];
    }

    firstPage() {
        this.currentPage = this.tablePages[0];
        this.currentPageIndex = 1;
        this.currentthreePage = [1, 2, 3];
    }
}


export class Page {
    min: number;
    max: number;
    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }
}