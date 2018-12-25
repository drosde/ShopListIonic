import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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

  itemsToCancel:Array<number> = [];
  controlCancelItemPrice: any = {
    index: null,
    touches: null,
    lastTouchDate: null
  };  

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public helper:HelperProvider, private alertCtrl:AlertController) {
    this.lista = this.navParams.get('lista');
    this.index = this.navParams.get('index');
  }

  ionViewDidLoad() {  }

  editarLista(){
    this.navCtrl.setPages([{page: HomePage}, {page: CrearListaPage, params: {'lista': this.lista, 'index': this.index}}]);
  }

  async borrarLista(){
    let opts = {
      title: '¿Borrar lista "' + this.lista.title + '"?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.helper.storageItems.listas.splice(this.index, 1);

            this.helper.guardarEnStorage('listas', this.helper.storageItems.listas)
            .then(() => console.log('Delted from storage'))
            .catch(e => console.error('Error al borrar la lista.'));

            this.navCtrl.pop();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    };
    
    let alert = await this.alertCtrl.create(opts);
    alert.present();
  }

  verTotalItem(event, item:ItemList){
    let content = event.target.innerHTML;
    event.target.innerHTML = (content == item.price.parsed ? item.totalPriceItem.parsed : item.price.parsed );
  }

  showPriceWithout(index:number){
    let itm = this.controlCancelItemPrice;

    // You need 2 touches to cancel the price of the item
    if(itm && itm.index == index && itm.touches > 1){

      // Time elapsed between touches, in seconds.
      let elpasedBWtouches = Math.abs(itm.lastTouchDate.getTime() - new Date().getTime()) / 1000;

      if(elpasedBWtouches < 0.8){
        let i = this.itemsToCancel.indexOf(index);
        let item = this.lista.content[index];

        // If the item has already been cancelled, remove it from the array of cancelled items
        // and it'll show normal again.
        if(i > -1)
          this.itemsToCancel.splice(i, 1);
        else       
          this.itemsToCancel.push(index);
        
        this.lista.total.raw += (item.price.raw * item.amount) * (i > -1 ? 1 : -1);
        this.lista.total.parsed = this.helper.numbertoMoney(this.lista.total.raw);

        this.controlCancelItemPrice = {
          index: null,
          touches: null,
          lastTouchDate: null
        }
      }

      // if it was too late, reset the timer.
      this.controlCancelItemPrice = {
        index: index,
        touches: 0,
        lastTouchDate: new Date()
      }
    }else{    
      // If item wasn't touched, then just initialize one new.
      this.controlCancelItemPrice = {
        index: index,
        touches: ++this.controlCancelItemPrice.touches,
        lastTouchDate: new Date()
      }
    }
  }
}
