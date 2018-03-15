import {
	MatButtonModule,
	MatButtonToggleModule,
	MatCheckboxModule,
	MatGridListModule,
	MatIconModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatSnackBarModule
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
	MatProgressSpinnerModule
];

@NgModule({
	imports: [...list],
	exports: [...list],
})
export class ThemeModule {
}
