import {MatButtonModule, MatButtonToggleModule, MatCheckboxModule, MatIconModule} from '@angular/material';
import {NgModule} from '@angular/core';

const list = [
  MatButtonModule, MatCheckboxModule, MatButtonToggleModule, MatIconModule
];

@NgModule({
  imports: [...list],
  exports: [...list],
})
export class ThemeModule {
}
