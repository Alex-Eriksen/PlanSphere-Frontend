import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink } from "@angular/router";
import { BreadcrumbItem } from "./breadcrumb-item.type";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'ps-breadcrumb',
  standalone: true,
    imports: [
        TranslateModule,
        NgOptimizedImage,
        RouterLink
    ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent implements OnInit {
    readonly #route = inject(ActivatedRoute);
    readonly #router = inject(Router);
    readonly #destroyRef$ = inject(DestroyRef);
    protected breadcrumbItems: BreadcrumbItem[] = [];

    ngOnInit() {
        this.#fillBreadcrumbItemsRecursive(this.#route.snapshot);
        this.#subscribeToRouteChange();
    }

    #fillBreadcrumbItemsRecursive(snapshot: ActivatedRouteSnapshot | null): void {
        if (!snapshot) return;
        if (snapshot.data["name"]) {
            this.breadcrumbItems.push({
                name: snapshot.data["name"],
                url: this.#getRelativeUrl(snapshot),
            });
        }
        this.#fillBreadcrumbItemsRecursive(snapshot.firstChild);
    }

    #getRelativeUrl(snapshot: ActivatedRouteSnapshot): string {
        return (
            "/" +
            snapshot.pathFromRoot
                .map((route) => route.url.map((segment) => segment.toString()).join("/"))
                .filter((route) => !!route)
                .join("/")
        );
    }

    #subscribeToRouteChange(): void {
        this.#router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this.#destroyRef$),
            )
            .subscribe(() => {
                this.breadcrumbItems = [];
                this.#fillBreadcrumbItemsRecursive(this.#route.snapshot.firstChild);
            });
    }
}
