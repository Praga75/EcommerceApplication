export interface SellerDetails {
  sellerid: number;
  FullName: string;
  Phone: string;
  Email: string;
  Password: string;
  Gender: string;
  GSTnumber: string;
  Totalincome: number;
  isVerified: number;
  isActive: number;
  logo: number;
}

export interface SellerAddress {
  sellerid: number;
  addressOne: string;
  addressTwo: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isPrimary: string;
}

export interface SellerAddress2 {
  sellerid: number;
  addressOne: string;
  addressTwo: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isPrimary: string;
}

export interface sellerProduct {
  productid: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
}

export interface SellerProductSpecification {
  productid: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
}

export interface notverifyproductResponse {
  productid: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: number;
  productquantity: number;
}

export interface notverifyproductResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  productid: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: number;
  productquantity: number;
}

export interface notverifiedResponse {
  productid: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: number;
  productquantity: number;
}

export interface notverifiedResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  productid: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: number;
  productquantity: number;
}

export interface notverifiedResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  productid: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: number;
  productquantity: number;
}

export interface notverifiedResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  productid: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: number;
  productquantity: number;
}

export interface notverifiedResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  productid: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: number;
  productquantity: number;
}

export interface notverifiedResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  productid: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: number;
  productquantity: number;
}

export interface productDetailsResponse {
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  productid: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
}

export interface joinproductResponse {
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  productid: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
}

export interface SellerProductImages {
  procductid: number;
  image: string;
}

export interface joinproductResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  productid: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
}

export interface joinproductResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  productid: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
}

export interface joinproductResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  productid: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
}

export interface ProductFullDetailsResponse {
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  productid: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface ProductFullDetailsResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  productid: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface RichCardCutomerAddress {
  customerid: number;
  addressLineOne: string;
  addressLineTwo: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  Phone2: string;
  isPrimary: string;
}

export interface RichCardCustomerDetails {
  customerid: number;
  FullName: string;
  Phone: string;
  Email: string;
  password: string;
  gender: string;
  status: string;
}

export interface RichCardAddToCard {
  cardid: number;
  productid: number;
  quantity: number;
  customerid: number;
}

export interface addtocardlistResponse {
  cardid: number;
  productid: number;
  quantity: number;
  customerid: number;
}

export interface RichCardAddToCardFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  cardid: number;
  productid: number;
  quantity: number;
  customerid: number;
}

export interface searchingResponse {
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  productid: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface searchingResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  productid: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface databyidResponse {
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  productid: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface databyidResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  productid: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface prodetailbyidResponse {
  sellerid: number;
  addressOne: string;
  addressTwo: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isPrimary: string;
  productid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  image: string;
}

export interface sellerProductlistResponse {
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface sellerProductlistResponse {
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  productid: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface sellerProductlistResponse {
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface sellerProductlistResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface sellerProductlistResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface sellerProductlistResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface sellerProductlistResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface sellerProductlistResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  sellerid: number;
  brand: string;
  category: string;
  price: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
}

export interface productConfirmationbySellerResponse {
  sellerid: number;
  brand: string;
  category: string;
  productRealprice: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
  orderid: number;
  productid: number;
  customerid: number;
  orderStatus: string;
  shippingAddress: string;
  deliveringAddress: string;
  paymentid: number;
  deliveryCharge: number;
  dateOfOrder: string;
  dateOfDelivery: string;
  price: number;
}

export interface productConfirmationbySellerResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  sellerid: number;
  brand: string;
  category: string;
  productRealprice: number;
  totalsale: number;
  isVerified: string;
  productquantity: number;
  description: string;
  productName: string;
  size: string;
  colour: string;
  returnPolicy: string;
  timeForReplacement: string;
  termsAndCondition: string;
  procductid: number;
  image: string;
  orderid: number;
  productid: number;
  customerid: number;
  orderStatus: string;
  shippingAddress: string;
  deliveringAddress: string;
  paymentid: number;
  deliveryCharge: number;
  dateOfOrder: string;
  dateOfDelivery: string;
  price: number;
}

export interface confirmOrderResponse {
  orderid: number;
  productid: number;
  customerid: number;
  orderStatus: string;
  shippingAddress: string;
  deliveringAddress: string;
  paymentid: number;
  deliveryCharge: number;
  dateOfOrder: string;
  dateOfDelivery: string;
  price: number;
}

export interface confirmOrderResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  orderid: number;
  productid: number;
  customerid: number;
  orderStatus: string;
  shippingAddress: string;
  deliveringAddress: string;
  paymentid: number;
  deliveryCharge: number;
  dateOfOrder: string;
  dateOfDelivery: string;
  price: number;
}

export interface CustomerOrderDetailsFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  orderid: number;
  productid: number;
  customerid: number;
  orderStatus: string;
  shippingAddress: string;
  deliveringAddress: string;
  paymentid: number;
  deliveryCharge: number;
  dateOfOrder: string;
  dateOfDelivery: string;
  price: number;
}

export interface orderTable {
  orderid: number;
  productid: number;
  customerId: number;
  orderStatus: string;
  paymentId: number;
  price: number;
  shippingAddress: string;
  deliveringAddress: string;
  deliveryCharge: number;
  dateOfOrder: string;
  dateOfDelivery: string;
  totalPrice: number;
}

export interface orderTableFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  orderid: number;
  productid: number;
  customerId: number;
  orderStatus: string;
  paymentId: number;
  price: number;
  shippingAddress: string;
  deliveringAddress: string;
  deliveryCharge: number;
  dateOfOrder: string;
  dateOfDelivery: string;
  totalPrice: number;
}

export interface orderDetailsResponse {
  orderid: number;
  productid: number;
  customerId: number;
  orderStatus: string;
  paymentId: number;
  price: number;
  shippingAddress: string;
  deliveringAddress: string;
  deliveryCharge: number;
  dateOfOrder: string;
  dateOfDelivery: string;
  totalPrice: number;
}

export interface orderDetailsResponseFilters {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  orderid: number;
  productid: number;
  customerId: number;
  orderStatus: string;
  paymentId: number;
  price: number;
  shippingAddress: string;
  deliveringAddress: string;
  deliveryCharge: number;
  dateOfOrder: string;
  dateOfDelivery: string;
  totalPrice: number;
}
