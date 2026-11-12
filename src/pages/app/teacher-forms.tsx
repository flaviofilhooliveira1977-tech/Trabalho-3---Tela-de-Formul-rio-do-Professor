import { useNavigate } from "react-router"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import rocketIcon from "../../assets/rocket.svg"
import attentionIcon from "../../assets/attention.svg"
import { PageHeader } from "../../components/page-header"
import { InputCustom } from "../../components/input-custom"
import { TextArea } from "../../components/text-area"
import { Select } from "../../components/select"
import { formatWhatsApp } from "../../utils/masks"
import { getTeacherProfile, saveTeacherProfile } from "../../utils/teacher-storage"
import { SUBJECT_OPTIONS, WEEK_DAY_OPTIONS } from "../../constants/teacher-options"
import { teacherFormSchema, type TeacherFormData, type TeacherFormInput } from "../../schemas/teacher-schemas"

export function TeacherForms() {
    const navigate = useNavigate()
    const currentProfile = getTeacherProfile()

    const {
        control,
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm<TeacherFormInput, unknown, TeacherFormData>({
        resolver: zodResolver(teacherFormSchema),
        mode: "onChange",
        defaultValues: {
            whatsapp: currentProfile.whatsapp || "",
            biography: currentProfile.biography || "",
            subject: currentProfile.subject || "",
            cost: currentProfile.cost ? currentProfile.cost : ("" as unknown as number),
            schedule: currentProfile.schedule?.length
                ? currentProfile.schedule
                : [{ week_day: "", from: "", to: "" }],
        },
    })

    const { fields: scheduleItems, append, remove } = useFieldArray({
        control,
        name: "schedule",
    })

    function addNewScheduleItem() {
        append({ week_day: "", from: "", to: "" })
    }

    function handleWhatsAppChange(e: React.ChangeEvent<HTMLInputElement>) {
        const masked = formatWhatsApp(e.target.value)
        e.target.value = masked
        setValue("whatsapp", masked, { shouldValidate: true })
    }

    function handleCreateClass(data: TeacherFormData) {
        saveTeacherProfile({
            whatsapp: data.whatsapp,
            biography: data.biography,
            subject: data.subject,
            cost: data.cost,
            schedule: data.schedule,
        })
        navigate("/give-classes/register-completed")
    }

    return (
        <div className="w-full min-h-screen items-center flex flex-col align-top bg-background antialiased overflow-x-hidden">
            <PageHeader title="Dar aulas" backTo="/" />

            <div className="w-full flex flex-col items-center bg-purple h-[352px] px-6">
                <div className="flex w-full justify-between items-center max-w-4xl mt-[64px]">
                    <h1 className="font-archivo-bold text-4xl text-white">
                        Que incrível que você<br />quer dar aulas.
                    </h1>
                </div>
                <div className="flex justify-between items-center w-full max-w-4xl mt-[24px]">
                    <h2 className="font-poppins-regular text-base text-text-purple-base">
                        O primeiro passo, é preencher esse<br /> formulário de inscrição.
                    </h2>

                    <div className="flex flex-row gap-4 items-center">
                        <img src={rocketIcon} alt="" className="w-8 h-8" />
                        <span className="font-poppins-regular text-sm text-text-purple-base">
                            Preparare-se!<br />vai ser o máximo.
                        </span>
                    </div>
                </div>
            </div>

            <main className="flex flex-col w-full max-w-4xl justify-center my-auto bg-white border-1 border-gray-lines-in-white rounded-lg -mt-[3.2rem] overflow-hidden pt-16 mb-16 shadow-xs">
                <form onSubmit={handleSubmit(handleCreateClass)} noValidate>
                    <fieldset className="flex flex-col items-center mx-16">
                        <legend className="flex w-full items-center justify-between pb-6 mb-10 font-archivo-semibold text-2xl text-text-title border-b-1 border-gray-lines-in-white">
                            Seus dados
                        </legend>

                        <div className="flex flex-row w-full justify-between items-center gap-8">
                            <div className="flex items-center">
                                <img
                                    className="w-[5rem] h-[5rem] rounded-full object-cover"
                                    src={currentProfile.avatar}
                                    alt={`${currentProfile.name} ${currentProfile.lastName}`}
                                />
                                <strong className="font-archivo-bold text-xl text-text-title block ms-6">
                                    {currentProfile.name} {currentProfile.lastName}
                                </strong>
                            </div>

                            <div className="flex flex-col w-[22rem]">
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

                        <div className="flex flex-col w-full max-w-full mt-8">
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
                                    <div className="grid grid-cols-4 w-full gap-8 mb-4">
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

                                    {index > 0 && (
                                        <div className="flex items-center w-full gap-8 pb-4">
                                            <span className="flex-1 border-t-1 border-gray-lines-in-white" />
                                            <button
                                                type="button"
                                                className="font-archivo-semibold text-sm text-red-500 cursor-pointer hover:text-red-600 transition"
                                                onClick={() => remove(index)}
                                            >
                                                Excluir horário
                                            </button>
                                            <span className="flex-1 border-t-1 border-gray-lines-in-white" />
                                        </div>
                                    )}
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
