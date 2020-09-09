import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';

@Component({
	selector: 'app-tag-input',
	templateUrl: './tag-input.component.html',
	styleUrls: ['./tag-input.component.scss']
})
export class TagInputComponent implements OnInit {

	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = false;
	separatorKeysCodes = [ENTER, COMMA];
	formCtrl = new FormControl();
	filteredTags: Observable<string[]>;

	@ViewChild('tagInput') tagInput: ElementRef;

	// allTags: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
	@Input() allTags: string[] = [];

	private _tags: string[] = [];

	@Input()
	set tags(tags: string[]) {
		this._tags = tags || [];
	}

	get tags(): string[] {
		return this._tags;
	}

	@Output() tagsChange = new EventEmitter();

	constructor() {
		this.filteredTags = this.formCtrl.valueChanges.pipe(
			startWith(null),
			map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice())
		);
	}

	ngOnInit() {
	}

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add our tag
		if ((value || '').trim()) {
			this.tags.push(value.trim());
			this.tagsChange.emit(this.tags);
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}

		this.formCtrl.setValue(null);
	}

	remove(tag: string): void {
		const index = this.tags.indexOf(tag);

		if (index >= 0) {
			this.tags.splice(index, 1);
			this.tagsChange.emit(this.tags);
		}
	}

	selected(event: MatAutocompleteSelectedEvent): void {
		this.tags.push(event.option.viewValue);
		this.tagsChange.emit(this.tags);
		this.tagInput.nativeElement.value = '';
		this.formCtrl.setValue(null);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();
		return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
	}
}
