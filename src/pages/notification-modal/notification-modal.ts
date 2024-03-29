import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController, Slides, Events } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { HelpersProvider } from '../../providers/helpers/helpers';
import moment from 'moment';

/**
 * Generated class for the NotificationModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-modal',
  templateUrl: 'notification-modal.html',
})
export class NotificationModalPage {
  
  @ViewChild(Slides) slides: Slides;
  
  headerTitle: string;
  notification: any = {};
  fileUrl: string;
  defaultFileUrl: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public app: App,
    public viewCtrl: ViewController,
    public apiProvider: ApiProvider,
    public events: Events,
    public helpersProvider: HelpersProvider) {
    
    this.events.publish("auth:checkLogin");
    
    this.fileUrl = this.helpersProvider.getBaseUrl() + 'files/messages/';
    this.defaultFileUrl = this.helpersProvider.getBaseUrl() + 'files/messages/default.png';
    
    this.notification = this.navParams.get('notification');
    this.headerTitle = this.navParams.get(this.notification.name);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationModalPage');
  }
  
  dismiss() {
    this.viewCtrl.dismiss(null);
  }
  
  showPicture(name, url) {
    this.helpersProvider.photoViewer.show(url, name);
  }

  messageAt(item) {
    return moment(item.message_at).format('DD MMM YYYY HH:mm');
  }
}
