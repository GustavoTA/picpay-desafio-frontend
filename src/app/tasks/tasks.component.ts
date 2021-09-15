import { Component, OnInit } from '@angular/core';
import { TasksService } from '../core/tasks/tasks.service';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task } from '../core/tasks/task';
import { faSearch, faPen, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { isNull } from '@angular/compiler/src/output/output_ast';


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

  pagamentoForm: FormGroup
  task: Task = new Task
  tipo: string

  constructor(private taskService: TasksService, private modalService: NgbModal,  private formBuilder: FormBuilder) {
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

    this.pagamentoForm = this.formBuilder.group({
      usuario: ['', Validators.required],
      valor: ['', Validators.required ],
      data: ['', Validators.required],
      titulo: ['', Validators.required],

    })
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

  novoPagamento(){
    this.limparTask()
    this.pagamentoForm.setValue({usuario: '', valor : '', data : '', titulo : ''})
    this.tipo = 'Adicionar'
  }

  atualizarPagamento(mytask){
    this.limparTask()
    this.tipo = 'Atualizar'
    let myDate = mytask.date
    this.task = mytask
    myDate = myDate.toString().substring(0, 16)
    this.pagamentoForm.setValue({usuario: mytask.name, valor : mytask.value, data : myDate, titulo : mytask.title}) 
  }

  deletarPagamento(mytask){
    this.limparTask()
    this.tipo = 'Deletar'
    this.task = mytask
  }

  pagamento(){
    this.task.name = this.pagamentoForm.get('usuario').value
    this.task.value  = this.pagamentoForm.get('valor').value
    this.task.date = this.pagamentoForm.get('data').value
    this.task.title = this.pagamentoForm.get('titulo').value
    switch (this.tipo){
      case 'Adicionar':
        this.taskService.criarTask(this.task).subscribe(res => console.log(res))
        break
      case 'Atualizar':
        this.taskService.atualizarTask(this.task).subscribe(res => console.log(res))
        break
      case 'Deletar':
        this.taskService.deletarTask(this.task).subscribe(res => console.log(res))
        break
    }
    this.paginar(this.page)
  }

  limparTask(){
    this.task.id = null
    this.task.date = null
    this.task.image = null
    this.task.isPlayed = false
    this.task.title = null
    this.task.username = null 
    this.task.value = null
    this.task.name = null
  }

  open(content) {
    this.modalService.open(content, { centered: true }).result.then((result) => {
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
