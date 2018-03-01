import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import {Device} from '@ionic-native/device';
import {TabsPage} from '../tabs/tabs';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {ApiProvider} from '../../providers/api/api';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  
  loading: any;

  registerForm: FormGroup;
  name: AbstractControl;
  gender: AbstractControl;
  phone: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  confirm_password: AbstractControl;
  relation_email: AbstractControl;

  constructor(
		public navCtrl: NavController,
		public api: ApiProvider,
		public loadingCtrl: LoadingController,
		public navParams: NavParams,
		private toastCtrl: ToastController,
		private device: Device,
    private formBuilder: FormBuilder) {
    
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
      confirm_password: ['', Validators.compose([Validators.required])],
      relation_email: ['', Validators.compose([Validators.required, Validators.email])]
    }, {validator: this.matchingPasswords('password', 'confirm_password')});
    
    if (localStorage.getItem("isLoggedIn") == "1") {
      this.navCtrl.setRoot(TabsPage);
    }
    
	}
  
  onSubmit(value:any) : void {
    if (this.registerForm.valid) {
      this.loading = this.loadingCtrl.create({
        content: "Please Wait ..."
      });
      this.loading.present();
      
      let params = {
        "name": value.name,
        "gender": value.gender,
        "phone": value.phone,
        "email": value.email,
        "password": value.password,
        "confirm_password": value.confirm_password,
        "relation_email": value.relation_email,
        "registered_device_number": this.device.uuid,
        "firebase_token": "xxx",
        "device_number": this.device.uuid
      };
      
      this.api.post('auth/register', params, {'Content-Type':'application/json'})
        .then((data) => {
          
          let result = JSON.parse(data.data);
          
          localStorage.setItem("isLoggedIn", "1");
          localStorage.setItem("user", JSON.stringify(result.data));
          localStorage.setItem("token", result.data.token);
          
          this.loading.dismiss();
          this.toastCtrl.create({
            message: result.message,
            duration: 3000,
            position: 'buttom',
            dismissOnPageChange: false,
          }).present();
          
          this.navCtrl.setRoot(TabsPage);
        })
        .catch((error) => {
          this.loading.dismiss();
          console.log(error);
          
          let result = JSON.parse(error.error);
          
          this.toastCtrl.create({
            message: result.message,
            duration: 3000,
            position: 'buttom',
            dismissOnPageChange: false,
          }).present();
        });
    }
  }
  
  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}
