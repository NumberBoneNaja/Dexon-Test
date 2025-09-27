import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { IThickness } from "../../interface/thickness";

interface EditThicknessModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: IThickness;
  onSubmit: (data: IThickness) => void;
}

const EditThicknessModal: React.FC<EditThicknessModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<IThickness>({
    ID: initialData.ID,
    test_point_id: initialData.test_point_id,
    inspection_date: initialData.inspection_date,
    actual_thickness: initialData.actual_thickness,
  });

  useEffect(() => {
    setFormData({
      ID: initialData.ID,
      test_point_id: initialData.test_point_id,
      inspection_date: initialData.inspection_date,
      actual_thickness: initialData.actual_thickness,
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "actual_thickness" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      inspection_date: new Date(formData.inspection_date || "").toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Edit Thickness</h3>
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
              value={new Date(formData.inspection_date || "").toISOString().split("T")[0]}
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
            <button
              type="submit"
              className="btn text-white"
              style={{ backgroundColor: "#14094D" }}
            >
              Save
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

export default EditThicknessModal;
