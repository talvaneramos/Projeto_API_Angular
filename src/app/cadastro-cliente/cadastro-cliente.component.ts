import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cadastro-cliente',
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css']
})

export class CadastroClienteComponent implements OnInit {
  
  mensagem:string;

  mensagemProcessamento:string;  
  mensagemSucesso:string;
  mensagemErro:string;

  environment = environment;

  errosNome = [];
  errosEmail = [];
  errosCpf = [];

  constructor(private httpClient:HttpClient) { }

  ngOnInit(): void {
  }

  cadastrarCliente(formCadastro: any){

    this.mensagemProcessamento = "Processando requisição, por favor aguarde...";
    this.mensagemSucesso = "";
    this.mensagemErro = "";

    this.errosNome = [];
    this.errosEmail = [];
    this.errosCpf =[];


    this.httpClient.post(environment.apiUrlCliente, 
    formCadastro.value, 
    { responseType : 'text' })    
    .subscribe(
      {
        next: (success) => { 
          this.mensagemProcessamento = "";
          this.mensagemSucesso = success;
          formCadastro.reset();
        },
        error: (e) => { 
          this.mensagemProcessamento = "";          

          switch(e.status){
            case 400:
              this.mensagemErro = "Ocorreram erros de validação no formulário. ";

              var validations = JSON.parse(e.error);               

              this.errosNome = validations.errors.Nome;
              this.errosEmail = validations.errors.Email;
              this.errosCpf = validations.errors.Cpf;

              break;

              case 403:
                this.mensagemErro = e.error;
                break;

                default:
                  this.mensagemErro = "Erro ao cadastrar cliente. "
                  break;

          }          
        },
        
      }      
    );
  }

  limparMensagemSucesso(){    
    this.mensagemSucesso = "";
  }
  
  limparMensagemErro(){
    this.mensagemErro = "";
  }
  
}
