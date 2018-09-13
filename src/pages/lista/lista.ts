import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Lista } from '../../models/lista';
import { HomePage } from '../home/home';
import { CrearListaPage } from '../crear-lista/crear-lista';
import { HelperProvider } from '../../providers/helper/helper';
import { ItemList } from '../../models/item';
@IonicPage()
@Component({
  selector: 'page-lista',
  templateUrl: 'lista.html',
})
export class ListaPage {

  lista:Lista;
  index:number;
  mostarItemTotal:boolean = false;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public helper:HelperProvider) {
    this.lista = this.navParams.get('lista');
    this.index = this.navParams.get('index');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaPage');
  }

  editarLista(){
    this.navCtrl.setPages([{page: HomePage}, {page: CrearListaPage, params: {'lista': this.lista, 'index': this.index}}]);
  }

  borrarLista(){
    this.helper.storageItems.listas.splice(this.index, 1);

    this.helper.guardarEnStorage('listas', this.helper.storageItems.listas)
    .then(() => console.log('Delted from storage'))
    .catch(e => console.error('Error al borrar la lista.'))

    this.navCtrl.pop();
  }

  verTotalItem(event, item:ItemList){
    let content = event.target.innerHTML;
    event.target.innerHTML = (content == item.price.parsed ? item.totalPriceItem.parsed : item.price.parsed );
  }
}
