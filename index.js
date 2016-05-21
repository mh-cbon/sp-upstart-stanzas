var miss  = require('mississippi')
var split = require('split')
var fs    = require('fs')

// based on http://upstart.ubuntu.com/cookbook/#configuration
var knownStanzas = [
  'exec',
  'script',
  'end script',
  'pre-start exec',
  'pre-start script',
  'post-start exec',
  'post-start script',
  'pre-stop exec',
  'pre-stop script',
  'post-stop exec',
  'post-stop script',
  'start on',
  'stop on',
  'env',
  'task',
  'cgroup',
  'apparmor load',
  'apparmor switch',
  'export',
  'respawn limit',
  'respawn',
  'normal exit',
  'instance',
  'description',
  'author',
  'reload signal',
  'version',
  'emits',
  'usage',
  'console',
  'umask',
  'manual',
  'nice',
  'oom',
  'oom score',
  'setuid',
  'setgid',
  'chroot',
  'chdir',
  'limit',
  'kill signal',
  'kill timeout',
  'expect stop',
  'expect daemon',
  'expect fork',
];

var SPUpstartStanzas = function () {
  var current;
  var stream = miss.through.obj(function transform (chunk, env, cb) {
    chunk = chunk.toString();
    var ret;
    var handled = false;
    if (chunk.match(/^\s*#/)) {

      if (current && current.type!=='comment'
        && current.id!=='script'
        && current.id!=='pre-start script'
        && current.id!=='pre-stop script'
        && current.id!=='post-start script'
        && current.id!=='post-start script'
        && current.type!=='comment') {
        this.push(current);
        current = null;
      }
      if (!current) {
        current = {
          type: 'comment',
          content: ''
        }
      }
      current.content += chunk + '\n';
      handled = true;
    }

    if (!handled && chunk.match(/^\s*[^\s]+\s[^\s]+/)) {
      var s = chunk.match(/^\s*([^\s]+\s[^\s]+)/)[1];
      if (knownStanzas.indexOf(s)>-1) {
        if (s==='end script') {
          if (!current) {
            this.emit('error', new Error('mal formed stanzas'))
          } else {
            current.content += chunk + '\n'
          }
        } else {
          if (current) {
            this.push(current);
            current = null;
          }
          current = {
            type: 'stanzas',
            id: s,
            content: chunk + '\n'
          }
        }
        handled = true;
      }
    }
    if (!handled && chunk.match(/^\s*[^\s]+/)) {
      var s = chunk.match(/^\s*([^\s]+)/)[1];
      if (knownStanzas.indexOf(s)>-1) {
        if (s==='end script') {
          if (!current) {
            this.emit('error', new Error('mal formed stanzas'))
          } else {
            current.content += chunk + '\n'
          }
        } else {
          if (current) {
            this.push(current);
            current = null;
          }
          current = {
            type: 'stanzas',
            id: s,
            content: chunk + '\n'
          }
        }
        handled = true;
      }
    }
    if (!handled) {
      if (!current) this.emit('error', new Error('mal formed stanzas'))
      current.content += chunk + '\n';
    }
    cb()
  }, function (cb) {
    if(current) this.push(current);
    current = null;
    cb()
  });
  return miss.pipeline.obj(split(), stream);
}

SPUpstartStanzas.parseFile = function (fPath, options) {
  var parsedStanzas = [];
  var stream = miss.through.obj(function transform (chunk, env, cb) {
    if (chunk.type!=='comment') {
      chunk.content = chunk.content.substr(chunk.id.length);
      chunk.content = chunk.content.replace(/^\s+/, '')
      chunk.content = chunk.content.replace(/\s+$/, '')
      if (chunk.id.match(/script$/)) {
        chunk.content = chunk.content.substr(0, chunk.content.length-'end script'.length)
      }
      parsedStanzas.push(chunk)
    }
    cb(null)
  }, function flush(cb) {
    this.push(parsedStanzas);
    cb()
  })

  return fs.createReadStream(fPath)
  .pipe(SPUpstartStanzas())
  .pipe(stream)
}

module.exports = SPUpstartStanzas;
