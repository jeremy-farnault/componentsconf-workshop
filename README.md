# Test queries

mutation createCoin {
  createCoin(input: {
    name: "Bitcoin"
    symbol: "BTC"
    price: 9000
  }) {
    id name symbol price
  }
}

query listCoins {
  listCoins {
    items {
      id
      name
      symbol
      price
    }
  }
}

query listCoins {
  listCoins(filter: {
    price: {
      gt: 2000
    }
  }) {
    items {
      id
      name
      symbol
      price
    }
  }
}

mutation createNote {
  createNote(input: {
    title: "Note"
    description: "Note desc"
  }) {
    id title description
  }
}

query listNotes {
  listNotes {
    items {
      id title description
    }
  }
}
