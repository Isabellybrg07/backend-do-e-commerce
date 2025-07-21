import { Router } from "express";
import { PrismaClient } from "../../generated/prisma";

const productRoutes = Router();
const prisma = new PrismaClient();

// Criar produto
productRoutes.post('/', async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar produto" });
  }
});

// Listar todos os produtos
productRoutes.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// Buscar produto por ID
productRoutes.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!product) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

// Atualizar produto
productRoutes.put('/:id', async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar produto" });
  }
});

// Deletar produto
productRoutes.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar produto" });
  }
});

export default productRoutes;