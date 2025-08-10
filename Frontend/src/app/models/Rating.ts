export interface Rating {
  title:string,
  rate:number,
  comment :string,
  formateur:string,
  course:string,
  User: { _id :string,firstname :string,lastname :string,picture:string },
  createdAt: string;

}


