import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TemplateEditor } from "@/components/TemplateEditor";

export default async function TemplateEditorPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="mx-auto max-w-4xl">
      {session!.user.role !== "admin" && (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Nur Admin-Konten der Praxis können diese Vorlage bearbeiten. Sie sehen die Positionen
          hier nur lesend.
        </p>
      )}
      <TemplateEditor templateId={params.id} readOnly={session!.user.role !== "admin"} />
    </div>
  );
}
