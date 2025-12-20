import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableUser from "../../components/tables/BasicTables/BasicTableUser";

export default function UserTable() {
    return (
        <>
            <PageMeta
                title="Raqoshop Dashboard"
                description=""
            />
            <PageBreadcrumb pageTitle="Gestion utilisateurs" />
            <div className="space-y-6">
                <ComponentCard title="Utilisateurs">
                    <BasicTableUser />
                </ComponentCard>
            </div>
        </>
    );
}