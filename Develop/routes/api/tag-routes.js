const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
  // find all tags
  // be sure to include its associated Product data
});

router.get('/:id', async(req, res) => {
  try {
    const tags = await Tag.findByPk(req.params.id, {
    include: [{ model: Product }],
    });
    if (!tags) {
      res
        .status(404)
        .json({ message: "No tags with the id" });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});
  // find a single tag by its `id`
  // be sure to include its associated Product data

  router.post("/", async (req, res) => {
   
    try {
      const tags = await Tag.create(req.body);
      res.status(200).json(tags);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  router.put("/:id", async (req, res) => {
    // update a tag's name by its `id` value
    try {
      const tags = await Tag.update(
        {
          tag_name: req.body.tag_name,
        },
        {
          returning: true,
          where: {
            id: req.params.id,
          },
        }
      );
      if (!tags) {
        res
        .status(404)
        .json({ message: "Tag id not found" });
        return; }

      res.status(200).json(tags);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.delete("/:id", async (req, res) => {
   
    try {
  const tags = await Tag.destroy({
  where: {
  id: req.params.id,
        },
      });
      res.status(200).json(tags);
  
      if (!tags) {
        res
          .status(404)
          .json({
            message: "Tag id not found.",
          });
        return;
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;
