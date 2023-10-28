import { mat4 } from 'gl-matrix'
import { initGl } from '../lib/gl-wrap'
import PointRenderer from '../vis/points'

const FOV = Math.PI * 0.5
const NEAR = 0.01
const FAR = 10

class VisRenderer {
    gl: WebGLRenderingContext
    points: PointRenderer
    view: mat4
    proj: mat4

    constructor (canvas: HTMLCanvasElement, textureSize: number) {
        this.gl = initGl(canvas)
        this.points = new PointRenderer(this.gl, textureSize)

        const aspect = canvas.width / canvas.height
        this.proj = mat4.perspective(mat4.create(), FOV, aspect, NEAR, FAR)
        this.view = mat4.lookAt(mat4.create(), [2, 2, 2], [0, 0, 0], [0, 0, 1])

        this.points.setProj(this.proj)
        this.points.setView(this.view)
    }

    draw (): void {
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT)

        this.points.draw(this.gl)
    }

    resize (width: number, height: number): void {
        const aspect = width / height
        this.proj = mat4.perspective(mat4.create(), FOV, aspect, NEAR, FAR)

        this.points.setProj(this.proj)
    }
}

export default VisRenderer
