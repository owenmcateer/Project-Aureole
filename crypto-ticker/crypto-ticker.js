/**
 * Cryptocurrency ticker
 * 
 * @demo ./crypto-ticker/Crypto-tracker-demo.gif
 * A realtime visual feed of Cryptocurrency trading.
 * Green=buy, Red=sell. The length and speed of each trade indicates it's size & priority.
 * 
 * Kraken (https://docs.kraken.com/websockets/) provides the realtime trading data WebSockets,
 * JavaScript listens for trades and then animates them to Aureole.
 * The white spinner indicates the feed connection is open and brings some life.  
 *
 * @ref https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.min.js
 * @ref https://cdn.jsdelivr.net/gh/owenmcateer/canvas-cast/dist/App.js
 * @ref ./pixel-map.js
 */

// Canvas Cast config
const matrix = {
  // Node Serial server
  ip: '',
  // Matrix pixel size
  width: 520,
  height: 520,
  // Matrix brightness 0-255
  brightness: 10,
  // Context type (2d/webgl)
  type: '2d',
  // Custom pixel map (@see ./pixel-map.js)
  customMap: gFxMap(520),
};

// Start WS Matrix
canvasCast.init(matrix);


// Crypto feed config
const cx = matrix.width / 2;
const wsUri = "wss://ws.kraken.com/";
const pairs = [];
let trades = [];
let clockTick = 0;
const clockTickLeds = 10;

// Setup
function setup() {
  createCanvas(matrix.width, matrix.height);
  pixelDensity(1);
  colorMode(HSB);
  frameRate(30);

  // Connect to kraken WS API
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) { onOpen(evt) };
  websocket.onclose = function(evt) { onClose(evt) };
  websocket.onmessage = function(evt) { onMessage(evt) };
  websocket.onerror = function(evt) { onError(evt) };
}


// Draw tick
function draw() {
  background(0);
  noStroke();

  // Small block tick
  const innerRingSpacing = TWO_PI / 24;
  for (let i = 0; i < clockTickLeds; i++) {
    const x = cos(innerRingSpacing * (i + clockTick)) * 50 + cx;
    const y = sin(innerRingSpacing * (i + clockTick)) * 50 + cx;
    fill(0, 0, (i + 1) * (100 / clockTickLeds));
    ellipse(x, y, 10);
  }
  clockTick += 1;

  // Trades array
  trades.forEach((trade, index) => {
    trade.tick();
    trade.render();
  });

  // Remove dead trades
  trades = trades.filter((trade) => trade.isAlive);

  // Cast data
  const p5canvas = document.getElementById('defaultCanvas0');
  canvasCast.cast(p5canvas);
  // Custom pixel map guide
  canvasCast.guide(p5canvas, 5);
}


// Trade class
class Trade {
  constructor(side, price, volume, pair) {
    this.isAlive = true;
    this.arm = floor(random(24));
    this.rotate = (this.arm / 24) * TWO_PI;
    this.distance = 0;
    this.pair = pair;

    this.side = side;
    this.price = price;
    this.volume = volume;
    this.size = map(constrain(this.volume, 0.01, 4), 0.01, 4, 20, 220);
    this.speed = map(this.size, 20, 360, 4, 0.1) + random(0.1, 0.5);
  }

  tick() {
    this.distance += this.speed;

    // Still on screen?
    if ((this.distance - this.size) > cx) {
      this.isAlive = false;
    }
  }

  setColour() {
    noStroke();
    if (this.side === 'b') {
      // Green
      fill(124, 100, 50, 0.8);
    }
    else {
      // Red
      fill(0, 100, 100, 0.8);
    }
  }

  render() {
    this.setColour();
    push();
    translate(cx, cx);
    rotate(this.rotate);
    // ellipse(this.distance, 0, this.size, 10);
    rect(constrain(max(0, this.distance - this.size), 0, width), -5, min(this.size, this.distance), 10);
    pop();
  }
}

// The trades we wish to subscribe to
function subscribeToFeeds() {
  wsSendMessage({
    event: 'subscribe',
    subscription: {
      name: 'trade',
    },
    pair: [
      // Fiat
      "XBT/CHF",
      "XBT/DAI",
      'BTC/CAD',
      'BTC/EUR',
      'BTC/GBP',
      'BTC/JPY',
      'BTC/USD',
      'BTC/USDT',
      'BTC/USDC',
      // Alt coins
      'ADA/XBT',
      'ALGO/XBT',
      'ATOM/XBT',
      'BAT/XBT',
      'BCH/XBT',
      'DASH/XBT',
      'EOS/XBT',
      'GNO/XBT',
      'ICX/XBT',
      'LINK/XBT',
      'LSK/XBT',
      'NANO/XBT',
      'OMG/XBT',
      'PAXG/XBT',
      'QTUM/XBT',
      'SC/XBT',
      'TRX/XBT',
      'WAVES/XBT',
      'ETC/XBT',
      'ETH/XBT',
      'LTC/XBT',
      'MLN/XBT',
      'REP/XBT',
      'XTZ/XBT',
      'XDG/XBT',
      'XLM/XBT',
      'XMR/XBT',
      'XRP/XBT',
      'ZEC/XBT',
    ],
  });
}

// On WS connectino opened
function onOpen(evt) {
  console.log('Connected');

  // Subscribe To Feeds
  subscribeToFeeds();
}

// On WS connection closed
function onClose(evt) {
  console.log('Disconnected');
}

// Received data from WS server
function onMessage(evt) {
  switch (JSON.parse(evt.data).event) {
    case 'heartbeat':
      // Ignore heartbeat pings
      return;
      break;

    case 'subscriptionStatus':
      addPair(evt.data);
      break;

    case undefined:
      addTrade(evt.data);
      break;

    default:
      console.log(`Response: ${evt.data}`);
  }
}

// Report any erros
function onError(evt) {
  console.error(`ERROR: ${evt.data}`);
}

// Send message to WS server.
function wsSendMessage(message) {
  websocket.send(JSON.stringify(message));
}

// Add a valid trade onto the board
function addTrade(trade) {
  /**
    channelID	integer	ChannelID of pair-trade subscription
    Array	array	Array of trades
      Array	array	Array of trade values
        price	float	Price
        volume	float	Volume
        time	float	Time, seconds since epoch
        side	string	Triggering order side (buy/sell), values: b|s
        orderType	string	Triggering order type (market/limit), values: m|l
        misc	string	Miscellaneous
  */
  const tradeData = JSON.parse(trade);
  tradeData[1].forEach(trade => {
    trades.push(new Trade(trade[3], trade[0], trade[1], pairs[tradeData[0]]));
    console.log(`
      Trade(${pairs[tradeData[0]]})|
      ${tradeType(trade[3])}
        - price:${trade[0]}
        - volume:${trade[1]}
    `);
  });
}

function tradeType(type) {
  switch (type) {
    case 'b':
      return 'BUY';
      break;

      case 's':
      return 'SELL';
      break;
  }
}

function addPair(data) {
  const pairData = JSON.parse(data);
  pairs[pairData.channelID] = pairData.pair;
}
