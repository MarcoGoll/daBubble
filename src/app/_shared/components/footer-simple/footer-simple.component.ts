import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer-simple',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer-simple.component.html',
  styleUrl: './footer-simple.component.scss',
})
export class FooterSimpleComponent {}
