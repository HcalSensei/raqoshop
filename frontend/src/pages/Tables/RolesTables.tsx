import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableRole from "../../components/tables/BasicTables/BasicTableRole";

export default function RolesTables() {
    return (
        <>
            <PageMeta title="Roles Tables" description=""/>
            <PageBreadcrumb pageTitle="Roles Tables" />
            <ComponentCard title="Roles Table">
                <BasicTableRole />
            </ComponentCard>
        </>
    )
}