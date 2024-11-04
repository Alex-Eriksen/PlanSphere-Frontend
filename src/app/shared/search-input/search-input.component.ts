import { Component, ElementRef, input, Input, signal, ViewChild, WritableSignal } from "@angular/core";
import { AfterViewInit, OnDestroy } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, fromEvent, map, Subscription } from "rxjs";
import { MatFormField, MatLabel, MatSelect, MatSuffix } from "@angular/material/select";
import { NgClass } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MatInput } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'ps-search-input',
  standalone: true,
  imports: [
      MatIcon,
      MatSuffix,
      MatLabel,
      MatFormField,
      MatInput,
      TranslateModule,
      NgClass,
      MatSelect,
      ReactiveFormsModule,
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent implements AfterViewInit, OnDestroy {
    @Input() searchSignal: WritableSignal<string> = signal("");
    placeholder = input<string>("SEARCH");
    control = input<FormControl<any>>(new FormControl());
    @ViewChild("searchInput") search!: ElementRef<HTMLInputElement>;
    appliedClass = input<string>();
    debounceTime = input(500);
    searchInputValue$: Subscription = new Subscription();

    ngAfterViewInit(): void {
        this.searchInputValue$ = fromEvent<Event>(this.search.nativeElement, "input")
            .pipe(
                map((event) => (event.target as HTMLInputElement).value.trim()),
                debounceTime(this.debounceTime()),
                distinctUntilChanged(),
            )
            .subscribe((value: string) => {
                this.searchSignal.set(value);
            });
        if (this.control().value) {
            this.searchSignal.set(this.control().value);
        }
    }

    ngOnDestroy(): void {
        this.searchInputValue$.unsubscribe();
    }
}
