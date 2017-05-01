import { Router } from 'express';
const router = new Router();
import faker from 'faker';

router.get('/', async (req, res, next) => {
  try {
    res.send(
      {
        status: 'OK',
        reach: faker.fake('{{random.number}}'),
      });
    return true;
  } catch (err) {
    next(err);
    return false;
  }
});
export default router;
