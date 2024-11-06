import { Component, DestroyRef, EventEmitter, inject, input, OnInit, Output } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { NgClass, NgOptimizedImage } from "@angular/common";
import { FormControl } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { transferBytesUtility } from "../utilities/transfer-bytes.utility";
import { ButtonComponent } from "../button/button.component";
import { SmallHeaderComponent } from "../small-header/small-header.component";

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
    protected readonly transferBytes = transferBytesUtility;
    image = input.required<FormControl<File | null | string>>();
    label = input.required<string>();
    fileSizeConvertToBytes: number = 0;
    displayImage: string = "";
    @Output() uploadedFile: EventEmitter<File> = new EventEmitter();


    selectImage(event: Event): void {
        const element = event.currentTarget as HTMLInputElement;
        let image: File | null = null;
        if (element.files && element.files.length > 0) {
            image = element.files[0];
            this.fileSizeConvertToBytes = image.size;
            this.image().setValue(image);
        }
        if (image) {
            this.setImageUrlOnLoadedWithImageDimensions(image);
            this.resizeAndCropImage(image, 200).then((resizedFile) => {
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

    resizeAndCropImage(file: File, targetSize: number): Promise<File> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = targetSize;
                canvas.height = targetSize;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject("Couldn't get canvas context");
                    return;
                }

                const scale = Math.min(img.width / targetSize, img.height / targetSize);
                const offsetX = (img.width - targetSize * scale) / 2;
                const offsetY = (img.height - targetSize * scale) / 2;

                ctx.drawImage(img, offsetX, offsetY, img.width - offsetX * 2, img.height - offsetY * 2, 0, 0, targetSize, targetSize);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const resizedFile = new File([blob], file.name, { type: file.type });
                        resolve(resizedFile);
                    } else {
                        reject("Canvas conversion to Blob failed");
                    }
                }, file.type);
            };

            img.onerror = () => {
                reject("Image load error");
            };
        });
    }

}
