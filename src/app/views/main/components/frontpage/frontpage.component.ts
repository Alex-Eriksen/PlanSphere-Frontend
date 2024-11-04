import { Component } from '@angular/core';
import { UploadFileDropZoneComponent } from "../../../../shared/upload-logo/upload-logo.component";
import { InputComponent } from "../../../../shared/input/input.component";

@Component({
  selector: 'ps-frontpage',
  standalone: true,
    imports: [
        UploadFileDropZoneComponent,
        InputComponent
    ],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.scss'
})
export class FrontpageComponent {

}
