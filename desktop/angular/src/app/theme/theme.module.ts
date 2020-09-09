import {
	MatButtonModule,
	MatButtonToggleModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MatFormFieldModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatNativeDateModule,
	MatOptionModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatSelectModule,
	MatSnackBarModule,
	MatTableModule
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
	MatDialogModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatRadioModule
];

@NgModule({
	imports: [...list],
	exports: [...list],
})
export class ThemeModule {
}
