export interface Thickness {
    ID : number;                
    InspectionDate : string;    // ใช้ string แทน Date (จาก API ส่วนใหญ่เป็น ISO string)
    ActualThickness : number;
    TestpointID : number;
}