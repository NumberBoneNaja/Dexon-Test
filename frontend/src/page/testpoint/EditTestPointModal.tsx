import { X } from "lucide-react";
import type { ITestpoint } from "../../interface/testpoint";
import { useState, useEffect } from "react";

interface EditTestPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ITestpoint) => void;
  initialData: ITestpoint | null; // ข้อมูลที่ต้องการแก้ไข
}

export default function EditTestPointModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditTestPointModalProps) {
  const [formData, setFormData] = useState<ITestpoint>({
    tp_description: "",
    note: "",
  });

  // โหลดค่าเมื่อเปิด modal
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("test: ",formData);
    onSubmit(formData);
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-lg flex flex-col gap-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Edit Test Point</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">TP Description *</span>
            </label>
            <textarea
              name="tp_description"
              value={formData.tp_description}
              onChange={handleInputChange}
              className="textarea textarea-bordered h-24 w-full"
              placeholder="Enter test point description"
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Note</span>
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className="textarea textarea-bordered h-24 w-full"
              placeholder="Enter note (optional)"
            />
          </div>

          {/* Footer / Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
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

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}></button>
      </form>
    </dialog>
  );
}
