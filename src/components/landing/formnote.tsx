import type { ChangeEvent } from "react";
import { useState } from "react";
import { styles } from "@/components/styles";


export interface IFile {
    // "fieldname": string
    "originalname": string
    // "encoding": string
    "mimetype": string
    // "destination": string
    "filename": string
    "path": string
    "size": number
}


export const uploadFileRaw = async (route: string, event: ChangeEvent<HTMLInputElement>): Promise<IFile[]> => {
    if (!event.target.files) {
        throw new Error('missing files');
    }

    const body = new FormData();

    for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        if (file === undefined) throw Error('file not defined.');
        if (event.target.files[i]) body.append("uploadfile", file);
    }

    // body.append('uploadfile', event.target.files[0]);
    const result: IFile[] = await fetch(`/uploads/${route}`, {
        method: 'post',
        // headers: getHeaders(),
        body
    }).then(r => r.json());
    return result;
}

export const FormNote = () => {


    const [fileinputvalue, fileinputvalue_set] = useState("");
    const [showUploadProgress, showUploadProgress_set] = useState(false);

    const addAttachment = async (event: React.ChangeEvent<HTMLInputElement>) => {
        showUploadProgress_set(true);
        const result = await uploadFileRaw('esoscommentattachments', event).catch(err => {
            console.error(err.message);
            showUploadProgress_set(false);
        });
        showUploadProgress_set(false);
        console.log(result);
        if (!result) return;
        // let newlist = clone(attachmentsList);
        // newlist = newlist.concat(result);
        // attachmentsList_set(newlist);
        // props.onChange(newlist);

    }

    return <div>
        <div className={styles.block}>
            <div className="px-6 py-6 pt-0">
                <p className={styles.h4}>Add message</p>
                <textarea className="w-full border border-zinc-500 rounded-md"></textarea>

                <p className={styles.h4}>Upload content</p>

                <input
                    // hidden
                    type="file"
                    value={fileinputvalue}
                    // accept={".jpg, .png, .jpeg, .gif"}
                    name="uploadfile"
                    multiple
                    onChange={async (e) => {
                        fileinputvalue_set(e.target.value);
                        await addAttachment(e);
                        fileinputvalue_set('');
                    }} />

                <p className="font-semibold text-lg text-zinc-700 mt-8 mb-2">Add recipients</p>



                <form action="#" method="POST" className="space-y-6">
                    <div>
                        <label htmlFor="name" className="sr-only">
                            Full name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="name"
                            placeholder="Full name"
                            required
                            className={styles.input}
                        />
                    </div>

                    <div>
                        <label htmlFor="mobile-or-email" className="sr-only">
                            Mobile number or email
                        </label>
                        <input
                            type="text"
                            name="mobile-or-email"
                            id="mobile-or-email"
                            autoComplete="email"
                            placeholder="Mobile number or email"
                            required
                            className="block w-full rounded-md border-zinc-500 border shadow-sm focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm p-4"
                        />
                    </div>


                </form>

            </div>
            <div className={styles.blockAlt}>
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-zinc-900 py-4 px-4 text-md font-semibold text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                >
                    Continue
                </button>
            </div>
        </div>
        <p className="text-xs text-center text-zinc-500 mb-5">
            By signing up, you agree to our{' '}
            <a href="#" className="font-medium text-zinc-900 hover:underline">
                Terms
            </a>
            ,{' '}
            <a href="#" className="font-medium text-zinc-900 hover:underline">
                Data Policy
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-zinc-900 hover:underline">
                Cookies Policy
            </a>
            .
        </p>
    </div>
}
