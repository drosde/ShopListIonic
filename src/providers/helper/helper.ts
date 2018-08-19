import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Platform, ToastController } from 'ionic-angular';
import { Lista } from '../../models/lista';
@Injectable()
export class HelperProvider {

  storageItems:any = [];

 
  constructor(
    private storage:NativeStorage, private platform:Platform,
    private toastCtrl:ToastController,
  ) {
    this.getInitialsOptions();

    // let lista:Lista = {
    //   title: 'Kiosko',
    //   content: [
    //     {name: 'Alfajor', price: 15, amount: 10}, 
    //     {name: 'Gaseosa', price: 60, amount: 2}
    //   ],
    //   note: '3 dulcedeleche, 5 blancos y 2 de cualquier otro',
    //   total: 75,
    //   date: "18/7/2018"
    // }

    // /* TTTEST */
    //   this.storageItems.listas = [lista];
    // /** */
    
  }

  guardarEnStorage(tag: string, value: any) {
    return this.storage.setItem(tag, { value: value });
  }

  getInitialsOptions() {
    if (this.platform.is('cordova')) {
      this.storage.keys().then(
        data => {
          console.log(data);
          data.forEach(element => {
            if (element.toString().match(/[a-z]/i)) {
              this.storage.getItem(element).then(
                data => {
                  this.storageItems[element] = data['value'];
                },
                error => {
                  console.error('ERROR EN GetInitialOptions items!', error);
                }
              );
            }
          });

          console.log("storage:", this.storageItems);
        }
      ).catch(e => console.error('ERROR EN GetInitialOptions!', e));
    }
  }

  agregarListaStorage(lista:Lista, indice?:number) : Promise<any>{
    if(!this.storageItems.listas) this.storageItems.listas = [];

    if(indice >= 0){
      this.storageItems.listas[indice] = lista;
      // console.log('indice', indice);
    }else{
      this.storageItems.listas.push(lista);
    }

    return this.guardarEnStorage('listas', this.storageItems.listas)
  }

  getItem(key = "") {
    return this.storage.getItem(key)
  }

  borrarTodosGuardados(borrar?) {
    return this.storage.remove(borrar)
  }

  /**
   * 
   * @param mensaje Mensaje
   * @param state Estado, True o false
   * @param posicion Top - Bottom. Default "top"
   * @param clase Special class
   */
  toast(mensaje: string = "", state: boolean = false, posicion: string = "top", duracion: number = 4000, clase: string = null) {

    let myclase = clase ? clase : state ? "toastSucces" : "toastError";

    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: duracion,
      position: posicion,
      cssClass: myclase,
      showCloseButton: true
    });
    toast.present();
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  generarItems(){
    let items = 'Gaseosa,lavandina,Leche,Manteca,Galletitas,Queso,Fly,Destergente,Papa,arroz,fideo,carne,huevos,yogurt,cereal,hamburgesas,lacteos,oreos,hamburgesas,tapas de empadana,mostaza,ketchup,fiambre,jamon,cebolla'.split(',');

    return {name: items[this.getRandomInt(items.length -1)], 
            amount: this.getRandomInt(200),
            price: this.getRandomInt(2000)};
  }
}
