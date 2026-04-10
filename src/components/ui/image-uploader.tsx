import * as React from "react"

import { Upload } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export type ImageUploaderValue = File | null

function assignRef<T>(
    ref: React.Ref<T> | undefined,
    value: T | null
): void {
    if (!ref) return
    if (typeof ref === "function") ref(value)
    else (ref as React.MutableRefObject<T | null>).current = value
}

export type ImageUploaderProps = Omit<
    React.ComponentProps<"input">,
    "type" | "value" | "onChange" | "defaultValue"
> & {
    /** Valor controlado (ex.: campo do react-hook-form via Controller). */
    value?: ImageUploaderValue
    onChange?: (file: ImageUploaderValue) => void
    onBlur?: () => void
    /** Texto da label acessível; o `id` liga label ao input. */
    label?: string
    /** Mensagem de erro do formulário (ex.: `fieldState.error?.message`). */
    error?: string
    /** Classes no container da zona de soltar. */
    className?: string
    /** Classes na área tracejada. */
    dropzoneClassName?: string
}

const ImageUploader = React.forwardRef<HTMLInputElement, ImageUploaderProps>(
    (
        {
            value = null,
            onChange,
            onBlur,
            name,
            id: idProp,
            disabled,
            label,
            error,
            className,
            dropzoneClassName,
            accept = "image/png,image/jpeg,image/webp",
            ...inputProps
        },
        ref
    ) => {
        const reactId = React.useId()
        const id = idProp ?? `image-uploader-${reactId}`
        const inputInnerRef = React.useRef<HTMLInputElement | null>(null)
        const [isDragging, setIsDragging] = React.useState(false)
        const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

        const setInputRef = React.useCallback(
            (node: HTMLInputElement | null) => {
                inputInnerRef.current = node
                assignRef(ref, node)
            },
            [ref]
        )

        React.useEffect(() => {
            if (!value) {
                setPreviewUrl(null)
                return
            }
            const url = URL.createObjectURL(value)
            setPreviewUrl(url)
            return () => URL.revokeObjectURL(url)
        }, [value])

        const setFile = React.useCallback(
            (file: File | null) => {
                onChange?.(file)
            },
            [onChange]
        )

        const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] ?? null
            if (file && !file.type.startsWith("image/")) {
                e.target.value = ""
                return
            }
            setFile(file)
        }

        const onDragOver = (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (!disabled) setIsDragging(true)
        }

        const onDragLeave = (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragging(false)
        }

        const onDrop = (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragging(false)
            if (disabled) return
            const file = e.dataTransfer.files?.[0]
            if (file?.type.startsWith("image/")) {
                setFile(file)
            }
        }

        const clear = () => {
            if (inputInnerRef.current) inputInnerRef.current.value = ""
            setFile(null)
        }

        const hasImage = Boolean(value && previewUrl)

        return (
            <div
                className={cn("flex flex-col gap-2", className)}
                data-slot="image-uploader"
            >
                {label ? (
                    <Label htmlFor={id} className={cn(error && "text-destructive")}>
                        {label}
                    </Label>
                ) : null}

                <div
                    className={cn(
                        "relative flex min-h-32 w-full flex-col rounded-lg",
                        disabled && "pointer-events-none opacity-50",
                        dropzoneClassName
                    )}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    <label
                        htmlFor={id}
                        className={cn(
                            "flex min-h-32 w-full cursor-pointer flex-col items-center justify-center hover:bg-gray-700 hover:border-gray-400 gap-2 rounded-lg border-2 border-dashed border-gray-500  bg-gray-800 px-4 py-6 text-center transition-colors",
                            isDragging && "border-primary bg-primary/5",
                            error && "border-destructive",
                            disabled && "cursor-not-allowed"
                        )}
                    >
                        {hasImage ? (
                            <>
                                <img
                                    src={previewUrl!}
                                    alt=""
                                    className="max-h-24 w-full max-w-[200px] rounded-md object-contain"
                                />
                                <p className="text-sm font-medium text-gray-200">
                                    Imagem selecionada
                                </p>
                                <p className="text-xs text-gray-200">
                                    Clique para escolher outra imagem
                                </p>
                            </>
                        ) : (
                            <>
                                <span className="flex size-10 items-center justify-center">
                                    <Upload className="size-8 text-gray-200" aria-hidden />
                                </span>
                                <p className="text-sm text-gray-200">
                                    <span className="font-medium ">
                                        Arraste uma imagem
                                    </span>{" "}
                                    ou clique para selecionar
                                </p>
                                <p className="text-xs text-gray-200">
                                    PNG, JPEG ou WebP
                                </p>
                            </>
                        )}
                    </label>

                    <input
                        {...inputProps}
                        ref={setInputRef}
                        id={id}
                        name={name}
                        type="file"
                        accept={accept}
                        disabled={disabled}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={error ? `${id}-error` : undefined}
                        className="sr-only"
                        onChange={onFileInputChange}
                        onBlur={onBlur}
                    />
                </div>

                {
                    error ? (
                        <p
                            id={`${id}-error`}
                            role="alert"
                            className="text-sm text-destructive"
                        >
                            {error}
                        </p>
                    ) : null
                }

                {
                    hasImage ? (
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                disabled={disabled}
                                onClick={(e) => {
                                    e.preventDefault()
                                    clear()
                                }}
                            >
                                Remover imagem
                            </Button>
                        </div>
                    ) : null
                }
            </div>
        )
    }
)

ImageUploader.displayName = "ImageUploader"

export { ImageUploader }
