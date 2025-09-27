import { X } from "lucide-react";
import type { ITestpoint } from "../../interface/testpoint";

interface AddTestPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: ITestpoint;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AddTestPointModal: React.FC<AddTestPointModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
}) => {
  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-lg flex flex-col gap-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Add Test Point</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">TP Description *</span>
            </label>
            <textarea
              name="tp_description"
              value={formData.tp_description}
              onChange={onInputChange}
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
              onChange={onInputChange}
              className="textarea textarea-bordered h-24 w-full"
              placeholder="Enter note (optional)"
            />
          </div>

          {/* Footer */}
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
              Add Test Point
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
};

export default AddTestPointModal;
