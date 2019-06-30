import { NgModule } from "@angular/core";

import { 
    MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, 
    MatExpansionModule, MatProgressSpinnerModule, MatPaginatorModule } from '@angular/material';


@NgModule({
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
    ]
})
export class AngularMaterialModule {}