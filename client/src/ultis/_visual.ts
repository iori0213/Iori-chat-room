import { toast, TypeOptions } from "react-toastify";

export const toasti = (message: string, type?: TypeOptions) => {
  toast(message, {
    type: type || "default",
  });
};
