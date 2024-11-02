import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { IJobTitlePopupInputs } from "./job-title-popup-inputs.interface";
import { JobTitleService } from "../../../core/features/jobTitle/services/job-title.service";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { Observable, Subscription, tap } from "rxjs";
import { IJobTitle } from "../../../core/features/jobTitle/models/job-title-overview.model";
import { IJobTitlePayload } from "../../../core/features/jobTitle/models/job-title-payload";
import { markAllControlsAsTouchedAndDirty } from "../../utilities/form.utilities";
import { DialogHeaderComponent } from "../../dialog-header/dialog-header.component";
import { LoadingOverlayComponent } from "../../loading-overlay/loading-overlay.component";
import { SmallHeaderComponent } from "../../small-header/small-header.component";
import { ButtonComponent } from "../../button/button.component";
import { TranslateModule } from "@ngx-translate/core";
import { InputComponent } from "../../input/input.component";
import { TooltipComponent } from "../../tooltip/tooltip.component";
import { MatSlideToggle } from "@angular/material/slide-toggle";

@Component({
  selector: 'ps-job-title-popup',
  standalone: true,
    imports: [
        DialogHeaderComponent,
        LoadingOverlayComponent,
        SmallHeaderComponent,
        ButtonComponent,
        TranslateModule,
        InputComponent,
        TooltipComponent,
        MatSlideToggle
    ],
  templateUrl: './job-title-popup.component.html',
  styleUrl: './job-title-popup.component.scss'
})
export class JobTitlePopupComponent implements OnInit, OnDestroy {
    readonly #jobTitleService = inject(JobTitleService);
    readonly #matDialog = inject(MatDialog);
    readonly #fb = inject(NonNullableFormBuilder);
    readonly componentInputs: IJobTitlePopupInputs = inject(MAT_DIALOG_DATA);
    isPageLoading: boolean = false;
    isFormSubmitting: boolean = false;

    #jobTitle!: IJobTitle;

    #loadJobTitleSubscription: Subscription = new Subscription();

    formGroup = this.#fb.group({
        name: this.#fb.control("", Validators.required),
        isInheritanceActive: this.#fb.control(false),
    });

    ngOnInit(): void {
        this.isPageLoading = true;
        if (this.componentInputs.isEditPopup) {
            this.#initializeEditPopup();
        } else {
            this.isPageLoading = false;
        }
    }

    ngOnDestroy() {
        this.#loadJobTitleSubscription.unsubscribe();
    }

    submitForm() {
        if (!this.formGroup.valid) {
            markAllControlsAsTouchedAndDirty(this.formGroup);
            return;
        }
        this.isFormSubmitting = true;
        if (this.componentInputs.isEditPopup) {
            this.#jobTitleService
                .updateJobTitle(this.formGroup.value as IJobTitlePayload, this.componentInputs.sourceLevel, this.componentInputs.sourceLevelId, this.componentInputs.jobTitleId!)
                .subscribe({
                    next: () => {
                        this.isFormSubmitting = false;
                        this.closeDialog();
                    },
                });
        } else {
            this.#jobTitleService
                .createJobTitle(this.formGroup.value as IJobTitlePayload, this.componentInputs.sourceLevel, this.componentInputs.sourceLevelId)
                .subscribe({
                    next: () => {
                        this.isFormSubmitting = false;
                        this.closeDialog();
                    },
                });
        }
    }

    toggleActivated() {
        this.formGroup.controls.isInheritanceActive.patchValue(!this.formGroup.controls.isInheritanceActive.value);
    }

    closeDialog() {
        this.#matDialog.closeAll();
    }

    #initializeEditPopup() {
        this.#getJobTitle().subscribe({
            complete: () => {
                this.isPageLoading = false;
            }
        });
    }

    #getJobTitle(): Observable<IJobTitle> {
        return this.#jobTitleService.getJobTitle(this.componentInputs.jobTitleId!)
            .pipe(
                tap((jobTitle) => {
                    this.#jobTitle = jobTitle;
                    this.formGroup.patchValue(jobTitle);
                }));
    }
}
