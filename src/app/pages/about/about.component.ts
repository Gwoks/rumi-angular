import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  team = [
    {
      name: 'Dr. Ahmad Rahman',
      role: 'Founder & CEO',
      description: 'Ahli pendidikan Islam dengan pengalaman 15 tahun',
      avatar: '👨‍🏫'
    },
    {
      name: 'Siti Khadijah',
      role: 'Head of Curriculum',
      description: 'Spesialis pengembangan kurikulum anak usia dini',
      avatar: '👩‍🏫'
    },
    {
      name: 'Muhammad Yusuf',
      role: 'Technology Director',
      description: 'Expert dalam teknologi pendidikan interaktif',
      avatar: '👨‍💻'
    }
  ];
}
