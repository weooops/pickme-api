const Category = require('../../models').Category;

/**
 * 카테고리 리스트 조회
 */
const index = (req, res) => {
  req.query.limit = req.query.limit || 10;

  // "limit"이 숫자가 아닌경우 400을 반환한다.
  const limit = Number(req.query.limit);
  if (Number.isNaN(limit)) return res.status(400).end();

  // "limit" 값이 100보다 클 경우 400을 반환한다.
  if (limit > 100) return res.status(400).end();

  Category
    .findAll({
      limit: limit
    })
    .then(categories => {
      res.json(categories);
    })
    .catch(() => res.status(500).end());
};

/**
 * 카테고리 리스트 상세 조회
 */
const show = (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).end();

  Category
    .findOne({ where: { id }})
    .then(category => {
      if (!category) return res.status(404).end();
      res.json(category);
    })
    .catch(() => res.status(500).end());
};

/**
 * 카테고리 리스트 삭제
 */
const destroy = (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).end();

  Category
    .destroy({ where: { id } })
    .then(() => {
      res.status(204).end();
    })
    .catch(() => res.status(500).end());
};

/**
 * 카테고리 리스트 생성
 */
const create = (req, res) => {
  const { title, description, image } = req.body;
  if (!title) return res.status(400).end();

  Category
    .create({ title, description, image })
    .then(category => {
      res.status(201).json(category);
    })
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError') return res.status(409).end();
      res.status(500).end();
    });
};

/**
 * 카테고리 리스트 수정
 */
const update = (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).end();

  const { title, description, image } = req.body;
  if (!title) return res.status(400).end();

  Category
    .findOne({ where: { id }})
    .then(category => {
      if (!category) return res.status(404).end();

      category.title = title;
      category.description = description;
      category.image = image;

      category
        .save()
        .then(() => {
          res.json(category);
        })
        .catch(err => {
          res.status(500).end();
        });
    })
    .catch(() => res.status(500).end());
};

module.exports = {
  index,
  show,
  destroy,
  create,
  update
};