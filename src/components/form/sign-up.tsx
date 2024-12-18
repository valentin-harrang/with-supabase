"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { z } from "zod";
import SignUpFormSchema from "@/schema/sign-up-form";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import { PasswordStrengthIndicator } from "@/components/form/password-strength-indicator";
import { signUpAction } from "@/app/actions";

const SignUpForm = () => {
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const password = form.watch("password");
  const passwordStrength = usePasswordStrength(password);

  const onSubmit = async (values: z.infer<typeof SignUpFormSchema>) => {
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const response = await signUpAction(formData);

      if (response.success) {
        toast.success(response.message);
        form.reset();
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex : Jean"
                  className="capitalize"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.charAt(0).toUpperCase() +
                        e.target.value.slice(1).toLowerCase()
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex : Dupont"
                  className="capitalize"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.charAt(0).toUpperCase() +
                        e.target.value.slice(1).toLowerCase()
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              {password && (
                <PasswordStrengthIndicator
                  passwordStrength={passwordStrength}
                />
              )}
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "En cours..." : "S'inscrire"}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;