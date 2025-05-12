import express from "express"
import cors from "cors"
import {promises as fs} from "node:fs"

const PORT = 3333
const database_url = "./database/base_dados.json"

const app = express()
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: "*",
    credentials: true
}))
app.use(express.json())

app.get("/instrutores", async (req, res) => {
    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const instrutores = db.usuarios.filter((user) => user.tipo === "instrutor")

        res.status(200).json(instrutores)
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/cursos/com-muitos-comentarios", async (req, res) => {
    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const cursosComMuitosComentarios = db.cursos.filter((curso) => curso.comentarios.length >= 3)

        res.status(200).json(cursosComMuitosComentarios)
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
    
})

app.get("/usuarios/:id/cursos", async (req, res) => {
    const { id } = req.params
    const idInt = Number(id)
    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const user = db.usuarios.find((usuario) => usuario.id === idInt)
        const cursosUser = user.cursos_matriculados

        const infoCurso = db.cursos.find((curso) => cursosUser.find(id => curso.id === id))

        res.status(200).json(infoCurso)
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/usuarios/com-progresso-acima", async (req, res) => {
    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)

        
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/usuarios/:id/comentarios", async (req, res) => {
    const { id } = req.params
    const idInt = Number(id)

    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        
        const comentariosUsuarios = db.cursos.find((curso) => curso.comentarios.filter((c) => c.usuario_id === idInt))
        res.status(200).json(comentariosUsuarios)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/cursos/:id/media-progresso", async (req, res) => {
    const { id } = req.params
    const idInt = Number(id)

    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const usuario = db.usuarios.find((user) => user.id === idInt)
        const valoresProgresso = Object.values(usuario.progresso)
        
        const media = valoresProgresso.reduce((a, b) => a + b)/valoresProgresso.length
        
        res.status(200).json({mensagem: `A média do progresso desse aluno é: ${media}`})
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/cursos/:id/media-nota", async (req, res) => {
    const { id } = req.params
    const idInt = Number(id)

    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const curso = db.cursos.find((c) => c.id === idInt)

        const comentarios = curso.comentarios
        
        const notasComentario = comentarios.map((comentario) => comentario.nota)
        const mediaNotas = notasComentario.reduce((a, b) => a + b)/notasComentario.length

        res.status(200).json({mensagem: `A média das notas dos comentários desse curso é: ${mediaNotas}`})
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/cursos/:id/duracao-total", async (req, res) => {
    const { id } = req.params
    const idInt = Number(id)

    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const curso = db.cursos.find((c) => c.id === idInt)

        const aulas = curso.aulas
        const duracao = aulas.map((aula) => aula.duracao_minutos)

        const duracaoTotal = duracao.reduce((a, b) => a + b)

        res.status(200).json({mensagem: `A duração total das aulas desse curso em minutos é de: ${duracaoTotal} mins`})
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/instrutores/:id/quantidade-cursos", async (req, res) => {
    const { id } = req.params
    const idInt = Number(id)

    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const instrutor = db.usuarios.find((usuario) => usuario.id === idInt)

        const cursosCriados = db.cursos.filter((curso) => curso.instrutor_id === instrutor.id)

        res.status(200).json(cursosCriados)
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})
app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta: ${PORT}`)
})
