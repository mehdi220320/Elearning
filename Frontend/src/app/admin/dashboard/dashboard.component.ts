import { Component } from '@angular/core';
import {HackathonService} from '../../services/hackathon.service';
import {Hackathon} from '../../models/Hackathon';
import {CourseService} from '../../services/course.service';
import {Course} from '../../models/Course';
import {ReclamationService} from '../../services/reclamation.service';
import {Reclamation} from '../../models/Reclamation';
import { formatDistanceToNow } from 'date-fns';
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  hackathons:Hackathon[]=[]
  constructor(private hackathonService:HackathonService,
              private courseService:CourseService,
              private userService:UsersService,
              private reclamationservice:ReclamationService) {
  }
  ngOnInit(){
    this.getHackathons();
    this.getCourses();
    this.getReclamations();
    this.getNumberOfUsers();
  }
  reclamations:Reclamation[]=[]
  numberOfReclamations:any=0;
  getReclamations(){
    this.reclamationservice.newest().subscribe({
      next:(res)=>this.reclamations=res,
      error:(err)=>console.error(err)
    })
    this.reclamationservice.numberOfReclamations().subscribe({
      next:(res)=>this.numberOfReclamations=res,
      error:(err)=>console.error(err)
    })
  }
  getRelativeTime(date: string | Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }
  numberOfHackathons:any=0
  getHackathons(){
    this.hackathonService.getNextPaginationHackathons().subscribe({
      next:(res)=>this.hackathons=res,
      error:(err)=>console.error(err)
    })
    this.hackathonService.numberOfHackathons().subscribe({
      next:(res)=>this.numberOfHackathons=res,
      error:(err)=>console.error(err)
    })
  }
  courses:Course[]=[]
  numberCoursesActive:any=0;
  getCourses(){
    this.courseService.newest().subscribe({
      next:(res)=>this.courses=res,
      error:(err)=>console.error(err)
    })
    this.courseService.numberCoursesActive().subscribe({
      next:(res)=>this.numberCoursesActive=res,
      error:(err)=>console.error(err)
    })
  }

  numberOfUsers:any=0;
  getNumberOfUsers(){
    this.userService.numberOfUsers().subscribe({
      next:(res)=>this.numberOfUsers=res,
      error:(err)=>console.error(err)
    })
  }

  formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${this.formatDate(start)} - ${this.formatDate(end)}`;
  }
  private formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
  deleteHackathon(hackathonId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce hackathon?')) {
      this.hackathonService.deleteHackathon(hackathonId).subscribe({
        next: () => {
          this.getHackathons();
        },
        error: (err) => {
          console.error('Error deleting hackathon:', err);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'planned': return 'status-planned';
      case 'ongoing': return 'status-ongoing';
      case 'completed': return 'status-completed';
      case 'canceled': return 'status-canceled';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'scheduled': return 'Planifié';
      case 'ongoing': return 'En cours';
      case 'completed': return 'Terminé';
      case 'canceled': return 'Annulé';
      default: return status;
    }
  }
  deleteCourse(_id: any) {
    // Enhanced confirmation message in French
    const confirmationMessage = "Êtes-vous sûr de vouloir supprimer ce cours ?\n\n" +
      "⚠️ Attention : Cette action supprimera également :\n" +
      "• Tous les chapitres inclus dans ce cours\n" +
      "• Tous les tests associés\n" +
      // "• Les progressions des étudiants\n\n" +
      "Cette action est irréversible.";

    if (confirm(confirmationMessage)) {
      this.courseService.deleteById(_id).subscribe({
        next: (res) => {
          // Remove from local array
            this.getCourses()

          console.log('Cours supprimé avec succès', res);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression du cours. Veuillez réessayer.');
        }
      });
    }
  }

}
