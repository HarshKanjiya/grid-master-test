import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, EventEmitter, HostListener, Input, model, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-datepicker',
  templateUrl: './custom-date-picker.component.html',
  styleUrls: ['./custom-date-picker.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomDatepickerComponent implements OnInit {
  @Input() dateFormat: string = 'MM/dd/yyyy'; // Default format
  @Input() appendToBody: boolean = true; // Option to append to body

  model = model<any>(); // bind value
  @ViewChild('wrapper') wrapper!: ElementRef<HTMLDivElement>;

  @Output() selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>();

  currentDate = new Date();
  currentYear: number = this.currentDate.getFullYear();
  currentMonth: number = this.currentDate.getMonth();
  selectedDate: Date | null = null;
  isDatePickerOpen: boolean = false;
  showMonthList: boolean = false;
  showYearList: boolean = false;

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  years = Array.from({ length: 100 }, (_, i) => this.currentYear - 50 + i);

  defaultSelectedValue = computed(() => {
    const _value = this.model();
    if (!_value) return '';
    return this.formatDate(new Date(_value), this.dateFormat);
  })

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.wrapper.nativeElement.contains(event.target as Node)){
      this.isDatePickerOpen = this.showMonthList = this.showYearList = false;
    }
  }

  ngOnInit(): void {
    this.updateCalendar();
  }

  // get formattedDate(): string {
  //   if (!this.selectedDate) return '';
  //   return this.formatDate(this.selectedDate, this.dateFormat);
  // }

  get monthDays() {
    return this.getCalendarDays(this.currentYear, this.currentMonth);
  }

  get currentMonthName(): string {
    return this.months[this.currentMonth];
  }

  toggleDatePicker(): void {
    this.isDatePickerOpen = !this.isDatePickerOpen;
  }

  toggleMonthList(): void {
    this.showMonthList = !this.showMonthList;
    this.showYearList = false;
  }

  toggleYearList(): void {
    this.showYearList = !this.showYearList;
    this.showMonthList = false;
  }

  selectMonth(month: string): void {
    this.currentMonth = this.months.indexOf(month);
    this.updateCalendar();
    this.showMonthList = false;
  }

  selectYear(year: number): void {
    this.currentYear = year;
    this.updateCalendar();
    this.showYearList = false;
    this.showMonthList = true;
  }

  selectDate(day: any): void {
    if (day) {
      this.selectedDate = new Date(this.currentYear, this.currentMonth, day.date);
      this.selectedDateChange.emit(this.selectedDate);
      this.isDatePickerOpen = false; // Close date picker after selection (optional)
    }
  }

  isSelectedDate(day: any): boolean {
    return day && this.selectedDate?.getDate() === day.date && this.selectedDate?.getMonth() === this.currentMonth;
  }

  isToday(day: any): boolean {
    if (!day) return false; // Handle null day
    const date = new Date(this.currentYear, this.currentMonth, day.date);
    return date.toDateString() === this.currentDate.toDateString();
  }

  navigateMonth(direction: number): void {
    this.currentMonth += direction;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
    }
    this.updateCalendar();
  }

  formatDate(date: Date, format: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return format.replace('MM', month).replace('dd', day).replace('yyyy', year);
  }

  updateCalendar(increment: number = 0): void {
    // // Increment or decrement the month based on the input parameter
    // this.currentMonth += increment;

    // // If the month exceeds December (11), move to January (0) of the next year
    // if (this.currentMonth > 11) {
    //   this.currentMonth = 0; // Reset month to January
    //   this.currentYear++;     // Move to the next year
    // }
    // // If the month goes below January (0), move to December (11) of the previous year
    // else if (this.currentMonth < 0) {
    //   this.currentMonth = 11; // Reset month to December
    //   this.currentYear--;     // Move to the previous year
    // }

    // // Update the calendar days for the new month and year
    // this.monthDays = this.getCalendarDays(this.currentYear, this.currentMonth);

    // // Reset the selected date to the first day of the new month if needed
    // this.selectedDate = new Date(this.currentYear, this.currentMonth, 1);
    // this.selectedDateChange.emit(this.selectedDate); // Emit the new selected date
  }


  getCalendarDays(year: number, month: number): any[] {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendar = [];
    let week = Array(firstDay).fill(null); // Fill empty days before the first day

    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ date: day });

      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      calendar.push(week.concat(Array(7 - week.length).fill(null))); // Fill trailing empty days
    }

    return calendar;
  }

  // Handle keyboard events
  handleKeydown(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      event.preventDefault(); // Prevent scrolling
      this.toggleDatePicker(); // Open or close calendar
    }
  }

}
