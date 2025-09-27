export interface IThickness {
    ID? : number;                
    inspection_date? : string;    // ใช้ string แทน Date (จาก API ส่วนใหญ่เป็น ISO string)
    actual_thickness? : number;
    test_point_id? : number;
}