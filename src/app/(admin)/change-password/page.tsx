import { ChangePasswordForm } from '@/components/admin/change-password-form';

export default function ChangePasswordPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Change Password</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
