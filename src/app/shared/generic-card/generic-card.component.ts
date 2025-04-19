import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-generic-card',
  templateUrl: './generic-card.component.html',
  styleUrl: './generic-card.component.scss',
})
export class GenericCardComponent {
  isSubmitted = false;
  errorMessage = '';
  successMessage = '';

  @Input({
    required: true,
  })
  title!: string;

  @Input({
    required: true,
  })
  description!: string;

  @Input({
    required: true,
  })
  genericForm!: FormGroup;

  @Output()
  genericCloseForm = new EventEmitter();

  @Output() submitForm = new EventEmitter();

  get formControls() {
    return this.genericForm.controls;
  }

  closeModal() {
    this.genericCloseForm.emit();
  }
}
