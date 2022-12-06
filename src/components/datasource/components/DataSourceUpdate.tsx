import { styles } from "@/components/styles"
import { useAnimationTimer } from "@/hooks/useAnimationTimer"
import { RdataWithInOut } from "@/server/trpc/router/datasource"
import { trpc } from "@/utils/trpc"
import { deviceDataSchema } from "@/validation/devicedata"
import type { Rdatasource, Rinput, Routput } from "@prisma/client"
import clsx from "clsx"
import { moment } from "@/utils/momentAlt"
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
    const [hidden, hidden_set] = useState(true);
    const timer = useAnimationTimer();

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

        <div className="pl-1">
            <span>{data.name}</span>
        </div>





        <div className={clsx("grid gap-2",
            data.inputs.length < 2 ? "grid-cols-1" : "grid-cols-2"
        )}>
            {data.inputs.map(i => {
                return <div key={i.id} className={"w-full border-4 dark:border-blue-800 from-sky-500 to-blue-600 p-4 rounded-lg text-sky-50 font-semibold flex dark:bg-blue-900 dark:hover:bg-blue-800 cursor-pointer transition active:bg-cyan-300 dark:active:bg-cyan-700 bg-gradient-to-tr dark:from-blue-900 dark:to-blue-700 hover:bg-gradient-to-t  active:translate-y-0.5 dark:hover:to-cyan-600"}>
                    <div className="flex-1">{i.name}</div>
                    <div className="font-mono">{i.value}</div>
                </div>
            })}
        </div>

        <div className="grid grid-cols-1 gap-2 mt-2">
            {data.outputs.map(o => {
                return <div key={o.id} className={"w-full bg-sky-100 border border-sky-100 text-sky-900 p-4 rounded-lg font-semibold flex dark:bg-zinc-900 dark:border-zinc-800 transition dark:text-sky-200"}>
                    <div className="flex-1">{o.name}</div>
                    <div className="font-mono">{o.value}</div>
                </div>
            })}
        </div>

        <div
            onClick={() => { hidden_set(!hidden); }}
            className="flex font-mono px-1 opacity-50 pt-1 cursor-pointer hover:opacity-100">
            <span className={clsx(styles.caption, "mb-1 flex-1")}>{moment(data.updatedAt).fromNow()}</span>
            <span className={clsx(styles.caption, "mb-1 ml-4")}>PACKETS: {(data.packetCount).toString()}</span>
            <span className={clsx(styles.caption, "mb-1 ml-4")}>TX: {(data.dataTx / BigInt(1024)).toString()}kb</span>
            <span className={clsx(styles.caption, "mb-1 ml-4")}>RX: {(data.dataRx / BigInt(1024)).toString()}kb</span>
        </div>

        <pre className={clsx("text-xs font-mono opacity-75", hidden && "hidden")}>{JSON.stringify(data, null, 2)}</pre>
    </div>
}