import { styles } from "@/components/styles"
import type { Rdatasource } from "@prisma/client"

export const DataSourceUpdate = (props: {
    data: Rdatasource
}) => {

    const data = props.data;

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
        <pre className="text-xs">{JSON.stringify(props.data, null, 2)}</pre>
    </div>
}