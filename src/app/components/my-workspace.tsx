import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageUploader } from '@/components/ui/image-uploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';


interface MyWorkspaceProps {
    openSettingsDialog: boolean;
    setOpenSettingsDialog: (open: boolean) => void;
}

type WorkspaceSettingsForm = {
    avatar: File | null;
};

const MyWorkspace: React.FC<MyWorkspaceProps> = ({ openSettingsDialog, setOpenSettingsDialog }) => {
    const { control, handleSubmit } = useForm<WorkspaceSettingsForm>({
        defaultValues: { avatar: null },
    });

    const onSubmit = (data: WorkspaceSettingsForm) => {
        console.log(data);
    };

    return <Dialog open={openSettingsDialog} onOpenChange={setOpenSettingsDialog}>
        <DialogContent className="min-w-2xl max-w-2xl">
            <DialogHeader>
                <DialogTitle className='text-xl font-semibold'>Configurações</DialogTitle>
                <p className='text-gray-400 m-0 font-medium'>Configurações do meu workspace</p>
            </DialogHeader>
            <DialogDescription>


                <form onSubmit={handleSubmit(onSubmit)} className=''>
                    <div className='flex flex-col gap-4 border mt-4 border-gray-700 rounded-lg p-6'>
                        <h1 className='text-lg font-semibold text-white'>Seus dados</h1>
                        <div>
                            <Label>Nome</Label>
                            <Input name="name" />
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input name="email" type="email" />
                        </div>

                        <Controller
                            name="avatar"
                            control={control}
                            rules={{ required: "Selecione uma imagem" }}
                            render={({ field, fieldState }) => (
                                <ImageUploader
                                    ref={field.ref}
                                    name={field.name}
                                    value={field.value ?? null}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    label=""
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </div>

                    <div className='flex flex-col gap-4 border mt-4 border-gray-700 rounded-lg p-6'>
                        <h1 className='text-lg font-semibold text-white'>Temas</h1>
                        <div>
                            <Label>Cor do tema</Label>
                            <ColorPicker value="#000000" onChange={(color) => console.log(color)} />
                        </div>

                        <div>
                            <Label>Modo claro/escuro</Label>
                            <div className='flex items-center gap-2 pt-1'>
                                <Moon className='size-5 text-gray-200' />
                                <Switch checked={true} onCheckedChange={(checked) => console.log(checked)} />
                                <Sun className='size-5 text-gray-200' />
                            </div>
                        </div>
                    </div>
                </form>
            </DialogDescription>
            <DialogFooter className="flex justify-end gap-2 bg-transparent border-t-0">
                <Button onClick={() => setOpenSettingsDialog(false)} className="text-gray-400 bg-transparent border-gray-400 cursor-pointer" variant="outline">Cancelar</Button>
                <Button className=" border-gray-400 cursor-pointer" variant="outline">Salvar</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}

export default MyWorkspace;