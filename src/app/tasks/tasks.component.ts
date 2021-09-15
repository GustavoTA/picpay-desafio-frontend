import { Component, OnInit } from '@angular/core';
import { TasksService } from '../core/tasks/tasks.service';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task } from '../core/tasks/task';
import { faSearch, faPen, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  private tasksLista$: BehaviorSubject<Task[]> = new BehaviorSubject(null)

  tableTask: Task[] = []
  page = 1
  limit: number = 5
  
  //Icones
  faSearch = faSearch
  faPen = faPen
  faTimesCircle = faTimesCircle

  filtro = ''
  totalTasks = 0
  totalPage = 0
  arrayPages = []

  closeResult: string;

  usuario: string
  valor: number
  data: Date
  titulo: string

  constructor(private taskService: TasksService, private modalService: NgbModal) {
    this.taskService.totalTasks()
    //Usar o Pipe para esperar a requisição assincrona acontecer, antes de seguir com o fluxo, não é possivel fazer no ngOnInit, pq a requisição leva mais tempo q a pagina carregar
    .pipe(tap(res =>{    
      this.totalTasks = res.length
      this.paginar(1)
    }))
   .subscribe()
    this.taskService.listarTasks(this.page, this.limit)
    .subscribe(tasks => {this.taskService.setTasks(tasks)})
    this.tasksLista$ = this.taskService.getTasks()
  }

  ngOnInit(): void {
    this.tasksLista$
    .subscribe(data => {
        this.tableTask = data
      })
  }


  paginar(pages){
    ///contando quantas paginas existem
    this.totalPage = Math.ceil(this.totalTasks/this.limit)
    console.log(this.totalPage)
    if(pages == "previous" && (this.page -1) > 0) this.page --

    if(pages == "next" && (this.page + 1) < this.totalPage )this.page ++

    if(pages > 0 && pages <= this.totalPage) this.page = pages

    //Verifica se esta entre as 3 primires paginas e se possui 5 ou mais paginas
    if(this.page <= 3 && this.totalPage >= 5) this.arrayPages = [1, 2, 3, 4, 5]
    //Verifica se tem menos que 5 paginas
    else if(this.totalPage < 5){
      this.arrayPages = []
      for(let x = 1; x < (this.totalPage + 1); x ++){
        this.arrayPages.push(x)
      }
    }
    //Lista o meio com duas paginas antes e duas depois
    else if(this.page > 3 && this.page < (this.totalPage - 2)){
      this.arrayPages = []
      for(let x = (this.page -2); x < (this.page + 3); x ++){
        this.arrayPages.push(x)
      }
    }
    //Para penultima e ultima pagina
    else{
      this.arrayPages = []
      for(let x = (this.totalPage -4); x < (this.totalPage + 1) ; x ++){
        this.arrayPages.push(x)
      }
    }
    //Motando a lista com a nova pagina
    this.taskService.listarTasks(this.page, this.limit).subscribe(res => this.taskService.setTasks(res))
  }


  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
