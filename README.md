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
f = 'fixtures/wait-for-state.conf'
f = 'fixtures/tty1.conf'

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
  content: '# Required args w/ no sensible default, the tests at the beginning of\n# the script are just to guard against WAITER="" or WAIT_FOR="", as the\n# instance line will fail if they are not set, since they have no env\n' }
{ type: 'stanzas',
  id: 'instance',
  content: 'instance $WAITER$WAIT_FOR\n\n' }
{ type: 'stanzas',
  id: 'script',
  content: 'script\n    test -n "$WAIT_FOR" || exit 1\n    test -n "$WAITER" || exit 1\n\n    # We don\'t want to override the manual stanza\n    # XXX: initctl show-config should share manual w/ us too\n    case $MANUAL_OVERRIDE in\n    N|n|0)\n        if grep -q "^\\s*manual\\s*$" /etc/init/$WAIT_FOR.conf /etc/init/$WAIT_FOR.override 2>/dev/null; then\n            exit 0\n        fi\n        ;;\n    esac\n\n    if [ "$WAIT_STATE" = "stopped" ] ; then\n        TARGET_GOAL="stop"\n    fi\n\n    # Already running/stopped?\n    status $WAIT_FOR | grep -q "$TARGET_GOAL/$WAIT_STATE" && exit 0\n\n    # Give it a push\n    $TARGET_GOAL $WAIT_FOR || :\n\n    # upstart will kill this shell on started/stopped $WAIT_FOR\n    while sleep $TIMEOUT ; do\n        case $WAIT_FOREVER in\n        N|n|0)\n            exit 100\n            ;;\n        Y|y|1)\n            ;;\n        *)\n            exit 1\n            ;;\n        esac\n    done\n    # Very strange, sleep returned non-zero?\n    exit 1\nend script\n\n' }
  */
  console.log(d);
})
.on('end', function () {
  console.log('\n\n')
  spUpstartStanzas
  .parseFile(f)
  .on('data', function (stanzas) {
    /*
    [ { type: 'stanzas',
    id: 'author',
    content: '"Clint Byrum <clint.byrum@canonical.com>"' },
  { type: 'stanzas',
    id: 'description',
    content: '"Waiting for state"' },
  { type: 'stanzas', id: 'task', content: '' },
  { type: 'stanzas', id: 'normal exit', content: '2' },
  { type: 'stanzas',
    id: 'stop on',
    content: 'started $WAIT_FOR or stopped $WAIT_FOR' },
  { type: 'stanzas', id: 'env', content: 'TIMEOUT=30' },
  { type: 'stanzas', id: 'env', content: 'MANUAL_OVERRIDE="N"' },
  { type: 'stanzas', id: 'env', content: 'WAIT_FOREVER="N"' },
  { type: 'stanzas', id: 'env', content: 'WAIT_STATE="started"' },
  { type: 'stanzas', id: 'env', content: 'TARGET_GOAL="start"' },
  { type: 'stanzas', id: 'instance', content: '$WAITER$WAIT_FOR' },
  { type: 'stanzas',
    id: 'script',
    content: 'test -n "$WAIT_FOR" || exit 1\n    test -n "$WAITER" || exit 1\n\n    # We don\'t want to override the manual stanza\n    # XXX: initctl show-config should share manual w/ us too\n    case $MANUAL_OVERRIDE in\n    N|n|0)\n        if grep -q "^\\s*manual\\s*$" /etc/init/$WAIT_FOR.conf /etc/init/$WAIT_FOR.override 2>/dev/null; then\n            exit 0\n        fi\n        ;;\n    esac\n\n    if [ "$WAIT_STATE" = "stopped" ] ; then\n        TARGET_GOAL="stop"\n    fi\n\n    # Already running/stopped?\n    status $WAIT_FOR | grep -q "$TARGET_GOAL/$WAIT_STATE" && exit 0\n\n    # Give it a push\n    $TARGET_GOAL $WAIT_FOR || :\n\n    # upstart will kill this shell on started/stopped $WAIT_FOR\n    while sleep $TIMEOUT ; do\n        case $WAIT_FOREVER in\n        N|n|0)\n            exit 100\n            ;;\n        Y|y|1)\n            ;;\n        *)\n            exit 1\n            ;;\n        esac\n    done\n    # Very strange, sleep returned non-zero?\n    exit 1\n' } ]
    */
    console.log(stanzas);
  })
})
```
