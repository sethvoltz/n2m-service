const express = require('express');
const router = express.Router();
const Notion = require('../lib/notion');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/:uuid', async function(req, res, next) {
  const uuid = req.params.uuid;
  const notion = new Notion();
  const markdown = await notion.getPage(uuid);

  if (req.query.hasOwnProperty('pretty')) {
    res.render('pretty', { title: uuid, markdown: markdown });
    return;
  }
  res.send(markdown);
});

module.exports = router;
