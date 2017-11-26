const _ = require('lodash');
const Boom = require('boom');
const sharp = require('sharp');

const INVALID_QUEUE = 'Image transformation queue was invalid.';

async function lipoExpress(req, res, next) {
  try {
    const err = Boom.badRequest(
      _.isFunction(res.__) ? res.__(INVALID_QUEUE) : INVALID_QUEUE
    );

    if (!_.isString(req.body.queue)) throw Boom.badRequest(err);

    const queue = JSON.parse(req.body.queue);

    if (!_.isArray(queue)) throw Boom.badRequest(err);

    const options = _.isString(req.body.options)
      ? JSON.parse(req.body.options)
      : null;

    let metadata = false;

    const transform = _.reduce(
      queue,
      (transform, task) => {
        if (task[0] === 'metadata') {
          metadata = true;
          return transform;
        }
        return transform[task.shift()](...task);
      },
      _.isObject(options) ? sharp(options) : sharp()
    );

    if (_.isFunction(transform.on))
      transform.on('info', info => {
        Object.keys(info).forEach(key => {
          res.set(`x-sharp-${key}`, info[key]);
        });
      });

    if (metadata) {
      if (req.file) req.file.stream.pipe(transform);
      const info = await transform.metadata();
      res.send(info);
    } else if (req.file) req.file.stream.pipe(transform).pipe(res);
    else transform.pipe(res);
  } catch (err) {
    next(err);
  }
}

module.exports = lipoExpress;
