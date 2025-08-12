import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  programs = [
    {
      id: 1,
      title: 'Belajar Hijaiyah',
      description: 'Mengenal huruf Arab dengan cara yang menyenangkan',
      icon: '📖',
      color: 'bg-terracotta-100'
    },
    {
      id: 2,
      title: 'Shalat Anak',
      description: 'Belajar tata cara shalat yang benar untuk anak-anak',
      icon: '🕌',
      color: 'bg-sage-100'
    },
    {
      id: 3,
      title: 'Cerita Nabi',
      description: 'Kisah-kisah inspiratif para nabi dan rasul',
      icon: '📚',
      color: 'bg-cream-200'
    },
    {
      id: 4,
      title: 'Akhlak Mulia',
      description: 'Mengajarkan nilai-nilai moral dan etika Islam',
      icon: '⭐',
      color: 'bg-terracotta-100'
    }
  ];

  testimonials = [
    {
      name: 'Sarah & Keluarga',
      text: 'RUMI membantu anak saya belajar Islam dengan cara yang sangat menyenangkan!',
      rating: 5
    },
    {
      name: 'Ahmad & Fatimah',
      text: 'Program di RUMI sangat interaktif dan mudah dipahami anak-anak.',
      rating: 5
    },
    {
      name: 'Keluarga Bahagia',
      text: 'Terima kasih RUMI, anak-anak jadi lebih antusias belajar agama.',
      rating: 5
    }
  ];

  stats = [
    { number: '1000+', label: 'Anak Bahagia' },
    { number: '50+', label: 'Program Menarik' },
    { number: '100+', label: 'Keluarga Puas' },
    { number: '24/7', label: 'Dukungan' }
  ];
}
