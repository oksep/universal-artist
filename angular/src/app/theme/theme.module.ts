import {
	MatButtonModule,
	MatButtonToggleModule,
	MatCheckboxModule, MatFormFieldModule,
	MatGridListModule,
	MatIconModule, MatInputModule, MatOptionModule,
	MatProgressBarModule,
	MatProgressSpinnerModule, MatSelectModule,
	MatSnackBarModule, MatTableModule, MatDialogModule
} from '@angular/material';

import {NgModule} from '@angular/core';

const list = [
	MatProgressBarModule,
	MatSnackBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatButtonToggleModule,
	MatIconModule,
	MatGridListModule,
	MatProgressSpinnerModule,
	MatTableModule,
	MatFormFieldModule,
	MatOptionModule,
	MatSelectModule,
	MatInputModule,
	MatDialogModule
];

@NgModule({
	imports: [...list],
	exports: [...list],
})
export class ThemeModule {
}
