import { trpc } from "@/utils/trpc";
import { DataSourceCreate, DataSourceDisplay } from "@/components";
import { Container } from "@/components/landing";

export function DataSourceList() {
  const datasources = trpc.datasource.findMany.useQuery();

  return (
    <main className={""}>
      <Container>
        <DataSourceCreate
          onCreate={() => {
            datasources.refetch();
          }}
        />

        <div className="xs:grid-cols-1 mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {datasources.data?.map((ds) => {
            return (
              <DataSourceDisplay
                key={ds.id}
                data={ds}
                updateNeeded={() => {
                  datasources.refetch();
                }}
              />
            );
          })}
        </div>
      </Container>
    </main>
  );
}
