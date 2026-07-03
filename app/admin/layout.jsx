import AdminLayout from "@/components/admin/AdminLayout";
import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "GoCart. - Admin",
  description: "GoCart. - Admin",
};

export default async function RootAdminLayout({ children }) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <SignIn fallbackRedirectUrl='/admin' routing='hash' />
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
