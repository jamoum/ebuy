import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import {SubSink} from 'subsink';
import {ProductService} from '../../../../services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit, OnDestroy {
  private photoFile;
  public form: FormGroup;
  public subs = new SubSink();
  public product;
  public lstCategory =[];
  private productSubject: Observable<any> = new BehaviorSubject({}) ;
  private img=null;

  constructor(private fb: FormBuilder,
              private router: Router,
              private activeRouter: ActivatedRoute,
              private productService: ProductService,
              private categoryService:CategoryService) {

                activeRouter.params.subscribe((p) => {
                  this.productSubject = productService.getOne(p.productId);
                });

  }

  ngOnInit() {
    this.form = this.fb.group({     
      category: this.fb.group({ id: ['', [Validators.required]]}),
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      price: ['', [Validators.required]],
    });

    this.getCategories();

    this.subs.add(this.productSubject
      .subscribe({
          next: (result) => {
            const pro = result.data;
            console.log(result)
            this.img=pro.imageUrl;
            this.form =  this.fb.group({
              id: [pro.id],
              category: this.fb.group({ id: [pro.category.id, [Validators.required]]}),
              user: this.fb.group({ id: [pro.user.id, [Validators.required]]}),
              productStatus: this.fb.group({ id: [pro.productStatus.id, [Validators.required]]}),
              name: [pro.name, [Validators.required]],
              published: [pro.published, [Validators.required]],
              service: [pro.service, [Validators.required]],
              deleted: [pro.deleted, [Validators.required]],

              description: [pro.description, [Validators.required]],
              shortDescription: [pro.shortDescription, [Validators.required]],
              imageUrl: ['',[Validators.required] ],
              cost: [pro.cost, [Validators.required]],
              price: [pro.price, [Validators.required]],
            });
          },
        error: (err) => { console.log(err); },
        },
      ));

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.photoFile = event.target.files[0];
    }
  }

  onSubmit() {
    console.log(this.form.value);
    if (this.form.invalid) {
      return;
    }
    let formData: any = new FormData();   
    if(this.form.value.imageUrl=='')
      this.form.value.imageUrl=this.img;
    formData.append("productJson", JSON.stringify(this.form.value));
    formData.append("file", this.photoFile);
    console.log(this.form.value.id);
    this.subs.add(this.productService.update(formData,this.form.value.id)
      .subscribe(
        (result: any) => {
         if(result.status.code == 200) {
            //this.router.navigate(['/login']);
            console.log("Done")
            this.form.reset();
          }
        },
        error => console.log(error)
      ));
  }

  hasError(field: string): boolean {
    return field == "" || field == null;
  }

  isValid(field: string) {
    return this.form.get(field).invalid && this.form.get(field).touched;
  }

  
  getCategories() {
    this.categoryService.getActive().subscribe( {
      next: (result)=> {        
       this.lstCategory = result.data;
       console.log(this.lstCategory);
      },
      error: (err)=> console.log(err.console.error())
     });

 }

}
