// Hàm kiểm tra emoji
const containsEmoji = (str: string) => {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAB0}-\u{1FABF}\u{1FAC0}-\u{1FAFF}\u{1FAD0}-\u{1FAFF}\u{1FAE0}-\u{1FAFF}\u{1FAF0}-\u{1FAFF}]/u;
  return emojiRegex.test(str);
};

export const validateRegisterForm = (form: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const { username, email, password, confirmPassword } = form;

  if (!username || !email || !password || !confirmPassword)
    return "Vui lòng điền đầy đủ thông tin.";
  
  // Kiểm tra emoji trong tất cả các trường
  if (containsEmoji(username) || 
      containsEmoji(email) || containsEmoji(password) || containsEmoji(confirmPassword))
    return "Không được sử dụng emoji trong bất kỳ trường nào.";
  
  // Kiểm tra ký tự đặc biệt và khoảng trắng trong username
  if (username.includes(" ") || /[!@#$%^&*(),.?":{}|<>]/.test(username))
    return "Tên đăng nhập không được chứa ký tự đặc biệt hoặc khoảng trắng.";
  
  if (!email.match(/^\S+@\S+\.\S+$/)) 
    return "Email không hợp lệ.";
  
  if (username.length < 6) 
    return "Tên đăng nhập phải có ít nhất 6 ký tự.";
  
  if (password.length < 6) 
    return "Mật khẩu phải có ít nhất 6 ký tự.";
  
  if (password !== confirmPassword) 
    return "Mật khẩu xác nhận không khớp.";

  return null;
};

export const validateLoginForm = (form: {
  username: string;
  password: string;
}) => {
  const { username, password } = form;

  if (!username || !password) 
    return "Vui lòng điền đầy đủ thông tin.";
  
  // Kiểm tra emoji trong username và password
  if (containsEmoji(username) || containsEmoji(password))
    return "Không được sử dụng emoji trong bất kỳ trường nào.";
  
  // Kiểm tra ký tự đặc biệt và khoảng trắng trong username
  if (username.includes(" ") || /[!@#$%^&*(),.?":{}|<>]/.test(username))
    return "Tên đăng nhập không được chứa ký tự đặc biệt hoặc khoảng trắng.";
  
  if (password.length < 6) 
    return "Mật khẩu phải có ít nhất 6 ký tự.";

  return null;
};
