export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (!password) {
    return { isValid: false, message: "الرجاء إدخال كلمة المرور" };
  }
  if (password.length < 8) {
    return { isValid: false, message: "يجب أن تتكون كلمة المرور من 8 خانات على الأقل" };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A-Z)" };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل (a-z)" };
  }
  if (!/\d/.test(password)) {
    return { isValid: false, message: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل (0-9)" };
  }
  
  // Standard ASCII symbols and other non-alphanumeric characters
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;
  if (!specialCharRegex.test(password)) {
    return { isValid: false, message: "يجب أن تحتوي كلمة المرور على رمز واحد على الأقل (مثل @، #، $، إلخ)" };
  }
  
  return { isValid: true, message: "" };
};
