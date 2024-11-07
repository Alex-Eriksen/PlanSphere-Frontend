import { Component, DestroyRef, inject, input, OnInit, output } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { NgClass, NgOptimizedImage } from "@angular/common";
import { FormControl } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ButtonComponent } from "../button/button.component";
import { SmallHeaderComponent } from "../small-header/small-header.component";
import { Observable } from "rxjs";

@Component({
  selector: 'ps-upload-logo',
  standalone: true,
    imports: [
        TranslateModule, NgOptimizedImage, NgClass, ButtonComponent, SmallHeaderComponent
    ],
  templateUrl: './upload-logo.component.html',
  styleUrl: './upload-logo.component.scss'
})
export class UploadFileDropZoneComponent implements OnInit{
    readonly #destroyRef$ = inject(DestroyRef);
    image = input.required<FormControl<File | null | string>>();
    label = input.required<string>();
    displayImage: string = "";
    uploadedFile = output<File>();

    selectImage(event: Event): void {
        const element = event.currentTarget as HTMLInputElement;
        let image: File | null = null;
        if (element.files && element.files.length > 0) {
            image = element.files[0];
            this.image().setValue(image);
        }
        if (image) {
            this.setImageUrlOnLoadedWithImageDimensions(image);
            this.resizeAndCropImage(image, 200).subscribe((resizedFile) => {
                this.uploadedFile.emit(resizedFile);
            })
        }
    }

    setImageUrlOnLoadedWithImageDimensions(image: File) {
        const reader = new FileReader();
        reader.onload = (image: ProgressEvent<FileReader>) => {
            const img = new Image();
            img.src = image.target?.result as string;
            this.displayImage = img.src;
        };
        reader.readAsDataURL(image);
    }

    ngOnInit() {
        this.setImageUrl();
    }

    setImageUrl() {
        this.image()
            .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef$))
            .subscribe((data) => {
                if (data) this.displayImage = String(data);
            });
    }

    resizeAndCropImage(file: File, targetSize: number): Observable<File> {
        return new Observable((observer) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = targetSize;
                canvas.height = targetSize;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    observer.error("Couldn't get canvas context");
                    observer.complete();
                    return;
                }

                const scale = Math.min(img.width / targetSize, img.height / targetSize);
                const offsetX = (img.width - targetSize * scale) / 2;
                const offsetY = (img.height - targetSize * scale) / 2;

                ctx.drawImage(img, offsetX, offsetY, img.width - offsetX * 2, img.height - offsetY * 2, 0, 0, targetSize, targetSize);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const resizedFile = new File([blob], file.name, { type: file.type });
                        observer.next(resizedFile);
                        observer.complete();
                    } else {
                        observer.error("Canvas conversion to Blob failed");
                    }
                }, file.type);
            };

            img.onerror = () => {
                observer.error("Image load error");
            };
        });
    }

}
