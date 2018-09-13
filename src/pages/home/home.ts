import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { Lista } from '../../models/lista';
import { ListaPage } from '../lista/lista';
import { CrearListaPage } from '../crear-lista/crear-lista';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private helper:HelperProvider) {}

  abrirLista(lista:Lista, i:number){
    this.navCtrl.push(ListaPage, {lista, index: i});
  }

  crearLista(){
    this.navCtrl.push(CrearListaPage)
  }
}
