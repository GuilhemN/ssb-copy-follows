var ssbClient = require('ssb-client');
const isFeed = require('ssb-ref').isFeed
const pull = require('pull-stream');

ssbClient(function (err, sbot) {

    pull(
        sbot.messagesByType({ type: 'post', live: true }),
        pull.drain(
            (post) => {
                console.log(post);
            },
            () => {
                throw new Error("Posts stream should not end")
            }
        )
    )

})