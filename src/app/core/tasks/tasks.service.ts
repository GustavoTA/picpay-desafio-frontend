import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from './task';

import { BehaviorSubject } from 'rxjs';

const API_URL = "http://localhost:3000/tasks"

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private TasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(null);

  constructor(private http : HttpClient) { }
  
  listarTasks(page: number, limit: number) {
    return this.http.get<Task[]>(API_URL+"?_page="+page+"&_limit="+limit, {observe: 'body'})
  }

  totalTasks(){
    return this.http.get<Task[]>(API_URL + "?_page=1&_limit=999",{observe : 'body'})
  }

  criarTask(task){
    return this.http.post(API_URL, task)
  }

  atualizarTask(task: Task){
    return this.http.put(API_URL, task)
  }

  deletarTask(task: Task){
    return this.http.delete(API_URL)
  }

  setTasks(tasks){
    this.TasksSubject.next(tasks)
  }

  getTasks(){
    return this.TasksSubject
  }

}