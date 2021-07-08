var ssbClient = require('ssb-client');
const isFeed = require('ssb-ref').isFeed
const pull = require('pull-stream');

var copyFrom = "@3j8AVZK0F/e3Y5BpprOvPMt250oBTd3pKCSHSq2f8Zw=.ed25519"

// From ssb-friends
function follow(sbot, feedId, opts, cb) {
    if (!isFeed(feedId)) {
        return cb(new Error(`follow() requires a feedId, got ${feedId}`))
    }
    opts = opts || {}

    const content = {
        type: 'contact',
        contact: feedId,
        following: 'state' in opts ? opts.state : true,
        recps: opts.recps
    }
    sbot.publish(content, cb)
}


ssbClient(function (err, sbot) {
    console.log("Connexion to ssb server initialized.");

    follow(sbot, copyFrom, { state: true });

    var first = true;

    pull(
        sbot.friends.stream({ live: true }),
        pull.drain(
            (friends) => {
                if (first) {
                    first = false;

                    if (copyFrom in friends) {
                        for (const [friend, value] of Object.entries(friends[copyFrom])) {
                            follow(sbot, friend, {state: true == value});
                            console.log("[Initialization] Update follow status of "+friend+" to "+value);
                        }
                    }
                } else {
                    if (copyFrom == friends.from) {
                        follow(sbot, friends.to, { state: true == friends.value });
                        console.log("Update follow status of " + friends.to + " to " + true == friends.value);
                    }
                }
            },
            () => {
                throw new Error("Graph stream should not end")
            }
        )
    )

})