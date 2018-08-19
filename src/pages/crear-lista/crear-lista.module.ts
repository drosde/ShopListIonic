import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrearListaPage } from './crear-lista';

@NgModule({
  declarations: [
    CrearListaPage,
  ],
  imports: [
    IonicPageModule.forChild(CrearListaPage),
  ],
})
export class CrearListaPageModule {}
