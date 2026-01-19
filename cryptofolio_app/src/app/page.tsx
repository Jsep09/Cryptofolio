import { redirect } from "next/navigation";

export default function RootPage() {
  // ในอนาคตคุณสามารถเช็คได้ว่า ถ้ายังไม่ได้ Login ให้ไปหน้า /login
  // แต่ตอนนี้ให้ไปหน้า Dashboard ก่อนเลย
  redirect("/dashboard");

  // หรือถ้ายังไม่ได้สร้างหน้าย่อย ให้ไปที่หน้าหลักของ Group (dashboard)
  // redirect("/dashboard");
}
