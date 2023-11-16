import {
    initProgram,
    initBuffer,
    initFloatAttribute,
    initTextureFramebuffer,
    getTextureAttachments,
    FULLSCREEN_RECT
} from '../lib/gl-wrap'
import vertSource from '../shaders/tex-attrib-vert.glsl?raw'

class TextureAttribRenderer {
    program: WebGLProgram
    buffer: WebGLBuffer
    framebuffer: WebGLFramebuffer
    texture: WebGLTexture
    texAttachments: Array<number>
    bindPosition: () => void
    textureSize: number
    numVertex: number

    constructor (
        gl: WebGLRenderingContext,
        fragSource: string,
        textureSize: number,
        numSourceTextures: number
    ) {
        this.program = initProgram(gl, vertSource, fragSource)

        this.buffer = initBuffer(gl)
        gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_RECT, gl.STATIC_DRAW)
        this.numVertex = FULLSCREEN_RECT.length / 2

        const { framebuffer, texture } = initTextureFramebuffer(gl, textureSize)
        this.framebuffer = framebuffer
        this.texture = texture

        this.texAttachments = getTextureAttachments(gl, numSourceTextures)

        this.bindPosition = initFloatAttribute(gl, this.program, 'position', 2, 2, 0)

        this.textureSize = textureSize
        const textureSizeLoc = gl.getUniformLocation(this.program, 'texSize')
        gl.uniform1f(textureSizeLoc, textureSize)

        // set texture location uniforms for each source texture
        for (let i = 0; i < numSourceTextures; i++) {
            const texLoc = gl.getUniformLocation(this.program, `tex${i}`)
            gl.uniform1i(texLoc, i)
        }
    }

    getTexture (gl: WebGLRenderingContext, sourceTextures: Array<WebGLTexture>): WebGLTexture {
        gl.viewport(0, 0, this.textureSize, this.textureSize)
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
        gl.useProgram(this.program)

        for (let i = 0; i < this.texAttachments.length; i++) {
            gl.activeTexture(this.texAttachments[i])
            gl.bindTexture(gl.TEXTURE_2D, sourceTextures[i])
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
        this.bindPosition()

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.numVertex)

        return this.texture
    }
}

export default TextureAttribRenderer