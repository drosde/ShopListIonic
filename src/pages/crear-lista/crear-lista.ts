import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Lista } from '../../models/lista';
import { ItemList } from '../../models/item';
import { HelperProvider } from '../../providers/helper/helper';
import { Keyboard } from '@ionic-native/keyboard';
import { Content } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-crear-lista',
  templateUrl: 'crear-lista.html',
})

export class CrearListaPage {

  @ViewChild(Content) content: Content;

  listaForm:FormGroup;
  lista:Lista = {} as Lista;
  processing:boolean = false;

  // items:ItemList[] = [{name: null, amount: null, price: null}];
  items:ItemList[] = [];
  index:number = null;

  isUpdate:boolean = false;

  constructor(
    public navCtrl: NavController, public navParams: NavParams, 
    public formBuilder:FormBuilder, private helper:HelperProvider,
    private keyboard:Keyboard, private alertCtrl:AlertController) {
      
    let p_list = this.navParams.get('lista');
    this.index = this.navParams.get('index');

    if(p_list){
      this.lista = p_list;
      this.items = p_list.content;      
      this.isUpdate = true;
    }else{      
      this.lista.total = {
        raw: 0,
        parsed: "$0"
      }
    }

    this.listaForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      note: ['']
    });

  }

  ionViewDidLoad() {
  }

  guardarLista(lista:Lista, items:ItemList[]){
    this.processing = true;

    let totalList:number = 0;

    console.log('Lista antes d calculos', lista);
    
    items.forEach(e => {
      if(typeof e.amount === "string") e.amount = parseInt(e.amount)
      if(typeof e.price.raw === "string") e.price.raw = parseInt(e.price.raw)
      totalList += e.totalPriceItem.raw = e.amount * e.price.raw;
      e.totalPriceItem.parsed = this.helper.numbertoMoney(e.totalPriceItem.raw);
    });

    lista.content = items;
    lista.total.raw = totalList;
    lista.total.parsed = this.helper.numbertoMoney(lista.total.raw);

    let date = new Date();
    lista.date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

    console.log('Lista', lista);

    console.log('Lista index', this.index);
    this.helper.agregarListaStorage(lista, this.index)
    .then(() => {
      this.helper.toast('Se creo la lista!', true, 'bottom', 2200);
      this.navCtrl.pop();
      this.processing = false;
    })
    .catch(e => {
      this.helper.toast('Hubo un error al guardar la lista. Intetalo de nuevo.', false, 'bottom', 2200);
      console.error('Error al guardar', e);
      this.processing = false;
    });
  }

  agregarItem(item:ItemList){
    console.log('item', item);
    console.log('ITEMS', this.items);

    if(!item.agregado && item.name && item.amount && item.price) this.items.push({name: null, amount: null, price: {raw:null, parsed:null}, totalPriceItem:{raw:null, parsed:null}});
    item.agregado = true;
  }

  eliminarItem(item:ItemList, indice:number){
    this.items.splice(indice, 1)
  }

  pasarPrecioaDinero(value:number, item:ItemList){
    console.log(value, item.price);
    item.price.parsed = this.helper.numbertoMoney(value);
  }

  async alertForumularioItem(){
    let alert = await this.alertCtrl.create({
      title: "Agregar Item",
      inputs: [
      {
        type: 'text',
        name: 'name',
        placeholder: 'Item Name'
      },{
        type: 'number',
        name: 'amount',
        min: 1,
        placeholder: 'Cantidad'
      },{
        type: 'number',
        name: 'price',
        placeholder: 'Item Price'
      }],
      buttons: [
        {
          text: 'Guardar',
          handler: (data) => {
            if((data.price && data.amount && data.name) && data.amount > 0){
                data.price = parseInt(data.price);
                data.amount = parseInt(data.amount);

                let item:ItemList = {
                  name: data.name,
                  amount: data.amount,
                  price: {
                    raw: data.price,
                    parsed: this.helper.numbertoMoney(data.price)
                  },
                  totalPriceItem: {
                    raw: data.amount * data.price,
                    parsed: this.helper.numbertoMoney(data.amount * data.price)
                  }
                }

                console.log(item);
                this.items.push(item);
              // }
            }else{         
              let msg = data.amount > 0 ? 'Completa todos los campos del item.' : "Cantidad no puede ser menor o igual a 0";
              this.helper.toast(msg, false, 'top', 3500);
              return false;//prevent close
            }
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }
}
