import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {HackathonService} from '../../services/hackathon.service';
import {Hackathon} from '../../models/Hackathon';
import {AuthService} from '../../services/authServices/auth.service';

@Component({
  selector: 'app-hackathon-details',
  standalone: false,
  templateUrl: './hackathon-details.component.html',
  styleUrl: './hackathon-details.component.css'
})
export class HackathonDetailsComponent {
  hackthonId:any="";
  hackathon:Hackathon={
    createdAt:"",
    _id:'',
    title:'',
    location:'',
    startDate:'',
    endDate :'',
    shortDescription:'',
    description:'',
    theme: {_id:'',name:''},
    courses: [],
    status: '',
    fee:0,
    Prizes:'',
    coverImage:{
      path: '',
      contentType: ''
    },
    maxParticipants:0,
    skills:[],
    rules:[],
    objectifs:[],
    participants:[]
  }
  constructor(
    private route:ActivatedRoute,
    private hackathonService:HackathonService,
    private authService:AuthService,
    private sanitizer:DomSanitizer) {}

  ngOnInit(){
    window.scrollTo({ top: 0, behavior: 'instant' });
    this.loadHackathon()
  }
  loadHackathon(){
    this.hackthonId = this.route.snapshot.paramMap.get('id') ;
    this.hackathonService.getById(this.hackthonId).subscribe({
      next:(response)=>{
        this.hackathon=response;
        const userId = this.authService.getUserId();
        if (this.hackathon.participants?.some((p: any) => (p._id ?? p) === userId)) {
          this.follow = true;
        }
      },
      error:(err)=>console.error(err)
    })
  }
  getImage(url: string | null): SafeUrl | string {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80';
  }
  // Add these methods to your HackathonDetailsComponent

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = Math.abs(end.getTime() - start.getTime());
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours} heures`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} jours`;
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'planned': return 'Planifié';
      case 'ongoing': return 'En cours';
      case 'completed': return 'Terminé';
      case 'canceled': return 'Annulé';
      default: return status;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
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
  follow:boolean=false;
  addParticipant(){
    this.hackathonService.addParticipants(this.hackthonId,this.authService.getUserId()).subscribe({
      next:()=> {
        this.follow=true
        console.log("add success")
      },
      error:(err)=>console.log(err)
    })
  }
  removeParticipant(){
    this.hackathonService.removeParticipants(this.hackthonId,this.authService.getUserId()).subscribe({
      next:()=> {
        this.follow=false
        console.log("remove success")
      },
      error:(err)=>console.log(err)
    })
  }
}
