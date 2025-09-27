import React, { useEffect, useState } from 'react';
import { EditPipeline, getInfoByID, NewPipe } from '../../service/info';
import type { IInfo } from '../../interface/info';
import { useNavigate, useParams } from 'react-router-dom';



const EditPipe: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
  
    const [formData, setFormData] = useState<IInfo>({
      line_number: '',
      location: '',
      from: '',
      to: '',
      drawing_number: '',
      service: '',
      material: '',
      inservice_date: '',
      pipe_size: 0,
      original_thickness: 0,
      stress: 0,
      joint_efficiency: 0,
      ca: 0,
      design_life: 0,
      design_pressure: 0,
      operating_pressure: 0,
      design_temperature: 0,
      operating_temperature: 0,
    });
  
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
  
  
    useEffect(() => {
      const fetchData = async () => {
        if (!id) return;
        try {
          const res = await getInfoByID(Number(id)); 
          if (res) {
            setFormData(res); 
          }
        } catch (err) {
          console.error("โหลดข้อมูลไม่สำเร็จ", err);
          setErrorMessage("ไม่สามารถโหลดข้อมูล pipeline ได้");
        }
      };
      fetchData();
    }, [id]);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: name.includes('date')
          ? value
          : [
              'pipe_size', 'original_thickness', 'stress', 'joint_efficiency', 'ca',
              'design_life', 'design_pressure', 'operating_pressure', 'design_temperature', 'operating_temperature'
            ].includes(name)
          ? Number(value)
          : value
      }));
    };
  
    const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    const payload = {
      ...formData,
      inservice_date: formData.inservice_date 
        ? formData.inservice_date.split("T")[0]
        : "",
    };

    console.log("Submitting pipeline data:", payload);
    const res = await EditPipeline(payload, Number(id));

    if (res && !res.error) {
      const modal = document.getElementById("success_modal") as HTMLDialogElement;
      modal?.showModal();
     
    } else {
      setErrorMessage(res?.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      const modal = document.getElementById("error_modal") as HTMLDialogElement;
      modal?.showModal();
    }
  } catch (error: any) {
    setErrorMessage(error?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ API");
    const modal = document.getElementById("error_modal") as HTMLDialogElement;
    modal?.showModal();
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold text-center">แก้ไข Pipeline</h1>
         
        </div>

        {/* Form */}
        <div className="bg-base-100 p-8 rounded-b-lg">
          <div className="space-y-6">
            
            {/* Basic Information Section */}
            <div className="bg-base-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-primary">ข้อมูลพื้นฐาน</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Line Number *</span>
                  </label>
                  <input
                    type="text"
                    name="line_number"
                    value={formData.line_number}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="เช่น P-001"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Location</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="ตำแหน่งติดตั้ง"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Drawing Number</span>
                  </label>
                  <input
                    type="text"
                    name="drawing_number"
                    value={formData.drawing_number}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="หมายเลขแบบแปลน"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">From Location</span>
                  </label>
                  <input
                    type="text"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="จุดเริ่มต้น"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">To Location</span>
                  </label>
                  <input
                    type="text"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="จุดปลายทาง"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Inservice Date</span>
                  </label>
                  <input
                    type="date"
                    name="inservice_date"
                    value={formData.inservice_date ? formData.inservice_date.split('T')[0] : ''} 
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            {/* Material & Service Section */}
            <div className="bg-base-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-primary">วัสดุและการใช้งาน</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Service</span>
                  </label>
                  <input
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  >
                   
                  </input>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Material</span>
                  </label>
                  <input
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  >
                    
                  </input>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Pipe Size (mm)</span>
                  </label>
                  <input
                    type="number"
                    name="pipe_size"
                    value={formData.pipe_size}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="ขนาดท่อ"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Technical Specifications Section */}
            <div className="bg-base-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-primary">ข้อมูลทางเทคนิค</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Original Thickness (mm)</span>
                  </label>
                  <input
                    type="number"
                    name="original_thickness"
                    value={formData.original_thickness}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="ความหนาเดิม"
                    min="0"
                    step="1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Stress (MPa)</span>
                  </label>
                  <input
                    type="number"
                    name="stress"
                    value={formData.stress}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="ความเค้น"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Joint Efficiency (%)</span>
                  </label>
                  <input
                    type="number"
                    name="joint_efficiency"
                    value={formData.joint_efficiency}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="ประสิทธิภาพรอยเชื่อม"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">CA (mm)</span>
                  </label>
                  <input
                    type="number"
                    name="ca"
                    value={formData.ca}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Corrosion Allowance"
                    min="0"
                    step="1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Design Life (years)</span>
                  </label>
                  <input
                    type="number"
                    name="design_life"
                    value={formData.design_life}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="อายุการใช้งานออกแบบ"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Pressure & Temperature Section */}
            <div className="bg-base-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-primary">ความดันและอุณหภูมิ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Design Pressure (bar)</span>
                  </label>
                  <input
                    type="number"
                    name="design_pressure"
                    value={formData.design_pressure}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="ความดันออกแบบ"
                    min="0"
                    step="1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Operating Pressure (bar)</span>
                  </label>
                  <input
                    type="number"
                    name="operating_pressure"
                    value={formData.operating_pressure}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="ความดันใช้งาน"
                    min="0"
                    step="1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Design Temperature (°C)</span>
                  </label>
                  <input
                    type="number"
                    name="design_temperature"
                    value={formData.design_temperature}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="อุณหภูมิออกแบบ"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Operating Temperature (°C)</span>
                  </label>
                  <input
                    type="number"
                    name="operating_temperature"
                    value={formData.operating_temperature}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="อุณหภูมิใช้งาน"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                className="btn btn-outline"
                // onClick={handleCancel}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className={`btn bg-[#14094D] text-white ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting || !formData.line_number}
                onClick={handleSubmit}
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <dialog id="success_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-success">สำเร็จ!</h3>
          <p className="py-4">บันทึกข้อมูล Pipeline เรียบร้อยแล้ว</p>
          <div className="modal-action">
            <button 
              className="btn bg-[#14094D] text-white"
              onClick={() => {
                const modal = document.getElementById('success_modal') as HTMLDialogElement;
                modal?.close();
                navigate('/info');
              }}
            >
              ตกลง
            </button>
          </div>
        </div>
      </dialog>

      {/* Cancel Confirmation Modal */}
      <dialog id="cancel_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-warning">ยืนยันการยกเลิก</h3>
          <p className="py-4">คุณต้องการยกเลิกการกรอกข้อมูลหรือไม่?</p>
          <p className="text-sm text-gray-500 mb-4">ข้อมูลที่กรอกไว้จะหายไปทั้งหมด</p>
          <div className="modal-action">
            <button 
              className="btn btn-outline"
              onClick={() => {
                const modal = document.getElementById('cancel_modal') as HTMLDialogElement;
                modal?.close();
              }}
            >
              ไม่ยกเลิก
            </button>
            <button 
              className="btn btn-warning"
            //   onClick={confirmCancel}
            >
              ยืนยันยกเลิก
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="error_modal" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg text-error">เกิดข้อผิดพลาด!</h3>
    <p className="py-4">{errorMessage}</p>
    <div className="modal-action">
      <button 
        className="btn btn-error text-white"
        onClick={() => {
          const modal = document.getElementById('error_modal') as HTMLDialogElement;
          modal?.close();
        }}
      >
        ปิด
      </button>
    </div>
  </div>
</dialog>
    </div>
  );
};

export default EditPipe;