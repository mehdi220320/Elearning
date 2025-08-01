export interface Chapitre{
  _id:string
  title: string,
  description: string,
  file: {
    path: string,
    contentType: string,
    size:number
  },
  url: string,
  course: {_id:string,title:string},
  nombrePage: number,
  dureeVideo: string,
  createdAt: string;
}
