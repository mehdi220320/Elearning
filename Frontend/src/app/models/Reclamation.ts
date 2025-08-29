import {User} from './User';
import {Course} from './Course';
import {Hackathon} from './Hackathon';

export interface Reclamation{
  _id:string,
  sujet:string,
  type:string,
  creator:User,
  cours:Course,
  hackathon:Hackathon,
  description:string,
  seen:boolean,
  createdAt:string,
  updatedAt:string
}
