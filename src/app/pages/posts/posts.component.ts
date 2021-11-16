import { Component, OnInit, Inject, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../@core/data/smart-table';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from  '@angular/material/dialog';
import {NgxImageCompressService} from 'ngx-image-compress';
declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'ngx-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  @ViewChild('postMsg') postMesssgeElement: any;
  @ViewChildren('postImage') postImageElement: QueryList<ElementRef>;
  fileData: Array<File> = [];
  fileCovToReturn: Array<File> = [];
  images = [];
  twoimg = false;
  threeimg = false;
  fourimg = false;
  fiveimg = false;
  closeDialog = false;
  shows: boolean = false;
  textOnlylength: number;
  arrayfile: any = [];
  temp_images:any = [];
  token: string;

  message: any;
  showEmojiPicker = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set = 'twitter';
  

  constructor(private service: SmartTableData, private authservice: AuthService, private toastrService: NbToastrService,
    private dialogRef: MatDialogRef<PostsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private imageCompress: NgxImageCompressService) { 
    
  }

  ngOnInit(): void {
  }
  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
        this.showEmojiPicker = !this.showEmojiPicker;
  }
  addEmoji(event) {
    const { message } = this;
    const text = `${message !== undefined ? message : ''}${event.emoji.native}`;
    this.message = text;
  }

  onFocus() {
    this.showEmojiPicker = false;
  }
  onBlur() {
    console.log('onblur')
  }

  async openNewDialog(event: any) {
    console.log("event files", event.target.files)    
    this.fileData = Array.from(event.target.files)
    const data = await this.FiletoBase64(event)
    console.log("open data", data)
    this.images = data
    this.MainImageProcess(event)
  }
  cancel() {
    while(this.temp_images.length > 0) {
      this.temp_images.pop();
    }
    while(this.data.file.length > 0) {
      this.data.file.pop();
    }
    while(this.images.length > 0) {
      this.images.pop();
    }
    while(this.arrayfile.length > 0) {
      this.arrayfile.pop();
    }
    $(".set_view_more").css('display', 'none');
    this.shows = false
    this.toastrService.info("All images are removed. Please select new ones")
  }

  FiletoBase64(event){
    var data = []
    for (var i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const readers = new FileReader();
      readers.readAsDataURL(file);
      readers.onload = () => {
        // console.log(readers.result);
        data.push(readers.result)
      };
      if (i === event.target.files.length - 1)
      {
        this.textOnlylength = i
      }
    }
    return data;
  }

  MainImageProcess(event){
    if(this.images !== undefined){
      this.images
    }else{
      this.images = []
    }
    // Multipul Image upload
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      if(this.fileData[0] == undefined || this.fileData[0] == null){
        for (let i = 0; i < filesAmount; i++) {
          this.fileData.push(event.target.files[0])
          var reader = new FileReader();
          reader.onload = (event:any) => {
            this.images.push(event.target.result);
            this.images.sort((img1, img2) => img1.length > img2.length ? 1 : -1)
          }
          reader.readAsDataURL(event.target.files[i]);
          console.log("this.arrayfile", this.arrayfile)
          this.arrayfile.splice(Object.keys(this.fileData).length, 0, event.target.files[i])
          this.arrayfile.sort((fileA, fileB) => fileA.size > fileB.size ? 1 : -1)
        }
        this.arrayfile = this.fileData.filter(item => item)
      }else{
        console.log("this.fileData", this.fileData)
        this.arrayfile = this.fileData
        var orientation = -1;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();

          reader.onload = (event: any) => {
            // console.log("image", event.target.result)
            if (event.target.result.split(';')[0] == 'data:video/mp4' || event.target.result.split(';')[0] == 'data:video/avi') {
              this.temp_images.push({data: 'video', src: event.target.result})
              this.images.push(event.target.result);
            } else {
              this.temp_images.push({data: 'img', src: event.target.result})
              this.imageCompress.compressFile(event.target.result, orientation, 75, 50).then(
                result => {
                  console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
                  console.log("temp_images", this.temp_images)
                  this.images.push(result);
                });
              }
              this.images.sort((img1, img2) => img1.length > img2.length ? 1 : -1)
          }
          reader.readAsDataURL(event.target.files[i]);
          console.log("this.arrayfile", this.arrayfile)
          // this.arrayfile.splice(Object.keys(this.fileData).length, 0, event.target.files[i])
          this.arrayfile.sort((fileA, fileB) => fileA.size > fileB.size ? 1 : -1)
        }
      }
    }
  }

  postSave(){
    this.token = localStorage.getItem('admintoken')
    if (this.postImageElement.length !== 0) {        
      if(this.fileData[0] !== undefined)
      {
        this.arrayfile = this.fileData[0]
      }else{
        this.arrayfile = this.fileData
        }
      
      let arrayRemoveNull = this.arrayfile.filter(e => e)
      if (arrayRemoveNull[0].name.split('.').pop() !== 'png') {
          for (let i = 0; i < arrayRemoveNull.length; i++){
            this.fileCovToReturn.push(this.base64ToFile(
              this.images[i],
              arrayRemoveNull[i].name,
            ))
            var reader = new FileReader();
            reader.readAsDataURL(this.fileCovToReturn[i]);
          }
        } else {
          // this.toastr.info("png format is not supported used other format like jpg or jpeg")
          this.toastrService.success("png format is not supported used other format like jpg or jpeg")
        }
        reader.onload = (_event) => {
          this.authservice.newPost(this.token, this.postMesssgeElement.nativeElement.value, this.fileCovToReturn).pipe().subscribe((res) => {
            console.log("res", res)
          })
        }
    } else {
      this.toastrService.info("Please add images to post")
      if(this.postMesssgeElement.nativeElement.value == ''){
        this.toastrService.info("You are not set description!")
      }else if(this.postMesssgeElement.nativeElement.value.valid !== ''){
        this.authservice.newtextPost(this.token, this.postMesssgeElement.nativeElement.value).subscribe((res) => {
          console.log("res", res)
        })
      }
    }
  }

  base64ToFile(data, filename) {
     const arr = data.split(',');
     const mime = arr[0].match(/:(.*?);/)[1];
     const bstr = atob(arr[1]);
     let n = bstr.length;
     let u8arr = new Uint8Array(n);
     while(n--){
         u8arr[n] = bstr.charCodeAt(n);
     }
     return new File([u8arr], filename, { type: mime });
  }

  errorhandling(msg){
    this.toastrService.danger(msg)
  }

}
