import { Router } from "express";
import { PrismaClient } from "../../generated/prisma";
import * as zod from 'zod'
import { authMiddleware, roleCheck } from "../middlewares/authMiddlewares";
import id from "zod/v4/locales/id.cjs";

const productRoutes = Router();
const prisma = new PrismaClient();

const ProductRegisterDTO = zod.object({
  name: zod.string(),
  price: zod.number(),
  estoque: zod.number()
})

// Criar produto
productRoutes.post('/', authMiddleware, roleCheck(['ADMIN']), async (req, res) => {
  const { body } = req
  try {
    ProductRegisterDTO.parse(body)
  } catch (error) {
    res.status(400).send({
      message: "Requisição inválida",
      details: zod.treeifyError(error as zod.ZodError)
    })
    return
  }
  const createdProduct = await prisma.product.create({
    data: body
  })
  res.send(createdProduct)
});




// Listar todos os produtos
productRoutes.get('/', async (req, res) => {
    const products = await prisma.product.findMany();
 
    res.send({
      items: products
    })
});




// Buscar produto por ID
productRoutes.get('/:id', async (req, res) => {
   const {
    params: {id}
   } = req

    const product = await prisma.product.findFirst({
      where: { id }
    });

    if (!product) {
      res.status(404).send({
        message: 'Produto não encontrado'
      })
      return
    }
 
    res.send({
      items: product
    })
});






// Atualizar produto
productRoutes.put('/:id', authMiddleware, async (req, res) => {
  const { body, params } = req;
  const { id } = params
  try {
    ProductRegisterDTO.parse(body)
  } catch (error) {
    res.status(400).send({
      message: "Requisição inválida",
      details: zod.treeifyError(error as zod.ZodError)
    })
    return
  }
  const foundProduct = await prisma.product.findFirst({
    where: { id }
  })
  if (null === foundProduct) {
    res.status(404).send({
      message: "Produto não encontrado!"
    })
    return
  }
  const updatedProduct = await prisma.product.update({
    data: body,
    where: { id }
  })
  res.send(updatedProduct)
});




// Deletar produto
productRoutes.delete('/:id',authMiddleware, async (req, res) => {
   const {
    params: {id}
   } = req

    const product = await prisma.product.findFirst({
      where: { id }
    });

    if (!product) {
      res.status(404).send({
        message: 'Produto não encontrado'
      })
      return
    }

    const deletedProduct = await prisma.product.delete({
      where: {id}
    })
 
    res.send({
      items: deletedProduct
    })
});




export default productRoutes;