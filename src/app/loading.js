import { Spinner } from '@/components/ui/spinner'
import React from 'react'

const Loading = () => {
    return (
        <div className='w-full h-dvh'> <Spinner className={"absolute inset-0 place-self-center w-12 h-12 sm:w-16 sm:h-16"} /></div>
    )
}

export default Loading