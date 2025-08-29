import {Component, OnInit} from '@angular/core';
import {Reclamation} from '../../../models/Reclamation';
import {ReclamationService} from '../../../services/reclamation.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-reclamation-details',
  standalone: false,
  templateUrl: './reclamation-details.component.html',
  styleUrl: './reclamation-details.component.css'
})
export class ReclamationDetailsComponent implements OnInit{
  reclamation: Reclamation = {
    _id: '',
    sujet: '',
    type: '',
    creator: {
      _id: '',
      firstname: '',
      lastname: '',
      picture: '',
      email: '',
      phone: 0,
      role: '',
      createdAt: '',
      isActive: false
    },
    cours: {
      _id: '',
      title: '',
      coverImage: {
        path: '',
        contentType: ''
      },
      description: '',
      formateur: {
        _id: '',
        firstname: '',
        lastname: ''
      },
      categorie: {
        _id: '',
        name: ''
      },
      status: false,
      prix: 0,
      description_detaillee: '',
      niveau: '',
      duree: '',
      langue: '',
      certificat: false,
      rating: 0,
      createdAt: '',
      learns: []
    },
    hackathon: {
      createdAt:'',
      _id: '',
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      shortDescription: '',
      description: '',
      theme: {
        _id: '',
        name: ''
      },
      courses: [],
      status: '',
      fee: 0,
      Prizes: '',
      coverImage: {
        path: '',
        contentType: ''
      },
      maxParticipants: 0,
      objectifs: [],
      skills: [],
      rules: [],
      participants: []
    },
    description: '',
    seen: false,
    createdAt: '',
    updatedAt: ''
  };
  reclamationId:any=""
  constructor(private reclamationService:ReclamationService,
              private route:ActivatedRoute,
              private location: Location,
              private router: Router,
  ) {}

  ngOnInit(): void {
    this.reclamationId = this.route.snapshot.paramMap.get('id') ;
    this.loadReclamation();
  }
  loadReclamation(){
    if(this.reclamationId!==""){
      this.reclamationService.getById(this.reclamationId).subscribe({
        next:(res)=>this.reclamation=res,
        error:(err)=>console.log(err)
      })
    }

  }

  test(test: any) {
    if (test!==undefined){
      return true
    }else return false
  }
  goBackOrFallback() {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/admin/reclamations']);
  }
  markerSeen(){
    this.reclamationService.markerSeen(this.reclamationId).subscribe({
      next:(res)=>{
        this.reclamation.seen=true;
        alert("La réclamation est marquée comme traitée");
      }
    })
  }
}
