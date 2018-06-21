import { Component, SystemJsNgModuleLoaderConfig } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FCM } from '@ionic-native/fcm';
import { Subscribable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { JitSummaryResolver } from '@angular/compiler';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  fcmToken: string= "";
  subNorification: Subscription;

  constructor(public navCtrl: NavController, private fcm: FCM) {
    this.initializeFCMNotification();
  }
  

  initializeFCMNotification() {

    this.fcm.subscribeToTopic('ach').then((res) =>{
      alert('Topic cretaed' + JSON.stringify(res));
    }).catch((ex) =>{
      alert('Topic creation failed: ' + ex);
    });

    this.fcm.getToken().then(token => {
      //backend.registerToken(token);
      this.fcmToken = token;
      //alert(token);
    });

    this.subNorification = this.fcm.onNotification().subscribe(data => {
      alert(JSON.stringify(data));
      if(data.wasTapped){
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
      };
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      this.fcmToken = token;
      alert(token);
    });
  }

  getToken(){
    this.fcm.getToken().then(token => {
      //backend.registerToken(token);
      this.fcmToken = token;
      alert(token);
    });
  }

  ionViewDidLeave() {
    this.subNorification.unsubscribe();
  }
}
