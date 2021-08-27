const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


router.get('/', async (req, res) => {

  try {
    const product = await Product.findAll({
      include: [{ model: Category }, { model: Tag}],
});
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/:id', async (req, res) => {
  try {
    const productid = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag}],
    });
    if (!productid) {
      res.status(404).json({ message: "No products with this id."});
      return;
    }
    res.status(200).json(productid);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const idarr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
          };
        });
        return ProductTag.bulkCreate(idarr);
      }
      res.status(200).json(product);
    })
    .then((tagids) => res.status(200).json(tagids))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


router.put('/:id', (req, res) => {
 
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
     
      return ProductTag.findAll({ where: {product_id: req.params.id } })
    })
    .then((productTags) => {
      const tagids = productTags.map(({ tag_id })=> tag_id)
      const newtags = req.body.tagIds
        .filter((tag_id) => !tagids.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
         };
        });
      const tagstodelete= productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id })=> id)
      return Promise.all([
        ProductTag.destroy({ where: { id: tagstodelete } }),
        ProductTag.bulkCreate(newtags),
      ]);
    })
    .then((updatedProductTags)=> res.json(updatedProductTags))
    .catch((err) => {
      res.status(200).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if(!data) {
      res.status(400).json({message: "Product id was not found, nothing has been deleted."})
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err)
  }
});
module.exports = router;
