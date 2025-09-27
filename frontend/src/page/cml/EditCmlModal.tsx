import { useState, type Dispatch, type SetStateAction, useEffect } from "react";
import type { ICml } from "../../interface/cml";
import { UpdateCmlByID } from "../../service/Cml/cml";
import { X } from "lucide-react";

interface EditCmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  cmlData: ICml; // ข้อมูล CML ที่จะ edit
  onSuccess: () => void; // callback หลัง update สำเร็จ
  setShowErrorAlert: Dispatch<SetStateAction<boolean>>;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
}

const EditCmlModal: React.FC<EditCmlModalProps> = ({
  isOpen,
  onClose,
  cmlData,
  onSuccess,
  setShowErrorAlert,
  setShowAlert,
}) => {
  const [formData, setFormData] = useState<ICml>({
    ...cmlData,
    actual_outside_diameter: cmlData.actual_outside_diameter ?? 0,
    design_thickness: cmlData.design_thickness ?? 0,
    structural_thickness: cmlData.structural_thickness ?? 0,
    required_thickness: cmlData.required_thickness ?? 0,
  });

  // Pre-fill form data เมื่อเปิด modal
  useEffect(() => {
    setFormData({
      ...cmlData,
      actual_outside_diameter: cmlData.actual_outside_diameter ?? 0,
      design_thickness: cmlData.design_thickness ?? 0,
      structural_thickness: cmlData.structural_thickness ?? 0,
      required_thickness: cmlData.required_thickness ?? 0,
    });
  }, [cmlData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("thickness") || name === "actual_outside_diameter" || name === "cml_number"
      ? Number(value)
      : value,

    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("test",formData);
      const res = await UpdateCmlByID(formData, formData.ID!);
      if (!res) {
        setShowErrorAlert(true);
        return;
      }
      onSuccess(); // refresh data
      setShowAlert(true);
      onClose(); // ปิด modal
    } catch (error) {
      console.error("Error updating CML:", error);
      setShowErrorAlert(true);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({
      ...cmlData,
      actual_outside_diameter: cmlData.actual_outside_diameter ?? 0,
      design_thickness: cmlData.design_thickness ?? 0,
      structural_thickness: cmlData.structural_thickness ?? 0,
      required_thickness: cmlData.required_thickness ?? 0,
    });
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-2xl relative">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
          type="button"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-bold text-xl md:text-2xl mb-6 text-center">
          Edit CML
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

          {/* Thickness Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Actual Outside Diameter</span>
              </label>
              <input
                type="number"
                name="actual_outside_diameter"
                value={formData.actual_outside_diameter}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Design Thickness</span>
              </label>
              <input
                type="number"
                name="design_thickness"
                value={formData.design_thickness}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Structural Thickness</span>
              </label>
              <input
                type="number"
                name="structural_thickness"
                value={formData.structural_thickness}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Required Thickness</span>
              </label>
              <input
                type="number"
                name="required_thickness"
                value={formData.required_thickness}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleClose}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default EditCmlModal;
