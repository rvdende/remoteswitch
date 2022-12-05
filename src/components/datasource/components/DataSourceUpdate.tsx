import { styles } from "@/components/styles"
import { RdataWithInOut } from "@/server/trpc/router/datasource"
import { trpc } from "@/utils/trpc"
import { deviceDataSchema } from "@/validation/devicedata"
import type { Rdatasource, Rinput, Routput } from "@prisma/client"
import { useState } from "react"
import { z } from "zod"

// https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-953187833
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

export const DataSourceUpdate = (props: {
    data: RdataWithInOut
}) => {

    // const [data, data_set] = useState<z.infer<typeof deviceDataSchema>>();
    const [data, data_set] = useState<RdataWithInOut>(props.data);

    trpc.datasource.realtime.useSubscription({ uuid: props.data.uuid },
        {
            onData: (newdata) => {
                console.log('sub', newdata);
                data_set(newdata);
            },
            onError: (err) => {
                console.log(err);
            }
        });

    if (!data) return <div>no data...</div>

    return <div className={styles.paper}>
        <span className={styles.caption}>UUID</span>
        <span className={styles.body}>{data.uuid}</span>

        <span className={styles.caption}>createdAt</span>
        <span className={styles.body}>{data.createdAt.toISOString()}</span>

        <span className={styles.caption}>updatedAt</span>
        <span className={styles.body}>{data.updatedAt.toISOString()}</span>

        <span className={styles.caption}>type</span>
        <span className={styles.body}>{data.type}</span>

        <span className={styles.caption}>description</span>
        <span>{data.description}</span>
        <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
    </div>
}