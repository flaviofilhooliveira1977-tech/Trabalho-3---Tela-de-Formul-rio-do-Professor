import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Camera } from "lucide-react"
import { toast } from "sonner"

import backgroundFinally from "../../assets/background-finaly.svg"
import attentionIcon from "../../assets/attention.svg"
import { PageHeader } from "../../components/page-header"
import { InputCustom } from "../../components/input-custom"
import { TextArea } from "../../components/text-area"
import { Select } from "../../components/select"
import { formatWhatsApp } from "../../utils/masks"
import { getTeacherProfile, saveTeacherProfile } from "../../utils/teacher-storage"
import { SUBJECT_OPTIONS, WEEK_DAY_OPTIONS } from "../../constants/teacher-options"
import { teacherProfileSchema, type TeacherProfileFormData, type TeacherProfileFormInput } from "../../schemas/teacher-schemas"

export function TeacherProfile() {
    const storedProfile = getTeacherProfile()
    const [avatarUrl, setAvatarUrl] = useState(storedProfile.avatar)

    const {
        control,
        handleSubmit,
        register,
        watch,
        setValue,
        formState: { errors },
    } = useForm<TeacherProfileFormInput, unknown, TeacherProfileFormData>({
        resolver: zodResolver(teacherProfileSchema),
        mode: "onChange",
        defaultValues: {
            name: storedProfile.name,
            lastName: storedProfile.lastName,
            email: storedProfile.email,
            whatsapp: storedProfile.whatsapp,
            biography: storedProfile.biography,
            subject: storedProfile.subject,
            cost: storedProfile.cost || 20,
            schedule: storedProfile.schedule?.length
                ? storedProfile.schedule
                : [{ week_day: "1", from: "08:00", to: "18:00" }],
        },
    })

    const { fields: scheduleItems, append, remove } = useFieldArray({
        control,
        name: "schedule",
    })

    const watchedName = watch("name")
    const watchedLastName = watch("lastName")
    const watchedSubject = watch("subject")

    function addNewScheduleItem() {
        append({ week_day: "", from: "", to: "" })
    }

    function handleRemoveScheduleItem(index: number) {
        if (scheduleItems.length <= 1) {
            toast.error("Você deve manter pelo menos um horário disponível.")
            return
        }
        remove(index)
    }

    function handleWhatsAppChange(e: React.ChangeEvent<HTMLInputElement>) {
        const masked = formatWhatsApp(e.target.value)
        e.target.value = masked
        setValue("whatsapp", masked, { shouldValidate: true })
    }

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    setAvatarUrl(reader.result)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    function handleUpdateProfile(data: TeacherProfileFormData) {
        saveTeacherProfile({
            ...data,
            avatar: avatarUrl,
        })
        toast.success("Cadastro atualizado com sucesso!")
    }

    return (
        <div className="w-full min-h-screen items-center flex flex-col align-top bg-background antialiased overflow-x-hidden">
            <PageHeader title="Meu perfil" backTo="/" />

            <div className="w-full flex flex-col items-center justify-center bg-purple h-[410px] relative overflow-hidden px-6">
                <img
                    src={backgroundFinally}
                    alt=""
                    className="absolute w-[69rem] h-[28rem] object-contain pointer-events-none"
                />

                <div className="flex flex-col items-center z-10 -mt-6">
                    <div className="relative">
                        <img
                            src={avatarUrl}
                            alt={`${watchedName} ${watchedLastName}`}
                            className="w-[11.25rem] h-[11.25rem] rounded-full object-cover"
                        />
                        <label
                            htmlFor="avatar-upload"
                            title="Alterar foto de perfil"
                            className="w-12 h-12 rounded-full bg-green hover:bg-green-dark transition flex items-center justify-center absolute bottom-1 right-1 cursor-pointer shadow-md"
                        >
                            <Camera className="w-6 h-6 text-white" />
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </div>

                    <h2 className="font-archivo-bold text-3xl text-white mt-6 text-center">
                        {watchedName} {watchedLastName}
                    </h2>
                    <span className="font-poppins-regular text-base text-text-purple-base mt-1">
                        {watchedSubject || "Selecione uma matéria"}
                    </span>
                </div>
            </div>

            <main className="flex flex-col w-full max-w-4xl justify-center my-auto bg-white border-1 border-gray-lines-in-white rounded-lg -mt-[3.2rem] overflow-hidden pt-16 mb-16 z-10 shadow-xs">
                <form onSubmit={handleSubmit(handleUpdateProfile)} noValidate>
                    <fieldset className="flex flex-col items-center mx-16">
                        <legend className="flex w-full items-center justify-between pb-6 font-archivo-semibold text-2xl text-text-title border-b-1 border-gray-lines-in-white">
                            Seus dados
                        </legend>

                        <div className="grid grid-cols-2 w-full gap-8 mt-8">
                            <div className="flex flex-col w-full">
                                <InputCustom
                                    name="name"
                                    label="Nome"
                                    labelColor="text-text-complement"
                                    bgColor="bg-white-shape"
                                    register={register}
                                    error={errors.name}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col w-full">
                                <InputCustom
                                    name="lastName"
                                    label="Sobrenome"
                                    labelColor="text-text-complement"
                                    bgColor="bg-white-shape"
                                    register={register}
                                    error={errors.lastName}
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-5 w-full gap-8 mt-6">
                            <div className="flex flex-col w-full col-span-3">
                                <InputCustom
                                    name="email"
                                    label="E-mail"
                                    type="email"
                                    labelColor="text-text-complement"
                                    bgColor="bg-white-shape"
                                    register={register}
                                    error={errors.email}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col w-full col-span-2">
                                <InputCustom
                                    name="whatsapp"
                                    label="Whatsapp"
                                    placeholder="(  ) _____-____"
                                    labelColor="text-text-complement"
                                    bgColor="bg-white-shape"
                                    register={register}
                                    onChange={handleWhatsAppChange}
                                    error={errors.whatsapp}
                                />
                                {errors.whatsapp && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.whatsapp.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col w-full max-w-full mt-6">
                            <TextArea
                                name="biography"
                                label="Biografia"
                                labelColor="text-text-complement"
                                bgColor="bg-white-shape"
                                maxLength={300}
                                register={register}
                                error={errors.biography}
                                spanLabel="(Máximo 300 caracteres)"
                            />
                            {errors.biography && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.biography.message}
                                </p>
                            )}
                        </div>
                    </fieldset>

                    <fieldset className="flex flex-col items-center justify-between mx-16 mt-16">
                        <legend className="flex w-full items-center justify-between pb-6 font-archivo-semibold text-2xl text-text-title border-b-1 border-gray-lines-in-white">
                            Sobre a aula
                        </legend>

                        <div className="grid grid-cols-5 w-full gap-8">
                            <div className="flex flex-col w-full mt-8 col-span-3">
                                <Select
                                    name="subject"
                                    label="Matéria"
                                    labelColor="text-text-complement"
                                    bgColor="bg-white-shape"
                                    register={register}
                                    error={errors.subject}
                                    optionDefault="Selecione qual você quer ensinar"
                                    options={SUBJECT_OPTIONS}
                                />
                                {errors.subject && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.subject.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col w-full mt-8 col-span-2">
                                <InputCustom
                                    name="cost"
                                    label="Custo da sua hora por aula"
                                    labelColor="text-text-complement"
                                    bgColor="bg-white-shape"
                                    prefix="R$"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    register={register}
                                    error={errors.cost}
                                />
                                {errors.cost && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.cost.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="flex flex-col items-center justify-between mx-16 mt-16">
                        <legend className="flex w-full items-center justify-between pb-6 font-archivo-semibold text-2xl text-text-title border-b-1 border-gray-lines-in-white">
                            Horários disponíveis
                            <button
                                type="button"
                                className="font-archivo-semibold text-base text-purple cursor-pointer hover:text-dark-purple transition"
                                onClick={addNewScheduleItem}
                            >
                                + Novo horário
                            </button>
                        </legend>

                        {scheduleItems.map((scheduleItem, index) => {
                            return (
                                <div key={scheduleItem.id} className="w-full">
                                    <div className="grid grid-cols-4 w-full gap-8 mb-6">
                                        <div className="flex flex-col mt-8 col-span-2">
                                            <Select
                                                name={`schedule.${index}.week_day`}
                                                label="Dia da semana"
                                                labelColor="text-text-complement"
                                                bgColor="bg-white-shape"
                                                register={register}
                                                error={errors.schedule?.[index]?.week_day}
                                                optionDefault="Selecione o dia"
                                                options={WEEK_DAY_OPTIONS}
                                            />
                                            {errors.schedule?.[index]?.week_day && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.schedule[index]?.week_day?.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col w-full mt-8 col-span-1">
                                            <InputCustom
                                                name={`schedule.${index}.from`}
                                                label="Das"
                                                labelColor="text-text-complement"
                                                bgColor="bg-white-shape"
                                                type="time"
                                                register={register}
                                                error={errors.schedule?.[index]?.from}
                                            />
                                            {errors.schedule?.[index]?.from && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.schedule[index]?.from?.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col w-full mt-8 col-span-1">
                                            <InputCustom
                                                name={`schedule.${index}.to`}
                                                label="Até"
                                                labelColor="text-text-complement"
                                                bgColor="bg-white-shape"
                                                type="time"
                                                register={register}
                                                error={errors.schedule?.[index]?.to}
                                            />
                                            {errors.schedule?.[index]?.to && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.schedule[index]?.to?.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center w-full gap-8 pb-4">
                                        <span className="flex-1 border-t-1 border-gray-lines-in-white" />
                                        <button
                                            type="button"
                                            className="font-archivo-semibold text-base text-red-500 cursor-pointer hover:text-red-600 transition"
                                            onClick={() => handleRemoveScheduleItem(index)}
                                        >
                                            Excluir horário
                                        </button>
                                        <span className="flex-1 border-t-1 border-gray-lines-in-white" />
                                    </div>
                                </div>
                            )
                        })}
                    </fieldset>

                    <div className="flex w-full px-16 mt-10 bg-white-shape items-center justify-between py-8 border-t-1 border-gray-lines-in-white">
                        <div className="flex gap-4 items-center">
                            <img src={attentionIcon} alt="Aviso importante" className="w-8 h-8" />
                            <p className="font-poppins-regular text-xs text-purple items-center">
                                Importante!<br />
                                <span className="font-poppins-regular text-xs text-text-complement">
                                    Preencha todos os dados corretamente.
                                </span>
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="flex gap-4 items-center bg-green hover:bg-green-dark cursor-pointer transition py-4 px-10 rounded-lg font-archivo-semibold text-base text-white"
                        >
                            Salvar cadastro
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
