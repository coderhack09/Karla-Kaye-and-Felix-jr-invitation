export interface WeddingDetails {
  couple: {
    bride: string
    brideNickname: string
    groom: string
    groomNickname: string
  }
  wedding: {
    date: string
    venue: string
    tagline: string
  }
  theme: string
  hashtag: string
  ceremony: {
    venue: string
    address: string
    time: string
    googleMapsUrl: string
  }
  reception: {
    venue: string
    address: string
    time: string
    googleMapsUrl: string
  }
  narratives: {
    bride: string
    groom: string
    shared: string
  }
  dressCode: {
    theme: string
    note: string
  }
  details: {
    rsvp: {
      deadline: string
    }
  }
  contact: {
    bridePhone: string
    groomPhone: string
    email: string
  }
}

export const emptyWeddingDetails: WeddingDetails = {
  couple: {
    bride: "",
    brideNickname: "",
    groom: "",
    groomNickname: "",
  },
  wedding: {
    date: "",
    venue: "",
    tagline: "",
  },
  theme: "",
  hashtag: "",
  ceremony: {
    venue: "",
    address: "",
    time: "",
    googleMapsUrl: "",
  },
  reception: {
    venue: "",
    address: "",
    time: "",
    googleMapsUrl: "",
  },
  narratives: {
    bride: "",
    groom: "",
    shared: "",
  },
  dressCode: {
    theme: "",
    note: "",
  },
  details: {
    rsvp: {
      deadline: "",
    },
  },
  contact: {
    bridePhone: "",
    groomPhone: "",
    email: "",
  },
}
