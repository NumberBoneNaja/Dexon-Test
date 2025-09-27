import { useState } from "react";
import { X } from "lucide-react";

interface AddThicknessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { inspection_date: string; actual_thickness: number }) => void;
}

const AddThicknessModal: React.FC<AddThicknessModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    inspection_date: "",
    actual_thickness: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "actual_thickness" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ inspection_date: "", actual_thickness: 0 });
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Add Thickness</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose} type="button">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Inspection Date *</span>
            </label>
            <input
              type="date"
              name="inspection_date"
              value={formData.inspection_date}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Actual Thickness (mm) *</span>
            </label>
            <input
              type="number"
              name="actual_thickness"
              value={formData.actual_thickness}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
              step="0.01"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn text-white" style={{ backgroundColor: "#14094D" }}>
              Add
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}></button>
      </form>
    </dialog>
  );
};

export default AddThicknessModal;
