export interface ICountry extends Document {
  name: string;
  phone_code?: string;
  iso_code?: string;
}
