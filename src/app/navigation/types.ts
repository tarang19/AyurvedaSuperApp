export type ConsultationStackParamList = {
  DoctorList: undefined;
  DoctorDetail: {doctorId: string};
  BookingConfirm: {doctorId: string; slotId: string; date: string; time: string};
  Upcoming: undefined;
};

export type ShopStackParamList = {
  ProductList: undefined;
  ProductDetail: {productId: string};
  Cart: undefined;
  Checkout: undefined;
};

export type HealthStackParamList = {
  Timeline: undefined;
  RecordDetail: {recordId: string};
};

export type RootTabParamList = {
  Consultation: undefined;
  Shop: undefined;
  Health: undefined;
  Settings: undefined;
};

export type RootStackParamList = RootTabParamList & {
  Settings: undefined;
};
