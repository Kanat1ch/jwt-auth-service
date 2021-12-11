import { useEffect, useState } from "react"

export default function useCountdown(startFrom: number) {
    const [isActive, setIsActive] = useState<boolean>(false)
    const [time, setTime] = useState<number>(startFrom)

    let timeout: any = null

    useEffect(() => {
        if (isActive) {
            if (!time) return finish()

            timeout = setTimeout(() => {
                setTime(time => time - 1)
            }, 1000)
        }
        return () => clearTimeout(timeout)
    }, [isActive, time])

    const start = () => {
        setIsActive(true)
    }

    const pause = () => {
        setIsActive(false)
    }

    const finish = () => {
        setTime(startFrom)
        setIsActive(false)
    }

    return { isActive, time, start, pause, finish }
}

