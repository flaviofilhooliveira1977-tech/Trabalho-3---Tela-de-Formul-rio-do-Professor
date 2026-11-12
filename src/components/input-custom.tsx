import type { InputHTMLAttributes } from "react";

interface InputCustomProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label: string
    labelColor?: "text-text-purple-base" | "text-text-complement"
    bgColor?: "bg-white" | "bg-white-shape"
    spanLabel?: string
    prefix?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register?: any
    error?: unknown
}

export function InputCustom({
    name,
    label,
    labelColor = "text-text-purple-base",
    bgColor = "bg-white",
    spanLabel,
    prefix,
    register,
    error,
    onChange,
    ...rest
}: InputCustomProps) {
    const registration = register ? register(name) : {}

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (onChange) {
            onChange(e)
        }
        if (registration.onChange) {
            registration.onChange(e)
        }
    }

    return (
        <>
            <label
                htmlFor={name}
                className={`font-poppins-regular ${labelColor} text-sm/loose mb-2`}
            >
                {label}
                {spanLabel && (
                    <span className="ms-4 font-poppins-regular text-sm text-text-input">
                        {spanLabel}
                    </span>
                )}
            </label>
            <div className="relative w-full">
                {prefix && (
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-poppins-regular text-base text-text-complement pointer-events-none">
                        {prefix}
                    </span>
                )}
                <input
                    id={name}
                    {...registration}
                    {...rest}
                    onChange={handleChange}
                    className={`
                        peer
                        w-full h-[56px]
                        ${bgColor}
                        rounded-lg
                        focus:outline-hidden
                        ${prefix ? "ps-14" : "ps-6"}
                        font-poppins-regular
                        text-base
                        text-text-base
                        placeholder:text-text-input
                        ${error ? "border-red-500" : "border-gray-lines-in-white"}
                        border
                        pr-4
                    `}
                />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[2px] bg-purple scale-x-0 transition-transform duration-300 peer-focus:scale-x-100"></span>
            </div>
        </>
    )
}
