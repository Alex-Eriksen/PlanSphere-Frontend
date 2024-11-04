import { Component, effect, Input, signal } from "@angular/core";
import { ISignalPaginatedResponse } from "../interfaces/signal-paginated-response.interface";
import { TranslateModule } from "@ngx-translate/core";
import { NgClass } from "@angular/common";
import { MatOption } from "@angular/material/autocomplete";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: 'ps-pagination',
  standalone: true,
    imports: [
        TranslateModule,
        NgClass,
        MatOption,
        MatSelect
    ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
    pages: number[] = [];
    firstPage: number = 1;
    @Input() paginationValues: ISignalPaginatedResponse = {
        currentPage: signal(1),
        pageSize: signal(10),
        totalPages: signal(0),
        totalCount: signal(0),
        results: signal([]),
    };
    pageSizeRange: number[] = [5, 10, 15, 20, 25, 50, 100];
    @Input() type = "ITEMS";

    updatePagesEffect$ = effect(() => {
        this.updatePages(this.paginationValues.totalPages());
    });

    get paginationStartingIndex(): number {
        return (this.paginationValues.currentPage() - 1) * this.paginationValues.pageSize() + 1;
    }

    get paginationEndingIndex(): number {
        return Math.min(
            this.paginationValues.currentPage() * this.paginationValues.pageSize(),
            this.paginationValues.totalCount(),
        );
    }

    updatePages(pages?: number): void {
        if (!pages) return;
        this.pages = [];
        if (pages <= 5) {
            this.updateTableUnderFivePages();
        } else {
            this.updateTableOverThanFivePages();
        }
    }

    updateTableUnderFivePages() {
        for (let i = 2; i < this.paginationValues.totalPages(); i++) {
            this.pages.push(i);
        }
    }

    updateTableOverThanFivePages() {
        if (this.paginationValues.currentPage() < 4) {
            for (let i = 2; i < 4; i++) {
                this.pages.push(i);
            }
        } else {
            for (let i = 2; i < this.paginationValues.totalPages(); i++) {
                if (i >= this.paginationValues.currentPage() && i <= this.paginationValues.currentPage()) {
                    this.pages.push(i);
                }
            }
        }
    }

    nextPage() {
        this.#updatePageNumber(this.paginationValues.currentPage() + 1);
    }

    previousPage() {
        this.#updatePageNumber(this.paginationValues.currentPage() - 1);
    }

    updateSelectedPageNumber(pageNumber: number) {
        this.#updatePageNumber(pageNumber);
    }

    updateDataByPageSize(pageSize: number) {
        this.paginationValues.pageSize.set(pageSize);
        this.paginationValues.currentPage.set(1);
    }

    #updatePageNumber(pageNumber: number): void {
        this.paginationValues.currentPage.set(pageNumber);
    }
}
