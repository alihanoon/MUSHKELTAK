import axios from "axios";


const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;


const sendToGoogle = async (payload: any) => {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn("⚠️ Google Script URL is missing. Check your environment variables.");
    return;
  }

  try {
    
    await axios.post(GOOGLE_SCRIPT_URL, payload);
    console.log(`✅ Email sent successfully: ${payload.type} - Status: ${payload.statusId || 'N/A'}`);
  } catch (error: any) {
    console.error("❌ Error sending email to Google Script:", error.message);
  }
};

/**
 * 1. إرسال إيميل ترحيبي (عند إنشاء حساب جديد)
 */
export const sendWelcomeEmail = async (user: { email: string; name: string }) => {
  const payload = {
    type: "welcome",
    email: user.email,
    name: user.name,
  };
  return sendToGoogle(payload);
};

/**
 * 2. إرسال إيميل "تأكيد استلام" (فور تقديم الشكوى لأول مرة)
 * يتم استدعاء هذه الدالة في Controller بعد حفظ الشكوى بنجاح
 */
export const sendComplaintConfirmationEmail = async (complaint: any, user: any) => {
  const payload = {
    type: "status_change",
    email: user.email,
    name: user.name,
    statusId: 1, // الحالة رقم 1 هي "تم الاستلام" في سكربت جوجل
    complaintId: complaint.complaintNumber,
  };
  return sendToGoogle(payload);
};

/**
 * 3. إرسال إيميل تحديث الحالة (عندما يغير الموظف حالة الشكوى)
 * @param statusId الرقم من 2 إلى 5
 */
export const sendStatusUpdateEmail = async (complaint: any, user: any) => {
  const payload = {
    type: "status_change",
    email: user.email,
    name: user.name,
    statusId: complaint.status, // القيمة المتغيرة (2, 3, 4, أو 5)
    complaintId: complaint.complaintNumber,
  };
  return sendToGoogle(payload);
};

/**
 * 4. إرسال إيميل رمز التحقق (OTP) لإعادة تعيين كلمة السر
 */
export const sendOTPEmail = async (user: { email: string; name: string }, otp: string) => {
  const payload = {
    type: "forgot_password", // نوع جديد ليميزه سكربت جوجل
    email: user.email,
    name: user.name,
    otp: otp, // نمرر الرمز الذي ولدناه في السيرفر
  };
  return sendToGoogle(payload);
};