import { Component } from '@angular/core';
import {ChapitreService} from '../../../services/chapitre.service';
import {Chapitre} from '../../../models/Chapitres';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-media-list',
  standalone: false,
  templateUrl: './media-list.component.html',
  styleUrl: './media-list.component.css'
})
export class MediaListComponent {
  chapitresWM: Chapitre[] = [];
  filteredChapters: Chapitre[] = [];
  courses: {_id: string, title: string}[] = [];

  // Unified video array
  videos: { chapitre: Chapitre, sectionIndex: number, url: string, title: string, duration?: number }[] = [];
  filteredVideos: typeof this.videos = [];

  searchText: string = '';
  selectedCourse: string = '';
  currentPage: number = 1;
  pageSize: number = 6;
  isLoading: boolean = false;

  selectedVideo: typeof this.videos[0] | null = null;
  videoUrl: SafeResourceUrl | null = null;
  showVideoModal: boolean = false;

  constructor(
    private chapitreService: ChapitreService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadChapters();
  }

  loadChapters(): void {
    this.isLoading = true;
    this.chapitreService.getChaptersWithMedia().subscribe({
      next: (chapitres: Chapitre[]) => {
        this.chapitresWM = chapitres;
        this.filteredChapters = chapitres;
        this.extractCourses();
        this.stackVideos();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  extractCourses(): void {
    const courseMap = new Map<string, {_id: string, title: string}>();
    this.chapitresWM.forEach(chap => {
      if (chap.course) courseMap.set(chap.course._id, chap.course);
    });
    this.courses = Array.from(courseMap.values());
  }

  // Stack all video sections into a single array
  private stackVideos(): void {
    this.videos = [];
    this.chapitresWM.forEach(chap => {
      chap.section.forEach((sec, index) => {
        if (sec.url) {
          this.videos.push({
            chapitre: chap,
            sectionIndex: index,
            url: sec.url,
            title: sec.title,
            duration: sec.dureeVideo
          });
        }
      });
    });
    this.filteredVideos = [...this.videos];
  }

  applyFilters(): void {
    const search = this.searchText.toLowerCase();

    // Filter chapters
    this.filteredChapters = this.chapitresWM.filter(chap => {
      const matchesSearch = chap.title.toLowerCase().includes(search) ||
        chap.description.toLowerCase().includes(search) ||
        chap.section.some(sec => sec.title.toLowerCase().includes(search));
      const matchesCourse = this.selectedCourse === '' || (chap.course && chap.course._id === this.selectedCourse);
      return matchesSearch && matchesCourse;
    });

    // Filter videos
    this.filteredVideos = this.videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(search) ||
        video.chapitre.title.toLowerCase().includes(search);
      const matchesCourse = this.selectedCourse === '' || (video.chapitre.course && video.chapitre.course._id === this.selectedCourse);
      return matchesSearch && matchesCourse;
    });

    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedCourse = '';
    this.applyFilters();
  }

  // Video player
  playVideo(video: typeof this.videos[0]): void {
    this.selectedVideo = video;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getEmbedUrl(video.url));
    this.showVideoModal = true;
  }

  closeVideoPlayer(): void {
    this.showVideoModal = false;
    this.selectedVideo = null;
    this.videoUrl = null;
  }

  private getEmbedUrl(url: string): string {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = this.extractYouTubeId(url);
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  }

  private extractYouTubeId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  // Pagination
  get paginatedVideos(): typeof this.videos {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredVideos.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.filteredVideos.length / this.pageSize)).fill(0).map((_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages.length) this.currentPage++;
  }

  getVideoThumbnail(url: string): string {
    if (!url) return 'assets/images/video-placeholder.jpg';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = this.extractYouTubeId(url);
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return 'assets/images/video-placeholder.jpg';
  }
}
