import { initGl } from '../lib/gl-wrap'
import PointRenderer from '../vis/points'

class VisRenderer {
    gl: WebGLRenderingContext
    points: PointRenderer

    constructor (canvas: HTMLCanvasElement, textureSize: number) {
        this.gl = initGl(canvas)
        this.points = new PointRenderer(this.gl, textureSize)
    }

    draw (): void {
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT)

        this.points.draw(this.gl)
    }
}

export default VisRenderer
