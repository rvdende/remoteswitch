import { trpc } from "@/utils/trpc"
import {
    DataSourceCreate,
    DataSourceDisplay
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


            <div className="mt-4 grid gap-2 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {datasources.data?.map(ds => {
                    return <DataSourceDisplay key={ds.id} data={ds} />
                })}
            </div>
        </Container>
    </main>
}
