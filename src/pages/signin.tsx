import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import type { ILogin } from "@/validation/auth";



import Link from "next/link";
import { Logo } from "@/components/landing/logo";

export const LoginForm = () => {

  const router = useRouter();
  const { error } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    console.log(data);
    const result = await signIn("credentials", { ...data, callbackUrl: "/" });
    console.log(result);
  };

  return (
    <div className="radius flex flex-col items-center gap-2 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        {error && (
          <p className="text-center text-red-600">Login failed, try again!</p>
        )}
        <label>Email</label>
        <input
          className="rounded border py-1 px-4 dark:border-zinc-500"
          type="text"
          {...register("email", { required: true })}
        />
        {errors.email && <span>This field is required</span>}
        <label>Password</label>
        <input
          className="rounded border py-1 px-4 dark:border-zinc-500"
          autoComplete="current-password"
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && <span>This field is required</span>}




        <button
          type="submit"
          className="relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2"
        >
          LOGIN
        </button>




      </form>
    </div>
  );

}


export const SignInPage = () => {
  return <div>



    <div className='w-full h-full bg-white overflow-hidden fixed left-0 top-0 bottom-0  transition-all'>
      <div className='flex items-center flex-col align-middle h-full place-content-center pb-10 dark:bg-zinc-800'>
        <Link href="/" className="mb-10">
          <Logo />
        </Link>

        <LoginForm />
      </div>
    </div>

    {/* <Image
      className="z-10"
      src={ImageRoad}
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        objectFit: 'cover',
        position: 'fixed',
      }}
      alt={"road background"}
    /> */}


  </div>
}

export default SignInPage;