'use client'

import { useEffect, useState } from "react"

export function useDebounce(value: string, delay: number){
    const [debouncedVal, setDebouncedVal] = useState(value);
    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setDebouncedVal(value);
        }, delay)

        return(()=>{
            clearTimeout(timeout)
        })
    }, [value, delay])

    return debouncedVal
}