import React, { use, useEffect, useState } from "react"
import type { IInfo } from "../../interface/info"
import { useNavigate } from "react-router-dom"

interface Props {
  info: IInfo | null
  onDelete?: (id: number) => void
}

export default function InfoModal({ info, onDelete }: Props) {
    const navigate = useNavigate()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
    if (!info) return null
  
    const handleEdit = () => {
      navigate(`/editpip/${info.ID}`) // สมมติ route สำหรับ edit
    }
  
    const handleDelete = () => {
        if (!info.ID) return
        onDelete?.(info.ID)
        setShowDeleteConfirm(false)
        const modal = document.getElementById('info_modal') as HTMLDialogElement
        modal?.close()
      }
    
   

  return (
    <>
    <dialog id="info_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Pipeline Information Details</h3>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-primary" onClick={handleEdit}>Edit</button>
            <button className="btn btn-sm btn-error" onClick={handleDelete}>Delete</button>
          </div>
        </div>
        {info && (
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h4 className="card-title text-base">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Line Number</span>
                    </label>
                    <div className="text-lg font-bold text-blue-600">{info.line_number}</div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Service</span>
                    </label>
                    <div>{info.service}</div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Material</span>
                    </label>
                    <div>{info.material}</div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Location</span>
                    </label>
                    <div>{info.location}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h4 className="card-title text-base">Technical Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Pipe Size</span>
                    </label>
                    <div className="badge badge-neutral">{info.pipe_size}"</div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Original Thickness</span>
                    </label>
                    <div>{info.original_thickness} mm</div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Joint Efficiency</span>
                    </label>
                    <div>{info.joint_efficiency}</div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Stress</span>
                    </label>
                    <div>{info.stress} psi</div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Design Life</span>
                    </label>
                    <div>{info.design_life} years</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Conditions */}
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h4 className="card-title text-base">Operating Conditions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Operating Pressure</span>
                    </label>
                    <div className="text-green-600 font-semibold">{info.operating_pressure} psi</div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Operating Temperature</span>
                    </label>
                    <div className="text-orange-600 font-semibold">{info.operating_temperature}°C</div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Design Pressure</span>
                    </label>
                    <div>{info.design_pressure} psi</div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Design Temperature</span>
                    </label>
                    <div>{info.design_temperature}°C</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Information */}
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h4 className="card-title text-base">Connection Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">From</span>
                    </label>
                    <div className="text-sm">{info.from}</div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">To</span>
                    </label>
                    <div className="text-sm">{info.to}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documentation */}
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h4 className="card-title text-base">Documentation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Drawing Number</span>
                    </label>
                    <div className="text-sm font-mono">{info.drawing_number}</div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">In-service Date</span>
                    </label>
                    <div>{new Date(info.inservice_date ?? "").toLocaleDateString('th-TH')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h4 className="card-title text-base">System Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Ca Value</span>
                    </label>
                    <div>{info.ca}</div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">ID</span>
                    </label>
                    <div>#{info.ID}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
         {/* Delete Confirmation Modal */}
     
      </div>
    </dialog>
    <dialog id="delete_confirm_modal" className={`modal ${showDeleteConfirm ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">ยืนยันการลบข้อมูล</h3>
          <p className="py-4">คุณแน่ใจหรือว่าต้องการลบ pipeline นี้? ข้อมูลจะไม่สามารถกู้คืนได้</p>
          <div className="modal-action">
            <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(false)}>ยกเลิก</button>
            <button className="btn btn-error text-white" onClick={handleDelete}>ลบ</button>
          </div>
        </div>
      </dialog>
    </>
  )
}
