import { useConfigUser, useUpsertUserConfig } from '@/application/queries/config-user/use-config-user';
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
    userId: string;
}

type WorkspaceSettingsForm = {
    avatar: File | null;
    name: string;
    email: string;
    colorTheme: string;
    themeDarkMode: boolean;
};

const MyWorkspace: React.FC<MyWorkspaceProps> = ({ openSettingsDialog, setOpenSettingsDialog, userId }) => {
    const { data: configUser } = useConfigUser(userId);
    const { mutateAsync: upsertUserConfig } = useUpsertUserConfig();
    const [avatarRemoteCleared, setAvatarRemoteCleared] = React.useState(false);

    const { control, handleSubmit, reset } = useForm<WorkspaceSettingsForm>({
        defaultValues: {
            avatar: null,
            name: '',
            email: '',
            colorTheme: '#000000',
            themeDarkMode: false,
        },
    });

    React.useEffect(() => {
        if (!configUser) return;
        setAvatarRemoteCleared(false);
        reset({
            avatar: null,
            name: configUser.name ?? '',
            email: configUser.email ?? '',
            colorTheme: configUser.colorTheme ?? '#000000',
            themeDarkMode: configUser.themeDarkMode ?? false,
        });
    }, [configUser, reset]);

    const remoteAvatarUrl =
        avatarRemoteCleared ? undefined : configUser?.avatarUrl;

    const onSubmit = async (data: WorkspaceSettingsForm) => {
        console.log(data);
        await upsertUserConfig({
            userId,
            ...data,
        });
    };

    return <Dialog open={openSettingsDialog} onOpenChange={setOpenSettingsDialog}>
        <DialogContent className="min-w-2xl max-w-2xl">
            <DialogHeader>
                <DialogTitle className='text-xl font-semibold'>Configurações</DialogTitle>
                <DialogDescription className='text-gray-400 m-0 font-medium'>
                    Configurações do meu workspace
                </DialogDescription>
            </DialogHeader>
            <form id="workspace-settings" onSubmit={handleSubmit(onSubmit)} >
                <div className='flex flex-col gap-4 border mt-4 border-gray-700 rounded-lg p-6'>
                    <h1 className='text-lg font-semibold text-white'>Seus dados</h1>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <Label htmlFor={field.name}>Nome</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                />
                            </div>
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <Label htmlFor={field.name}>Email</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="email"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                />
                            </div>
                        )}
                    />

                    <Controller
                        name="avatar"
                        control={control}
                        rules={{
                            validate: (file) => {
                                if (file) return true;
                                if (remoteAvatarUrl) return true;
                                if (avatarRemoteCleared) return true;
                                return 'Selecione uma imagem';
                            },
                        }}
                        render={({ field, fieldState }) => (
                            <ImageUploader
                                ref={field.ref}
                                name={field.name}
                                value={field.value ?? null}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                label=""
                                error={fieldState.error?.message}
                                remotePreviewUrl={remoteAvatarUrl}
                                onClear={() => setAvatarRemoteCleared(true)}
                            />
                        )}
                    />
                </div>

                <div className='flex flex-col gap-4 border mt-4 border-gray-700 rounded-lg p-6'>
                    <h1 className='text-lg font-semibold text-white'>Temas</h1>
                    <Controller
                        name="colorTheme"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <Label>Cor do tema</Label>
                                <ColorPicker
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </div>
                        )}
                    />

                    <Controller
                        name="themeDarkMode"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <Label>Modo claro/escuro</Label>
                                <div className='flex items-center gap-2 pt-1'>
                                    <Moon className='size-5 text-gray-200' />
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <Sun className='size-5 text-gray-200' />
                                </div>
                            </div>
                        )}
                    />
                </div>
            </form>
            <DialogFooter className="flex justify-end gap-2 bg-transparent border-t-0">
                <Button onClick={() => setOpenSettingsDialog(false)} className="text-gray-400 bg-transparent border-gray-400 cursor-pointer" variant="outline">Cancelar</Button>
                <Button type="submit" form="workspace-settings" className=" border-gray-400 cursor-pointer" variant="outline">Salvar</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}

export default MyWorkspace;
