const Boom = require('@hapi/boom');
const _ = require('lodash');
const sharp = require('sharp');
const { version } = require('sharp/package.json');

async function lipoExpress(req, res, next) {
  try {
    const err = Boom.badRequest('Image transformation queue was invalid.');

    if (!_.isString(req.body.queue)) throw Boom.badRequest(err);

    const queue = JSON.parse(req.body.queue);

    if (!_.isArray(queue)) throw Boom.badRequest(err);

    const options = _.isString(req.body.options)
      ? JSON.parse(req.body.options)
      : null;

    let metadata = false;

    //
    // <https://sharp.pixelplumbing.com/en/stable/changelog/#v0210-4th-october-2018>
    //
    // Deprecate the following resize-related functions:
    // - crop
    // - embed
    // - ignoreAspectRatio
    // - max
    // - min
    // - withoutEnlargement
    //
    // Access to these is now via options passed to the resize function.
    //
    // For example:
    //
    // embed('north') is now
    // resize(width, height, { fit: 'contain', position: 'north' })
    //
    // crop('attention') is now
    // resize(width, height, { fit: 'cover', position: 'attention' })
    //
    // max().withoutEnlargement() is now
    // resize(width, height, { fit: 'inside', withoutEnlargement: true })
    //
    // min().withoutEnlargement() is now
    // resize(width, height, { fit: 'inside', withoutEnlargement: true })

    const transform = _.reduce(
      queue,
      (transform, task) => {
        if (task[0] === 'metadata') {
          metadata = true;
          return transform;
        }

        const method = task.shift();

        if (!transform[method])
          throw new Error(
            `Invalid or deprecated sharp method "${method}" was passed. See https://sharp.pixelplumbing.com/en/stable/changelog/ (current sharp version is ${version}).`
          );
        return transform[method](...task);
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
  } catch (error) {
    next(error);
  }
}

module.exports = lipoExpress;
