import { useState, useEffect, useRef } from 'react'
import type { FC } from 'react'
import VisRenderer from '../vis/vis'
import '../style/vis.css'

const TEXTURE_SIZE = 2048

const Vis: FC = () => {
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const visRef = useRef<VisRenderer | null>(null)

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

    useEffect(() => {
        if (!canvasRef.current) {
            throw new Error('could not get reference to canvas')
        }
        visRef.current = new VisRenderer(canvasRef.current, TEXTURE_SIZE)
    }, [])

    return (
        <canvas
            width={width}
            height={height}
            ref={canvasRef}
            className="vis-canvas"
        />
    )
}

export default Vis
