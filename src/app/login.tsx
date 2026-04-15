import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm } from "react-hook-form";


type LoginProps = {
  onLoginSuccess: () => void;
};

export default function Login(_props: LoginProps) {

  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: any) => {
    _props.onLoginSuccess(data.email, data.password);
  };


  return (
    <section className="h-screen bg-background w-full flex flex-col items-center justify-center">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-1/2 justify-center">
          <h1 className="text-blue-600 text-[60px] font-bold tracking-wide">Converse</h1>
        </div>
        <Separator orientation="vertical" className="h-full" />
        <div className="flex flex-col w-1/2 items-center justify-center">
          <div>
            <div>
              <h1 className="text-start"><span className="text-blue-600 font-bold ">Converse</span></h1>
              <p className="text-sm text-muted-foreground">com seus amigos e familiares de forma rápida e segura.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-2">

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Controller control={control} name="email" render={({ field }) => <Input {...field} />} />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Controller control={control} name="password" render={({ field }) => <Input {...field} />} />
              </div>


              <div className="flex justify-between items-center">
                <a href="/signup" className="text-xs text-muted-foreground transition-all duration-300 hover:text-primary hover:underline">Não tem uma conta? <span className="font-bold">Crie uma agora</span></a>
                <Button type="submit">Entrar</Button>
              </div>
            </form>
          </div>
        </div>
      </div >
    </section >
  );
}