import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableSupplier from "../../components/tables/BasicTables/BasicTableSupplier";

export default function SupplierTables() {
    return (
        <>
            <PageMeta
                title="Raqoshop Dashboard"
                description=""
            />
            <PageBreadcrumb pageTitle="Gestion utilisateurs" />
            <div className="space-y-6">
                <ComponentCard title="Utilisateurs">
                    <BasicTableSupplier />
                </ComponentCard>
            </div>
        </>
    );
}