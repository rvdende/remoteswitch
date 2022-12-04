import { styles } from "@/components/styles";
import { trpc } from "@/utils/trpc"
import clsx from 'clsx';
import { useState } from "react";
import { useForm } from "react-hook-form";

interface IDatasourceCreateForm {
    uuid: string
}

export const DataSourceCreate = (props: {
    onCreate?: () => void
}) => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const datasourcecreate = trpc.datasource.create.useMutation();



    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IDatasourceCreateForm>();

    return <div>

        <span className={styles.caption}>
            Add Data Source:
        </span>

        <form action=""
            onSubmit={
                handleSubmit(async (data) => {
                    setErrorMessage(undefined);
                    await datasourcecreate.mutateAsync(data);

                    // run onCreate event if it exists
                    props.onCreate && props.onCreate();
                })
            }
        >

            {datasourcecreate.error && (
                <p className="text-red-600">
                    <pre>{JSON.stringify(datasourcecreate.error, null, 2)}</pre>
                </p>
            )}

            <div className="flex flex-row">

                <input
                    placeholder="Enter device UUID to add to your account."

                    {...register(
                        "uuid",
                        { required: true })
                    }
                    className={clsx(
                        styles.input,
                        "rounded-r-none"
                    )}
                />

                <button type="submit"
                    className={clsx(
                        styles.button,
                        "rounded-l-none")}>
                    Add
                </button>

            </div>

            {errors.uuid && (
                <p className="text-center text-red-600">This field is required</p>
            )}

        </form>
    </div>
}