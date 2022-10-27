import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { HttpErrorHandler, HandleError } from "../http-error-handler.service";
import { DewAuthService } from "../authentication/auth.service";
import { Config } from "../config";

const mimeTypes = {
  pdf: "application/pdf",
  png: "image/png",
  jpeg: "image/jpeg",
  bmp: "image/bmp",
  ppm: "image/x-portable-pixmap",
  gif: "image/gif"
};

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private handleError: HandleError;

  private httpOptions = null;
  constructor(
    private http: HttpClient,
    private authService: DewAuthService,
    httpErrorHandler: HttpErrorHandler,
    private sanitizer: DomSanitizer
  ) {
    this.handleError = httpErrorHandler.createHandleError("ApiService");
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: this.authService.authToken
      })
    };
  }

  insertSellerDetails(request): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/insertSellerDetails";
    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("insertSellerDetails", request)));
  }

  selectSellerDetailsByID(email, password): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/selectSellerDetailsByID";

    var request: any = {};

    request.email = email;

    request.password = password;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("selectSellerDetailsByID", request)));
  }

  insertSellerAddress(request): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/insertSellerAddress";
    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("insertSellerAddress", request)));
  }

  insertSellerAddress2(request): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/insertSellerAddress2";
    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("insertSellerAddress2", request)));
  }

  selectSellerDetailsByID36233(sellerid): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/selectSellerDetailsByID36233";

    var request: any = {};

    request.sellerid = sellerid;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(
        catchError(this.handleError("selectSellerDetailsByID36233", request))
      );
  }

  insertSellerProduct(request): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/insertSellerProduct";
    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("insertSellerProduct", request)));
  }

  insertSellerProductSpecification(request): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/insertSellerProductSpecification";
    return this.http
      .post(url, request, this.httpOptions)
      .pipe(
        catchError(
          this.handleError("insertSellerProductSpecification", request)
        )
      );
  }

  selectSellerProductByID(productid): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/selectSellerProductByID";

    var request: any = {};

    request.productid = productid;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("selectSellerProductByID", request)));
  }

  notverifyproduct(): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/notverifyproduct";

    return this.http
      .get(url, this.httpOptions)
      .pipe(catchError(this.handleError("notverifyproduct", [])));
  }

  varied(): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/varied";

    return this.http
      .get(url, this.httpOptions)
      .pipe(catchError(this.handleError("varied", [])));
  }

  updatestatus(data): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/updatestatus";

    var request: any = {};

    request.data = data;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("updatestatus", request)));
  }

  updateSellerProduct(request): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/updateSellerProduct";
    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("updateSellerProduct", request)));
  }

  productDetails(): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/productDetails";

    return this.http
      .get(url, this.httpOptions)
      .pipe(catchError(this.handleError("productDetails", [])));
  }

  updatesellerStatus(request): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/updatesellerStatus";
    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("updatesellerStatus", request)));
  }

  joinproduct(): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/joinproduct";

    return this.http
      .get(url, this.httpOptions)
      .pipe(catchError(this.handleError("joinproduct", [])));
  }

  ProductFullDetails(): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/ProductFullDetails";

    return this.http
      .get(url, this.httpOptions)
      .pipe(catchError(this.handleError("ProductFullDetails", [])));
  }

  insertRichCardCustomerDetails(request): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/insertRichCardCustomerDetails";
    return this.http
      .post(url, request, this.httpOptions)
      .pipe(
        catchError(this.handleError("insertRichCardCustomerDetails", request))
      );
  }

  insertRichCardCutomerAddress(request): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/insertRichCardCutomerAddress";
    return this.http
      .post(url, request, this.httpOptions)
      .pipe(
        catchError(this.handleError("insertRichCardCutomerAddress", request))
      );
  }

  selectRichCardCustomerDetailsByID(Email, password): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/selectRichCardCustomerDetailsByID";

    var request: any = {};

    request.Email = Email;

    request.password = password;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(
        catchError(
          this.handleError("selectRichCardCustomerDetailsByID", request)
        )
      );
  }

  insertRichCardAddToCard(request): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/insertRichCardAddToCard";
    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("insertRichCardAddToCard", request)));
  }

  selectRichCardAddToCardByID(cardid): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/selectRichCardAddToCardByID";

    var request: any = {};

    request.cardid = cardid;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(
        catchError(this.handleError("selectRichCardAddToCardByID", request))
      );
  }

  addtocardlist(customerid): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/addtocardlist";

    var request: any = {};

    request.customerid = customerid;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("addtocardlist", request)));
  }

  selectSellerProductByID76501(searching): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/selectSellerProductByID76501";

    var request: any = {};

    request.searching = searching;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(
        catchError(this.handleError("selectSellerProductByID76501", request))
      );
  }

  searching(searchingData): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/searching";

    var request: any = {};

    request.searchingData = searchingData;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("searching", request)));
  }

  databyid(id): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/databyid";

    var request: any = {};

    request.id = id;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("databyid", request)));
  }

  prodetailbyid(id): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/prodetailbyid";

    var request: any = {};

    request.id = id;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("prodetailbyid", request)));
  }

  sellerProductlist(Sellerid): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/sellerProductlist";

    var request: any = {};

    request.Sellerid = Sellerid;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("sellerProductlist", request)));
  }

  sellerProductlist(Sellerid): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/sellerProductlist";

    var request: any = {};

    request.Sellerid = Sellerid;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("sellerProductlist", request)));
  }

  sellerAddProductList(Sellerid): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/sellerAddProductList";

    var request: any = {};

    request.Sellerid = Sellerid;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("sellerAddProductList", request)));
  }

  orderDetails(productid): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/orderDetails";

    var request: any = {};

    request.productid = productid;

    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("orderDetails", request)));
  }

  sellerOrderStatus(request): Observable<any> {
    var url = Config.ServiceBaseUrl + "api/sellerOrderStatus";
    return this.http
      .post(url, request, this.httpOptions)
      .pipe(catchError(this.handleError("sellerOrderStatus", request)));
  }
}
