import { useState, type Dispatch, type SetStateAction } from "react";
import type { ICml } from "../../interface/cml";
import { AddNewCml } from "../../service/Cml/cml";
import { X } from "lucide-react";

interface AddCmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  infoId: number;
  onSuccess: () => void; // callback หลังเพิ่มสำเร็จ
  setShowErrorAlert: Dispatch<SetStateAction<boolean>>;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
}

const AddCmlModal: React.FC<AddCmlModalProps> = ({
  isOpen,
  onClose,
  infoId,
  onSuccess,
  setShowErrorAlert,
  setShowAlert,
}) => {
  const [formData, setFormData] = useState<ICml>({
    cml_number: 0,
    cml_description: "",
    actual_outside_diameter: 0,
    design_thickness: 0,
    structural_thickness: 0,
    required_thickness: 0,
    info_id: infoId,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await AddNewCml(formData);
      if (!res) {
        setShowErrorAlert(true);
        return;
      }
      onSuccess(); // refresh data
      setShowAlert(true);

      onClose(); // ปิด modal
      setFormData({
        cml_number: 0,
        cml_description: "",
        actual_outside_diameter: 0,
        design_thickness: 0,
        structural_thickness: 0,
        required_thickness: 0,
        info_id: infoId,
      });
    } catch (error) {
      console.error("Error adding CML:", error);
      setShowErrorAlert(true);
    }
  };
  const handleClose = () => {
    onClose(); // ปิด modal
    setFormData({
      cml_number: 0,
      cml_description: "",
      actual_outside_diameter: 0,
      design_thickness: 0,
      structural_thickness: 0,
      required_thickness: 0,
      info_id: infoId,
    });
  };
  

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-2xl relative">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
          type="button"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-bold text-xl md:text-2xl mb-6 text-center">
          Add New CML
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              name="cml_description"
              value={formData.cml_description}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full h-28"
              placeholder="Enter description"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn text-white"
              style={{ backgroundColor: "#14094D" }}
            >
              Add CML
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop click */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default AddCmlModal;
