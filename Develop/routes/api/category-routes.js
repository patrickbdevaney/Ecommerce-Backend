const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get("/", async (req, res) => {
  try {
    const data = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const get = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!get) {
      res
        .status(404)
        .json({ message: "No category with this id" });
    }
    res.status(200).json(get);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const create = await Category.create(req.body);
    res.status(200).json(create);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const update = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        returning: true,
        where: {
          id: req.params.id,
        },
      }
    );
    if (!update) {
      res.status(404).json({ message: "Cannot update, no category."});
      return;
    }
    res.status(200).json(update);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const remove = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    if(!remove) {
      res.status(404).json({ message: "Id not found, no category deleted"});
      return;
  }
    res.status(200).json(remove);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;