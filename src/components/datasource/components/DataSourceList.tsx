import { trpc } from "@/utils/trpc"
import {
    DataSourceCreate,
    DataSourceUpdate
} from "@/components";
import { styles } from "@/components/styles";

export function DataSourceList() {

    const datasources = trpc.datasource.findMany.useQuery();

    return <main className={styles.paper}>

        <DataSourceCreate onCreate={() => {
            datasources.refetch();
        }} />



        <div>
            {datasources.data?.map(ds => {
                return <DataSourceUpdate key={ds.id} data={ds} />
            })}
        </div>
    </main>
}