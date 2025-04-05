import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() title!: string;
  @Input() type!: 'create' | 'update' | 'delete';

  @Input() iconType!: string;

  @Output() action = new EventEmitter();
}
