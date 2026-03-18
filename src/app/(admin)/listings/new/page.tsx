import { ListingForm } from '@/components/admin/listing-form';

export default function NewListingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Add New Listing</h1>
      <ListingForm />
    </div>
  );
}
