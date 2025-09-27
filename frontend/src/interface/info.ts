export interface Info {
  ID: number;                // จาก gorm.Model
  LineNumber: string;
  Location: string;
  FromLocation: string;
  ToLocation: string;
  DrawingNumber: string;
  Service: string;
  Material: string;
  InserviceDate: string;     // ใช้ string แทน Date (จาก API ส่วนใหญ่เป็น ISO string)
  PipeSize: number;
  OriginalThickness: number;
  Stress: number;
  JointEfficiency: number;
  Ca: number;
  DesignLife: number;
  DesignPressure: number;
  OperatingPressure: number;
  DesignTemperature: number;
  OperatingTemperature: number;
}