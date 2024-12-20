"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { signInAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import signInFormSchema from "@/schema/sign-in-form";

const SignInForm = () => {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const response = await signInAction(formData);

      if (response.success) {
        toast.success(response.message);
        form.reset();

        if (response.redirect) {
          window.location.href = response.redirect;
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Erreur inattendue :", error);
      toast.error("Une erreur inattendue est survenue. Veuillez réessayer.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="jean.dupont@exemple.com"
                  autoCapitalize="none"
                  autoCorrect="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-sm">
          <Link
            href="/mot-de-passe-oublie"
            className="text-primary hover:underline"
            title="Réinitialiser le mot de passe"
          >
            Vous avez oublié votre mot de passe ?
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "En cours..." : "Se connecter"}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
