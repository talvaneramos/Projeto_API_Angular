import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-consulta-cliente',
  templateUrl: './consulta-cliente.component.html',
  styleUrls: ['./consulta-cliente.component.css']
})
export class ConsultaClienteComponent implements OnInit {

  listagemDeClientes = []; 
  mensagemSucessoExclusao:string; 
  mensagemSucessoEdicao:string; 
  mensagemErroEdicao:string; 
  
  
  errosNome = []; 
  errosEmail = []; 
  errosCpf = [];

  clienteEdicao = { 
    idCliente : 0, 
    nome : '', 
    email : '', 
    cpf : '' 
  }

  constructor(private httpClient: HttpClient) { }     

  ngOnInit(): void {
    this.consultarClientes();
  }

  consultarClientes(){
    this.httpClient.get(environment.apiUrlCliente)
    .subscribe(
      {
        next: (success: any[]) => {
          this.listagemDeClientes = success;
      },
      error: (e) => {
          console.log(e);
      }
       
      }
    )
  } 

  excluirCliente(id){
    if(window.confirm('Deseja realmente excluir o registro? ')){
      this.httpClient.delete(environment.apiUrlCliente + "/" + id, { responseType : 'text' })
        .subscribe(
          {
            next: (success) =>{
                this.mensagemSucessoExclusao = success;
                this.consultarClientes();
            },
            error: (e) => {
                console.log(e);
            }
          }
        )
    }
  }
 
  exibirCliente(item){ 

    this.clienteEdicao = item;

    this.mensagemSucessoEdicao = ""; 
    this.mensagemErroEdicao = ""; 
    
    this.errosNome = []; 
    this.errosEmail = []; 
    this.errosCpf = [];
  }

  atualizarCliente(formEdicao){ 

    this.mensagemSucessoEdicao = "";
    this.mensagemErroEdicao = "";
    
    this.errosNome = [];
    this.errosEmail = [];
    this.errosCpf = [];

    this.httpClient.put(environment.apiUrlCliente, formEdicao.value, 
             { responseType: 'text'  })
      .subscribe({
        next: (success) => {
          this.mensagemSucessoEdicao = success;
          this.consultarClientes();
        },
        error: (e) => {
          
          this.consultarClientes();

          switch(e.status){
            case 400:
              this.mensagemErroEdicao = "Ocorreram erros de validação no formulário. ";

              var validations = JSON.parse(e.error);
              
              this.errosNome = validations.errors.Nome; 
              this.errosEmail = validations.errors.Email;
              this.errosCpf = validations.errors.Cpf;
              break;

              case 403:
                this.mensagemErroEdicao = e.error;
                break;

                default:
                  this.mensagemErroEdicao = "Erro ao alterar cliente. "
                  break;

          }        
          
          console.error(e)},
        complete: () => console.info('complete')
      });
  }
   
  limparMensagemSucessoExclusao() {
    this.mensagemSucessoExclusao = "";
  }

  limparMensagemSucessoEdicao() {
    this.mensagemSucessoEdicao = "";
  }

  limparMensagemErroEdicao() {
    this.mensagemErroEdicao = "";
  }
}
