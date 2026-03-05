import { toast } from "react-toastify";

// confirmationToast.js
export const showConfirmationToast = (message, onConfirm, onCancel) => {
  const toastId = toast(
    <div className="p-2">
      <p className="mb-3">{message}</p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            toast.dismiss(toastId);
            onCancel?.();
          }}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            toast.dismiss(toastId);
            onConfirm();
          }}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>,
    {
      duration: 10000, // 10 seconds
      position: "top-center",
    }
  );
};

