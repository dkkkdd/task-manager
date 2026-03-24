import { useState } from "react";
import { useAuthActions, useAuthState } from "@/context/AuthProvider";

export const useUpdateUserForm = (onClose: () => void) => {
  const { updateUserInfo } = useAuthActions();
  const { user } = useAuthState();

  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserInfo(formData);
    onClose();
  };

  return { formData, handleChange, handleSubmit };
};
