import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BaseTableStock from "../../components/tables/BasicTables/BasicTableStock";


export default function StockTables() {
  return (
    <>
      <PageMeta
        title="Raqoshop Dashboard"
        description=""
      />
      <PageBreadcrumb pageTitle="Gestion stock" />
      <div className="space-y-6">
        <ComponentCard title="Stock">
          <BaseTableStock />
        </ComponentCard>
      </div>
    </>
  );
}
