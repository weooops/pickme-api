const Pickme = require('../../models').Pickme;

/**
 * Pickme 리스트 조회
 */
const index = (req, res) => {
  req.query.limit = req.query.limit || 10;
  req.query.category = req.query.category || 0;

  // "limit"이 숫자가 아닌경우 400을 반환한다.
  const limit = Number(req.query.limit);
  if (Number.isNaN(limit)) return res.status(400).end();

  // "limit" 값이 100보다 클 경우 400을 반환한다.
  if (limit > 100) return res.status(400).end();

  // "category"가 숫자가 아닌경우 400을 반환한다.
  const category_id = Number(req.query.category);
  if (Number.isNaN(category_id)) return res.status(400).end();

  Pickme
    .findAll({
      category_id,
      limit
    })
    .then(pickmes => {
      res.json(pickmes);
    })
    .catch(() => res.status(500).end());
};

/**
 * Pickme 리스트 상세 조회
 */
const show = (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).end();

  Pickme
    .findOne({ where: { id }})
    .then(pickme => {
      if (!pickme) return res.status(404).end();
      res.json(pickme);
    })
    .catch(() => res.status(500).end());
};

/**
 * Pickme 리스트 삭제
 */
const destroy = (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).end();

  Pickme
    .destroy({ where: { id } })
    .then(() => {
      res.status(204).end();
    })
    .catch(() => res.status(500).end());
};

/**
 * Pickme 리스트 생성
 */
const create = (req, res) => {
  const { name, description, image } = req.body;
  if (!name) return res.status(400).end();

  Pickme
    .create({ name, description, image })
    .then(pickme => {
      res.status(201).json(pickme);
    })
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError') return res.status(409).end();
      res.status(500).end();
    });
};

/**
 * Pickme 리스트 수정
 */
const update = (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).end();

  const { name, description, image } = req.body;
  if (!name) return res.status(400).end();

  Pickme
    .findOne({ where: { id }})
    .then(pickme => {
      if (!pickme) return res.status(404).end();

      pickme.name = name;
      pickme.description = description;
      pickme.image = image;

      pickme
        .save()
        .then(() => {
          res.json(pickme);
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