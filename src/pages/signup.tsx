import React from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";

import { trpc } from "@/utils/trpc";
import type { IRegister } from "@/validation/auth";

import { signIn } from "next-auth/react";
import { Logo } from "@/components/landing/logo";
import Link from "next/link";

const RegisterForm = () => {

  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const mutation = trpc.auth.register.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: (status, message) => {
      signIn('credentials', { callbackUrl: '/', ...message });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegister>();

  const onSubmit: SubmitHandler<IRegister> = async (data) => {
    setErrorMessage(undefined);
    await mutation.mutateAsync(data);
  };

  return (
    <div className="radius flex flex-col items-center gap-2 border p-4">

      <Logo />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        {errorMessage && (
          <p className="text-center text-red-600">{errorMessage}</p>
        )}
        <label>Name</label>
        <input
          className="rounded border py-1 px-4"
          type="text"
          autoFocus
          {...register("name", { required: true })}
        />
        {errors.name && (
          <p className="text-center text-red-600">This field is required</p>
        )}
        <label>Email</label>
        <input
          className="rounded border py-1 px-4"
          type="text"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="text-center text-red-600">This field is required</p>
        )}
        <label>Password</label>
        <input
          className="rounded border py-1 px-4"
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className="text-center text-red-600">This field is required</p>
        )}

        <button type="submit" className="rounded border py-1 px-4 cursor-pointer bg-emerald-400 hover:bg-emerald-500 hover:text-white">Sign Up</button>
      </form>

      <p> Already have an account? Go to <Link href="/signin" className="text-emerald-500">Sign In</Link> instead.
      </p>

    </div>
  );
};

export default RegisterForm;