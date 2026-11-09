import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";
import { PageHeader } from "@/components/ui/Misc";
import { BusinessForm } from "@/components/app/forms/BusinessForm";
import { AppearanceForm } from "@/components/app/forms/AppearanceForm";

export default async function ConfiguracionPage() {
  const session = await requireOwner();

  const business = await prisma.business.findUnique({
    where: { id: session.user.businessId },
  });
  if (!business) return null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <PageHeader
          title="Configuración"
          description="Datos generales de tu negocio."
        />
        <BusinessForm defaultValues={business} />
      </div>

      <div>
        <PageHeader
          title="Apariencia"
          description="Elige un tema de color o personaliza los colores y el logo de tu negocio."
        />
        <AppearanceForm defaultValues={business} />
      </div>
    </div>
  );
}
