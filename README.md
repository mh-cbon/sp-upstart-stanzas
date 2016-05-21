# sp-upstart-stanzas

Stream parser for upstart stanzas files

# Install

```sh
npm i @mh-cbon/sp-upstart-stanzas --save
```

# Usage
```js
var spUpstartStanzas = require('@mh-cbon/sp-upstart-stanzas')
var fs = require('fs')

var f = ''
f = 'fixtures/tty1.conf'
f = 'fixtures/wait-for-state.conf'
fs.createReadStream(f)
.pipe(spUpstartStanzas())
.on('data', function (d) {
  /*
  { type: 'stanzas',
  id: 'author',
  content: 'author "Clint Byrum <clint.byrum@canonical.com>"\n' }
{ type: 'stanzas',
  id: 'description',
  content: 'description "Waiting for state"\n\n' }
{ type: 'stanzas', id: 'task', content: 'task\n' }
{ type: 'stanzas',
  id: 'normal exit',
  content: 'normal exit 2\n\n' }
{ type: 'stanzas',
  id: 'stop on',
  content: 'stop on started $WAIT_FOR or stopped $WAIT_FOR\n\n' }
{ type: 'comment',
  content: '# These are all arguments for use influencing how this job waits\n' }
{ type: 'stanzas', id: 'env', content: 'env TIMEOUT=30\n' }
{ type: 'stanzas',
  id: 'env',
  content: 'env MANUAL_OVERRIDE="N"\n' }
{ type: 'stanzas', id: 'env', content: 'env WAIT_FOREVER="N"\n' }
{ type: 'stanzas',
  id: 'env',
  content: 'env WAIT_STATE="started"\n' }
{ type: 'stanzas',
  id: 'env',
  content: 'env TARGET_GOAL="start"\n\n' }
{ type: 'comment',
  content: '# Required args w/ no sensible default, the tests at the begin...' }
{ type: 'stanzas',
  id: 'instance',
  content: 'instance $WAITER$WAIT_FOR\n\n' }
{ type: 'stanzas',
  id: 'script',
  content: 'script\n    test -n "$WAIT_FOR" || exit 1\n    test -n "$WAITE...' }
  */
  console.log(d);
})
.on('end', function () {
  console.log('\n\n')
  spUpstartStanzas
  .parseFile(f)
  .on('data', function (stanzas) {
    /*
    [ { id: 'author',
        content: '"Clint Byrum <clint.byrum@canonical.com>"' },
      { id: 'description', content: '"Waiting for state"' },
      { id: 'task', content: '' },
      { id: 'normal exit', content: '2' },
      { id: 'stop on',
        content: 'started $WAIT_FOR or stopped $WAIT_FOR' },
      { id: 'env', content: 'TIMEOUT=30' },
      { id: 'env', content: 'MANUAL_OVERRIDE="N"' },
      { id: 'env', content: 'WAIT_FOREVER="N"' },
      { id: 'env', content: 'WAIT_STATE="started"' },
      { id: 'env', content: 'TARGET_GOAL="start"' },
      { id: 'instance', content: '$WAITER$WAIT_FOR' },
      { id: 'script',
        content: 'test -n "$WAIT_FOR" || exit 1\n    test -n "$WAITER"...' } ]
    */
    console.log(stanzas);
  })
})
```
