import { type FC } from "react";
import { AuthLayout } from "../layouts/AuthLayout";
import { SignupForm } from "../components/SignupForm";

export const SignupPage: FC = () => (
  <AuthLayout>
    <SignupForm />
  </AuthLayout>
);
