var vm = new Vue({
  el: '#app',
  data: {
    gather: true,
    state: '點擊按鈕，開始遊戲',
    symbols: [
      { label: 'spades', symbol: '♠' },
      { label: 'hearts', symbol: '♥' },
      { label: 'diamonds', symbol: '♦' },
      { label: 'clubs', symbol: '♣' }
    ],
    cards: [
      {
        id: 1,
        label: 'spades',
        open: false
      },
      {
        id: 2,
        label: 'hearts',
        open: false
      },
      {
        id: 3,
        label: 'clubs',
        open: false
      },
      {
        id: 4,
        label: 'diamonds',
        open: false
      }
    ],

    question: null,
    mode: '',
    count: 0
  },
  methods: {
    shuffle() {
      // 重新編排 cards的id，cards[cid]
      let newArray = [1, 2, 3, 4].sort(
        (a, b) => (Math.random() > 0.5 ? 1 : -1)
      );
      this.cards.forEach((card, cid) => (card.id = newArray[cid]));
    },
    turnAll(state) {
      this.cards.forEach(card => (card.open = state));
    },
    getSymbol(label) {
      let result = this.symbols.find(s => s.label == label);
      return result ? result.symbol : label;
    },
    startGame() {
      this.mode = '';
      this.question = this.symbols[parseInt(Math.random() * 4)]; //隨機挑選花色
      this.turnAll(false); // 把牌關閉，並且堆疊起來
      this.gather = true;
      this.state = '準備開始新的一局遊戲';
      setTimeout(() => {
        this.gather = false;
        this.state = '你的任務是...';
      }, 1000);
      setTimeout(() => {
        this.turnAll(true); // 把牌全部打開，展示答案給使用者看
        this.state =
          '找出' + this.question.label + this.question.symbol + '的撲克牌花色';
      }, 2000);
      setTimeout(() => {
        this.turnAll(false); //看完牌了，重新蓋牌及告知使用者：遊戲真的要開始了
        this.state = '準備開始囉';
      }, 4000);
      this.count = 0;
      // 開始洗牌
      setTimeout(() => {
        let startShuffle = () => {
          this.shuffle(); // 洗牌
          if (this.count++ < 6) {
            //洗牌超過六次才停止，停止後要使用者猜測哪一張牌是正確答案
            setTimeout(startShuffle, 500);
          } else {
            this.state =
              '請找出' +
              this.question.label +
              this.question.symbol +
              '的撲克牌花色';
            this.mode = 'answer'; // mode = 'answer' 表示遊戲已洗完牌，等待使用者挑出卡片
          }
        };
        startShuffle();
      }, 6000);
    },
    getCard(label) {
      return this.cards.find(card => card.label == label);
    },
    openCard(card) {
      if (this.mode == 'answer') {
        card.open = !card.open;
        if (card.label == this.question.label) {
          this.state =
            '你贏了，你拿到' + this.question.label + this.question.symbol;
        } else {
          this.state = '你輸了';
          setTimeout(() => {
            this.getCard(this.question.label).open = true;
          }, 1000);
        }
        setTimeout(() => {
          this.startGame();
        }, 3000);
      } else {
        this.startGame();
      }
    }
  }
});
