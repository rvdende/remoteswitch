import { trpc } from "@/utils/trpc"
import {
    DataSourceCreate,
    DataSourceUpdate
} from "@/components";
import { styles } from "@/components/styles";
import { Container } from "@/components/landing";

export function DataSourceList() {

    const datasources = trpc.datasource.findMany.useQuery();

    return <main className={""}>


        <Container>

            <DataSourceCreate onCreate={() => {
                datasources.refetch();
            }} />


            <div className="mt-4 ">
                {datasources.data?.map(ds => {
                    return <DataSourceUpdate key={ds.id} data={ds} />
                })}
            </div>
        </Container>
    </main>
}