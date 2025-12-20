import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BaseTableOrder from "../../components/tables/BasicTables/BasicTableOrder";


export default function OrderTables() {
  return (
    <>
      <PageMeta
        title="Raqoshop Dashboard"
        description=""
      />
      <PageBreadcrumb pageTitle="Gestion Commandes" />
      <div className="space-y-6">
        <ComponentCard title="Commandes">
          <BaseTableOrder />
        </ComponentCard>
      </div>
    </>
  );
}
