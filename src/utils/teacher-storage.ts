export interface ScheduleItem {
    week_day: string
    from: string
    to: string
}

export interface TeacherProfileData {
    name: string
    lastName: string
    email: string
    avatar: string
    whatsapp: string
    biography: string
    subject: string
    cost: number
    schedule: ScheduleItem[]
}

const STORAGE_KEY = "@proffy:teacher-profile-2026"

export const defaultTeacherProfile: TeacherProfileData = {
    name: "Rafael",
    lastName: "Rocha",
    email: "rafael.rocha@proffy.com.br",
    avatar: "https://avatars.githubusercontent.com/u/15871684?v=4",
    whatsapp: "",
    biography: "",
    subject: "",
    cost: 0,
    schedule: [{ week_day: "", from: "", to: "" }]
}

export function getTeacherProfile(): TeacherProfileData {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return defaultTeacherProfile
        return { ...defaultTeacherProfile, ...JSON.parse(stored) }
    } catch {
        return defaultTeacherProfile
    }
}

export function saveTeacherProfile(data: Partial<TeacherProfileData>): TeacherProfileData {
    const current = getTeacherProfile()
    const updated: TeacherProfileData = {
        ...current,
        ...data
    }
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (error) {
        console.error("Erro ao salvar perfil no localStorage:", error)
    }
    return updated
}
