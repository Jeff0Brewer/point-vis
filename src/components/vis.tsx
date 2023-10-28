import { useState, useEffect } from 'react'
import type { FC } from 'react'
import '../style/vis.css'

const Vis: FC = () => {
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)

    useEffect(() => {
        const fitToWindow = (): void => {
            setWidth(window.innerWidth * window.devicePixelRatio)
            setHeight(window.innerHeight * window.devicePixelRatio)
        }
        // initialize canvas size
        fitToWindow()

        // resize canvas when window resizes
        window.addEventListener('resize', fitToWindow)
        return () => {
            window.removeEventListener('resize', fitToWindow)
        }
    }, [])

    return (
        <canvas className="vis-canvas" width={width} height={height} />
    )
}

export default Vis
