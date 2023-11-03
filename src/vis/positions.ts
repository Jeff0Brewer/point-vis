import {
    initProgram,
    initBuffer,
    initFloatAttribute,
    initTextureFramebuffer,
    FULLSCREEN_RECT
} from '../lib/gl-wrap'
import vertSource from '../shaders/position-vert.glsl?raw'
import fragSource from '../shaders/position-frag.glsl?raw'

class PositionRenderer {
    program: WebGLProgram
    buffer: WebGLBuffer
    bindPosition: () => void
    framebuffer: WebGLFramebuffer
    texture: WebGLTexture
    numVertex: number

    constructor (gl: WebGLRenderingContext, textureSize: number) {
        this.program = initProgram(gl, vertSource, fragSource)

        this.buffer = initBuffer(gl)
        gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_RECT, gl.STATIC_DRAW)
        this.numVertex = FULLSCREEN_RECT.length / 2

        this.bindPosition = initFloatAttribute(gl, this.program, 'position', 2, 2, 0)

        const { framebuffer, texture } = initTextureFramebuffer(gl, textureSize)
        this.framebuffer = framebuffer
        this.texture = texture
    }

    getTexture (gl: WebGLRenderingContext, frequencies: WebGLTexture): WebGLTexture {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
        gl.useProgram(this.program)

        gl.bindTexture(gl.TEXTURE_2D, frequencies)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
        this.bindPosition()

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.numVertex)

        return this.texture
    }
}

export default PositionRenderer
