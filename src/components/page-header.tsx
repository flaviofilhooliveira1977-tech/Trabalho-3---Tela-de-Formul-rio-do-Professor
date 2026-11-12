import { Link } from "react-router"
import goBack from "../assets/goback-another-purple.svg"
import proffyLogo from "../assets/proffy-logo.svg"

interface PageHeaderProps {
    title: string
    backTo?: string
}

export function PageHeader({ title, backTo = "/" }: PageHeaderProps) {
    return (
        <div className="w-full flex flex-row justify-center items-center bg-dark-purple h-[64px]">
            <header className="flex w-full justify-between items-center max-w-7xl px-6">
                <Link to={backTo}>
                    <img src={goBack} alt="Voltar" className="w-8 h-12" />
                </Link>
                <h1 className="text-text-purple-base font-archivo-semibold text-base">
                    {title}
                </h1>
                <img src={proffyLogo} alt="Logo Proffy" className="w-12 h-4" />
            </header>
        </div>
    )
}
