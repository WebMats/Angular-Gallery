import { NgModule } from "@angular/core";

import { 
    MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, 
    MatExpansionModule, MatProgressSpinnerModule } from '@angular/material';


@NgModule({
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
    ]
})
export class AngularMaterialModule {}