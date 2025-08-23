import {Course} from './Course';
import {User} from './User';

export interface Hackathon {
  _id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  shortDescription: string;
  description: string;
  theme: {
    _id: string;
    name: string;
  };
  courses: Course[];
  status: string;
  fee: number;
  Prizes: string;
  coverImage: {
    path: string;
    contentType: string;
  };
  maxParticipants: number;
  objectifs:string[],
  skills:string[],
  rules:string[],
  participants:User[]
}
