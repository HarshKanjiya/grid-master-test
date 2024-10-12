import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, EventEmitter, HostListener, Input, Output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  styleUrls: ['./custom-date-picker.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CustomDatePickerComponent {
  @Input() selectedDate: string | null = null;  // Allow parent to provide initial date
  @Output() dateSelected = new EventEmitter<string>();  // Emit date when it changes

  isDatePickerOpen = signal<boolean>(false);
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  daysInMonth: number[] = [];

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  @ViewChild('datePickerElement') datePickerElement!: ElementRef<HTMLDivElement>;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.datePickerElement.nativeElement.contains(event.target as Node)) this.isDatePickerOpen.set(true);
    else this.isDatePickerOpen.set(false)

  }

  constructor() {
    this.generateDaysInMonth(this.currentMonth, this.currentYear);
  }

  toggleDatePicker() {
    this.isDatePickerOpen.set(!this.isDatePickerOpen());
  }

  generateDaysInMonth(month: number, year: number) {
    const date = new Date(year, month + 1, 0);
    const daysCount = date.getDate();
    this.daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateDaysInMonth(this.currentMonth, this.currentYear);
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateDaysInMonth(this.currentMonth, this.currentYear);
  }

  selectDate(day: number) {
    this.selectedDate = `${this.pad(day)}/${this.pad(this.currentMonth + 1)}/${this.currentYear}`;
    this.isDatePickerOpen.set(false);
    this.emitSelectedDate();
  }

  pad(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  emitSelectedDate() {
    this.dateSelected.emit(this.selectedDate);  // Emit the selected date
  }

  isSelected(day: number): boolean {
    const selectedDay = parseInt(this.selectedDate?.split('/')[0] || '', 10);
    const selectedMonth = parseInt(this.selectedDate?.split('/')[1] || '', 10) - 1;
    const selectedYear = parseInt(this.selectedDate?.split('/')[2] || '', 10);

    return selectedDay === day && this.currentMonth === selectedMonth && this.currentYear === selectedYear;
  }
}
