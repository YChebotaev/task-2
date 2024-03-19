import { type FC } from "react";
import { AuthLayout } from "../layouts/AuthLayout";
import { SigninForm } from "../components/SigninForm";

export const SigninPage: FC = () => (
  <AuthLayout>
    <SigninForm />
  </AuthLayout>
);
