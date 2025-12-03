import express from "express";
import { ENV } from "./config/env.js";
import {db} from './config/db.js'
import {inventarioGeneral, equiposInventario} from "./db/schema.js"
import { and, eq, sql } from 'drizzle-orm';

const app = express();
const PORT = ENV.PORT || 5001 ;

app.use(express.json())

app.get("/api/health", (req,res) => {
    res.status(200).json({success: true})
});

//CREACION DE NUEVOS INVENTARIOS POR LOCALIDADES
app.post("/api/inventarioGeneral", async (req, res) =>{
    try{
        const {mes, anio, ubicacion, localidad, creado_por} = req.body
        
        if (!mes || !ubicacion || !localidad) {
            return res.status(400).json({error: "No cumple con los requisitos"})
        }

        const nuevoInventario = await db
        .insert(inventarioGeneral)
        .values({
            mes,
            anio,
            ubicacion,
            localidad,
            creado_por,
        })
        .returning();
        res.status(201).json(nuevoInventario[0])
    } catch (error) {
        console.log("Error agregar nuevo registro", error);
        res.status(500).json({error:"Busca el error"});
    }
})

//ELIMINA UN INVENTARIO GENERAL
app.delete("/api/inventarioGeneral/:id" , async (req,res) =>{
    try{
        const { id } = req.params;
        await db
        .delete(inventarioGeneral)
        .where(
            and(eq(inventarioGeneral.id, id))
        );

        res.status(200).json({ message: "Inventario Eliminado" });
    } catch (error){
        console.log("Error al remover el inventario");
        res.status(500).json({error:"Busca el error"})
    }
})


//AGREGAR NUEVOS EQUIPOS AL INVENTARIO GENERAL
app.post("/api/equipos-inventario", async (req, res) => {
    try {
        const { inventario_id, numero_serie, nota, imagen_url } = req.body;
        
        // Validación básica
        if (!numero_serie || !nota) {
            return res.status(400).json({ 
                error: "inventario_id, numero_serie y nota son requeridos" 
            });
        }

        // 1. Verificar que el inventario existe
        const inventarioExistente = await db
            .select()
            .from(inventarioGeneral)
            .where(eq(inventarioGeneral.id, inventario_id))
            .limit(1);

        if (inventarioExistente.length === 0) {
            return res.status(404).json({ 
                error: "Inventario no encontrado" 
            });
        }

        // 2. Insertar el equipo
        const [nuevoEquipo] = await db
            .insert(equiposInventario)
            .values({
                inventario_id,
                numero_serie,
                nota,
                imagen_url: imagen_url || null,
 
            })
            .returning();
            res.status(201).json(nuevoEquipo[0])

        // 3. Actualizar el contador en inventarioGeneral
        await db
            .update(inventarioGeneral)
            .set({ 
                total_equipos: sql`${inventarioGeneral.total_equipos} + 1`,
                fecha_actualizacion: new Date()
            })
            .where(eq(inventarioGeneral.id, inventario_id));

        res.status(201).json({
            message: "Equipo agregado exitosamente",
            equipo: nuevoEquipo,
            total_equipos: inventarioExistente[0].total_equipos + 1
        });

    } catch (error) {
        console.error("Error al agregar equipo:", error);
        
        // Manejo de error de duplicado de número de serie
        if (error.message.includes('unique constraint') || error.code === '23505') {
            return res.status(409).json({ 
                error: "El número de serie ya existe" 
            });
        }
        
        res.status(500).json({ 
            error: "Error interno del servidor" 
        });
    }
});

app.delete("/api/equipos-inventario/:id/:numero_serie" , async (req,res) =>{
    try{
        const { id, numero_serie } = req.params;
        await db
        .delete(equiposInventario)
        .where(
            and(eq(equiposInventario.id, parseInt(id)), eq(equiposInventario.numero_serie, numero_serie))
        );

        res.status(200).json({ message: "Equipo Eliminado" });
    } catch (error){
        console.log("Error al eliminar el equipo");
        res.status(500).json({error:"Busca el error"})
    }
})


app.listen(5001, () => {
    console.log("Sevidor Conectado PORT: 5001", );
});