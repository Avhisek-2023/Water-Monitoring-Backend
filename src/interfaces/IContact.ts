export interface IContact extends Document {
  phone: string;
  alternatePhone?: string;
  emergencyContactNo: string;
}
