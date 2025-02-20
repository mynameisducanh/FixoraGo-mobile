export const validateRegisterForm = (form: {
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const { email, password, confirmPassword } = form;

  if (!email || !password || !confirmPassword)
    return "Vui lòng điền đầy đủ thông tin.";
  if (!email.match(/^\S+@\S+\.\S+$/)) return "Email không hợp lệ.";
  if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";
  if (password !== confirmPassword) return "Mật khẩu xác nhận không khớp.";

  return null;
};

export const validateLoginForm = (form: {
  email: string;
  password: string;
}) => {
  const { email, password } = form;
  
  if (!email || !password) return "Vui lòng điền đầy đủ thông tin.";
  if (!email.match(/^\S+@\S+\.\S+$/)) return "Email không hợp lệ.";
  if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";

  return null;
};
