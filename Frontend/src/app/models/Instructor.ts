export interface Instructor{
  _id:string;
  firstname: string;
  lastname:string;
  email:string;
  experience:number;
  adresse:string;
  Site_web:string;
  GitHub:string;
  Twitter:string;
  LinkedIn:string;
  picture:{
    path: string;
    contentType: string;
  };
  phone: string;
  biographie:string;
  speciality:string;
  Competences:string[];
  categorie: {
    _id: string;
    name: string;
  };
  createdAt:string,
}
