import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BaseTableDriver from "../../components/tables/BasicTables/BasicTableDriver";

export default function DriverTables() {
  return (
    <>
      <PageMeta
        title="Raqoshop Dashboard"
        description=""
      />
      <PageBreadcrumb pageTitle="Gestion livreurs" />
      <div className="space-y-6">
        <ComponentCard title="Livreurs">
          <BaseTableDriver />
        </ComponentCard>
      </div>
    </>
  );
}
