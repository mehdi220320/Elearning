export interface Course {
  _id: string;
  title: string;
  coverImage: {
    path: string;
    contentType: string;
  };
  description: string;
  formateur: {
    _id: string;
    firstname: string;
    lastname: string;
  };
  categorie: {
    _id: string;
    name: string;
  };
  status: boolean;
  prix: number;
  description_detaillee: string;
  niveau: string;
  duree: string;
  langue: string;
  certificat: boolean;
  createdAt: string;
}
