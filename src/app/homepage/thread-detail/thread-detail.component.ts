import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-thread-detail',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './thread-detail.component.html',
  styleUrl: './thread-detail.component.scss',
})
export class ThreadDetailComponent {}
