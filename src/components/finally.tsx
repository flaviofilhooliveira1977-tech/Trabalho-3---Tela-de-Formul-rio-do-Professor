import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import backgroundFinally from '../assets/background-finaly.svg'
import done from '../assets/done.svg'
import { Button } from './button'

type FinallyProps = {
    title: string
    subtitle: ReactNode
    titleButton: string
    path?: string
}

export function Finally({ title, subtitle, titleButton, path = "" }: FinallyProps) {
    const navigate = useNavigate()
    function handleFinally() {
        navigate(path)
    }
    return (
        <div className="flex flex-col min-h-screen items-center justify-center relative h-full bg-purple overflow-hidden">
            <img src={backgroundFinally} alt="" className="absolute w-[69rem] h-[32rem] pointer-events-none" />
            <div className="flex flex-col items-center justify-center z-10 px-4">
                <img src={done} alt="Concluído" />
                <h1 className="font-archivo-bold text-white text-6xl mt-10 text-center">
                    {title}
                </h1>
                <p className="font-poppins-regular text-base text-text-purple-base mt-6 text-center">
                    {subtitle}
                </p>

                <div>
                    <Button
                        title={titleButton}
                        type="button"
                        disabled={false}
                        onClick={handleFinally}
                    />
                </div>
            </div>
        </div>
    )
}
