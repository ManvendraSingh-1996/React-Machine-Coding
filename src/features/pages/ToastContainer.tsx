import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";

const ToastContainer = () => {
  const userData = useContext(UserContext);
  const [toasts, setToasts] = useState<
    Array<{ id: number; message: string; type: string }>
  >([]);
  const handleToast = (msg: string, type: string) => {
    const id = toasts.length + 1;
    setToasts([...toasts, { id: id, message: msg, type: type }]);
    setTimeout(() => {
      handleClose(id);
    }, 6000);
  };
  console.log("user from context :", userData);

  const handleClose = (id: number) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  };
  return (
    <div>
      <div className="fixed top-4 right-4 z-50 p-4">
        {toasts?.map((data) => (
          <div
            key={data.id}
            className={` ${data.type} toast bg-green-100 border border-green-400 text-black px-4 py-3 m-2 rounded shadow-lg flex items-center justify-between space-x-4 max-w-sm`}
          >
            <div className="font-semibold">{data.message}</div>
            <span
              className="cursor-pointer font-bold text-lg hover:text-green-900 transition-colors"
              onClick={() => {
                handleClose(data.id);
              }}
            >
              &times;
            </span>
          </div>
        ))}
      </div>
      <h1 className=" "> Sample Toast Button for {userData}</h1>
      <div className="space-x-2 py-2 btn-container ">
        <button
          className="px-3 py-1 bg-blue-400 hover:bg-blue-300 rounded-md"
          onClick={() => handleToast("Success Toast", "success")}
        >
          Success Toast
        </button>
        <button
          className="px-3 py-1 bg-blue-400 hover:bg-blue-300 rounded-md"
          onClick={() => handleToast("Delete Toast", "delete")}
        >
          Delete Toast
        </button>
        <button
          className="px-3 py-1 bg-blue-400 hover:bg-blue-300 rounded-md"
          onClick={() => handleToast("Failed Toast", "failed")}
        >
          Failed Toast
        </button>
        <button
          className="px-3 py-1 bg-blue-400 hover:bg-blue-300 rounded-md"
          onClick={() => handleToast("Warning Toast", "warning")}
        >
          Warning Toast
        </button>
      </div>
    </div>
  );
};

export default ToastContainer;
