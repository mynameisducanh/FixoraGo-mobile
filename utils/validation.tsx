export const validateRegisterForm = (form: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const { username, email, password, confirmPassword } = form;

  if (!username || !email || !password || !confirmPassword)
    return "Vui lòng điền đầy đủ thông tin.";
  if (!email.match(/^\S+@\S+\.\S+$/)) return "Email không hợp lệ.";
  if (username.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
  if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
  if (password !== confirmPassword) return "Mật khẩu xác nhận không khớp.";

  return null;
};

export const validateLoginForm = (form: {
  username: string;
  password: string;
}) => {
  const { username, password } = form;

  if (!username || !password) return "Vui lòng điền đầy đủ thông tin.";
  if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";

  return null;
};
