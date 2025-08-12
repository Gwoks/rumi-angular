import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Program {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  ageGroup: string;
  duration: string;
  difficulty: string;
  content: string[];
  features: string[];
}

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.css'
})
export class ProgramsComponent {
  programs: Program[] = [
    {
      id: 1,
      title: 'Belajar Hijaiyah',
      description: 'Mengenal huruf Arab dengan cara yang menyenangkan melalui permainan interaktif',
      icon: '📖',
      color: 'bg-terracotta-100',
      ageGroup: '4-7 tahun',
      duration: '30 menit/sesi',
      difficulty: 'Pemula',
      content: [
        'Pengenalan 28 huruf hijaiyah',
        'Cara menulis huruf Arab yang benar',
        'Harokat dasar (fathah, kasrah, dhammah)',
        'Permainan mencocokkan huruf',
        'Lagu-lagu hijaiyah yang mudah diingat'
      ],
      features: [
        'Animasi interaktif',
        'Suara pengucapan yang jelas',
        'Game edukatif',
        'Progress tracking'
      ]
    },
    {
      id: 2,
      title: 'Shalat Anak',
      description: 'Belajar tata cara shalat yang benar dengan panduan visual dan audio',
      icon: '🕌',
      color: 'bg-sage-100',
      ageGroup: '5-10 tahun',
      duration: '45 menit/sesi',
      difficulty: 'Menengah',
      content: [
        'Rukun dan syarat shalat',
        'Gerakan shalat yang benar',
        'Bacaan dalam shalat',
        'Adab sebelum dan sesudah shalat',
        'Praktik shalat berjamaah'
      ],
      features: [
        'Video tutorial 3D',
        'Audio bacaan shalat',
        'Reminder waktu shalat',
        'Evaluasi gerakan'
      ]
    },
    {
      id: 3,
      title: 'Cerita Nabi',
      description: 'Kisah-kisah inspiratif para nabi dan rasul dengan animasi menarik',
      icon: '📚',
      color: 'bg-cream-200',
      ageGroup: '3-12 tahun',
      duration: '20 menit/cerita',
      difficulty: 'Semua Level',
      content: [
        'Kisah 25 nabi dan rasul',
        'Nilai moral dari setiap cerita',
        'Animasi berkualitas tinggi',
        'Narasi yang menarik',
        'Kuis pemahaman cerita'
      ],
      features: [
        'Animasi 2D yang indah',
        'Narasi profesional',
        'Subtitle bahasa Indonesia',
        'Download untuk offline'
      ]
    },
    {
      id: 4,
      title: 'Akhlak Mulia',
      description: 'Mengajarkan nilai-nilai moral dan etika Islam dalam kehidupan sehari-hari',
      icon: '⭐',
      color: 'bg-terracotta-100',
      ageGroup: '6-12 tahun',
      duration: '35 menit/sesi',
      difficulty: 'Menengah',
      content: [
        'Akhlak kepada Allah SWT',
        'Akhlak kepada sesama manusia',
        'Akhlak kepada lingkungan',
        'Contoh aplikasi dalam kehidupan',
        'Role play dan simulasi'
      ],
      features: [
        'Scenario berbasis kehidupan nyata',
        'Interactive role playing',
        'Reward system',
        'Parent engagement tools'
      ]
    },
    {
      id: 5,
      title: 'Hafalan Doa',
      description: 'Menghafal doa-doa harian dengan metode yang mudah dan menyenangkan',
      icon: '🤲',
      color: 'bg-sage-100',
      ageGroup: '3-10 tahun',
      duration: '25 menit/sesi',
      difficulty: 'Pemula',
      content: [
        'Doa sehari-hari lengkap',
        'Teknik menghafal yang efektif',
        'Arti dan makna setiap doa',
        'Adab berdoa yang benar',
        'Praktik doa bersama'
      ],
      features: [
        'Audio dengan tajwid yang benar',
        'Visualisasi arti doa',
        'Repetition exercises',
        'Achievement badges'
      ]
    },
    {
      id: 6,
      title: 'Iqra Interaktif',
      description: 'Belajar membaca Al-Quran dengan metode Iqra yang telah terbukti efektif',
      icon: '📜',
      color: 'bg-cream-200',
      ageGroup: '5-12 tahun',
      duration: '40 menit/sesi',
      difficulty: 'Pemula-Mahir',
      content: [
        'Metode Iqra 1-6 lengkap',
        'Tajwid dasar yang mudah dipahami',
        'Latihan membaca bertahap',
        'Evaluasi kemampuan membaca',
        'Sertifikat kelulusan digital'
      ],
      features: [
        'AI voice recognition',
        'Personalized learning path',
        'Real-time feedback',
        'Progress monitoring'
      ]
    }
  ];

  selectedCategory: string = 'all';
  categories = [
    { id: 'all', name: 'Semua Program', icon: '🌟' },
    { id: 'quran', name: 'Al-Quran', icon: '📖' },
    { id: 'worship', name: 'Ibadah', icon: '🕌' },
    { id: 'stories', name: 'Cerita', icon: '📚' },
    { id: 'moral', name: 'Akhlak', icon: '⭐' }
  ];

  get filteredPrograms() {
    if (this.selectedCategory === 'all') {
      return this.programs;
    }
    
    const categoryMap: { [key: string]: number[] } = {
      'quran': [1, 6], // Hijaiyah, Iqra
      'worship': [2, 5], // Shalat, Doa
      'stories': [3], // Cerita Nabi
      'moral': [4] // Akhlak
    };
    
    const categoryIds = categoryMap[this.selectedCategory] || [];
    return this.programs.filter(program => categoryIds.includes(program.id));
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
  }
}
