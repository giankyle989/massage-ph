import { ChangePasswordForm } from '@/components/admin/change-password-form';

export default function ChangePasswordPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Change Password</h1>
      <ChangePasswordForm />
    </div>
  );
}
