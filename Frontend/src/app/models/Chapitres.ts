export interface Chapitre{
  _id:string
  title: string,
  description: string,
  section: [
    {
      title:string,
      description:string,
      url: string,
      nombrePage: number,
      dureeVideo: number,
      file: {
        path: string,
        contentType: string,
        size:number,
        name:string
      }
    }
  ]

  course: {_id:string,title:string},
  createdAt: string;
}
