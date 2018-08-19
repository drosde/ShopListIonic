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

  isKeyboardOpen:boolean = false;

  constructor(
    public navCtrl: NavController, public navParams: NavParams, 
    public formBuilder:FormBuilder, private helper:HelperProvider,
    private keyboard:Keyboard, private alertCtrl:AlertController) {
      
    let p_list = this.navParams.get('lista');
    this.index = this.navParams.get('index');
    // console.log(this.index);

    if(p_list){
      this.lista = p_list;
  
      this.items = p_list.content;
    }

    this.listaForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      // content: ['', Validators.compose([Validators.required])],
      note: ['']
    });

  }

  ionViewDidLoad() {

    // for(let i=0; i<25; i++){
    //   this.items.push(this.helper.generarItems());
    // }

  }

  guardarLista(lista:Lista, items:ItemList[]){
    this.processing = true;

    //delete last item, is null.
    // let lastitem = items[items.length - 1];
    // if(!lastitem.price && !lastitem.name && !lastitem.amount){
    //   items.pop();
    // }

    lista.content = items;
    lista.total = this.calcularTotal(items);

    let date = new Date();
    lista.date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

    console.log('Lista', lista);

    console.log(this.index);
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

    if(!item.agregado && item.name && item.amount && item.price) this.items.push({name: null, amount: null, price: null});
    item.agregado = true;
  }

  eliminarItem(item:ItemList, indice:number){
    // if(this.items.length == 1){
    //   item.name = null
    //   item.price = null
    //   item.amount = null
    // }else 
    this.items.splice(indice, 1)
  }

  calcularTotal(items:ItemList[]){
    let total:number = 0;
    items.forEach(el => {
      console.log(el)
      total += parseInt(el.price+"");
    });
    return total;
  }

  async alertForumularioItem(){
    let alert = await this.alertCtrl.create({
      title: "Agregar Item",
      buttons: [
        {
          text: 'Guardar',
          handler: (data) => {
            if((data.price && data.amount && data.name) && data.amount > 0){
              // let i = this.items[0];
              // if(i && (!i.price && !i.amount && !i.name)){
              //   this.items[0] = data;
              // }else{
                this.items.push(data);
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
      ],
      inputs: [{
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
      }]
    });
    alert.present();
  }
}
