var ssbClient = require('ssb-client');
const pull = require('pull-stream');

ssbClient(function (err, sbot) {
    console.log(sbot.friends)
    pull(
        sbot.friends.stream({ live: true }),
        pull.drain(
            (x) => {
                console.log(x)
            },
            () => {
                throw new Error("Graph stream should not end")
            }
        )
    )
})