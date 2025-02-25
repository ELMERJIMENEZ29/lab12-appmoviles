import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../models/post.model';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.page.html',
  styleUrls: ['./edit-page.page.scss'],
})
export class EditPagePage implements OnInit {

  post = {} as Post;

  id: any;

  constructor(
    private toastCtrl:ToastController,
    private loadingCtrl:LoadingController,
    private afAuth:AngularFireAuth,
    private router:Router,
    private navCtrl:NavController,
    private firestore: AngularFirestore,
    private actRoute:ActivatedRoute
  ) {this.id=this.actRoute.snapshot.paramMap.get("id") ;

  }

  ngOnInit() {
    this.getPostById(this.id);
  }

  async getPostById(id:string){
    let loader= await this.loadingCtrl.create({
      message: "Espere un momento por favor..."
    })
    await loader.present();

    this.firestore
    .doc("posts/"+id).valueChanges().subscribe((data:any)=>{
      const {title,details} = data as {title : string, details:string};
      this.post.title=data.title;
      this.post.details = data.details;
    })
      await loader.dismiss();
  }

  async updatePost(post:Post){
    let loader= await this.loadingCtrl.create({
      message: "Actualizando..."
    })
    await loader.present();

    this.firestore
    .doc("posts/"+this.id).update(post).then(()=>{
      console.log("Elemento actualizado correctamente!");
      this.router.navigate(['/home']);
      loader.dismiss();
    }).catch((error)=>{
      console.error("Error al actualizar el elemento: ", error);
      loader.dismiss();
    });
  }

  formValidation(){
    if (!this.post.title) {
      this.showToast("Ingrese un titulo");
      return false;
    }
    if (!this.post.details) {
      this.showToast("Ingrese una descripcion");
      return false;
    }
    return true;
  }

  showToast(message:string){
    this.toastCtrl.create({
      message: message,
      duration:4000
    }).then(toastData => toastData.present());
  }


}
