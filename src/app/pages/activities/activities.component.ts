import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent {
  activities = [
    {
      id: 1,
      title: 'Kuis Hijaiyah Interaktif',
      description: 'Uji kemampuan mengenal huruf hijaiyah dengan kuis yang menyenangkan',
      icon: '📝',
      type: 'quiz',
      difficulty: 'Mudah',
      duration: '15 menit'
    },
    {
      id: 2,
      title: 'Game Puzzle Nama-nama Allah',
      description: 'Susun puzzle untuk mengenal Asmaul Husna dengan cara yang menyenangkan',
      icon: '🧩',
      type: 'game',
      difficulty: 'Sedang',
      duration: '20 menit'
    },
    {
      id: 3,
      title: 'Mewarnai Masjid',
      description: 'Aktivitas mewarnai digital dengan tema masjid dan ornamen Islam',
      icon: '🎨',
      type: 'creative',
      difficulty: 'Mudah',
      duration: '30 menit'
    },
    {
      id: 4,
      title: 'Karaoke Lagu Islami',
      description: 'Bernyanyi bersama lagu-lagu Islami anak dengan lirik dan nada',
      icon: '🎵',
      type: 'music',
      difficulty: 'Mudah',
      duration: '25 menit'
    }
  ];
}
