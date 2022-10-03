module.exports = 
{
  owner: "6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe",
  preview_asset: "com.bm.brain.1.primary",
  hidden_asset: "com.bm.brain.hidden",
  primary_asset: "com.bm.brain.1.primary",
  experience_asset: "com.bm.brain.1.html",
  id: "bm-1",
  __system: {
      status: "minted",
      "com.origyn.royalties.secondary": [],
      "com.origyn.node": "yfhhd-7eebr-axyvl-35zkt-z6mp7-hnz7a-xuiux-wo5jf-rslf7-65cqd-cae",
      "com.origyn.royalties.primary": [],
      "com.origyn.originator": "yfhhd-7eebr-axyvl-35zkt-z6mp7-hnz7a-xuiux-wo5jf-rslf7-65cqd-cae"
    },
  library: [
        {
          library_id: "com.bm.brain.1.primary",
          title: "bm - brain 1",
          location_type: "canister",
          location: "https://frfol-iqaaa-aaaaj-acogq-cai.raw.ic0.app/-/bm-1/-/com.bm.brain.1.primary",
          content_type: "image/png",
          content_hash: "1",
          size: 500000,
          sort: "1",
          read: "public"
        },
        {
          library_id: "com.bm.brain.hidden",
          title: "Random-brain",
          location_type: "collection",
          location: "https://frfol-iqaaa-aaaaj-acogq-cai.raw.ic0.app/-/bm-1/-/com.bm.brain.1.hidden2",
          content_type: "image/gif",
          content_hash: "1",
          size: 9990000,
          sort: "1",
          read: "public"
        },
        {
          library_id: "com.bm.brain.1.html",
          title: "bm Sample",
          location_type: "canister",
          location: "https://frfol-iqaaa-aaaaj-acogq-cai.raw.ic0.app/-/bm-1/-/com.bm.brain.1.html",
          content_type: "text/html",
          content_hash: "1",
          size: 500000,
          sort: "1",
          read: "public"
        },
        {
          library_id: "wallet",
          title: "Wallet dApp",
          location_type: "collection",
          location: "https://frfol-iqaaa-aaaaj-acogq-cai.raw.ic0.app/-/bm-1/-/wallet",
          content_type: "text/html",
          content_hash: "1",
          size: 1503756,
          sort: "1",
          read: "public"
        },
        {
          library_id: "ledger",
          title: "Ledger dApp",
          location_type: "collection",
          location: "https://frfol-iqaaa-aaaaj-acogq-cai.raw.ic0.app/-/bm-1/-/ledger",
          content_type: "text/html",
          content_hash: "1",
          size: 974320,
          sort: "1",
          read: "public"
        },
        {
          library_id: "data",
          title: "Data dApp",
          location_type: "collection",
          location: "https://frfol-iqaaa-aaaaj-acogq-cai.raw.ic0.app/-/bm-1/-/data",
          content_type: "text/html",
          content_hash: "1",
          size: 936231,
          sort: "1",
          read: "public"
        },
        {
          library_id: "marketplace",
          title: "Marketplace dApp",
          location_type: "collection",
          location: "https://frfol-iqaaa-aaaaj-acogq-cai.raw.ic0.app/-/bm-1/-/marketplace",
          content_type: "text/html",
          content_hash: "1",
          size: 936231,
          sort: "1",
          read: "public"
        },
        {
          library_id: "dapp_library",
          title: "Library dApp",
          location_type: "collection",
          location: "https://frfol-iqaaa-aaaaj-acogq-cai.raw.ic0.app/-/bm-1/-/dapp_library",
          content_type: "text/html",
          content_hash: "1",
          size: 936231,
          sort: "1",
          read: "public"
        }
    ],
  __apps: [
        {
          app_id: "com.bm.sample.app",
          read: "public",
          write: {
              type: "allow",
              list: [
                  "6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe"
                ]
            },
          permissions: {
              type: "allow",
              list: [
                  "6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe"
                ]
            },
          data: {
              "com.bm.sample.app.name": "brain 1",
              "com.bm.sample.app.total_in_collection": 16,
              "com.bm.sample.app.creator_name": "bm",
              "com.bm.sample.app.creator_principal": "6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe"
            }
        }
    ]
}
;