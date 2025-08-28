export interface Comment{
  _id:string,
  description:string,
  chapter: string,
  user: { _id:string,
          firstname:string,
          lastname:string,
          picture:string
  },
  likes:any[],
  createdAt:string,

}
